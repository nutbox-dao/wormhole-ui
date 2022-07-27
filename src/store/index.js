import * as Vue from 'vue'
import * as Vuex from 'vuex'
import Cookie from 'vue-cookies'
import { b64uEnc, b64uDec } from '@/utils/helper'
import postsModule from './postsModule'

export default Vuex.createStore({
  state: {
    rsaKey: Cookie.get('keyPair'),
    accountInfo: Cookie.get('accountInfo'),
    steemBalance: 0,
    sbdBalance: 0,
    rcPercent: 0,
    ethBalance: 0,
    ethAddress: null,
    prices: {},
    erc20Balances: {},
    posts: [],
    transactions: [],
    vestsToSteem: 1
  },
  getters: {
    getPrivateKey: (state) => (publicKey) => {
      if (state.rsaKey){
        if (publicKey === state.rsaKey.publicKey) {
          return b64uDec(state.rsaKey.privateKey)
        }
      }
    },
    getAccountInfo: (state) => {
      const acc = state.accountInfo
      if (acc) {
        if (acc.twitterUsername) return acc
        return JSON.parse(acc)
      }else {
        return null
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
      if (!accountInfo || Object.keys(accountInfo).length === 0) {
        state.accountInfo = null;
        Cookie.remove('accountInfo')
      }else {
        state.accountInfo = JSON.stringify(accountInfo);
        Cookie.set('accountInfo', JSON.stringify(accountInfo), '30d')
      }
      
    },
    saveSteemBalance: (state, steemBalance) => {
      state.steemBalance = steemBalance
    },
    saveSbdBalance: (state, sbdBalance) => {
      state.sbdBalance = sbdBalance
    },
    saveRcPercent: (state, rcPercent) => {
      state.rcPercent = rcPercent
    },
    savePrices: (state, prices) => {
      state.prices = prices
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
    },
    saveTransactions: (state, transactions) => {
      state.transactions = transactions
    },
    saveVestsToSteem: (state, vestsToSteem) => {
      state.vestsToSteem = vestsToSteem
    }
  },
  actions: {},
  modules: {
    postsModule
  },
})
