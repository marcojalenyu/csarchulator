import BigNumber from 'bignumber.js';

export class convertToFTP2 {
    constructor(inputNum, expDegree, precision, round) {
        this.expDegree = expDegree;
        this.outputArr = [];
        this.hexLib = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        this.negNum = 0;

        switch (round) {
            case "truncate":
                this.roundMthd = -1;
                break;
            case "ceiling":
                this.roundMthd = 0;
                break;
            case "floor":
                this.roundMthd = 1;
                break;
            case "nearest_even":
                this.roundMthd = 2;
                break;
            default:
                this.roundMthd = -1; // Default to truncate if unknown
                break;
        }

        switch (precision) {

            case "single":
                precision = 1;
                this.expBias = 127;
                this.expSize = 8;
                break;

            case "double":
                precision = 2;
                this.expBias = 1023;
                this.expSize = 11;
                break;

            case "quadruple":
                precision = 4;
                this.expBias = 16383;
                this.expSize = 15;
                break;

            default:
                precision = 1;
                this.expBias = 127;
                this.expSize = 8;
                break;
        }

        this.bitSize = precision * 32;
        this.hexSize = this.bitSize / 4;
        this.maxLimit = new BigNumber("2").exponentiatedBy(this.expBias + 1).minus(1);

        if (expDegree < 0) {
            this.inputStr = inputNum + "e" + expDegree;
            this.inputNum = new BigNumber(this.inputStr);
        }
        else {
            this.inputNum = new BigNumber(inputNum);
            this.inputNum = this.inputNum.times(BigNumber(10).exponentiatedBy(this.expDegree));
        }

        this.expDegree = 0;
    }
    
    process () {
        let isCase = this.chckInf();

        if (isCase === "inf") {
            if (this.inputNum < 0) {
                this.negNum = 1;
            }
            let infExp = this.convertToBin(this.expSize, this.expBias * 2 + 1);
            let infMts = [];
            this.pushToOutput(infExp, infMts);
            var {binStr: binStrInf, hexStr: hexStrInf} = this.getOutputStr();
            return {binStr: binStrInf, hexStr: hexStrInf};
        }

        // If negative
        if (this.inputNum < 0) {
            this.negNum = 1;
            this.inputNum = this.inputNum.abs();
        }

        let exp = 0;
        let num = new BigNumber(this.inputNum);

        if (num.isZero()) {
            // Zero special case
            let expBits = this.convertToBin(this.expSize, 0).reverse();
            let mantissaBits = Array(this.bitSize - (this.expSize + 1)).fill(0);
            this.pushToOutput(expBits, mantissaBits);
            var {binStr, hexStr} = this.getOutputStr();
            return {binStr, hexStr};
        }

        // Normalize so that 1 <= num < 2
        while (num.gte(2)) {
            num = num.dividedBy(2);
            exp++;
        }
        while (num.lt(1)) {
            num = num.times(2);
            exp--;
        }

        // Remove the implicit leading 1 for mantissa
        num = num.minus(1);

        // Get mantissa bits
        let mantissaBits = [];
        let mantissaLen = this.bitSize - (this.expSize + 1);
        for (let i = 0; i < mantissaLen; i++) {
            num = num.times(2);
            if (num.gte(1)) {
                mantissaBits.push(1);
                num = num.minus(1);
            } else {
                mantissaBits.push(0);
            }
        }

        // Calculate exponent bits
        let expBits = this.convertToBin(this.expSize, exp + this.expBias).reverse();

        this.pushToOutput(expBits, mantissaBits);

        ({binStr, hexStr} = this.getOutputStr());
        return {binStr, hexStr};
    }

    // Checks for infinity
    chckInf () {
        let tempNum = new BigNumber(this.inputNum.toString());
        let maxLimit = new BigNumber(this.maxLimit);
        if (tempNum.abs().gt(maxLimit)) {
            return "inf";
        }
    }

    // Converts bin to hex, then gets string representations of both bin and hex
    getOutputStr () {
        var binStr = "";
        var hexStr = "";
        for (let i = 0; i < this.bitSize; i++) {
            binStr += this.outputArr[i].toString();
        }
        for (let i = 0; i < this.hexSize; i++) {
            hexStr += this.convertToHex(this.outputArr[i*4], this.outputArr[i*4+1], this.outputArr[i*4+2], this.outputArr[i*4+3]);
        }
        return {binStr, hexStr};
    }

    // Fill up output array
    pushToOutput (expArr, mtsArr) {
        let i = 0;

        // Push sign bit
        this.outputArr.push(this.negNum);

        // Push exponent and integer to output
        for (i = 0; i < this.expSize; i++) {
            this.outputArr.push(expArr.shift());
        }
        for (i = 0; i < this.bitSize - (this.expSize + 1); i++) {
            if (mtsArr.length > 0) {
                this.outputArr.push(mtsArr.shift());
            }
            else {
                this.outputArr.push(0);
            }
        }

        if (mtsArr.length) {
            let rndStr = this.cmpExcess (mtsArr);
            switch (this.roundMthd) {
                case 0:
                case 1:
                    switch (rndStr) {
                        case "Greater":
                        case "Lesser":
                            if (this.negNum === this.roundMthd) {
                                this.roundOutput ("Up");
                            }
                            break;
                        default:
                            // No action needed for other cases
                            break;
                    }
                break;
                case 2:
                    switch (rndStr) {
                        case "Greater":
                            this.roundOutput("Up");
                            break;
                        case "Even":
                            if (this.outputArr[this.bitSize - 1] === 1) {
                                this.roundOutput("Up");
                            }
                            break;
                        default:
                            // No action needed for other cases
                            break;
                    }
                break;
                default:
                    // No action needed for other cases
                    break;
            }
        }
    }

    // Determines where excess bits lean towards
    cmpExcess (mtsArr) {
        let rndStr = "None";
        let arrLen = mtsArr.length - 1;
        let frstBit = mtsArr[arrLen];
        let zeroCnt = 0;
        let i = 0;

        // Count Zeroes
        if (frstBit === 1) {
            for (i = 0; i < arrLen; i++) {
                if (mtsArr.pop() === 0) {
                    zeroCnt++;
                }
            }
            if (zeroCnt === arrLen - 1) {
                rndStr = "Tied";
            }
            else {
                rndStr = "Greater";
            }
        }
        else {
            rndStr = "Lesser";
        }

        return rndStr;
    }

    // Adds or subtracts the output by 1
    roundOutput (rndTo) {
        let rndMod = -1;

        switch (rndTo) {
            case "Up":
                rndMod = 0;
                break;
            case "Down":
                rndMod = 1;
                break;
            default:
                // Default behavior if rndTo is not recognized
                rndMod = -1;
                break;
        }

        let currPos = this.bitSize - 1;
        
        // Rounding loop
        while (parseInt(this.outputArr[currPos].toString()) % 2 !== rndMod) {
            this.outputArr[currPos] = (parseInt(this.outputArr[currPos].toString()) + 1) % 2;
            currPos--;
        }
        if (this.outputArr[currPos] % 2 === rndMod) {
            this.outputArr[currPos] = (this.outputArr[currPos] + 1) % 2;
        }
    }

    // Print
    printOutput () {
        let i = 0;

        for (i = 0; i < this.bitSize; i++) {
            process.stdout.write(this.outputArr[i].toString());
        }
        for (i = 0; i < this.hexSize; i++) {
            process.stdout.write(this.convertToHex(this.outputArr[i*4], this.outputArr[i*4+1], this.outputArr[i*4+2], this.outputArr[i*4+3]));
        }
    }

    // Convert integer to binary
    convertToBin (bitSize, tempNum) {
        let i = 0;
        let dstArr = [];
        let srcNum = new BigNumber(tempNum.toString()).abs();
        
        for (i = 0; i < bitSize; i++) {
            dstArr.push(srcNum % 2);
            srcNum = srcNum.dividedBy(2).integerValue(BigNumber.ROUND_FLOOR);
        }

        return dstArr
    }

    // Convert fractional to binary
    convertFract (tmpNum) {
        let i = 0;
        let dstArr = [];
        let srcNum = new BigNumber(tmpNum.toString())
        while (srcNum !== 0) {
            srcNum = srcNum.times(2);
            dstArr.push(srcNum.integerValue(BigNumber.ROUND_FLOOR).abs());
            if (srcNum.integerValue(BigNumber.ROUND_FLOOR).abs().gt(0)) {
                srcNum = srcNum.minus(1);
            }

            i++;
            if (i > this.expBias + this.bitSize * 2) {
                break;
            }
        }

        return dstArr;
    }

    // Convert nibble to hex
    convertToHex (bit1, bit2, bit3, bit4) {
        let hexIndex = parseInt(bit4);
        hexIndex += parseInt(bit3) * 2;
        hexIndex += parseInt(bit2) * 4;
        hexIndex += parseInt(bit1) * 8;

        return this.hexLib[hexIndex];
    }
}