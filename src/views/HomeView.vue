<template>
  <div class="home">
    <div class="container mx-auto lg:mt-10rem mt-20vh px-0.75rem">
      <div class="fade-in">
        <div class="gradient-text gradient-text-right3 c-text-black text-3.2rem max-w-40rem mx-auto mb-2.3rem">
          Send & Receive Asset through Twitter
        </div>
      </div>
      <button :disabled="generatingKeys" @click="sendTwitter"
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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { b64uEnc, b64uDec, u8arryToHex, hexTou8array } from '@/utils/helper'
import { createKeypair, sign, verify, open, box, openBox, test } from '@/utils/tweet-nacl'
import { ParseKeyNonce, SendPwdServerPubKey, TWITTER_MONITOR_ACCOUNT } from '@/config'

export default {
  name: 'HomeView',
  components: {
  },
  data: () => {
    return {
      pubKey: null,
      generatingKeys: false
    }
  },
  computed: {
    ...mapState(['rsaKey']),
    ...mapGetters(['getPrivateKey'])
  },
  methods: {
    async sendTwitter() {
      this.generatingKeys = true
      if (this.rsaKey && this.rsaKey.privateKey) {
        this.pubKey = this.rsaKey.publicKey
      } else {
        // generate new pair
        const pair = createKeypair()
        this.pubKey = pair.publicKey;
        this.$store.commit('saveKeyPair', pair)
      }
      this.generatingKeys = false
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_ACCOUNT + ' !create worm hole account with pub key:' + this.pubKey, '__blank')
    },
    async login() {

    }
  },
  async mounted() {
  },
}
</script>
<style lang="scss">
</style>
