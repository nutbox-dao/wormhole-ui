import store from '@/store'
import { checkAccessToken } from '@/utils/account'
import { likePost as lp, retweetPost as rtp, quotePost as qp, replyPost as rep } from '@/api/api'
import { logout } from '@/utils/account'
import { errCode } from '@/config'

export const likePost = async (tweetId) => {
    await checkAccessToken();
    try {
        const twitterId = store.getters.getAccountInfo.twitterId;
        const r = await lp(twitterId, tweetId)
        console.log('user like tweet result:', r);
        if(r) {
            return r.id
        }
    }catch(e) {
        if (e === 401) {
            throw 'log out'
        }
    }
}

export const retweetPost = async (tweetId) => {
    await checkAccessToken();
    try {
        const twitterId = store.getters.getAccountInfo.twitterId;
        const r = await rtp(twitterId, tweetId)
        console.log('user like tweet result:', r);
        if(r) {
            return r.id
        }
    }catch(e) {
        if (e === 401) {
            throw 'log out'
        }
    }
}