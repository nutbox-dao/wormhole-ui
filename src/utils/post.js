import store from '@/store'
import { checkAccessToken, logout } from '@/utils/account'
import { likePost as lp, unLikePost as ulp, retweetPost as rtp, quotePost as qp, replyPost as rep, userFollow as fp } from '@/api/api'
import { VP_CONSUME, RC_CONSUME, errCode } from '@/config';

function checkVP(consume) {
    const vpInfo = store.state.vpInfo;
    const vp = store.state.vp;
    if (vp >= consume && vpInfo.lastUpdateTime > 0) {
        return true;
    }
    return false;
}

function checkRC(consume) {
    const rcInfo = store.state.rcInfo;
    const rc = store.state.rc;
    if (rc >= consume && rcInfo.lastUpdateRCTime > 0) {
        return true;
    }
    return false;
}

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

function udpateUserRCLocal(consume) {
    const rcInfo = store.state.rcInfo;
    const rc = store.state.rc;
    if (rc >= consume && rcInfo.lastUpdateRCTime > 0) {
        store.commit('saveRcInfo', {
            ...rcInfo,
            rc: rcInfo.rc - consume
        })
        return true;
    }
    return false;
}

export const likePost = async (tweetId, authorId, up=true) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
        const rcResult = checkRC(RC_CONSUME.LIKE)
        if (!rcResult) {
            throw errCode.INSUFFICIENT_RC;
        }
        if (!checkVP(VP_CONSUME.LIKE)) {
            throw errCode.INSUFFICIENT_VP;
        }
        let r;
        if (up) {
            r = await lp(twitterId, tweetId)
        }else {
            r = await ulp(twitterId, tweetId)
        }
        if (authorId !== twitterId) {
            updateUserVpLocal(VP_CONSUME.LIKE)
            udpateUserRCLocal(RC_CONSUME.LIKE)
        }
        console.log('user like tweet result:', r, up);
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
        const rcResult = udpateUserRCLocal(RC_CONSUME.FOLLOW)
        if (!rcResult) {
            throw errCode.INSUFFICIENT_RC;
        }
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
        const rcResult = checkRC(RC_CONSUME.RETWEET)
        if (!rcResult) {
            throw errCode.INSUFFICIENT_RC;
        }
        if (!checkVP(VP_CONSUME.RETWEET)) {
            throw errCode.INSUFFICIENT_VP;
        }
        const r = await rtp(twitterId, tweetId)
        if (twitterId !== authorId) {
            updateUserVpLocal(VP_CONSUME.RETWEET)
            udpateUserRCLocal(RC_CONSUME.RETWEET)
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
        const rcResult = udpateUserRCLocal(RC_CONSUME.COMMENT)
        if (!rcResult) {
            throw errCode.INSUFFICIENT_RC;
        }
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
        const rcResult = checkRC(RC_CONSUME.QUOTE)
        if (!rcResult) {
            throw errCode.INSUFFICIENT_RC;
        }
        if(!checkVP(VP_CONSUME.QUOTE)) {
            throw errCode.INSUFFICIENT_VP;
        }
        const r = await qp(twitterId, tweetId, content)
        if (authorId !== twitterId) {
            updateUserVpLocal(VP_CONSUME.QUOTE)
            udpateUserRCLocal(RC_CONSUME.QUOTE)
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