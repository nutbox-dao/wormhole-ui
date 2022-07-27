
export default {
    namespaced: true,
    state: {
        tagsAggregation: {},
        // store square posts, classify by tags
        allPosts: {},
        // in square page, this field stored which tag user alread chosed
        currentTagIndex: 0
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
        }
    },
    getters: {
        getPostsByTag: (state) => (tag) => {
            const posts = state.allPosts[tag]
            return posts
        }
    }
}