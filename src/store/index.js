import * as Vue from 'vue'
import * as Vuex from 'vuex'
import Cookie from 'vue-cookies'
import { b64uEnc, b64uDec } from '@/utils/helper'

export default Vuex.createStore({
  state: {
    rsaKey: Cookie.get('rsaKey')
  },
  getters: {
    getPrivateKey: (state) => (publicKey) => {
      if (publicKey === state.rsaKey.publicKey) {
        return b64uDec(state.rsaKey.privateKey)
      }
    }
  },
  mutations: {
    saveRsaKey: (state, rsaKey) => {
      console.log(11);
      rsaKey.privateKey = b64uEnc(rsaKey.privateKey)
      console.log(22);
      state.rsaKey = rsaKey;
      Cookie.set('rsaKey', rsaKey, '20min')
    }
  },
  actions: {},
  modules: {},
})
