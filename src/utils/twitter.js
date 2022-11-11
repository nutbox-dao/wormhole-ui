import { Client } from 'twitter-api-sdk'
import store from '@/store'
import { refreshToken } from '@/utils/account'
import { getTweetsById as gtbi, userFollowing as uf, userLike as ul } from '@/api/api'

async function checkAccessToken() {
    let acc = store.getters.getAccountInfo;
    if (acc && acc.accessToken) {
        const { expiresAt } = acc;
        if (expiresAt - new Date().getTime() < 600000) {
            // refresh token 
            try {
                console.log(1);
                await refreshToken();
                console.log(2);
                acc = store.getters.getAccountInfo;
            }catch(e) {
                console.log(234, e);
                throw 'log out';
            }
        }
        return acc.accessToken
    }else {
        // need auth again
        throw 'log out';
    }
}

export const getTweetsById = async (tweetIds) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId
    const tweets = await gtbi(twitterId, tweetIds)
    console.log(11, tweets);
    return tweets;
}

/**
 * check if user followed the author
 * @param {*} authorId 
 */
export const userFollowing = async (authorId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId
    const f = await uf(twitterId, authorId)
    console.log(222, f);
    return f;
}

export const userLike = async (tweetId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    const r = await ul(twitterId, tweetId);
    console.log('like result', r);
    if (r && r.liked) {
        return true
    }
    return false
}

export const userLiking = async (tweetId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    
}