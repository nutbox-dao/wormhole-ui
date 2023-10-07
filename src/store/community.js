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
    myCreatedWh3Community: {},
    myCreatedNutboxCommunity: {},
    createCommunityState: 0, // 0:loading,1:创建了nutbox合约，2:填写了社区内容，3：创建社区矿池，4：开启社区矿池，5：积分授权了社区矿池，6：填写了虫洞资料
    configs: {},
    
    showingCommunity: {},
    trendingPosts: [],
    newPosts: [],
    promotionPosts: [],
    activities: [],
    announces: [],
    topics: [],
    pendingTopics: [],
    endedTopics: [],
    spaces: [],
    members: [],
    ops: [],
    communityCC: [],
    price: 0,
    specifyDistributionEras: [],
    nutboxCommunityInfo: {},
    poolsData: [],
    currentBlockNum: 0,
    communityContractInfo: []
  },
  mutations: {
    saveCommunities: (state, communities) => {
      state.communities = communities;
    },
    saveMyCreatedWh3Community: (state, myCreatedWh3Community) => {
      state.myCreatedWh3Community = myCreatedWh3Community
    },
    saveMyCreatedNutboxCommunity: (state, myCreatedNutboxCommunity) => {
      state.myCreatedNutboxCommunity = myCreatedNutboxCommunity
    },
    saveCreateCommunityState: (state, createCommunityState) => {
      state.createCommunityState = createCommunityState
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
    savePendingTopics: (state, pendingTopics) => {
      state.pendingTopics = pendingTopics
    },
    saveEndedTopics: (state, endedTopics) => {
      state.endedTopics =endedTopics
    },
    saveSpaces: (state, spaces) => {
      state.spaces = spaces
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
    savePrice: (state, price) => {
      state.price = price
    },
    saveSpecifyDistributionEras: (state, specifyDistributionEras) => {
      state.specifyDistributionEras = specifyDistributionEras
    },
    saveNutboxCommunityInfo: (state, nutboxCommunityInfo) => {
      state.nutboxCommunityInfo = nutboxCommunityInfo
    },
    savePoolsData: (state, poolsData) => {
      state.poolsData = poolsData
    },
    saveCommunityContractInfo: (state, communityContractInfo) => {
      state.communityContractInfo = communityContractInfo
    },
    saveCurrentBlockNum: (state, currentBlockNum) => {
      state.currentBlockNum = currentBlockNum
    },
    
    clearData: (state) => {
      state.showingCommunity = {};
      state.trendingPosts = [];
      state.newPosts = [];
      state.promotionPosts = [];
      state.activities = [];
      state.announces = [];
      state.topics = [];
      state.pendingTopics = [];
      state.endedTopics = [];
      state.spaces = [];
      state.members = [];
      state.ops = [];
      state.price = 0;
      state.specifyDistributionEras = [];
      state.currentBlockNum = 0;
      state.nutboxCommunityInfo = {};
      state.poolsData = [],
      state.communityContractInfo = []
    }
  }
};
