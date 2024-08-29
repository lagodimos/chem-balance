import {
    Compound,
    Electron,
    Element,
    Substance,
} from "../../solver/chemical-equation/Substance";

import Charge from "./Charge";

interface Props {
    substance: Substance;
    topLevelSubstance: boolean;
}

function SubstanceText({ substance, topLevelSubstance }: Props) {
    return (
        <>
            {!(substance instanceof Compound) ? (
                substance instanceof Electron ? (
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
