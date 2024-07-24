import Result from "./components/Result/Result";
import Input from "./components/Input";
import { useState } from "react";

function App() {
    const [inputEquation, setInputEquation] = useState("");

    function handleInputChange(input: string) {
        setInputEquation(input);
    }

    return (
        <div
            className="bg-dark text-light"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Result inputEquation={inputEquation}></Result>
            <Input onInputChange={handleInputChange} />
        </div>
    );
}

export default App;
