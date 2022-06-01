<template>
  <div class="home">
    <div class="container mx-auto lg:mt-10rem mt-20vh px-0.75rem">
      <div class="fade-in">
        <div class="gradient-text gradient-text-left c-text-black text-3.2rem max-w-40rem mx-auto mb-2.3rem">
          Send & Receive SOL through Twitter
        </div>
      </div>
      <a class="twitter-share-button" target="blank"
         :href="'https://twitter.com/intent/tweet?text=@nutbox !create warm hole account with pub key:' + pubKey">
        <button class="slide-in-blurred-top gradient-btn gradient-btn-outline border-6px rounded-full c-text-bold text-1.6rem py-1rem px-2.5rem">Activate Your Wallet</button>
      </a>
      <div class="fade-in">
        <div class="text-text8F mt-2rem">
          Already verified yourself ?
        </div>
        <div class="text-textPrimary1 c-text-black text-1.2rem leading-1.5rem mt-0.5rem underline">Log in here</div>
      </div>
    </div>
<!--    <a-->
<!--      class="twitter-share-button"-->
<!--      target="blank"-->
<!--      :href="'https://twitter.com/intent/tweet?text=@nutbox !create warm hole account with pub key:' + pubKey"-->
<!--    >-->
<!--      Tweet</a-->
<!--    >-->
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import { mapState, mapGetters } from 'vuex'
import { b64uEnc, b64uDec, u8arryToHex, hexTou8array } from '@/utils/helper'
import { createKeypair, sign, verify, open, box, openBox } from '@/utils/tweet-nacl'
import { ParseKeyNonce } from '@/config'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
  },
  data: () => {
    return {
      pubKey: ''
    }
  },
  computed: {
    ...mapState(['rsaKey']),
    ...mapGetters(['getPrivateKey'])
  },
  method() {},
  async mounted() {
    // if (this.rsaKey && this.rsaKey.privateKey) {
    //   console.log(1 , this.rsaKey);
    //   this.pubKey = this.rsaKey.publicKey
    // } else {
    //   // generate new pair
    //   const pair = createKeypair()
    //   this.pubKey = pair.pubKey;
    //   this.$store.commit('saveKeyPair', pair)
    // }


  },
}
</script>
<style lang="scss">
.slide-in-blurred-top {
  animation: slide-in-blurred-top .6s cubic-bezier(.23,1,.32,1) both;
}
@keyframes slide-in-blurred-top{
  0%{
    filter:blur(40px);
    opacity:0;
    transform:translateY(-1000px) scaleY(2.5) scaleX(.2);
    transform-origin:50% 0
  }
  to{
    filter:blur(0);
    opacity:1;
    transform:translateY(0) scaleY(1) scaleX(1);
    transform-origin:50% 50%
  }
}
.fade-in {
  animation-name: FadeIn;
  animation-duration: 3s;
  transition-timing-function: linear;
}

@keyframes FadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

</style>
