// Helper function to group bits 
function groupRight(str, n) {
    // Pad left with zeros to make length a multiple of n
    const padLen = (n - (str.length % n)) % n;
    if (padLen > 0) str = '0'.repeat(padLen) + str;
    let out = [];
    for (let i = str.length; i > 0; i -= n) {
        out.unshift(str.substring(Math.max(i - n, 0), i));
    }
    return out;
}

// Decimal to Unpacked BCD: Each digit is a byte (0000dddd)
export function decimalToUnpackedBCD(decimal) {
    if (!/^\d+$/.test(decimal)) return '';
    return decimal
        .replace(/\D/g, '')
        .split('')
        .map(d => '0000' + parseInt(d, 10).toString(2).padStart(4, '0'))
        .join(' ');
}

// Unpacked BCD to Decimal
export function unpackedBCDToDecimal(bcd) {
    if (!/^([01]{8}\s*)+$/.test(bcd.replace(/\s+/g, ''))) return '';
    const bits = bcd.replace(/\s+/g, '');
    // Reject if a byte is invalid (i.e. outside of binary 0-9 per byte)
    const bytes = groupRight(bits, 8);
    for (const byte of bytes) {
        if (!/^[01]{8}$/.test(byte)) return '';
        if (byte.slice(0, 4) !== '0000') return '';
        const val = parseInt(byte.slice(4), 2);
        if (val > 9) return '';
    }
    return bytes.map(b => parseInt(b.slice(4), 2).toString()).join('').replace(/^0+/, '');
}

// Decimal to Packed BCD: Each byte holds two digits (dddddddd)
export function decimalToPackedBCD(decimal) {
    if (!/^\d+$/.test(decimal)) return '';
    let digits = decimal.replace(/\D/g, '').split('');
    if (digits.length === 0) digits = ['0'];
    let bits = '';
    for (let i = 0; i < digits.length; i += 2) {
        if (i + 1 < digits.length) {
            // Two digits: pack both
            let byte = (parseInt(digits[i], 10) << 4) | parseInt(digits[i + 1], 10);
            bits += byte.toString(2).padStart(8, '0');
        } else {
            // One digit left: pack single digit in lower nibble, upper nibble is zero
            let byte = parseInt(digits[i], 10);
            bits += byte.toString(2).padStart(4, '0');
        }
    }
    // Group into 4s for readability
    return bits.match(/.{1,4}/g).join(' ');
}

// Packed BCD to Decimal
export function packedBCDToDecimal(bcd) {
    if (!/^([01]{4}\s*)+$/.test(bcd.replace(/\s+/g, ''))) return '';
    const bits = bcd.replace(/\s+/g, '');
    // Reject if a byte is invalid (i.e. outside of binary 0-9 per byte)
    const bytes = groupRight(bits, 4);
    for (const byte of bytes) {
        if (!/^[01]{4}$/.test(byte)) return '';
        const val = parseInt(byte, 2);
        if (val > 9) return '';
    }
    return bytes.map(b => parseInt(b, 2).toString()).join('').replace(/^0+/, '');
}

// Decimal to Densely Packed BCD
export function decimalToDenselyPackedBCD(decimal) {
    if (!/^\d+$/.test(decimal)) return '';
    let digits = decimal.replace(/\D/g, '').padStart(Math.ceil(decimal.length / 3) * 3, '0').split('');
    let result = [];
    for (let i = 0; i < digits.length; i += 3) {
        let d1 = parseInt(digits[i], 10);
        let d2 = parseInt(digits[i + 1], 10);
        let d3 = parseInt(digits[i + 2], 10);
        let bcd = denselyPack3Digits(d1, d2, d3);
        // Format as 000 000 0000
        bcd = `${bcd.slice(0, 3)} ${bcd.slice(3, 6)} ${bcd.slice(6, 10)}`;
        result.push(bcd);
    }
    return result.join(' ');
}

