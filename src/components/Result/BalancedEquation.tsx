import { ChemicalEquation } from "../../solver/chemical-equation/Equation";
import SubstanceText from "./SubstanceText";

interface Props {
    equation: ChemicalEquation;
    solution: number[];
}

function BalancedEquation({ equation, solution }: Props) {
    const substances = equation.getReactants().concat(equation.getProducts());

    return (
        <p className="display-4 text-center">
            {solution.map((coefficient, index) => (
                <>
                    <span className="text-primary">
                        {coefficient != 1 && coefficient}
                    </span>
                    <SubstanceText
                        substance={substances[index]}
                        topLevelSubstance={true}
                    />
                    {![
                        substances.length - 1,
                        equation.getReactants().length - 1,
                    ].includes(index) && " + "}
                    {index == equation.getReactants().length - 1 && " = "}
                </>
            ))}
        </p>
    );
}

export default BalancedEquation;
