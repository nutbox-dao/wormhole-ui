import store from '@/store'
import { refreshToken, logout } from '@/utils/account'
import { getTweetsById as gtbi, getTweetById as getbi, userFollowing as uf,
     userLike as ul, getSapceBySpaceId, getUserInfoFromTwitter as guibu,
    userTweet as ut } from '@/api/api'

async function checkAccessToken() {
    let acc = store.getters.getAccountInfo;
    if (acc && acc.accessToken) {
        const { expiresAt } = acc;
        if (expiresAt - new Date().getTime() < 600000) {
            // refresh token 
            try {
                await refreshToken();
                acc = store.getters.getAccountInfo;
            }catch(e) {
                console.log(234, e);
                throw 'log out';
            }
        }
        return acc.accessToken
    }else {
        // need auth again
        await logout();
        throw 'log out';
    }
}

export const getTweetsById = async (tweetIds) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId
    const tweets = await gtbi(twitterId, tweetIds)
    return tweets;
}

export const getTweetById = async (tweetId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    const tweet = await getbi(twitterId, tweetId);
    return tweet;
}

export const getSpaceById = async (spaceId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    const space = await getSapceBySpaceId(twitterId, spaceId);
    return space;
}

export const getUserInfoByUserId = async (userid) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    const user = await guibu(twitterId, userid);
    return user;
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

export const userTweet = async (text) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    const r = await ut(twitterId, text)
    if(r) {
        return r.id
    }
}