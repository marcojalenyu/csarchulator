"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useEffect, useState } from 'react';

const UnicodeUtf = ( {from, to} ) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [utfType, setUtfType] = useState('UTF-8');
    const [selectedFormat, setSelectedFormat] = useState(from);
    const [selectedOutput, setSelectedOutput] = useState(to);
    const [outputPlaceholder, setOutputPlaceholder] = useState('Translation');
    const [copySuccess, setCopySuccess] = useState('');

    /**
     * This effect is triggered whenever the input or utfType changes
     */
    useEffect(() => {
        convert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, utfType]);

    /**
     * This effect updates the state whenever the URL parameters change
     */
    useEffect(() => {
        if (from && to) {
            setSelectedFormat(from);
            setSelectedOutput(to);
            if (from === 'UTF' && to === 'Unicode') {
                const temp = input;
                setInput(output);
                setOutput(temp);
            } else if (from === 'Unicode' && to === 'UTF') {
                const temp = input;
                setInput(output);
                setOutput(temp);
            }
        } else {
            setSelectedFormat('Unicode');
            setSelectedOutput('UTF');
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
        setSelectedFormat(selectedFormat === 'Unicode' ? 'UTF' : 'Unicode');
        setSelectedOutput(selectedOutput === 'UTF' ? 'Unicode' : 'UTF');
        setOutputPlaceholder('Translation');
    };

    // This function converts the input to the selected output format
    const convert = () => {
        if (input.length === 0) {
            setOutput('');
            setOutputPlaceholder('Translation');
            return;
        }

        if (selectedFormat === 'Unicode') {
            setOutput(convertUnicodeToUtf(input));
        } else {
            setOutput(convertUtfToUnicode(input));
        }
    };

    // This function checks if the given string is all zeros
    const isZero = (str) => {
        return /^0+$/.test(str);
    };

    // This function checks if the given string is a valid hexadecimal number
    const isValidHex = (str) => {
        return /^[0-9A-F]+$/i.test(str);
    };

    /**
     * This function checks if the given unicode is valid or not
     * @param {*} unicode
     * @returns true if the unicode is valid, false otherwise
     * @see https://en.wikipedia.org/wiki/UTF-8
     * @see https://en.wikipedia.org/wiki/UTF-16
     * @see https://en.wikipedia.org/wiki/UTF-32
     * @see https://en.wikipedia.org/wiki/Unicode
    **/
    const isValidUnicode = (unicode) => {
        const minCodePoint = 0x0;
        const maxCodePoint = 0x10FFFF;

        if (unicode.length === 0 || 
            unicode.length > 6 || 
            !isValidHex(unicode)) {
            return false;
        }

        const codePoint = parseInt(unicode, 16);

        if (codePoint < minCodePoint || codePoint > maxCodePoint) {
            return false;
        }

        return true;
    }

    /**
     * This function converts the given unicode to UTF-8, UTF-16 or UTF-32
     * @param {*} unicode 
     * @returns UTF-8, UTF-16 or UTF-32 representation of the given unicode
     */
    const convertUnicodeToUtf = (unicode) => {
        
        // Remove leading zeros
        if (!isZero(unicode)) {
            unicode = unicode.replace(/^0+/, '');
        }
        let utf = '';

        if (isValidUnicode(unicode)) {

            if (utfType === 'UTF-8') {
                let intUnicode = parseInt(unicode, 16);
                if (intUnicode >= 0x00 && intUnicode <= 0x7F) {
                    utf = unicode.slice(-2).padStart(2, '0');
                } else {
                    let binUnicode = intUnicode.toString(2);
                    let numOfBits = binUnicode.length;
        
                    let start, bytesReq, res = '';
                    if (numOfBits > 16) {
                        start = '11110';
                        bytesReq = 4;
                        binUnicode = binUnicode.padStart(21, '0');
                    } else if (numOfBits > 11) {
                        start = '1110';
                        bytesReq = 3;
                        binUnicode = binUnicode.padStart(16, '0');
                    } else {
                        start = '110';
                        bytesReq = 2;
                        binUnicode = binUnicode.padStart(11, '0');
                    }
        
                    for (let i = 0; i < bytesReq - 1; i++) {
                        res = '10' + binUnicode.slice(-6) + res;
                        binUnicode = binUnicode.slice(0, -6);
                    }
        
                    res = start + binUnicode + res;
                    utf = parseInt(res, 2).toString(16).toUpperCase();
                }
            } else if (utfType === 'UTF-16') {
                let intUnicode = parseInt(unicode, 16);
                if (intUnicode <= 0xFFFF) {
                    utf = unicode.slice(-4).padStart(4, '0');
                } else {
                    let subtractedVal = intUnicode - 0x10000;
                    let binaryVal = subtractedVal.toString(2).padStart(20, '0');
                    let left = binaryVal.slice(0, 10);
                    let right = binaryVal.slice(10, 20);
        
                    let finalLeft = (0xD800 + parseInt(left, 2)).toString(16).toUpperCase();
                    let finalRight = (0xDC00 + parseInt(right, 2)).toString(16).toUpperCase();
        
                    utf = finalLeft + finalRight;
                }
            } else if (utfType === 'UTF-32') {
                utf = unicode.slice(-8).padStart(8, '0').toUpperCase();
            } else {
                setOutputPlaceholder('Invalid UTF type');
            }

        } else {
            setOutputPlaceholder('Invalid Unicode');
        }

        return utf;
    };

    /**
     * This function converts the given UTF-8, UTF-16 or UTF-32 to unicode
     * @param {*} utf 
     * @returns Unicode representation of the given UTF-8, UTF-16 or UTF-32
     */
    const convertUtfToUnicode = (utf) => {
        // Remove leading zeros
        if (!isZero(utf)) {
            utf = utf.replace(/^0+/, '');
        }

        let unicode = '';

        if (isValidHex(utf)) {
            if (utfType === 'UTF-8') {
                let binary = parseInt(utf, 16).toString(2).padStart(utf.length * 4, '0');
                let codePoint = '';

                if (binary.length !== 8) {
                    binary = binary.padStart(8, '0');
                }
                
                if (binary.startsWith('0') && binary.length === 8) { // Single byte sequence
                    codePoint = binary;
                } else if (binary.startsWith('110') && binary.length === 16) { // 2-byte sequence
                    codePoint = binary.slice(3, 8) + binary.slice(10, 16);
                } else if (binary.startsWith('1110') && binary.length === 24) { // 3-byte sequence
                    codePoint = binary.slice(4, 8) + binary.slice(10, 16) + binary.slice(18, 24);
                } else if (binary.startsWith('11110') && binary.length === 32) { // 4-byte sequence
                    codePoint = binary.slice(5, 8) + binary.slice(10, 16) + binary.slice(18, 24) + binary.slice(26, 32);
                } else {
                    setOutputPlaceholder('Invalid UTF-8');
                    return unicode;
                }

                unicode = parseInt(codePoint, 2).toString(16).toUpperCase();
            } 
            else if (utfType === 'UTF-16') {
                const codePoint = parseInt(utf, 16);

                if (codePoint <= 0xFFFF) { // Single 2-byte sequence
                    unicode = codePoint.toString(16).toUpperCase();
                } else if (utf.length === 8) { // Surrogate pair (4 bytes)
                    let high = parseInt(utf.slice(0, 4), 16) - 0xD800;
                    let low = parseInt(utf.slice(4), 16) - 0xDC00;
                    let codePoint = (high << 10) + low + 0x10000;
                    unicode = codePoint.toString(16).toUpperCase();
                } else {
                    setOutputPlaceholder('Invalid UTF-16');
                }
            } 
            else if (utfType === 'UTF-32') {
                // UTF-32 is simply the code point padded to 4 bytes
                unicode = parseInt(utf, 16).toString(16).toUpperCase();
            } 
            else {
                setOutputPlaceholder('Invalid UTF type');
            }
        } else {
            setOutputPlaceholder('Invalid UTF');
        }
    
        if (isValidUnicode(unicode)) {
            return unicode;
        }
        
        setOutputPlaceholder('Invalid Unicode');
        return '';
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
                    <ul className="nav nav-tabs align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">{selectedFormat}</li>
                        <li className={`nav-item nav-item-type p-3 ${utfType === 'UTF-8' ? 'active' : ''}`} 
                            onClick={() => setUtfType('UTF-8')}
                        >
                            UTF-8
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${utfType === 'UTF-16' ? 'active' : ''}`} 
                            onClick={() => setUtfType('UTF-16')}
                        >
                            UTF-16
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${utfType === 'UTF-32' ? 'active' : ''}`} 
                            onClick={() => setUtfType('UTF-32')}
                        >
                            UTF-32
                        </li>
                    </ul>
                    <div className="m-3">
                        <textarea 
                            className="form-control io-box" 
                            rows="5" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)}
                            maxLength={16} 
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
};

export default UnicodeUtf;