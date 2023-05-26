import store from '@/store'
import { checkAccessToken, logout } from '@/utils/account'
import { joinCommunity as jc, getCommunityPendingRewards as gcpr, getCommunityAuthorPendingRewards as gcapr,
    getCommunityClaimRewardsParas as gccrp, getCommunityClaimAuthorRewardsParas as gccarp, setCommunityRewardClaimed as scrc,
    setCommunityAuthorRewardClaimed as scarc, getCommunityHistoryRewards as gchr, getCommunityAuthorHistoryRewards as gcahr,
    getJoinCommunityState as gjcs } from '@/api/api'
import { errCode } from '@/config';

export const getCommunityClaimRewardsParas = async (communityId, twitterId, ids) => {
    await checkAccessToken();
    try {
        const params = await gccrp(communityId, twitterId, ids)
        return params;
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const getCommunityClaimAuthorRewardsParas = async (communityId, twitterId, ids) => {
    await checkAccessToken();
    try {
        const params = await gccarp(communityId, twitterId, ids)
        return params;
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const setCommunityRewardClaimed = async (twitterId, ids) => {
    await checkAccessToken();
    try {
        const params = await scrc(twitterId, ids)
        return params;
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const setCommunityAuthorRewardClaimed = async (twitterId, ids) => {
    await checkAccessToken();
    try {
        const params = await scarc(twitterId, ids)
        return params;
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const getJoinCommunityState = async (twitterId) => {
    await checkAccessToken();
    try {
        return await gjcs(twitterId);
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const joinCommunity = async (communityId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
       await jc(twitterId, communityId)
       const showingCommunity = store.state.community.showingCommunity;
       showingCommunity.joined = 1;
       const communities = store.state.community.communities;
       if (communities && communities.length > 0) {
            const community = communities.find(c => c.communityId === communityId)
            if (community) {
                community.joined = 1
            }
       }
    }catch(e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const getCommunityPolicyStake = async (communityId, policy) => {
    
}