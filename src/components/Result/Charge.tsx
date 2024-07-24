interface Props {
    charge: number;
}

function Charge({ charge }: Props) {
    return (
        <>
            {![1, 0, -1].includes(charge) && <sup>{Math.abs(charge)}</sup>}
            {charge > 0 && <sup>+</sup>}
            {charge < 0 && <sup>-</sup>}
        </>
    );
}

export default Charge;
