import { Base64 } from 'js-base64'

const b64uLookup = {
    "/": "_",
    "_": "/",
    "+": "-",
    "-": "+",
    "=": ".",
    ".": "=",
    "N": 'p',
    "p": 'N'
};

export const b64uEnc = (str) => {
    return Base64.encode(str).replace(/(\+|\/|=)/g, (m) => b64uLookup[m])
}

export const b64uDec = (str) =>
    Base64.decode(str.replace(/(-|_|\.)/g, (m) => b64uLookup[m]));

export const sleep = async function (interval = 6) {
    return new Promise((resolve) => {
        setTimeout(resolve, interval * 1000); // 6秒
    });
}

export const u8arryToHex = (buffer) => {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
}

export const hexTou8array = (hex) => {
    return Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
}