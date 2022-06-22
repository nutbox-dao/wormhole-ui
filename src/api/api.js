import { get, post, put, getTwitterApi } from "./axios"
import { BACKEND_API_URL } from '../config'

export const getUserInfo = async (username, ethAddress) => 
    get(BACKEND_API_URL + '/users/byusername', {username, ethAddress})

export const getRegisterTicket = async (publicKey) => 
    get(BACKEND_API_URL + '/register/getRegisterTicket', {publicKey})

export const getUsersPosts = async (username, pageSize, time, newPost) => 
    get(BACKEND_API_URL + '/twitter/getUsersPostsByTime', {username, pageSize, time, newPost})

export const getUsersTransaction = async (twitterId, pageSize, time, newTrans) =>
    get(BACKEND_API_URL + '/transaction/byTwitterId', { twitterId, pageSize, time, newTrans })

export const getTwitterAccount = async (username) =>
getTwitterApi('https://api.twitter.com/twitter/2/users/by/username/' + username + '?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld')

