import {
    Electron,
    Element,
    Substance,
    SubstanceType,
} from "../../solver/chemical-equation/Substance";

import Charge from "./Charge";

interface Props {
    substance: Substance;
    topLevelSubstance: boolean;
}

function SubstanceText({ substance, topLevelSubstance }: Props) {
    return (
        <>
            {substance.getType() != SubstanceType.Compound ? (
                substance.getType() == SubstanceType.Electron ? (
                    (substance as Electron).getSymbol()
                ) : (
                    (substance as Element).getSymbol()
                )
            ) : (
                <>
                    {!topLevelSubstance && "("}
                    {substance.getSubstances().map((sub) => (
                        <SubstanceText
                            substance={sub}
                            topLevelSubstance={false}
                        />
                    ))}
                    {!topLevelSubstance && ")"}
                </>
            )}
            {substance.getQuantity() != 1 && (
                <sub>{substance.getQuantity()}</sub>
            )}
            <Charge charge={substance.getCharge()} />
        </>
    );
}

export default SubstanceText;
