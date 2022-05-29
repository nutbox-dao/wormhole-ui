<template>
  <div class="home">
    <a class="twitter-share-button" target="blank"
  href="https://twitter.com/intent/tweet?text=@nutbos create account: sdfsgsgf">
Tweet</a>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {getKeyPair} from "@/utils/rsa"

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  method() {

  },
  mounted() {
    const a = getKeyPair('asdf')
    console.log(235, a)
  }
}
</script>

