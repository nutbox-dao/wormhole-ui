import { get, post, put, getTwitterApi } from "./axios"
import { BACKEND_API_URL } from '../config'

// for test
export const registerAccount = async (acc) => 
    post(BACKEND_API_URL + '/register/register-test-account', acc)

export const getUserBindInfo = async (acc) => 
    get(BACKEND_API_URL + '/users/bytwittername', {twitterName: acc})

export const getTest = async () => 
    getTwitterApi('/api')

export const getTwitterAccount = async (username) =>
    getTwitterApi('/twitter/2/users/by/username/' + username + '?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld')