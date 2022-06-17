import * as Vue from 'vue'
import * as Vuex from 'vuex'
import Cookie from 'vue-cookies'
import { b64uEnc, b64uDec } from '@/utils/helper'

export default Vuex.createStore({
  state: {
    rsaKey: Cookie.get('keyPair'),
    accountInfo: null,
    saveSteemBalance: 0,
    ethBalance: 0,
    ethAddress: null,
    prices: {},
    ethers: {},
    erc20Balances: {},
    posts: []
  },
  getters: {
    getPrivateKey: (state) => (publicKey) => {
      if (state.rsaKey){
        if (publicKey === state.rsaKey.publicKey) {
          return b64uDec(state.rsaKey.privateKey)
        }
      }
    }
  },
  mutations: {
    saveKeyPair: (state, rsaKey) => {
      if (rsaKey){
        rsaKey.privateKey = b64uEnc(rsaKey.privateKey)
      }
      state.rsaKey = rsaKey;
      Cookie.set('keyPair', state.rsaKey, '7d')
    },
    saveAccountInfo: (state, accountInfo) => {
      state.accountInfo = accountInfo;
    },
    saveSteemBalance: (state, steemBalance) => {
      state.steemBalance = steemBalance
    },
    savePrices: (state, prices) => {
      state.prices = prices
    },
    saveEthers: (state, ethers) => {
      state.ethers = ethers
    },
    saveEthBalance: (state, ethBalance) => {
      state.ethBalance = ethBalance
    },
    saveEthAddress: (state, ethAddress) => {
      state.ethAddress = ethAddress
    },
    saveERC20Balances: (state, erc20Balances) => {
      state.erc20Balances = erc20Balances
    },
    savePosts: (state, posts) => {
      state.posts = posts
    }
  },
  actions: {},
  modules: {},
})
