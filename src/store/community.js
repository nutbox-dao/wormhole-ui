import Cookie from "vue-cookies";
import { CHAIN_ID } from "@/config";

export default {
  namespaced: true,
  state: {
    communities: [],
    showingCommunity: {},
    configs: {}
  },
  mutations: {
    saveCommunities: (state, communities) => {
      state.communities = communities;
    },
    saveShowingCommunity: (state, showingCommunity) => {
      state.showingCommunity =showingCommunity
    },
    saveConfigs: (state, configs) => {
      state.configs = configs
    }
  },
  getters: {
    isMainChain: (state) => {
      return parseInt(state.chainId) === parseInt(CHAIN_ID);
    },
  },
};
