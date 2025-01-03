import React, { useState } from 'react';
import { convert } from './decimal-ftp-convert';

const DecimalFTP = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [precision, setPrecision] = useState('single');
    const [rounding, setRounding] = useState('truncate');

    // const handleConvert = () => {
    //     try {
    //         const expDegree = 0; // Adjust as needed
    //         const converter = new convert(input, expDegree, precision, rounding);
    //         const { binStr, hexStr } = converter.process();
    //         setOutput(`Binary: ${binStr}\nHexadecimal: ${hexStr}`);
    //     } catch (error) {
    //         setOutput('Error in conversion: ' + error.message);
    //     }
    // };

    const handleConvert = () => {
        try {
            const expDegree = 0; // Adjust as needed
            const converter = new convert(input, expDegree, precision, rounding);
            const { binStr, hexStr } = converter.process();
            setOutput(`Binary: ${binStr}\nHexadecimal: ${hexStr}`);
        } catch (error) {
            const expDegree = 0; 
            console.error('Detailed Conversion Error:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                inputData: { input, expDegree, precision, rounding }
            });
    
            setOutput(
                `Error in conversion:\n` +
                `Message: ${error.message}\n` +
                `Name: ${error.name}\n` +
                `Stack Trace:\n${error.stack}\n\n` +
                `Inputs: input=${input}, expDegree=${expDegree}, precision=${precision}, rounding=${rounding}`
            );
        }
    };

    return (
        <div className="container my-4">
            <h1>Decimal to Floating-Point Converter</h1>
            <textarea
                className="form-control my-3"
                placeholder="Enter a decimal number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></textarea>

            <div className="my-3">
                <label>Precision:</label>
                <select
                    className="form-select"
                    value={precision}
                    onChange={(e) => setPrecision(e.target.value)}
                >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="quadruple">Quadruple</option>
                </select>
            </div>

            <div className="my-3">
                <label>Rounding:</label>
                <select
                    className="form-select"
                    value={rounding}
                    onChange={(e) => setRounding(e.target.value)}
                >
                    <option value="truncate">Truncate</option>
                    <option value="ceiling">Ceiling</option>
                    <option value="floor">Floor</option>
                    <option value="nearest_even">Nearest Even</option>
                </select>
            </div>

            <button className="btn btn-primary" onClick={handleConvert}>
                Convert
            </button>

            <pre className="my-4">{output}</pre>
        </div>
    );
};

// Export
export default DecimalFTP;