
export default {
    namespaced: true,
    state: {
        tagsAggregation: {}
    },
    mutations: {
        saveTagsAggregation: (state, tagsAggregation) => {
            state.tagsAggregation = tagsAggregation
        }
    },
    getters: {

    }
}