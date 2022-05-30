import { Base64 } from 'js-base64'

const b64uLookup = {
    "/": "_",
    "_": "/",
    "+": "-",
    "-": "+",
    "=": ".",
    ".": "=",
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