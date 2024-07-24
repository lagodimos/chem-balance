interface Props {
    onInputChange(input: string): void;
}

function Input({ onInputChange }: Props) {
    function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        let input = "";

        if (event.key == "Enter") {
            input = (event.target as HTMLInputElement).value;
            onInputChange(input);
        }
    }

    return (
        <input
            type="text"
            className="m-5 fs-3 input-group-text bg-dark text-light"
            onKeyDown={handleOnKeyDown}
        />
    );
}

export default Input;
