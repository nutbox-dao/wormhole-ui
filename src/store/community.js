/**
 * This is for community common data and current showing on page
 * Include the all infos of this community
 * The data will be refresh when user change to another community
 */
import Cookie from "vue-cookies";
import { CHAIN_ID } from "@/config";

export default {
  namespaced: true,
  state: {
    communities: [],
    configs: {},
    
    showingCommunity: {},
    trendingPosts: [],
    newPosts: [],
    promotionPosts: [],
    activities: [],
    announces: [],
    topics: [],
    members: [],
    ops: [],
    communityCC: []
  },
  mutations: {
    saveCommunities: (state, communities) => {
      state.communities = communities;
    },

    saveConfigs: (state, configs) => {
      state.configs = configs
    },
    saveShowingCommunity: (state, showingCommunity) => {
      state.showingCommunity =showingCommunity
    },
    saveTrendingPosts: (state, trendingPosts) => {
      state.trendingPosts =trendingPosts
    },
    saveNewPosts: (state, newPosts) => {
      state.newPosts =newPosts
    },
    savePromotionPosts: (state, promotionPosts) => {
      state.promotionPosts =promotionPosts
    },
    saveActivities: (state, activities) => {
      state.activities =activities
    },
    saveAnnounces: (state, announces) => {
      state.announces =announces
    },
    saveTopics: (state, topics) => {
      state.topics =topics
    },
    saveMembers: (state, members) => {
      state.members = members
    },
    saveOps: (state, ops) => {
      state.ops = ops
    },
    saveCommunityCC: (state, communityCC) => {
      state.communityCC = communityCC
    },
    
    clearData: (state) => {
      state.showingCommunity = {};
      state.trendingPosts = [];
      state.newPosts = [];
      state.promotionPosts = [];
      state.activities = [];
      state.announces = [];
      state.topics = [];
      state.members = [];
      state.ops = [];
    }
  }
};
