<template>
  <div class="home">
    <p>
      sfadl
    </p>
    <button @click="sendTestTwitter">
      Sign Up
    </button>
    <a
      class="twitter-share-button"
      target="blank"
      :href="'https://twitter.com/intent/tweet?text=@nutbox !create warm hole account with pub key:' + pubKey"
    >
      Tweet</a
    >
    <button @click="login">
      login
    </button>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import { mapState, mapGetters } from 'vuex'
import { b64uEnc, b64uDec, u8arryToHex, hexTou8array } from '@/utils/helper'
import { createKeypair, sign, verify, open, box, openBox, test } from '@/utils/tweet-nacl'
import { ParseKeyNonce, SendPwdServerPubKey } from '@/config'
import { registerAccount } from '@/api/api'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
  },
  data: () => {
    return {
      pubKey: '',
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
      // operation.twitterId,
    // operation.name,
    // operation.userName,
    // operation.content,
    // operation.publicKey,
    // operation.postTime,
      await registerAccount({
        postId: 235768564646235,
        twitterId: 23523452543566,
        name: 'terry3t1',
        userName: 'terry3t1',
        content: '@nutbox !register new account: sadfgasgfasgsg',
        publicKey: this.pubKey
      })
    },
    async login() {

    }
  },
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
