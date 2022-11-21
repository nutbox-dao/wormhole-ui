import { get, post, put, getTwitterApi } from "./axios"
import { BACKEND_API_URL } from '../config'
import curation from "@/store/curation"
import { sleep } from "@/utils/helper"

export const postErr = async (module, title, error) =>
    post(BACKEND_API_URL + '/sys/err', {module, title, error})

/****************************************  auth  ***********************************************/
export const twitterAuth = async() => 
    get(BACKEND_API_URL + '/auth/login')

export const twitterLogin = async(code) =>
    get(BACKEND_API_URL + '/users/login', {code})

export const twitterRefreshAccessToken = async (twitterId) => 
    post(BACKEND_API_URL + '/auth/refresh', {twitterId})

export const logout = async (twitterId) => 
    get(BACKEND_API_URL + '/auth/logout', {twitterId})

export const register = async (params) => 
    post(BACKEND_API_URL + '/register', params)

export const check = async (params) =>
    post(BACKEND_API_URL + '/register/check', params)
    
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

export const getProfile = async (twitterId) =>
    post(BACKEND_API_URL + '/users/profile', {twitterId})

export const getUserByEth = async (ethAddress) =>
    get(BACKEND_API_URL + '/users/getUserByEth', {ethAddress})

export const getUserByIds = async (twitterIds) => 
    get(BACKEND_API_URL + '/users/byTwitterIds', {twitterIds})

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

export const newCuration = async (curation) =>
    post(BACKEND_API_URL + '/curation/newCuration', curation)

export const newCurationWithTweet = async (curation) => 
    post(BACKEND_API_URL + '/curation/newCurationWithTweet', curation)

export const likeCuration = async (twitterId, tweetId, curationId) =>
    post(BACKEND_API_URL + '/curation/likeCuration', {twitterId, tweetId, curationId})

export const followCuration = async (twitterId, authorId, curationId) =>
    post(BACKEND_API_URL + '/curation/followCuration', {twitterId, authorId, curationId})

export const getCurations = async (status, createTime, twitterId) =>
    get(BACKEND_API_URL + '/curation/getCurations', {status, createTime, twitterId})

export const getCurationById = async (curationId, twitterId) =>
    get(BACKEND_API_URL + '/curation/getCurationById', {curationId, twitterId})

export const getCurationParticipant = async (curationId, createAt) =>
    get(BACKEND_API_URL + '/curation/getCurationParticipant', {curationId, createAt})

export const getMyJoinedCurations = async (twitterId, createdTime) =>
    post(BACKEND_API_URL + '/curation/getMyJoinedCurations', {twitterId, createdTime})

export const getMyCreatedCurations = async (twitterId, createdTime) => 
    get(BACKEND_API_URL + '/curation/getMyCreatedCurations', {twitterId, createdTime})

export const getCurationsOfTweet = async (tweetId) =>
    get(BACKEND_API_URL + '/curation/getCurationsOfTweet', {tweetId})

export const getCurationRecord = async (curationId, createAt, isFeed) =>
    get(BACKEND_API_URL + '/curation/getCurationRecord', { curationId, createAt, isFeed })

/****************************************  tip  ***********************************************/
export const tipEVM = async (tip) =>
    post(BACKEND_API_URL + '/tip/tip', {tip})

export const getAllTipsOfCuration = async (curationId) => 
    get(BACKEND_API_URL + '/tip/tipsByCurationId', {curationId})

export const getTopTipsOfCuration = async (curationId) => 
    get(BACKEND_API_URL + '/tip/topTipsByCurationId', {curationId})

/****************************************  map  ***********************************************/
export const bMapToGMapLocations = async (locations) => {
    return get('https://restapi.amap.com/v3/assistant/coordinate/convert', {
        key: 'c69f301c227fe2c5c9c1442ce51f905a',
        locations: locations,
        coordsys: 'baidu'
    })
}

/****************************************  twitter api  ***********************************************/
export const getTweetsById = async (twitterId, tweetIds) => 
    post(BACKEND_API_URL + '/twitter-api/getTweetsById', {twitterId, tweetIds})

export const getTweetById = async (twitterId, tweetId) =>
    post(BACKEND_API_URL + '/twitter-api/getTweetById', {twitterId, tweetId})

export const getSapceBySpaceId = async (twitterId, spaceId) =>
    post(BACKEND_API_URL + '/twitter-api/getSpaceInfo', {twitterId, spaceId})

export const userFollowing = async (twitterId, authorId) => 
    post(BACKEND_API_URL + '/twitter-api/userFollowing', {twitterId, authorId})
    
export const userLike = async (twitterId, tweetId) => 
    post(BACKEND_API_URL + '/twitter-api/userLike', {twitterId, tweetId})

export const userTweet = async (twitterId, text) =>
    post(BACKEND_API_URL + '/twitter-api/tweet', {twitterId, text})

// userId can be twitter_id or username
export const getUserInfoFromTwitter = async (twitterId, userId) => 
    post(BACKEND_API_URL + '/twitter-api/getUserInfo', {twitterId, userId})

/****************************************  faucet  ***********************************************/
export const getFaucet = async (address) =>
    get(BACKEND_API_URL + '/faucet/usdt', {address})

export const applyAirdrop = async (twitterId) =>
    post(BACKEND_API_URL + '/faucet/apply', {twitterId})

export const getDropRecord = async (twitterId) => 
    get(BACKEND_API_URL + '/faucet/record', {twitterId})