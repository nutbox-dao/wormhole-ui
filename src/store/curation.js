
import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        draft: Cookie.get('curation-draft'),
        // cache the new curations those not send to backend
        newCurations: [],
        ongoingList: [],
        endList: [],
        closeList: [],
        detailCuration: {},
        detailRecords: []
    },
    mutations: {
        saveDraft: (state, draft) => {
            if (draft) {
                state.draft = draft;
                // const draftStr = JSON.stringify(draft)
                Cookie.set('curation-draft', draft, '2d')
            }else {
                state.draft = null;
                Cookie.remove('curation-draft');
            }
        },
        saveNewCurations: (state, newCurations) => {
            if (newCurations) {
                state.newCurations = newCurations;
                Cookie.set('new-curations', newCurations, '30d')
            }else {
                state.newCurations = [];
                Cookie.remove('new-curations')
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
        }
    },
    getters: {
        getDraft: (state) => {
            let draft = state.draft;
            if (draft) {
                return draft
            }
            return null;
        }
    }
}