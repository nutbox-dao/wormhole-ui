
import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        draft: Cookie.get('curation-draft')
    },
    mutations: {
        saveDraft: (state, draft) => {
            if (draft) {
                draft = JSON.stringify(draft)
                state.draft = draft;
                Cookie.set('curation-draft', draft, '2d')
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
                return JSON.parse(draft)
            }
            return null;
        }
    }
}