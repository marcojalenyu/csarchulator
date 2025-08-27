import React, { useState, useEffect } from "react";
import { convertToFTP2 } from "./decimal-ftp2-convert";
import { useLocation, useNavigate } from "react-router-dom";

const DecimalFTP2 = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {
        initialInput = "",
        initialOutputFormat = "binary",
        initialPrecision = "single",
        initialRounding = "truncate"
    } = location.state || {};

    const [input, setInput] = useState(initialInput);
    const [binaryOutput, setBinaryOutput] = useState("");
    const [hexOutput, setHexOutput] = useState("");
    const [outputFormat, setOutputFormat] = useState(initialOutputFormat);
    const [precision, setPrecision] = useState(initialPrecision);
    const [rounding, setRounding] = useState(initialRounding);

    // Individual output components
    const [outputSign, setOutputSign] = useState("");
    const [outputExponent, setOutputExponent] = useState("");
    const [outputMantissa, setOutputMantissa] = useState("");
    const [copySuccess, setCopySuccess] = useState('');
    const [outputPlaceholder, setOutputPlaceholder] = useState('Translation');

    /**
     * This effect is triggered whenever the input, precision, or rounding changes
     */
    useEffect(() => {
        handleConvert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, precision, rounding]);

    const splitBinary = (binary) => {
        const sign = binary.substring(0, 1);

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

        return { sign, exponent, mantissa };
    };

    const splitBinaryBinComponents = (sign, exponent, mantissa) => {
        // Reverse exponent and split into groups of 4, then reverse again
        let reversedExponent = exponent.split("").reverse().join("");
        let exponentGroups = [];
        for (let i = 0; i < reversedExponent.length / 4; i++) {
            exponentGroups.push(reversedExponent.substring(i * 4, (i + 1) * 4));
        }
        let outputExponent = exponentGroups.join(" ").split("").reverse().join("");

        // Same for mantissa
        let reversedMantissa = mantissa.split("").reverse().join("");
        let mantissaGroups = [];
        for (let i = 0; i < reversedMantissa.length / 4; i++) {
            mantissaGroups.push(reversedMantissa.substring(i * 4, (i + 1) * 4));
        }
        let outputMantissa = mantissaGroups.join(" ").split("").reverse().join("");

        return `${sign} ${outputExponent} ${outputMantissa}`;
    };

    const splitHex = (hex) => {
        const hexGroups = hex.match(/.{1,4}/g) || [];
        return hexGroups.join(" ");
    };

    const splitComponents = (bin, hex) => {
        const { sign, exponent, mantissa } = splitBinary(bin);
        const formattedBinary = splitBinaryBinComponents(sign, exponent, mantissa);
        const formattedHex = splitHex(hex);

        setOutputSign(sign);
        setOutputExponent(exponent);
        setOutputMantissa(mantissa);

        return { formattedBinary, formattedHex };
    };


    const handleConvert = () => {
        if (input.length === 0) {
            setBinaryOutput('');
            setHexOutput('');
            setOutputSign('');
            setOutputExponent('');
            setOutputMantissa('');
            setOutputPlaceholder('Translation');
            return;
        }

        // Check if input is a valid number (strict validation)
        const trimmedInput = input.trim();
        const isValidNumber = /^-?\d*\.?\d+([eE][+-]?\d+)?$/.test(trimmedInput);
        
        if (!isValidNumber) {
            setBinaryOutput('');
            setHexOutput('');
            setOutputSign('');
            setOutputExponent('');
            setOutputMantissa('');
            setOutputPlaceholder('Invalid input');
            return;
        }

        try {
            const expDegree = 0;
            const converter = new convertToFTP2(input, expDegree, precision, rounding);
            const { binStr, hexStr } = converter.process();

            const { formattedBinary, formattedHex } = splitComponents(binStr, hexStr);

            setBinaryOutput(formattedBinary);
            setHexOutput(formattedHex);
            setOutputPlaceholder('Translation');
        } 
        catch (error) {
            console.error("Detailed Conversion Error:", {
                message: error.message,
                name: error.name,
                stack: error.stack,
                inputData: { input, precision, rounding },
            });

            setBinaryOutput('');
            setHexOutput('');
            setOutputSign('');
            setOutputExponent('');
            setOutputMantissa('');
            setOutputPlaceholder('Invalid input');
        }
    };

    const handleCopy = () => {
        const currentOutput = outputFormat === "binary" ? binaryOutput : hexOutput;
        navigator.clipboard.writeText(currentOutput);
        setCopySuccess('Copied!');
        setTimeout(() => {
            setCopySuccess('');
        }, 2000);
    }
    
    // This function swaps the input and output fields
    const handleSwap = () => {
        const currentOutput = outputFormat === "binary" ? binaryOutput : hexOutput;
        navigate("/ftp2-decimal", { 
            state: { 
                initialInput: currentOutput,
                initialInputFormat: outputFormat,
                initialPrecision: precision,
                initialRounding: rounding,
            } 
        });
    };

    return (
        <div className="container my-4 flex-grow-1 text-start">
            <h1 className="mb-4 fs-5 fw-bold">Decimal to IEEE-754 Binary Floating-Point Converter</h1>
            <div className="row">
                {/* Input Section */}
                <div className="io-box col-md-5 p-0">
                    <ul className="nav nav-tabs align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">Precision</li>
                        <li className={`nav-item nav-item-type p-3 ${precision === "single" ? "active" : ""}`}
                            onClick={() => setPrecision("single")}
                            style={{ minWidth: 'fit-content', textAlign: 'center' }}
                        >
                            Single<br/>(32-bit)
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${precision === "double" ? "active" : ""}`}
                            onClick={() => setPrecision("double")}
                            style={{ minWidth: 'fit-content', textAlign: 'center' }}
                        >
                            Double<br/>(64-bit)
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${precision === "quadruple" ? "active" : ""}`}
                            onClick={() => setPrecision("quadruple")}
                            style={{ minWidth: 'fit-content', textAlign: 'center' }}
                        >
                            Quadruple<br/>(128-bit)
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
                            placeholder="Enter a decimal number (exponents allowed; e.g. 1.5e-10)"
                        ></textarea>
                    </div>
                </div>

                <div className="my-3 col-md-2 d-flex align-items-center justify-content-center">
                    <button className='btn btn-primary' onClick={handleSwap}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                        </svg>
                    </button>
                </div>

                {/* Output Section */}
                <div className="io-box output col-md-5 p-0 position-relative">
                    <ul className="nav nav-tabs output align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">Output</li>
                        <li className={`nav-item nav-item-type p-3 ${outputFormat === "binary" ? "active" : ""}`}
                            onClick={() => setOutputFormat("binary")}
                        >
                            Binary
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${outputFormat === "hexadecimal" ? "active" : ""}`}
                            onClick={() => setOutputFormat("hexadecimal")}
                        >
                            Hexadecimal
                        </li>
                    </ul>
                    <div className="m-3 position-relative">
                        <textarea
                            className="form-control io-box output text-black"
                            rows="5"
                            value={outputFormat === "binary" ? binaryOutput : hexOutput}
                            readOnly
                            placeholder={outputPlaceholder}
                        ></textarea>
                        <button className="copy-btn borderless position-absolute" 
                                style={{bottom: '8px', right: '8px'}} 
                                onClick={handleCopy}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                            </svg>
                            {copySuccess && <span className="copy-feedback ms-2">{copySuccess}</span>}
                        </button>
                    </div>

                    <div className="mt-4 mx-3">
                        <div className="mb-3">
                            <div className="p-2 border rounded bg-light">
                                <span className="fw-bold text-black">Sign: </span>
                                <span className="fs-6 text-black" style={{wordBreak: 'break-all'}}>{outputSign}</span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="p-2 border rounded bg-light">
                                <span className="fw-bold text-black">Exponent: </span>
                                <span className="fs-6 text-black" style={{wordBreak: 'break-all'}}>{outputExponent}</span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="p-2 border rounded bg-light">
                                <span className="fw-bold text-black">Mantissa: </span>
                                <span className="fs-6 text-black" style={{wordBreak: 'break-all'}}>{outputMantissa}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DecimalFTP2;
