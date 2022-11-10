import { Client } from 'twitter-api-sdk'
import store from '@/store'
import { refreshToken } from '@/utils/account'

async function checkAccessToken() {
    let acc = store.getters.getAccountInfo;
    const {accessToken, expiresAt} = acc;
    if (expiresAt - new Date().getTime() < 600000) {
        // refresh token 
        await refreshToken();
        console.log('expires');
        acc = store.getters.getAccountInfo;
    }
    return acc.accessToken
}

export const getTweetById = async (tweetId) => {
    const accessToken = await checkAccessToken();
    const client = new Client()
}