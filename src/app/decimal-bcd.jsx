import { useEffect, useState } from "react";
import {
    decimalToUnpackedBCD,
    unpackedBCDToDecimal,
    decimalToPackedBCD,
    packedBCDToDecimal,
    decimalToDenselyPackedBCD,
    denselyPackedBCDToDecimal
} from "./decimal-bcd-convert";

const DecimalBCD = ( { from, to } ) => {

    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [selectedFormat, setSelectedFormat] = useState(from);
    const [selectedOutput, setSelectedOutput] = useState(to);
    const [outputPlaceholder, setOutputPlaceholder] = useState('Translation');
    const [copySuccess, setCopySuccess] = useState('');
    const [bcdType, setBcdType] = useState('Unpacked BCD'); // 'Unpacked BCD', 'Packed BCD', 'Densely Packed BCD'

    /**
     * This effect is triggered whenever the input changes
     */
    useEffect(() => {
        convert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, selectedFormat, selectedOutput, bcdType]);

    /**
     * This effect updates the state whenever the URL parameters change
     */
    useEffect(() => {
        if (from && to) {
            setSelectedFormat(from);
            setSelectedOutput(to);
            if (from === 'Decimal' && to === 'BCD') {
                const temp = input;
                setInput(output);
                setOutput(temp);
            } else if (from === 'BCD' && to === 'Decimal') {
                const temp = input;
                setInput(output);
                setOutput(temp);
            }
        } else {
            setSelectedFormat('Decimal');
            setSelectedOutput('BCD');
        }
    }, [from, to]);    

    /**
     * This effect updates the URL whenever selectedFormat or selectedOutput changes
     */
    useEffect(() => {
        const newUrl = `${window.location.origin}/${selectedFormat.toLowerCase()}-${selectedOutput.toLowerCase()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }, [selectedFormat, selectedOutput]);

    // This function swaps the input and output fields
    const handleSwap = () => {
        const temp = input;
        setInput(output);
        setOutput(temp);
        setSelectedFormat(selectedFormat === 'Decimal' ? 'BCD' : 'Decimal');
        setSelectedOutput(selectedOutput === 'BCD' ? 'Decimal' : 'BCD');
        setOutputPlaceholder('Translation');
    };

    // This function converts the input to the selected output format
    const convert = () => {
        if (input.length === 0) {
            setOutput('');
            setOutputPlaceholder('Translation');
            return;
        }

        if (selectedFormat === 'Decimal') {
            if (bcdType === 'Unpacked BCD') {
                setOutput(decimalToUnpackedBCD(input));
            } else if (bcdType === 'Packed BCD') {
                setOutput(decimalToPackedBCD(input));
            } else if (bcdType === 'Densely Packed BCD') {
                setOutput(decimalToDenselyPackedBCD(input));
            }
        } else {
            if (bcdType === 'Unpacked BCD') {
                setOutput(unpackedBCDToDecimal(input));
            } else if (bcdType === 'Packed BCD') {
                setOutput(packedBCDToDecimal(input));
            } else if (bcdType === 'Densely Packed BCD') {
                setOutput(denselyPackedBCDToDecimal(input));
            }
        }
        // For invalid inputs
        if (output === '') {
            setOutputPlaceholder('Invalid number');
        }
    };

    // This function copies the output to the clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopySuccess('Copied!');
        setTimeout(() => {
            setCopySuccess('');
        }, 2000);
    }

    return (
        <div className="container my-4 flex-grow-1 text-start">
            <h1 className='mb-4 fs-5 fw-bold'>{selectedFormat} to {selectedOutput} Converter</h1>
            <div className="row">
                <div className="io-box col-md-5 p-0">
                    <ul className="nav nav-tabs input align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">{selectedFormat}</li>
                        <li
                            className={`nav-item nav-item-type p-3${bcdType === 'Unpacked BCD' ? ' active' : ''}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setBcdType('Unpacked BCD')}
                        >
                            Unpacked
                        </li>
                        <li
                            className={`nav-item nav-item-type p-3${bcdType === 'Packed BCD' ? ' active' : ''}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setBcdType('Packed BCD')}
                        >
                            Packed
                        </li>
                        <li
                            className={`nav-item nav-item-type p-3${bcdType === 'Densely Packed BCD' ? ' active' : ''}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setBcdType('Densely Packed BCD')}
                        >
                            Densely Packed
                        </li>
                    </ul>
                    <div className="m-3">
                        <textarea 
                            className="form-control io-box" 
                            rows="5" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter a number"
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
                <div className="io-box output col-md-5 p-0 position-relative">
                    <ul className="nav nav-tabs output align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">{selectedOutput}</li>
                    </ul>
                    <div className="m-3">
                        <textarea 
                            className="form-control io-box output text-black" 
                            rows="5" 
                            value={output} 
                            readOnly 
                            placeholder={outputPlaceholder}
                        ></textarea>
                    </div>
                    <button className='copy-btn borderless' onClick={() => handleCopy()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                        </svg>                        
                        {copySuccess && <span className="copy-feedback ms-2">{copySuccess}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DecimalBCD;
