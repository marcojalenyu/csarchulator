import BigNumber from 'bignumber.js';

export class convertFTP2toDec {
    constructor(input, precision, inputType = 'hex') {
        this.hexStr = input;
        this.inputType = inputType;
        this.hexLib = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        switch (precision) {
            case 'double':
                precision = 2;
                this.expBias = 1023;
                this.expSize = 11;
                this.bitSize = 64;
                BigNumber.set({ DECIMAL_PLACES: 65000 });
                break;
            case 'quadruple':
                precision = 4;
                this.expBias = 16383;
                this.expSize = 15;
                this.bitSize = 128;
                BigNumber.set({ DECIMAL_PLACES: 350 });
                break;
            default: // single
                precision = 1;
                this.expBias = 127;
                this.expSize = 8;
                this.bitSize = 32;
                BigNumber.set({ DECIMAL_PLACES: 50 });
                break;
        }

        this.bitSize = precision * 32;
        this.hexSize = this.bitSize / 4;
        this.maxLimit = new BigNumber("2").exponentiatedBy(this.expBias + 1).minus(1);
    }

    process() {
        let binArr = [];

        if (this.inputType === 'hex') {
            if (this.hexStr.length !== this.hexSize) {
                return "Invalid Hex Length";
            }
            for (let i = 0; i < this.hexStr.length; i++) {
                binArr = binArr.concat(this.convertHexToBin(this.hexStr[i]));
            }
        } else {
            if (this.hexStr.length !== this.bitSize) {
                return "Invalid Bin Length";
            }
            binArr = Array.from(this.hexStr, bit => parseInt(bit, 10));
            // this.hexStr = this.hexStr.split("").reverse().join("");
        }

        console.log(binArr, this.hexStr, this.hexStr.length)

        let sign = binArr[0] ? -1 : 1;
        let mntArr = binArr.slice(1 + this.expSize);
        let expArr = binArr.slice(1, 1 + this.expSize);
        let exp;
        let mnt = this.convertToFract(mntArr);

        if (expArr.every(bit => bit === 1)) {
            if (mntArr.every(bit => bit === 0)) {
                return sign === -1 ? '-∞' : '∞';
            } else {
                return 'NaN';
            }
        }

        if (!(expArr.every(bit => bit === 0))) {
            exp = (this.convertToInt(expArr) - this.expBias).toString();
            mnt = mnt.plus(1);
        } else {
            exp = 1 - this.expBias;
        }

        return mnt.multipliedBy(new BigNumber(2).pow(exp)).multipliedBy(sign).toString();
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
        const dec = this.hexLib.indexOf(hex);
        return this.convertToBin(4, dec).reverse();
    }

    convertHexToFrac(hexStr) {
        let binArr = [];
        for (let i = 0; i < hexStr.length; i++) {
            binArr = binArr.concat(this.convertHexToBin(hexStr[i]));
        }
        return this.convertToFract(binArr);
    }

    convertBinToHex(binStr) {
        let hexStr = "";
        for (let i = 0; i < binStr.length; i += 4) {
            const binNibble = binStr.slice(i, i + 4);
            const hexDigit = this.convertToHex(...binNibble.split("").map(Number));
            hexStr += hexDigit;
        }
        return hexStr;
    }
}