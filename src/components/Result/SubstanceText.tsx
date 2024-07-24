import {
    Substance,
    SubstanceType,
} from "../../solver/chemical-equation/Substance";

interface Props {
    substance: Substance;
    disableTopLevelParen: boolean;
}

function SubstanceText({ substance, disableTopLevelParen }: Props) {
    if (substance.getType() == SubstanceType.Electron) {
        return (
            <>
                e<sup>-</sup>
            </>
        );
    } else if (substance.getType() == SubstanceType.Element) {
        return (
            <>
                {substance.getText()}
                {substance.getQuantity() !== 1 && (
                    <sub>{substance.getQuantity()}</sub>
                )}
                {substance.getCharge() != 0 && (
                    <span>{substance.getCharge()}</span>
                )}
            </>
        );
    } else {
        return (
            <>
                {!disableTopLevelParen && "("}
                {substance.getSubstances().map((sub) => (
                    <SubstanceText
                        substance={sub}
                        disableTopLevelParen={false}
                    />
                ))}
                {!disableTopLevelParen && ")"}
            </>
        );
    }
}

export default SubstanceText;
