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

export const formatAmount = function (value) {
  if (!value) return "0.00";
  let unit = ''
  let digit = 3
  if(Number(value) < 1) {
    digit = 4
  }
  if (Number(value) > 1000) {
    digit = 2
  }
  value = Number(value)
  if (value < 1e6) {
  }else if (value < 1e9){
    value = value / 1e6
    unit = 'M'
  }else if(value < 1e12) {
    value = value / 1e9
    unit = 'B'
  }
  const str = Number(value).toFixed(digit).toString();
  let integer = str;
  let fraction = "";
  if (str.includes(".")) {
    integer = str.split(".")[0];
    fraction = "." + str.split(".")[1];
  }
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + fraction + unit;
}

/**
 * 
 * @param {*} value 
 * @param {*} abb is abbreviations 
 * @returns 
 */
 export const formatPrice = function (value, abb=false) {
  if (!value) return "$0.00";
  let unit = ''
  if(Number(value) > 1e6) {
    abb = true
  }
  let digit = 3
  if(Number(value) < 1) {
    digit = 4
  }
  if (abb) {
    value = Number(value)
    if (value < 1000) {}
    else if (value < 1e6) {
      value = value / 1000
      unit ='K'
    }else if (value < 1e9){
      value = value / 1e6
      unit = 'M'
    }else if(value < 1e12) {
      value = value / 1e9
      unit = 'B'
    }
  }
  const str = Number(value).toFixed(digit).toString();
  let integer = str;
  let fraction = "";
  if (str.includes(".")) {
    integer = str.split(".")[0];
    fraction = "." + str.split(".")[1];
  }
  return "$" + integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + fraction + unit;
};