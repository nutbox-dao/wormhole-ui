
import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        draft: localStorage.getItem('curation-draft'),
        ongoingList: [],
        endList: [],
        closeList: [],
        detailCuration: {},
        detailRecords: [],
        // cache the created curation which not push to backend
        pendingTweetCuration: localStorage.getItem('pending-cache-curation')
    },
    mutations: {
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
        saveEndList: (state, endList) => {
            state.endList = endList
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
        savePendingTweetCuration: (state, pendingTweetCuration) => {
            if (pendingTweetCuration && Object.keys(pendingTweetCuration).length > 0) {
                state.pendingTweetCuration = JSON.stringify(pendingTweetCuration)
                localStorage.setItem('pending-cache-curation', state.pendingTweetCuration)
            }else {
                state.pendingTweetCuration = null;
                localStorage.removeItem('pending-cache-curation')
            }
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
        }
    }
}