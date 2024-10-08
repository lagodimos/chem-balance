import { Fragment } from "react/jsx-runtime";
import { ChemicalEquation } from "../../solver/chemical-equation/Equation";
import SubstanceText from "./SubstanceText";

interface Props {
    equation: ChemicalEquation;
    solution: number[];
}

function BalancedEquation({ equation, solution }: Props) {
    const substances = equation.getReactants().concat(equation.getProducts());

    return (
        <p className="m-5 display-4">
            {solution.map((coefficient, index) => (
                <Fragment key={index}>
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
                    {index == equation.getReactants().length - 1 && " \u2192 "}
                </Fragment>
            ))}
        </p>
    );
}

export default BalancedEquation;
