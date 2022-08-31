
import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        draft: Cookie.get('curation-draft')
    },
    mutations: {
        saveDraft: (state, draft) => {
            if (draft) {
                state.draft = draft;
                const draftStr = JSON.stringify(draft)
                Cookie.set('curation-draft', draftStr, '2d')
            }else {
                state.draft = null;
                Cookie.remove('curation-draft');
            }
        }
    },
    getters: {
        getDraft: (state) => {
            let draft = state.draft;
            if (draft) {
                return draft
                return JSON.parse(draft)
            }
            return null;
        }
    }
}