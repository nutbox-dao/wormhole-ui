<template>
  <div class="home">
    <div class="container mx-auto lg:mt-10rem mt-20vh px-0.75rem">
      <div class="fade-in">
        <div class="gradient-text gradient-text-right3 c-text-black text-3.2rem max-w-40rem mx-auto mb-2.3rem">
          Send & Receive Asset through Twitter
        </div>
      </div>
      <button :disabled="generatingKeys" @click="fetchKey"
              class="slide-in-blurred-top gradient-btn gradient-btn-outline
              flex items-center mx-auto
              border-6px rounded-full c-text-bold
              text-1.6rem py-1rem px-2.5rem">
        <span>Activate Your Wallet</span>
        <c-spinner class="w-2.4rem h-2.4rem ml-1rem" v-show="generatingKeys"></c-spinner>
      </button>
      <div class="fade-in">
        <div class="text-text8F mt-2rem">
          Already verified yourself ?
        </div>
        <router-link to="/login" class="text-primaryColor1 c-text-black text-1.2rem leading-1.5rem mt-0.5rem underline" @click="login">Log in here</router-link>
      </div>
    </div>
    <!--    验证弹框-->
    <el-dialog :destroy-on-close="true" v-model="showPrivateKey" custom-class="c-dialog c-dialog-lg c-dialog-center">
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
import { generateEth } from '@/utils/ethers'
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
        this.generatingKeys = true
        this.$store.commit('saveEthAddress', null)
        // generate new pair
        const pair = createKeypair()
        const {id, pwd} = await getRegisterTicket(pair.publicKey)
        let pass = openBox(pwd, pair.privateKey)
        pass = hexToString(pass)
        const { eth, ethPrivateKey } = generateEth(id, pass)
        // const web25 = generateEth('', ethPrivateKey)
        this.accountInfo = { ethAddress: eth, privateKey: ethPrivateKey }
        this.ethAddress = eth
        this.showPrivateKey = true
      }catch(e) {
        this.showNotify(e.toString(), 5000, 'error')
      } finally {
        this.generatingKeys = false
      }
    },
    sendTwitter() {
      this.$store.commit('saveEthAddress', this.ethAddress)
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_RULE + ' !create worm hole account:' + this.ethAddress, '__blank')
    },
  },
  async mounted() {
    this.$store.commit('saveAccountInfo', {})
  },
}
</script>
<style lang="scss">
</style>
