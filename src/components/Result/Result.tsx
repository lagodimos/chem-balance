import { Parser } from "../../solver/parser/Parser";
import { ChemicalEquation } from "../../solver/chemical-equation/Equation";
import Placeholder from "./Placeholder";
import BalancedEquation from "./BalancedEquation";
import ErrorMessage from "./ErrorMessage";

type Result = {
    text: string;
    isError: boolean;
};

interface Props {
    inputEquation: string;
}

function Result({ inputEquation }: Props) {
    const parser = new Parser();
    let equation: ChemicalEquation;
    let solution: number[];
    let error: string = "";

    if (inputEquation.trim() != "") {
        try {
            equation = parser.parseEquation(inputEquation);
            solution = equation.solve();

            return <BalancedEquation equation={equation} solution={solution} />;
        } catch (e) {
            error = (e as Error).message;
            return <ErrorMessage>{error}</ErrorMessage>;
        }
    } else {
        return <Placeholder />;
    }
}

export default Result;