// Densely Pack 3 digits into 10 bits
function denselyPack3Digits(d1, d2, d3) {
    // d1, d2, d3: integers 0-9
    // Convert to 4-bit binary
    let b1 = d1.toString(2).padStart(4, '0');
    let b2 = d2.toString(2).padStart(4, '0');
    let b3 = d3.toString(2).padStart(4, '0');
    // a b c d (b1), e f g h (b2), i j k m (b3)
    let a = b1[0], b = b1[1], c = b1[2], d = b1[3];
    let e = b2[0], f = b2[1], g = b2[2], h = b2[3];
    let i = b3[0], j = b3[1], k = b3[2], m = b3[3];

    let out = [];
    if (a === '0' && e === '0' && i === '0') {
        // 000
        out = [b, c, d, f, g, h, 0, j, k, m];
    } else if (a === '0' && e === '0' && i === '1') {
        // 001
        out = [b, c, d, f, g, h, 1, 0, 0, m];
    } else if (a === '0' && e === '1' && i === '0') {
        // 010
        out = [b, c, d, j, k, h, 1, 0, 1, m]
    } else if (a === '0' && e === '1' && i === '1') {
        // 011
        out = [b, c, d, 1, 0, h, 1, 1, 1, m]
    } else if (a === '1' && e === '0' && i === '0') {
        // 100
        out = [j, k, d, f, g, h, 1, 1, 0, m];
    } else if (a === '1' && e === '0' && i === '1') {
        // 101
        out = [f, g, d, 0, 1, h, 1, 1, 1, m];
    } else if (a === '1' && e === '1' && i === '0') {
        // 110
        out = [j, k, d, 0, 0, h, 1, 1, 1, m];
    } else if (a === '1' && e === '1' && i === '1') {
        // 111
        out = [0, 0, d, 1, 1, h, 1, 1, 1, m];
    }
    // Only 10 bits are used: drop the last two
    return out.join('');
}

// Densely Packed BCD to Decimal
export function denselyPackedBCDToDecimal(bcd) {
    if (!/^([01]{10}\s*)+$/.test(bcd.replace(/\s+/g, ''))) return '';
    let bitsArr = bcd.replace(/\s+/g, '').match(/.{10}/g) || [];
    let result = [];
    for (let bits of bitsArr) {
        let digits = denselyUnpack10BitsTo3Digits(bits);
        result.push(digits);
    }
    return result.join('').replace(/^0+/, '');
}

// Helper: Unpack 10 DPD bits into 3 decimal digits
function denselyUnpack10BitsTo3Digits(bits) {
    // bits: string of 10 bits
    // Returns: string of 3 decimal digits
    let b = bits.split('').map(Number);
    // Map bits to variables for clarity
    // [0] [1] [2] [3] [4] [5] [6] [7] [8] [9]
    //  p   q   r   s   t   u   v   w   x   y
    let p = b[0], q = b[1], r = b[2], s = b[3], t = b[4], u = b[5], v = b[6], w = b[7], x = b[8], y = b[9];
    let out = [];

    if (v === 0) {
        // v = 0 means aei = 000 
        out = [0, p, q, r, 0, s, t, u, 0, w, x, y];
    }
    else if (v === 1 && w === 0 && x === 0) {
        // vwx = 100 means aei = 001
        out = [0, p, q, r, 0, s, t, u, 1, 0, 0, y];
    } 
    else if (v === 1 && w === 0 && x === 1) {
        // vwx = 101 means aei = 010
        out = [0, p, q, r, 1, 0, 0, u, 0, s, t, y];
    } 
    else if (v === 1 && w === 1 && x === 0) {
        // vwx = 110 means aei = 100
        out = [1, 0, 0, r, 0, s, t, u, 0, p, q, y];
    } 
    else if (v === 1 && w === 1 && x === 1) {
        // vwx = 111 means aei = 011, 101, 110, or 111
        if (s === 1 && t === 0) {
            // st = 10 means aei = 011
            out = [0, p, q, r, 1, 0, 0, u, 1, 0, 0, y];
        } else if (s === 0 && t === 1) {
            // st = 01 means aei = 101
            out = [1, 0, 0, r, 0, p, q, u, 1, 0, 0, y];
        } else if (s === 0 && t === 0) {
            // st = 00 means aei = 110
            out = [1, 0, 0, r, 1, 0, 0, u, 0, p, q, y];
        } else if (s === 1 && t === 1 && p === 0 && q === 0) {
            // st = 11 means aei = 111
            out = [1, 0, 0, r, 1, 0, 0, u, 1, 0, 0, y];
        }
        else {
            return '';
        }
    }
    else {
        return '';
    }

    let d1 = parseInt(out.slice(0, 4).join(''), 2);
    let d2 = parseInt(out.slice(4, 8).join(''), 2);
    let d3 = parseInt(out.slice(8, 12).join(''), 2);
    
    return '' + d1 + d2 + d3;
}