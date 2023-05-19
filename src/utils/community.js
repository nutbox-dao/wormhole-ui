import store from '@/store'
import { checkAccessToken, logout } from '@/utils/account'
import { joinCommunity as jc } from '@/api/api'
import { VP_CONSUME, RC_CONSUME, errCode } from '@/config';

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