<template>
  <div class="bg-white flex items-center border-t-1 border-headedBorder light:border-headerBorderLight">
    <router-link to="/" class="flex-1">
      <button  class="w-full h-60px flex justify-center items-center">
        <img src="~@/assets/tabbar/tab-icon0.svg" alt="">
      </button>
    </router-link>
    <router-link to="/community" class="flex-1">
      <button  class="w-full h-60px flex justify-center items-center">
        <img src="~@/assets/tabbar/tab-icon1.svg" alt="">
      </button>
    </router-link>
    <router-link to="/create-curation" class="flex-1">
      <button  class="w-full h-60px flex justify-center items-center">
        <img src="~@/assets/tabbar/tab-icon2.svg" alt="">
      </button>
    </router-link>
    <router-link to="/influence" class="flex-1">
      <button  class="w-full h-60px flex justify-center items-center">
        <img src="~@/assets/tabbar/tab-icon3.svg" alt="">
      </button>
    </router-link>
    <button v-if="!getAccountInfo"
            @click="$emit('login')"
            class="flex-1 h-60px flex justify-center items-center">
      <img src="~@/assets/tabbar/tab-icon4.svg" alt="">
    </button>
    <router-link v-else :to="`/profile/@${getAccountInfo.twitterUsername}/post`" class="flex-1">
      <button class="w-full h-60px flex justify-center items-center">
        <img src="~@/assets/tabbar/tab-icon4.svg" alt="">
      </button>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "BottomTabbar",
  computed: {
    ...mapGetters('getAccountInfo')
  },
}
</script>

<style scoped>

</style>
