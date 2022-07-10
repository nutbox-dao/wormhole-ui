import axios from "axios"
import steem from "steem"
const { auth } = require("steem");
const { key_utils, hash } = require("steem/lib/auth/ecc");

steem.api.setOptions({ url: 'https://api.steemit.com' })

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

export async function getGlobalProperties() {
    return new Promise(async (resolve, reject) => {
        axios.post('https://api.steemit.com', '{"jsonrpc":"2.0", "method":"database_api.get_dynamic_global_properties", "id":1}').then(res => {
            if (res.data.result)
                resolve(res.data.result)
            else
                reject();
        }).catch(err => {
            console.log('Get steem global data fail:', err)
            reject(err)
        })
    })
}

export async function vestsToSteem(vests) {
    const props = await getGlobalProperties()
    const totalSteem = Number(props.total_vesting_fund_steem.amount) / (10 ** props.total_vesting_fund_steem.precision)
    const totalVests = Number(props.total_vesting_shares.amount) / (10 ** props.total_vesting_shares.precision)
    return ((parseFloat(vests) * totalSteem) / totalVests)
}

export const getAccountRC = async (account) => {
    return new Promise((resolve, reject) => {
        axios.post('https://api.steemit.com', '{"jsonrpc":"2.0", "method":"rc_api.find_rc_accounts", "params":{"accounts":["' + account + '"]}, "id":1}').then(res => {
            if (res.data.result) {
                const rc = res.data.result.rc_accounts[0]
                var elapsed = Date.now() / 1000 - rc.rc_manabar.last_update_time;
                var maxMana = rc.max_rc;
                // 432000 sec = 5 days
                var currentMana = parseFloat(rc.rc_manabar.current_mana) + elapsed * maxMana / 432000;
                if (currentMana > maxMana) {
                    currentMana = maxMana
                }
                resolve([currentMana, maxMana])
            } else
                reject()
        }).catch(err => {
            console.log('Get steem account data fail:', err)
            reject(err)
        })

    })
}

/**
 * Get voting powering status
 * @param {*} account 
 * @returns 
 */
export function getVPHF20(account) {
    var totalShares = parseFloat(account.vesting_shares) + parseFloat(account.received_vesting_shares) - parseFloat(account.delegated_vesting_shares) - parseFloat(account.vesting_withdraw_rate);

    var elapsed = Date.now() / 1000 - account.voting_manabar.last_update_time;
    var maxMana = totalShares * 1000000;
    // 432000 sec = 5 days
    var currentMana = parseFloat(account.voting_manabar.current_mana) + elapsed * maxMana / 432000;

    if (currentMana > maxMana) {
        currentMana = maxMana;
    }

    return [currentMana, maxMana]

    var currentManaPerc = currentMana * 100 / maxMana;

    return Math.round(currentManaPerc * 100);
}

export const getPost = async (author, permlink) => {
    return new Promise(async (resolve, reject) => {
        const res = await steem.api.getContentAsync(author, permlink);
        if (res && res.author !== "" && res.permlink !== "") {
            resolve(res);
        } else {
            resolve(0)
        }
    })
}

export const getPosts = async (posts) => {
    return new Promise(async (resolve, reject) => {
        const steemPosts = await Promise.all(posts.map(post => getPost(post.steemId, post.postId)))
        posts = posts.map((p, idx) => {
            const steemP = steemPosts[idx]
            if (steemP === 0) return p
            return {
                ...p,
                children: steemP.children,
                curatorPayoutValue: steemP.curator_payout_value,
                pendingPayoutValue: steemP.pending_payout_value,
                totalPayoutValue: steemP.total_payout_value,
                votes: steemP.active_votes.length
            }
        })
        resolve(posts)
    })
}

export const getComments = async (author, permlink) => {
    return new Promise(async (resolve, reject) => {
        const res = await steem.api.getContentRepliesAsync(author, permlink);
        if (res && res.author !== "" && res.permlink !== "") {
            resolve(res);
        } else {
            reject(0)
        }
    })
}

export const getSteemBalance = async (username) => {
    const accountInfo = await getAccountInfo(username)

    return parseFloat(accountInfo ? accountInfo.balance : 0)
}