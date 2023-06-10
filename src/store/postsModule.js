
export default {
    namespaced: true,
    state: {
        // post detail page data
        currentShowingDetail: null,
        /**
         * this is categary by tag, contain page info and posts
         * {
         *      pageNum:0,
         *      posts: []
         * }
         */
        ongoingListByTag: {},
        trendingListByTag: {},
        trendingCurationListByTag: {},
        selectedTag: 'All'
    },
    mutations: {
        saveSelectedTag: (state, tag) => {
            state.selectedTag = tag
        },
        saveCurrentTagIndex: (state, currentTagIndex) => {
            state.currentTagIndex = currentTagIndex
        },
        saveCurrentShowingDetail: (state, currentShowingDetail) => {
            state.currentShowingDetail = currentShowingDetail
        },
        saveOngoingListByTag: (state, ongoingListByTag) => {
            state.ongoingListByTag = ongoingListByTag
        },
        saveTrendingListByTag: (state, trendingListByTag) => {
            state.trendingListByTag = trendingListByTag
        },
        saveTrendingCurationListByTag: (state, trendingCurationListByTag) => {
            state.trendingCurationListByTag = trendingCurationListByTag
        }
    },
}