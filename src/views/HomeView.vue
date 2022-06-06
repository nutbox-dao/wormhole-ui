<template>
  <div class="home">
    <div class="container mx-auto lg:mt-10rem mt-20vh px-0.75rem">
      <div class="fade-in">
        <div class="gradient-text gradient-text-left c-text-black text-3.2rem max-w-40rem mx-auto mb-2.3rem">
          Send & Receive SOL through Twitter
        </div>
      </div>
      <button :disabled="!pubKey" @click="sendTwitter"
              class="slide-in-blurred-top gradient-btn gradient-btn-outline
              flex items-center mx-auto
              border-6px rounded-full c-text-bold
              text-1.6rem py-1rem px-2.5rem">
        <span>Activate Your Wallet</span>
        <c-spinner class="w-2.4rem h-2.4rem ml-1rem" v-show="!pubKey"></c-spinner>
      </button>
      <div class="fade-in">
        <div class="text-text8F mt-2rem">
          Already verified yourself ?
        </div>
        <router-link to="/login" class="text-primaryColor1 c-text-black text-1.2rem leading-1.5rem mt-0.5rem underline" @click="login">Log in here</router-link>
      </div>
    </div>
   <!-- <p></p>
   <br>
    <button @click="sendTestTwitter">
      Sign Up
    </button> -->
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import { mapState, mapGetters } from 'vuex'
import { b64uEnc, b64uDec, u8arryToHex, hexTou8array } from '@/utils/helper'
import { createKeypair, sign, verify, open, box, openBox, test } from '@/utils/tweet-nacl'
import { ParseKeyNonce, SendPwdServerPubKey, TWITTER_MONITOR_ACCOUNT } from '@/config'
import { registerAccount } from '@/api/api'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
  },
  data: () => {
    return {
      pubKey: null,
      testMyPub: '913b75ea8d2371337e2febdfe7959ee344cad7236827cc8575fe85fbb0365669',
      testMyPrive: 'NzA1OWQ3Y2NiNTdmMWZkZDJkZWNhOGE1NDhmMGVjNmU4NzgyZjgzN2E4ODc0ZGYzM2M2YzEyNDJmNGJkMzY2NQ..'
    }
  },
  computed: {
    ...mapState(['rsaKey']),
    ...mapGetters(['getPrivateKey'])
  },
  methods: {
    async sendTestTwitter() {
      if (this.pubKey) {
        await registerAccount({
          postId: 235768564646235,
          twitterId: '1412585243085844481',
          twitterName: 'terry3t1',
          twitterUsername: 'terry3t1',
          content: '@nutbox !register new account: sadfgasgfasgsg',
          publicKey: this.pubKey
        })
      }
    },
    async sendTwitter() {
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_ACCOUNT + ' !create worm hole account with pub key:' + this.pubKey, '__blank')
    },
    async login() {

    }
  },
  async mounted() {
    if (this.rsaKey && this.rsaKey.privateKey) {
      this.pubKey = this.rsaKey.publicKey
    } else {
      // generate new pair
      const pair = createKeypair()
      this.pubKey = pair.publicKey;
      console.log(235, this.pubKey);
      this.$store.commit('saveKeyPair', pair)
    }
  },
}
</script>
<style lang="scss">
</style>
