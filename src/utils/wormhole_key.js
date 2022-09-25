const steem = require("steem")
const { auth } = require("steem");
const { sha256 } = require('js-sha256')
const base58 = require('bs58')

// use eth private key to generate a steem brain key
const generateBrainKey = (key) => {
    key = '0x80' + key;
    var checksum = sha256(key)
    checksum = sha256(checksum)
    checksum = checksum.slice(0, 4)
    const private_wif = key + checksum;
    return 'P' + base58.encode(hexTou8array(private_wif))
}

const hexTou8array = (hex) => {
    return Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
}

const generateAuth = (user, pass, type) => {
    const key = auth.getPrivateKeys(user, pass, [type]);
  
    const publicKey = auth.wifToPublic(Object.values(key)[0]);
    if (type == "memo") {
      return {
        key: key,
        auth: publicKey
      };
    } else {
      return {
        key: key,
        auth: publicKey
      };
    }
  };

  const generateKeys = (username, pass) => {
    const owner = generateAuth(username, pass, "owner");
    const active = generateAuth(username, pass, "active");
    const posting = generateAuth(username, pass, "posting");
    const memo = generateAuth(username, pass, "memo");

    return {
        key: {
            owner: owner.key,
            active: active.key,
            posting: posting.key,
            memo: memo.key
        },
        auth: {
            owner: owner.auth,
            active: active.auth,
            posting: posting.auth,
            memo: memo.auth
        }
    };
};

const fetchSteemAuth = async (ethPK) => {
    const pass = generateBrainKey(ethPK)
    const account = generateKeys('wormhole', pass);
    return account.key;
}

let privateKey = ''
fetchSteemAuth(privateKey).then(res => {
    console.log(res);
})