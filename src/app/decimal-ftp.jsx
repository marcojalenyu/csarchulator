import React, { useState } from "react";
import { convert } from "./decimal-ftp-convert";

const DecimalFTP = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [precision, setPrecision] = useState("single");
    const [rounding, setRounding] = useState("truncate");

    // Individual output components
    const [outputBinary, setOutputBinary] = useState("");
    const [outputSign, setOutputSign] = useState("");
    const [outputExponent, setOutputExponent] = useState("");
    const [outputMantissa, setOutputMantissa] = useState("");
    const [outputHex, setOutputHex] = useState("");
    const [copySuccess, setCopySuccess] = useState('');

    const splitBinary = (binary) => {
        const sign = binary.substring(0, 1);
        setOutputSign(sign);

        let exponent = "";
        let mantissa = "";

        switch (precision) {
            case "single":
                exponent = binary.substring(1, 9);
                mantissa = binary.substring(9, 32);
                break;
            case "double":
                exponent = binary.substring(1, 12);
                mantissa = binary.substring(12, 64);
                break;
            case "quadruple":
                exponent = binary.substring(1, 16);
                mantissa = binary.substring(16, 128);
                break;
            default:
                break;
        }

        setOutputExponent(exponent);
        setOutputMantissa(mantissa);
    };

    const splitBinaryBinComponents = () => {
        // Reverse output_exponent and split into groups of 4 then reverse again
        let reversed_exponent = outputExponent.split("").reverse().join("");
        let exponent_groups = [];
        for (let i = 0; i < reversed_exponent.length / 4; i++) {
            exponent_groups.push(reversed_exponent.substring(i * 4, (i + 1) * 4));
        }
        let output_exponent = exponent_groups.join(" ").split("").reverse().join("");

        // Reverse output_mantissa and split into groups of 4 then reverse again
        let reversed_mantissa = outputMantissa.split("").reverse().join("");
        let mantissa_groups = [];
        for (let i = 0; i < reversed_mantissa.length / 4; i++) {
            mantissa_groups.push(reversed_mantissa.substring(i * 4, (i + 1) * 4));
        }
        let output_mantissa = mantissa_groups.join(" ").split("").reverse().join("");

        let output_binary = outputSign + " " + output_exponent + " " + output_mantissa;
        setOutputBinary(output_binary);
    };

    const splitHex = (hex) => {
        const hexGroups = hex.match(/.{1,4}/g) || [];
        setOutputHex(hexGroups.join(" "));
    };

    const handleConvert = () => {
        try {
            const expDegree = 0; // Adjust as needed
            const converter = new convert(input, expDegree, precision, rounding);
            const { binStr, hexStr } = converter.process();

            // Set initial outputs
            setOutputBinary(binStr);
            setOutputHex(hexStr);

            // Automatically process outputs
            splitBinary(binStr);
            splitBinaryBinComponents();
            splitHex(hexStr);

            setOutput(`Binary: ${outputBinary}\nHexadecimal: ${outputHex}`);

        } catch (error) {
            console.error("Detailed Conversion Error:", {
                message: error.message,
                name: error.name,
                stack: error.stack,
                inputData: { input, precision, rounding },
            });

            setOutput(
                `Error in conversion:\n` +
                `Message: ${error.message}\n` +
                `Name: ${error.name}\n` +
                `Stack Trace:\n${error.stack}`
            );
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopySuccess('Copied!');
        setTimeout(() => {
            setCopySuccess('');
        }, 2000);
    }

    return (
        <div className="container my-4 flex-grow-1 text-start">
            <h1 className="mb-4 fs-5 fw-bold">Decimal to Floating-Point Converter</h1>
            <div className="row">
                {/* Input Section */}
                <div className="io-box col-md-5 p-0">
                    <ul className="nav nav-tabs align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">Precision</li>
                        <li className={`nav-item nav-item-type p-3 ${precision === "single" ? "active" : ""}`}
                            onClick={() => setPrecision("single")}
                        >
                            Single
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${precision === "double" ? "active" : ""}`}
                            onClick={() => setPrecision("double")}
                        >
                            Double
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${precision === "quadruple" ? "active" : ""}`}
                            onClick={() => setPrecision("quadruple")}
                        >
                            Quadruple
                        </li>
                    </ul>

                    <ul className="nav nav-tabs align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">Rounding</li>
                        <li
                            className={`nav-item nav-item-type p-3 ${rounding === "truncate" ? "active" : ""}`}
                            onClick={() => setRounding("truncate")}
                        >
                            Truncate
                        </li>
                        <li
                            className={`nav-item nav-item-type p-3 ${rounding === "ceiling" ? "active" : ""}`}
                            onClick={() => setRounding("ceiling")}
                        >
                            Ceiling
                        </li>
                        <li
                            className={`nav-item nav-item-type p-3 ${rounding === "floor" ? "active" : ""}`}
                            onClick={() => setRounding("floor")}
                        >
                            Floor
                        </li>
                        <li
                            className={`nav-item nav-item-type p-3 ${rounding === "nearest_even" ? "active" : ""}`}
                            onClick={() => setRounding("nearest_even")}
                        >
                            Ties to Even
                        </li>
                    </ul>

                    <div className="m-3">
                        <textarea
                            className="form-control io-box"
                            rows="5"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter a decimal number"
                        ></textarea>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="my-3 col-md-2 d-flex align-items-center justify-content-center">
                    <button className="btn btn-primary" onClick={handleConvert}>
                        Convert
                    </button>
                </div>

                {/* Output Section */}
                <div className="io-box output col-md-5 p-0 position-relative">
                    <ul className="nav nav-tabs output align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">Output</li>
                    </ul>
                    <div className="m-3">
                        <textarea
                            className="form-control io-box output text-black"
                            rows="5"
                            value={output}
                            readOnly
                            placeholder="Conversion result will appear here"
                        ></textarea>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-3">
                            <h5>Sign:</h5>
                            <p>{outputSign}</p>
                        </div>
                        <div className="col-md-3">
                            <h5>Exponent:</h5>
                            <p>{outputExponent}</p>
                        </div>
                        <div className="col-md-3">
                            <h5>Mantissa:</h5>
                            <p>{outputMantissa}</p>
                        </div>
                    </div>
                    
                    <button className="copy-btn borderless" onClick={handleCopy}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                        </svg>
                        {copySuccess && <span className="copy-feedback ms-2">{copySuccess}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DecimalFTP;
