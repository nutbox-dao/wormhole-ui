import store from '@/store'
import { checkAccessToken, logout } from '@/utils/account'
import { likePost as lp, retweetPost as rtp, quotePost as qp, replyPost as rep } from '@/api/api'

export const likePost = async (tweetId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
        const r = await lp(twitterId, tweetId)
        console.log('user like tweet result:', r);
        if(r) {
            return r
        }
    }catch(e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
    }
}

export const retweetPost = async (tweetId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
        const r = await rtp(twitterId, tweetId)
        console.log('user retweet result:', r);
        if(r) {
            return r
        }
    }catch(e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
    }
}

export const replyPost = async (tweetId, content, parentTwitterId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
        const r = await rep(twitterId, tweetId, content, parentTwitterId)
        console.log('user reply tweet result:', r);
        if(r) {
            return r
        }
    }catch(e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
    }
}

export const quotePost = async (tweetId, content) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
        const r = await qp(twitterId, tweetId, content)
        console.log('user reply tweet result:', r);
        if(r) {
            return r
        }
    }catch(e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
    }
}