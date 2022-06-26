import axios from "axios"
import steem from "steem"
const { auth } = require("steem");
const { key_utils, hash } = require("steem/lib/auth/ecc");

export const getAccountInfo = async (account) => {
    return new Promise((resolve, reject) => {
        axios.post('https://api.steemit.com', '{"jsonrpc":"2.0", "method":"condenser_api.get_accounts", "params":[["' + account + '"]], "id":1}').then(res => {
            if (res.data.result)
                resolve(res.data.result[0])
            else
                resolve()
        }).catch(err => {
            console.log('Get steem account data fail:', err)
            resolve()
        })
    })
}

export const getSteemBalance = async (username) => {
    const accountInfo = await getAccountInfo(username)
    
    return parseFloat(accountInfo ? accountInfo.balance : 0)
}