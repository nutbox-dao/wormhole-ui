import { get, post, put, getTwitterApi } from "./axios"
import { BACKEND_API_URL } from '../config'
import curation from "@/store/curation"
import { sleep } from "@/utils/helper"

export const postErr = async (module, title, error) =>
    post(BACKEND_API_URL + '/sys/err', {module, title, error})
    
/****************************************  user  ***********************************************/
export const getUserInfo = async (username, ethAddress) =>
    get(BACKEND_API_URL + '/users/byusername', {username, ethAddress})

export const readNft = async (twitterId) =>
    post(BACKEND_API_URL + '/users/readNft', {twitterId})

export const getNftReceivedState = async (twitterId) =>
    get(BACKEND_API_URL + '/users/nftReceiveState', {twitterId})

export const getUsersTransaction = async (twitterId, pageSize, time, newTrans) =>
    get(BACKEND_API_URL + '/transaction/byTwitterId', { twitterId, pageSize, time, newTrans })

export const getUsersTips = async (twitterId, pageSize, time, newTips) =>
    get(BACKEND_API_URL + '/transaction/tipsByTwitterId', { twitterId, pageSize, time, newTips })

export const cacheKey = async (params) =>
    post(BACKEND_API_URL + '/register/cachePwd', params)

export const getTwitterAccount = async (username) =>
getTwitterApi('/twitter/2/users/by/username/' + username + '?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld')

/****************************************  posts  ***********************************************/
export const getUsersPosts = async (twitterId, pageSize, time, newPost) =>
    get(BACKEND_API_URL + '/twitter/getUsersPostsByTime', {twitterId, pageSize, time, newPost})

export const getPostById = async (postId) =>
    get(BACKEND_API_URL + '/twitter/getPostById', {postId})

export const getPostsByTagTime = async (tag, pageSize, time, newPost) =>{
    if (newPost) {
        return get(BACKEND_API_URL + '/twitter/refreshByTagTime', {tag,pageSize, time})
    }else {
        return get(BACKEND_API_URL + '/twitter/moreByTagTime', {tag, pageSize, time})
    }
}

export const getCommentsByPostid = async (postId) =>
    get(BACKEND_API_URL + '/twitter/getCommentsByPostid', {postId})

export const getPostsByTagValue = async (tag, pageSize, pageNum) =>
    get(BACKEND_API_URL + '/twitter/getPostByValue', {tag, pageSize, pageNum})

export const getPostByTrend = async (tag, pageSize, pageNum) =>
    get(BACKEND_API_URL + '/twitter/getPostByTrend', {tag, pageSize, pageNum})

export const getTagAggregation = async () =>
    get(BACKEND_API_URL + '/twitter/tags')

export const getUserFavTag = async (twitterId) => 
    get(BACKEND_API_URL + '/twitter/getUserFavTag', {twitterId})

/****************************************  curation  ***********************************************/
/**
 * 
 * @param {*} curation: 
 * {
 *  curationId, creatorTwitter, creatorETH, content, token, amount, maxCount, endtime
 * } 
 * @returns 
 */
export const newCuration = async (curation) =>
    post(BACKEND_API_URL + '/curation/newCuration', curation)

export const getRefreshCurations = async (curationStatus) =>
    get(BACKEND_API_URL + '/curation/getRefreshCurations', {curationStatus})

export const getMoreCurations = async (curationStatus, createdTime) =>
    get(BACKEND_API_URL + '/curation/getMoreCurations', {curationStatus, createdTime})

export const getCurationById = async (curationId, twitterId) =>
    get(BACKEND_API_URL + '/curation/getCurationById', {curationId, twitterId})

export const getCurationParticipant = async (curationId, createAt) =>
    get(BACKEND_API_URL + '/curation/getCurationParticipant', {curationId, createAt})

/**
 * fetch wheather user joined the cration
 * @param {*} curationId 
 * @param {*} twitterId 
 * @returns the reward of user
 */
export const getWheatherUserJoinedCuration = async (curationId, twitterId) =>
    get(BACKEND_API_URL + '/curation/getWheatherUserJoinedCuration', {curationId, twitterId})

export const getMyJoinedCurations = async (twitterId, createdTime) =>
    get(BACKEND_API_URL + '/curation/getMyJoinedCurations', {twitterId, createdTime})

export const getMyCreatedCurations = async (twitterId, createdTime) => 
    get(BACKEND_API_URL + '/curation/getMyCreatedCurations', {twitterId, createdTime})

export const getRefreshCurationRecord = async (taskId, lastId, isFeed=false) => 
    get(BACKEND_API_URL + '/curation/getRefreshCurationRecord', {taskId, lastId, isFeed})

/****************************************  map  ***********************************************/
export const bMapToGMapLocations = async (locations) => {
    return get('https://restapi.amap.com/v3/assistant/coordinate/convert', {
        key: 'c69f301c227fe2c5c9c1442ce51f905a',
        locations: locations,
        coordsys: 'baidu'
    })
}

/****************************************  faucet  ***********************************************/
export const getFaucet = async (address) =>
    get(BACKEND_API_URL + '/faucet/usdt', {address})

export const applyAirdrop = async (twitterId) =>
    post(BACKEND_API_URL + '/faucet/apply', {twitterId})

export const getDropRecord = async (twitterId) => 
    get(BACKEND_API_URL + '/faucet/record', {twitterId})