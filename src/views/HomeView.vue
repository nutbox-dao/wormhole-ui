<template>
  <div class="home">
    <p>
      sfadl
    </p>
    <a
      class="twitter-share-button"
      target="blank"
      :href="'https://twitter.com/intent/tweet?text=@nutbox !create warm hole account with pub key:' + pubKey"
    >
      Tweet</a
    >
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
    if (this.rsaKey && this.rsaKey.privateKey) {
      console.log(1 , this.rsaKey);
      this.pubKey = this.rsaKey.publicKey
    } else {
      // generate new pair
      const pair = createKeypair()
      this.pubKey = pair.pubKey;
      this.$store.commit('saveKeyPair', pair)
    }

    
  },
}
</script>
