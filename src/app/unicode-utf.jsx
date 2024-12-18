"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useState } from 'react';

const UnicodeUtf = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [utfType, setUtfType] = useState('UTF-8');
    const [selectedFormat, setSelectedFormat] = useState('Unicode');
    const [selectedOutput, setSelectedOutput] = useState('UTF');

    const handleInputChange = (e) => {
        setInput(e.target.value);
        convert();
    };

    const handleUtfTypeChange = (type) => {
        setUtfType(type);
        convert();
    };

    const handleSwap = () => {
        const temp = input;
        setInput(output);
        setOutput(temp);
        setSelectedFormat(selectedFormat === 'Unicode' ? 'UTF' : 'Unicode');
        setSelectedOutput(selectedOutput === 'UTF' ? 'Unicode' : 'UTF');
    };

    const convert = () => {
        if (input.length === 0) {
            setOutput('');
            return;
        }

        if (selectedFormat === 'Unicode') {
            setOutput(convertUnicodeToUtf(input));
        } else {
            setOutput(convertUtfToUnicode(input));
        }
    };

    const isValidUnicode = (unicode) => {
        const validChars = /^[0-9A-F]+$/i;
        const minCodePoint = 0x0;
        const maxCodePoint = 0x10FFFF;

        if (unicode.length === 0 || 
            unicode.length > 6 || 
            !unicode.match(validChars)) {
            return false;
        }

        const codePoint = parseInt(unicode, 16);

        if (codePoint < minCodePoint || codePoint > maxCodePoint) {
            return false;
        }

        return true;
    }


    const convertUnicodeToUtf = (unicode) => {
        let utf = '';
        if (isValidUnicode(unicode)) {

            const text = String.fromCodePoint(parseInt(unicode, 16));
            const encoder = new TextEncoder();

            if (utfType === 'UTF-8') {
                utf = Array.from(encoder.encode(text)).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
            } else if (utfType === 'UTF-16') {
                utf = text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase()).join(' ');
            } else if (utfType === 'UTF-32') {
                utf = unicode;
            } else {
                utf = 'Invalid UTF type';
            }
        } else {
            utf = 'Invalid UTF type';
        }

        return utf;
    };

    const convertUtfToUnicode = (utf) => {
        let unicode = '';
        if (utfType === 'UTF-8') {
            unicode = String.fromCharCode(parseInt(utf, 16));
        } else if (utfType === 'UTF-16') {
            unicode = String.fromCharCode(parseInt(utf, 16));
        } else if (utfType === 'UTF-32') {
            unicode = String.fromCharCode(parseInt(utf, 16));
        } else {
            unicode = 'Invalid UTF type';
        }
        return unicode;
    };

    return (
        <div className="container my-4 flex-grow-1 text-start">
            <h1 className='mb-4 fs-5 fw-bold'>Unicode to UTF Converter</h1>
            <div className="row">
                <div className="io-box col-md-5 p-0">
                    <ul className="nav nav-tabs align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">{selectedFormat}</li>
                        <li className={`nav-item nav-item-type p-3 ${utfType === 'UTF-8' ? 'active' : ''}`} 
                            onClick={() => handleUtfTypeChange('UTF-8')}
                        >
                            UTF-8
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${utfType === 'UTF-16' ? 'active' : ''}`} 
                            onClick={() => handleUtfTypeChange('UTF-16')}
                        >
                            UTF-16
                        </li>
                        <li className={`nav-item nav-item-type p-3 ${utfType === 'UTF-32' ? 'active' : ''}`} 
                            onClick={() => handleUtfTypeChange('UTF-32')}
                        >
                            UTF-32
                        </li>
                    </ul>
                    <div className="m-3">
                        <textarea 
                            className="form-control io-box" 
                            rows="5" 
                            value={input} 
                            onChange={handleInputChange} 
                        ></textarea>
                    </div>
                </div>
                <div className="my-3 col-md-2 d-flex align-items-center justify-content-center">
                    <button className='btn btn-primary' onClick={handleSwap}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                        </svg>
                    </button>
                </div>
                <div className="io-box output col-md-5 p-0">
                    <ul className="nav nav-tabs output align-items-center d-flex">
                        <li className="nav-item fw-bold me-4 p-3">{selectedOutput}</li>
                    </ul>
                    <div className="m-3">
                        <textarea 
                            className="form-control io-box outpu text-black" 
                            rows="5" 
                            value={output} 
                            readOnly 
                            placeholder="Translation"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnicodeUtf;