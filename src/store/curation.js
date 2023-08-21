
import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        draft: localStorage.getItem('curation-draft'),
        ongoingList: [],
        trendingList: [],
        ongoingListByTag: {},
        trendingListByTag: {},
        closeList: [],
        detailCuration: {},
        detailRecords: [],
        customTags: [],
        rewardLists: [[],[],[],[],[],[],[]],
        customRewardLists: [[],[],[],[],[],[],[],[]],
        // cache the created curation which not push to backend
        pendingTweetCuration: localStorage.getItem('pending-cache-curation'),
        pendingTip: localStorage.getItem('pending-cache-tip'),
        pendingPopup: localStorage.getItem('pending-cache-popup'),
        customTokens: localStorage.getItem('custom-tokens'),
        selectedTag: 'All',
        communityRewards: [],
        communityAuthorRewards: [],
        spaceRewards: [],
        inviteRewards: {},

    },
    mutations: {
        saveSelectedTag: (state, tag) => {
            state.selectedTag = tag
        },
        saveDraft: (state, draft) => {
            if (draft && Object.keys(draft).length > 0) {
                state.draft = JSON.stringify(draft);
                // const draftStr = JSON.stringify(draft)
                localStorage.setItem('curation-draft', state.draft)
            }else {
                state.draft = null;
                localStorage.removeItem('curation-draft');
            }
        },
        saveOngoingList: (state, ongoingList) => {
            state.ongoingList = ongoingList
        },
        saveTrendingList: (state, trendingList) => {
            state.trendingList = trendingList
        },
        saveOngoingListByTag: (state, ongoingListByTag) => {
            state.ongoingListByTag = ongoingListByTag
        },
        saveTrendingListByTag: (state, trendingListByTag) => {
            state.trendingListByTag = trendingListByTag
        },
        saveCloseList: (state, closeList) => {
            state.closeList = closeList
        },
        saveDetailCuration: (state, detailCuration) => {
            state.detailCuration = detailCuration
        },
        saveDetailRecords: (state, detailRecords) => {
            state.detailRecords = detailRecords
        },
        saveCustomTags: (state, customTags) => {
            state.customTags = customTags
        },
        saveRewardLists: (state, rewardLists) => {
            state.rewardLists = rewardLists
        },
        saveCustomRewardLists: (state, customRewardLists) => {
            state.customRewardLists = customRewardLists;
        },
        savePendingTweetCuration: (state, pendingTweetCuration) => {
            if (pendingTweetCuration && Object.keys(pendingTweetCuration).length > 0) {
                state.pendingTweetCuration = JSON.stringify(pendingTweetCuration)
                localStorage.setItem('pending-cache-curation', state.pendingTweetCuration)
            }else {
                state.pendingTweetCuration = null;
                localStorage.removeItem('pending-cache-curation')
            }
        },
        savePendingTip: (state, pendingTip) => {
            if (pendingTip && Object.keys(pendingTip).length > 0) {
                state.pendingTip = JSON.stringify(pendingTip)
                localStorage.setItem('pending-cache-tip', state.pendingTip)
            }else {
                state.pendingTip = null;
                localStorage.removeItem('pending-cache-tip')
            }
        },
        savePendingPopup: (state, pendingPopup) => {
            if (pendingPopup && Object.keys(pendingPopup).length > 0) {
                state.pendingPopup = JSON.stringify(pendingPopup)
                localStorage.setItem('pending-cache-popup', state.pendingPopup)
            }else {
                state.pendingPopup = null;
                localStorage.removeItem('pending-cache-popup')
            }
        },
        saveCustomTokens: (state, customTokens) => {
            if (customTokens && Object.keys(customTokens).length > 0) {
                state.customTokens = JSON.stringify(customTokens);
                localStorage.setItem('custom-tokens', state.customTokens)
            }else {
                state.customTokens = null;
                localStorage.removeItem('custom-tokens')
            }
        },
        saveCommunityRewards: (state, communityRewards) => {
            state.communityRewards = communityRewards
        },
        saveCommunityAuthorRewards: (state, communityAuthorRewards) => {
            state.communityAuthorRewards = communityAuthorRewards
        },
        saveSpaceRewards: (state, spaceRewards) => {
            state.spaceRewards = spaceRewards;
        },
        saveInviteRewards: (state, inviteRewards) => {
            state.inviteRewards = inviteRewards;
        }
    },
    getters: {
        getDraft: (state) => {
            let draft = state.draft;
            if (draft) {
                if (typeof(draft) === 'string') {
                    return JSON.parse(draft)
                }
                return draft;
            }else {
                draft = localStorage.getItem('curation-draft')
                if (draft)
                return JSON.parse(draft)
                return null
            }
        },
        getPendingTweetCuration: (state) => {
            let pendingTweetCuration = state.pendingTweetCuration;
            if (pendingTweetCuration) {
                if (typeof(pendingTweetCuration) === 'string') {
                    return JSON.parse(pendingTweetCuration)
                }
                return pendingTweetCuration;
            }else {
                pendingTweetCuration = localStorage.getItem('pending-cache-curation')
                if (pendingTweetCuration)
                return JSON.parse(pendingTweetCuration)
                return null
            }
        },
        getPendingTip: (state) => {
            let pendingTip = state.pendingTip;
            if (pendingTip) {
                if (typeof(pendingTip) === 'string') {
                    return JSON.parse(pendingTip)
                }
                return pendingTip;
            }else {
                pendingTip = localStorage.getItem('pending-cache-tip')
                if (pendingTip)
                    return JSON.parse(pendingTip)
                return null
            }
        },
        getPendingPopup: (state) => {
            let pendingPopup = state.pendingPopup;
            if (pendingPopup) {
                if (typeof(pendingPopup) === 'string') {
                    return JSON.parse(pendingPopup)
                }
                return pendingPopup;
            }else {
                pendingPopup = localStorage.getItem('pending-cache-popup')
                if (pendingPopup)
                return JSON.parse(pendingPopup)
                return null
            }
        },
        getCustomTokens: (state) => {
            let customTokens = state.customTokens;
            if (customTokens) {
                if (typeof(customTokens) === 'string') {
                    return JSON.parse(customTokens)
                }
                return customTokens;
            }else {
                customTokens = localStorage.getItem('custom-tokens')
                if (customTokens) {
                    return JSON.parse(customTokens)
                }
                return null
            }
        },
        // curation rewards
        getCommunityRewards: (state) => (communityId) => {
            if (state.communityRewards) {
                return state.communityRewards.filter(c => c.communityId === communityId)
            }
            return []
        },
        getCommunityAuthorRewards: (state) => (communityId) => {
            if (state.communityAuthorRewards) {
                return state.communityAuthorRewards.filter(c => c.communityId == communityId)
            }
            return []
        },
        getRewardCommunityInfo: state => {
            return [...new Set(state.communityRewards.map(c => c.communityId).concat(state.communityAuthorRewards.map(c => c.communityId)))] 
        },

        // space rewards
        getSpaceCommunityRewards: (state) => (communityId) => {
            if (state.spaceRewards) {
                return state.spaceRewards.filter(c => c.communityId === communityId)
            }
            return []
        },
        getSpaceRewardCommunityInfo: (state) => {
            return [...new Set(state.spaceRewards.map(c => c.communityId))] 
        }
    }
}
