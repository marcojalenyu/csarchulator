import BigNumber from 'bignumber.js';

const hexLib = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

// Convert integer to binary
export function convertToBin (bitSize, tempNum) {
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
export function convertFract (tmpNum) {
    let i = 0;
    let dstArr = [];
    let srcNum = new BigNumber(tmpNum.toString())
    while (srcNum.eq(0)) {
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
export function convertToFract(bits) {
    let sum = new BigNumber(0);
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === 1 || (bits[i].eq && bits[i].eq(1))) {
            sum = sum.plus(new BigNumber(1).dividedBy(new BigNumber(2).pow(i + 1)));
        }
    }
    return sum;
}

// Convert bits to int
export function convertToInt(bits) {
    let sum = 0;
    for (let i = 0; i < bits.length; i++) {
        sum = sum * 2 + bits[i];
    }
    return sum;
}

// Convert nibble to hex
export function convertToHex(bit1, bit2, bit3, bit4) {
    let hexIndex = parseInt(bit4);
    hexIndex += parseInt(bit3) * 2;
    hexIndex += parseInt(bit2) * 4;
    hexIndex += parseInt(bit1) * 8;
    return this.hexLib[hexIndex];
}

// Convert one hex to binary
export function convertHexToBin(hex) {
    const dec = hexLib.indexOf(hex);
    return convertToBin(4, dec).reverse();
}

// Converts a string of hex to fractional
export function convertHexToFrac(hexStr) {
    let binArr = [];
    for (let i = 0; i < hexStr.length; i++) {
        binArr = binArr.concat(convertHexToBin(hexStr[i]));
    }
    return convertToFract(binArr);
}

// Converts a string of hex to integer
export function convertHexToInt(hexStr) {
    let binArr = [];
    for (let i = 0; i < hexStr.length; i++) {
        binArr = binArr.concat(convertHexToBin(hexStr[i]));
    }
    return convertToInt(binArr);
}