import axios from "axios"
import steem from "steem"
const { auth } = require("steem");
const { key_utils, hash } = require("steem/lib/auth/ecc");

steem.api.setOptions({url: 'https://api.steemit.com'})

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
        console.log(111, posts);
        const steemPosts = await Promise.all(posts.map(post => getPost(post.steemId, post.postId)))
        posts = posts.map((p, idx) => {
            const steemP = steemPosts[idx]
            if (steemP === 0) return p
            return {...p, 
                children: steemP.children,
                curatorPayoutValue: steemP.curator_payout_value,
                pendingPayoutValue: steemP.pending_payout_value,
                totalPayoutValue: steemP.total_payout_value,
                votes: steemP.active_votes.length
            }
        })
        console.log(333, posts);
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