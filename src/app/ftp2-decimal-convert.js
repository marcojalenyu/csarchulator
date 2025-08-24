import BigNumber from 'bignumber.js';

export class convertFTP2toDec {
    constructor(inputHex, precision) {
        this.hexStr = inputHex;
        this.hexLib = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

        switch (precision) {
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
    }

    process() {
        let binArr = [];
        let expArr = [];
        let mntArr = [];

        if (this.hexStr.length !== this.hexSize) {
            return "Invalid hex length.";
        }

        for (let i = 0; i < this.hexStr.length; i++) {
            binArr = binArr.concat(convertHexToBin(hexStr[i]));
        }

        let sign = binArr[0] ? -1 : 1;
        expArr = binArr.slice(1, 1 + this.expSize);
        mntArr = binArr.slice(1 + this.expSize);

        let exp = (this.convertToInt(expArr) - this.expBias).toString();
        let mnt = this.convertToFract(mntArr).plus(1);
        return new BigNumber(mnt.toString()).multipliedBy(new BigNumber(2).pow(exp)).multipliedBy(sign);
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

    // Convert bits to fractional value
    convertToFract(bits) {
        let sum = new BigNumber(0);

        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === 1 || (bits[i].eq && bits[i].eq(1))) {
                sum = sum.plus(new BigNumber(1).dividedBy(new BigNumber(2).pow(i + 1)));
            }
        }

        return sum;
    }

    convertToInt(bits) {
        let sum = 0;
        for (let i = 0; i < bits.length; i++) {
            sum = sum * 2 + bits[i];
        }
        return sum;
    }

    // Convert nibble to hex
    convertToHex(bit1, bit2, bit3, bit4) {
        let hexIndex = parseInt(bit4);
        hexIndex += parseInt(bit3) * 2;
        hexIndex += parseInt(bit2) * 4;
        hexIndex += parseInt(bit1) * 8;

        return this.hexLib[hexIndex];
    }

    // Convert one hex to binary
    convertHexToBin(hex) {
        const dec = hexLib.indexOf(hex);
        return convertToBin(4, dec).reverse();
    }

    convertHexToFrac(hexStr) {
        let binArr = [];
        for (let i = 0; i < hexStr.length; i++) {
            binArr = binArr.concat(convertHexToBin(hexStr[i]));
        }
        return convertToFract(binArr);
    }
}