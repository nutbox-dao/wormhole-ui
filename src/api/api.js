import { get, post, put, getTwitterApi } from "./axios"
import { BACKEND_API_URL } from '../config'

export const getUserInfo = async (username, ethAddress) => 
    get(BACKEND_API_URL + '/users/byusername', {username, ethAddress})

export const getRegisterTicket = async (publicKey) => 
    get(BACKEND_API_URL + '/register/getRegisterTicket', {publicKey})

export const getUsersTransaction = async (twitterId, pageSize, time, newTrans) =>
    get(BACKEND_API_URL + '/transaction/byTwitterId', { twitterId, pageSize, time, newTrans })

export const cacheKey = async (params) =>
    post(BACKEND_API_URL + '/register/cachePwd', params)

export const getTwitterAccount = async (username) =>
getTwitterApi('/twitter/2/users/by/username/' + username + '?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld')

export const getTagAggregation = async () =>
    get(BACKEND_API_URL + '/twitter/tags')

/****************************************  posts  ***********************************************/
export const getUsersPosts = async (username, pageSize, time, newPost) => 
get(BACKEND_API_URL + '/twitter/getUsersPostsByTime', {username, pageSize, time, newPost})

export const getPostsByTagTime = async (tag, pageSize, time, newPost) =>{
    if (newPost) {
        return get(BACKEND_API_URL + '/twitter/refreshByTagTime', {tag,pageSize, time})
    }else {
        return get(BACKEND_API_URL + '/twitter/moreByTagTime', {tag, pageSize, time})
    }
}