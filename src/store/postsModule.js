
export default {
    namespaced: true,
    state: {
        tagsAggregation: {},
        // store square posts, classify by tags
        allPosts: {},
        // in square page, this field stored which tag user alread chosed
        currentTagIndex: 0,
        // post detail page data
        currentShowingDetail: null
    },
    mutations: {
        saveTagsAggregation: (state, tagsAggregation) => {
            state.tagsAggregation = tagsAggregation
        },
        saveAllPosts: (state, allPosts) => {
            state.allPosts = allPosts
        },
        saveCurrentTagIndex: (state, currentTagIndex) => {
            state.currentTagIndex = currentTagIndex
        },
        saveCurrentShowingDetail: (state, currentShowingDetail) => {
            state.currentShowingDetail = currentShowingDetail
        }
    },
    getters: {
        getPostsByTag: (state) => (tag) => {
            const posts = state.allPosts[tag]
            return posts
        }
    }
}