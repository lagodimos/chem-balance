import { Substance } from "./Substance";
import { Fraction } from "../Fraction";
import { Matrix } from "../linear-algebra/Matrix";

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
        const coefficients: Fraction[][] = [];
        const elements: string[] = [];
        let solution: Fraction[];

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

                coefficients[i].push(new Fraction(coefficient, 1));
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
                new Fraction(coefficient, 1),
            );
        }

        const m = new Matrix(coefficients);

        // Set one variable to one and solve for the others
        const negativeOne = new Fraction(-1, 1);
        solution = m.solve(
            m.removeRightColumn().map((frac) => frac.mul(negativeOne)),
        );
        solution.push(new Fraction(1, 1));

        // Find the first integer solution
        let maxDenominator = new Fraction(1, 1);
        for (const frac of solution) {
            if (maxDenominator.getValue() < frac.getDenominator()) {
                maxDenominator = new Fraction(frac.getDenominator(), 1);
            }
        }
        solution = solution.map((frac) => frac.mul(maxDenominator));

        return solution.map((frac) => frac.getValue());
    }
}
