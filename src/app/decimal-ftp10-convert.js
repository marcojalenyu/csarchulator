export class convertToFTP10 {
    constructor(inputNum, expDegree, isPositive, precision) {
        this.inputNum = inputNum;
        this.expDegree = parseInt(expDegree);
        this.outputStr = "";
        this.hexLib = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

        switch (isPositive) {
            case true:
                this.isNegative = 0;
                break;

            case false:
                this.isNegative = 1;
                break;

            default:
                this.isNegative = 0; // Default to positive if value is unexpected
                break;
        }

        switch (precision) {

            case "single":
                precision = 1;
                break;

            case "double":
                precision = 2;
                break;

            case "quadruple":
                precision = 4;
                break;

            default:
                precision = 1; // Default to single precision if value is unexpected
                break;
        }

        this.bitSize = precision * 32;
        this.hexSize = this.bitSize / 4;
        this.combiBit = 5;
        this.coefBit = this.bitSize - (this.bitSize % 10) - 10;
        this.strLen = ((this.coefBit / 10) * 3) + 1;
        this.expSize = this.bitSize - this.coefBit - this.combiBit - 1;
        
        let expLim = ((Math.pow(2, this.expSize + 2) - Math.pow(2, this.expSize))) - 1;
        let expOffset = Math.pow(2, precision + (precision % 3) + (precision % 2)) - (4 - precision);
        this.expBias = expLim - parseInt(expLim / 2) + expOffset;

        if (this.expDegree < this.expBias * -1) {
            this.expDegree = 0;
            this.inputNum = "0";
        }
    }
    
    process () {
        this.inputNum = this.normalizeInput();
        
        let i = 1;
        let j = 0;

        let tempArr = [];
        let bitArr1 = [];
        let bitArr2 = [];
        let bitArr3 = [];
        let bigBitArr = [bitArr1, bitArr2, bitArr3];
        let hexStr = "";

        this.expDegree += this.expBias;
        tempArr = this.convertToBin(this.expSize + 2, this.expDegree);

        bitArr1 = this.convertToBin(4, this.inputNum[0]);

        // Add sign bit
        this.outputStr += this.isNegative;

        // Add combination bits
        if (bitArr1[0]) {
            this.outputStr += "11";
            this.outputStr += tempArr[0];
            this.outputStr += tempArr[1];
            this.outputStr += bitArr1[3];
        }
        else {
            this.outputStr += tempArr[0];
            this.outputStr += tempArr[1];
            this.outputStr += bitArr1[1];
            this.outputStr += bitArr1[2];
            this.outputStr += bitArr1[3];
        }
        
        // Add exponent continuation bits
        for (i = 0; i < this.expSize; i++) {
            this.outputStr += tempArr[i + 2];
        }

        // Add coefficient continuation bits
        for (i = 1; i < this.strLen; i++) {
            bigBitArr[(i - 1) % 3] = this.convertToBin (4, parseInt(this.inputNum[i]));
            if (i % 3 === 0) {
                tempArr = this.mapBCD(bigBitArr);
                for (j = 0; j < tempArr.length; j++) {
                    this.outputStr += tempArr[j];
                }
            }
        }

        hexStr = this.getOutputStr(this.outputStr);
        let binStr = this.outputStr;

        return {binStr, hexStr};
    }

    // Maps to Densely-Packed BCD
    mapBCD (bitArr) {
        let bcdArr = [];
        let indArr = [];
        let sumOne = bitArr[0][0] + bitArr[1][0] + bitArr[2][0];
        let i = 0;
        let index = -1;

        // Map least significant bits
        bcdArr[9] = bitArr[2][3];
        bcdArr[5] = bitArr[1][3];
        bcdArr[2] = bitArr[0][3];

        // If there is a digit that is over 7
        if (sumOne > 0) { 
            bcdArr[6] = 1;

            // One digit over 7
            if (sumOne === 1) {
                // Get the index of the first instance of 1 in every bit array
                for (i = 0; i < 3; i++) {
                    indArr[i] = Math.abs(bitArr[i].indexOf(1));
                }

                // Find the index of the bit array whose 1 is the most significant bit
                index = 2 - indArr.indexOf(0);

                // Map BCD array based on the other two bit arrays
                if (indArr.indexOf(1) === 0) {
                    bcdArr[0] = bitArr[0][1];
                    bcdArr[1] = bitArr[0][2];
                    bcdArr[3] = bitArr[index + 1][1];
                    bcdArr[4] = bitArr[index + 1][2];
                }
                else {
                    bcdArr[0] = bitArr[2][1];
                    bcdArr[1] = bitArr[2][2];
                    bcdArr[3] = bitArr[1][1];
                    bcdArr[4] = bitArr[1][2];
                }

                indArr = this.convertToBin (2, index);

                // Map found index to BCD array
                bcdArr[7] = indArr[0];
                bcdArr[8] = indArr[1];
            }
            // Multiple digits with 1 as the most significant bit
            else if (sumOne >= 2) {
                bcdArr[7] = 1;
                bcdArr[8] = 1;

                // Map BCD array if all digits have 1 as the most significant bit
                if (sumOne === 3) {
                    bcdArr[0] = 0;
                    bcdArr[1] = 0;
                    bcdArr[3] = 1;
                    bcdArr[4] = 1;
                }
                else {
                    // Find the index of the digit <= 7
                    for (i = 0; i < 3; i++) {
                        indArr[i] = bitArr[i].indexOf(0);
                    }

                    // Map bit array based on index
                    index = indArr.indexOf(0);
                    indArr = this.convertToBin (2, 2 - index);
                    bcdArr[0] = bitArr[index][1];
                    bcdArr[1] = bitArr[index][2];
                    bcdArr[3] = indArr[0];
                    bcdArr[4] = indArr[1];
                }
            }
        }
        // If there is no digit over 7
        else { 
            bcdArr[0] = bitArr[0][1];
            bcdArr[1] = bitArr[0][2];
            bcdArr[3] = bitArr[1][1];
            bcdArr[4] = bitArr[1][2];
            bcdArr[6] = 0;
            bcdArr[7] = bitArr[2][1];
            bcdArr[8] = bitArr[2][2];
        }

        return bcdArr;
    }

    // Adds leading zeroes to input
    normalizeInput () {
        let i = 0;
        let nrmStr = "";
        for (i = this.strLen; i > 0; i--) {
            if (this.strLen - i < this.strLen - this.inputNum.length) {
                nrmStr += "0";
            }
            else {
                nrmStr += this.inputNum[this.inputNum.length - i];
            }
        }
        return nrmStr;
    }

    // Convert integer to binary
    convertToBin (bitSize, srcNum) {
        let i = 0;
        let dstArr = [];
        for (i = 0; i < bitSize; i++) {
            dstArr[bitSize - i - 1] = srcNum % 2;
            srcNum = parseInt(srcNum / 2);
        }

        return dstArr;
    }

    // Convert nibble to hex
    convertToHex (bit1, bit2, bit3, bit4) {
        let hexIndex = bit4;
        hexIndex += bit3 * 2;
        hexIndex += bit2 * 4;
        hexIndex += bit1 * 8;

        return this.hexLib[hexIndex];
    }

    // Get hexadecimal representation
    getOutputStr (binStr) {
        var hexStr = "";
        for (var i = 0; i < this.hexSize; i++) {
            hexStr += this.convertToHex(parseInt(binStr[i*4]), parseInt(binStr[i*4+1]), parseInt(binStr[i*4+2]), parseInt(binStr[i*4+3]));
        }
        return hexStr;
    }
}