<template>
  <div class="home">
    <div class="container mx-auto lg:mt-5rem mt-20vh px-0.75rem">
      <div class="fade-in">
        <div class="c-text-black text-2.6rem leading-4.2rem max-w-20rem sm:max-w-35rem sm:mx-auto mb-2.3rem px-2rem text-left sm:text-center">
          <span class="gradient-text gradient-text-right3">Activate web3 wallet</span>
          and Sign up
        </div>
      </div>
      <button @click="fetchKey"
              class="slide-in-blurred-top gradient-btn gradient-btn-outline w-20rem h-4rem mx-auto rounded-full c-text-bold text-1.2rem">
        Activate Your Wallet
      </button>
      <div class="fade-in">
        <div class="mt-2rem">
          Already verified yourself ?
        </div>
        <router-link to="/login"
                     class="c-text-black text-15px leading-24px 2xl:text-1rem 2xl:leading-1.5rem mt-1rem underline">
          Log in here
        </router-link>
      </div>
    </div>
    <!--  Verify modal -->
    <el-dialog :destroy-on-close="true" v-model="showPrivateKey"
               custom-class="c-dialog c-dialog-lg c-dialog-center">
      <Verify :ethAccount="accountInfo" @send="sendTwitter"></Verify>
    </el-dialog>
  </div>
</template>

<script>
import { getRegisterTicket } from '@/api/api'
import Verify from "@/views/Verify";
import { hexToString } from '@/utils/helper'
import { createKeypair, sign, verify, open, box, openBox, test } from '@/utils/tweet-nacl'
import { TWITTER_MONITOR_RULE } from '@/config'
import { randomEthAccount } from '@/utils/ethers'
import { notify } from "@/utils/notify";

export default {
  name: 'HomeView',
  components: {
    Verify
  },
  data: () => {
    return {
      generatingKeys: false,
      showPrivateKey: false,
      ethAddress: '',
      accountInfo: {}
    }
  },
  computed: {
  },
  methods: {
    showNotify(message, duration, type) {
        notify({message, duration, type})
    },
    async fetchKey() {
      try {
        this.$store.commit('saveEthAddress', null)
        const account = randomEthAccount()
        this.accountInfo = account
        this.ethAddress = account.ethAddress
        this.showPrivateKey = true
      }catch(e) {
        this.showNotify(e.toString(), 5000, 'error')
      }
    },
    sendTwitter() {
      this.$store.commit('saveEthAddress', this.ethAddress)
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_RULE + ' !create wormhole account:' + this.ethAddress, '__blank')
    },
  },
  async mounted() {
    this.$store.commit('saveAccountInfo', {})
  },
}
</script>
<style lang="scss">
</style>
