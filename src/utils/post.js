import store from '@/store'
import { checkAccessToken, logout } from '@/utils/account'
import { likePost as lp, retweetPost as rtp, quotePost as qp, replyPost as rep, userFollow as fp } from '@/api/api'
import { VP_CONSUME } from '@/config';

function updateUserVpLocal(consume) {
    const vpInfo = store.state.vpInfo;
    const vp = store.state.vp;
    if (vp >= consume && vpInfo.lastUpdateTime > 0) {
        store.commit('saveVpInfo', {
            ...vpInfo,
            votingPower: vpInfo.votingPower - consume
        })
    }
}

export const likePost = async (tweetId, authorId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
        const r = await lp(twitterId, tweetId)
        if (authorId !== twitterId) {
            updateUserVpLocal(VP_CONSUME.LIKE)
        }
        console.log('user like tweet result:', r);
        if(r) {
            return r
        }
    }catch(e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const followPost = async (tweetId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
        const r = await fp(twitterId, tweetId)
        if (r) {
            return r
        }
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const retweetPost = async (tweetId, authorId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
        const r = await rtp(twitterId, tweetId)
        if (twitterId !== authorId) {
            updateUserVpLocal(VP_CONSUME.RETWEET)
        }
        console.log('user retweet result:', r);
        if(r) {
            return r
        }
    }catch(e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
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
        throw e
    }
}

export const quotePost = async (tweetId, content, authorId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
        const r = await qp(twitterId, tweetId, content)
        if (authorId !== twitterId) {
            updateUserVpLocal(VP_CONSUME.QUOTE)
        }
        console.log('user reply tweet result:', r);
        if(r) {
            return r
        }
    }catch(e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}