import { Substance } from "./Substance";
import { Rational } from "../Rational";
import {
    Matrix,
    NoSolutionError,
    MultipleSolutionsError,
} from "../linear-algebra/Matrix";

export class ChemicalEquation {
    private _reactants: Substance[];
    private _products: Substance[];

    constructor(reactants: Substance[], products: Substance[]) {
        this._reactants = reactants;
        this._products = products;
    }

    public getReactants() {
        return this._reactants;
    }

    public getProducts() {
        return this._products;
    }

    public solve() {
        const coefficients: Rational[][] = [];
        const elements: string[] = [];
        let solution: Rational[] = [];

        // Find all elements in the equation
        for (const substance of this._reactants.concat(this._products)) {
            for (const element of substance.getElementsCount().keys()) {
                if (!elements.includes(element)) {
                    elements.push(element);
                }
            }
        }

        // Coefficients for elements
        for (let i = 0; i < elements.length; i++) {
            coefficients.push([]);

            for (
                let j = 0;
                j < this._reactants.length + this._products.length;
                j++
            ) {
                let coefficient = 0;

                coefficient =
                    this._reactants
                        .concat(this._products)
                        [j].getElementsCount()
                        .get(elements[i]) ?? 0;

                if (this._reactants.length <= j) {
                    coefficient *= -1;
                }

                coefficients[i].push(new Rational(coefficient, 1));
            }
        }

        // Coefficients for charges
        coefficients.push([]);
        for (
            let i = 0;
            i < this._reactants.length + this._products.length;
            i++
        ) {
            let coefficient = 0;

            coefficient = this._reactants.concat(this._products)[i].getCharge();

            if (this._reactants.length <= i) {
                coefficient *= -1;
            }

            coefficients[coefficients.length - 1].push(
                new Rational(coefficient, 1),
            );
        }

        const m = new Matrix(coefficients);
        const negativeOne = new Rational(-1, 1);

        try {
            // Set one variable to one and solve for the others
            solution = m.solve(
                m.removeRightColumn().map((value) => value.mul(negativeOne)),
            );
        } catch (error) {
            if (error instanceof NoSolutionError) {
                throw new Error("All-zero solution");
            } else if (error instanceof MultipleSolutionsError) {
                throw new Error("Multiple solutions");
            }
        }

        solution.push(new Rational(1, 1));

        // Find the first integer solution
        let maxDenominator = new Rational(1, 1);
        for (const value of solution) {
            if (maxDenominator.getValue() < value.getDenominator()) {
                maxDenominator = new Rational(value.getDenominator(), 1);
            }
        }
        solution = solution.map((value) => value.mul(maxDenominator));

        return solution.map((value) => value.getValue());
    }
}
