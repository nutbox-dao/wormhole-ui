<template>
  <div class="home">
    <p>
      sfadl
    </p>
    <a
      class="twitter-share-button"
      target="blank"
      href="https://twitter.com/intent/tweet?text=@nutbos create account: sdfsgsgf"
    >
      Tweet</a
    >
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import { getKey } from '@/utils/rsa'
import { mapState, mapGetters } from 'vuex'

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
  },
  method() {},
  async mounted() {
    console.log(646);
    this.$store.commit('saveRsaKey', {})
    if (this.rsaKey && this.rsaKey.privateKey){
      console.log(2, this.rsaKey, this.rsaKey.publicKey);
    }else {
      console.log(1, new Date().getTime());
      getKey().then(rsa => {
        this.pubKey = rsa.publicKey
        this.$store.commit('saveRsaKey', rsa)
        console.log(2, rsa);
        console.log(3, new Date().getTime())
      })
    }
  },
}
</script>
