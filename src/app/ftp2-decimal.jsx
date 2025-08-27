import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { convertFTP2toDec } from "./ftp2-decimal-convert";

const FTP2Decimal = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {
        initialInput = "",
        initialDecimalOutput = "",
        initialInputFormat = "binary",
        initialPrecision = "single",
        initialRounding = "truncate"
    } = location.state || {};

    const [input, setInput] = useState(initialInput);
    const [inputFormat, setInputFormat] = useState(initialInputFormat);
    const [precision, setPrecision] = useState(initialPrecision);
    const [rounding, setRounding] = useState(initialRounding);
    const [decimalOutput, setDecimalOutput] = useState(initialDecimalOutput);
    const [copySuccess, setCopySuccess] = useState('');
    const [outputPlaceholder, setOutputPlaceholder] = useState('Translation');

    useEffect(() => {
        handleConvert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, precision, rounding, inputFormat]);

    const handleConvert = () => {
        if (input.length === 0) {
            setDecimalOutput('');
            setOutputPlaceholder('Translation');
            return;
        }

        let hexStr = "";
        try {
            if (inputFormat === "binary") {
                // Remove spaces and validate
                const binStr = input.replace(/\s+/g, "");
                if (!/^[01]+$/.test(binStr)) {
                    setOutputPlaceholder('Invalid binary input');
                    return;
                }
                
                // Convert binary to hex
                hexStr = parseInt(binStr, 2).toString(16).toUpperCase().padStart(
                    precision === "single" ? 8 :
                    precision === "double" ? 16 : 32, "0"
                );
            } else {
                // Remove spaces and validate
                hexStr = input.replace(/\s+/g, "").toUpperCase();
                if (!/^[0-9A-F]+$/.test(hexStr)) {
                    setOutputPlaceholder('Invalid hex input');
                    return;
                }
            }

            // Use your converter
            let converter;
            if (inputFormat === "binary") {
                converter = new convertFTP2toDec(hexStr, precision, 'binary');
            } else {
                converter = new convertFTP2toDec(hexStr, precision);
            }
            let decimalStr = converter.process();

            if (rounding !== "truncate" && !isNaN(Number(decimalStr))) {
                let num = Number(decimalStr);
                switch (rounding) {
                    case "ceiling":
                        decimalStr = Math.ceil(num).toString();
                        break;
                    case "floor":
                        decimalStr = Math.floor(num).toString();
                        break;
                    case "nearest_even":
                        decimalStr = (Math.round(num / 2) * 2).toString();
                        break;
                    default:
                        break;
                }
            }

            if (decimalStr === 'Invalid Hex Length') {
                setOutputPlaceholder(decimalStr);
                setDecimalOutput('');
            } else {
                setDecimalOutput(decimalStr);
                setOutputPlaceholder('Translation');
            }

        } catch (error) {
            setDecimalOutput('');
            setOutputPlaceholder('Invalid input');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(decimalOutput);
        setCopySuccess('Copied!');
        setTimeout(() => {
            setCopySuccess('');
        }, 2000);
    }

    // This function swaps the input and output fields
    const handleSwap = () => {
        navigate("/decimal-ftp2", {
            state: {
                initialInput: decimalOutput,
                initialPrecision: precision,
                initialRounding: rounding,
                initialOutputFormat: inputFormat
            }
        });        
    };

    return (
        <div className="container my-4 flex-grow-1 text-start">
            <h1 className="mb-4 fs-5 fw-bold">IEEE-754 Binary Floating-Point to Decimal Converter</h1>
            <div className="row">
                {/* Input Section */}
                <div className="io-box col-md-5 p-0">
                    <ul className="nav nav-tabs align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">Input</li>
                        <li className={`nav-item nav-item-type p-3 ${inputFormat === "binary" ? "active" : ""}`}
                            onClick={() => setInputFormat("binary")}
                        >
                            Binary
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${inputFormat === "hexadecimal" ? "active" : ""}`}
                            onClick={() => setInputFormat("hexadecimal")}
                        >
                            Hexadecimal
                        </li>
                    </ul>

                    <div className="m-3">
                        <textarea
                            className="form-control io-box"
                            rows="5"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Enter a floating-point value in the selected format`}
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

                    <ul className="nav nav-tabs output align-items-center d-flex">
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
                    <div className="m-3 position-relative">
                        <textarea
                            className="form-control io-box output text-black"
                            rows="5"
                            value={decimalOutput}
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
                </div>
            </div>
        </div>
    );
};

export default FTP2Decimal;