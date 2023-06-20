<template>
  <div class="light:bg-white flex border-t-1 border-headerBorder light:border-headerBorderLight
              pt-7px pb-23px text-color8B light:text-black/40 font-bold">
    <router-link to="/square" class="flex-1">
      <button  class="w-full h-30px flex justify-center items-center">
        {{$t('slider.home')}}
      </button>
    </router-link>
    <router-link to="/community" class="flex-1">
      <button  class="w-full h-30px flex justify-center items-center">
        {{$t('slider.community')}}
      </button>
    </router-link>
    <router-link to="/influence" class="flex-1">
      <button  class="w-full h-30px flex justify-center items-center">
        {{$t('slider.influence')}}
      </button>
    </router-link>
    <router-link :to="`/wallet/${getAccountInfo.twitterUsername}/reward`"
                 class="flex-1">
      <button class="w-full h-30px flex justify-center items-center"
              :class="/^\/wallet/.test($route.path)?'text-white light:text-black/90':''">
        {{$t('slider.wallet')}}
      </button>
    </router-link>
    <button v-if="!getAccountInfo"
            @click="$emit('login')"
            class="flex-1 h-30px flex justify-center items-center">
      {{$t('slider.mine')}}
    </button>
    <router-link v-else :to="`/profile/@${getAccountInfo.twitterUsername}/post`" class="flex-1">
      <button class="w-full h-30px flex justify-center items-center">
        {{$t('slider.mine')}}
      </button>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "BottomTabbar",
  computed: {
    ...mapGetters(['getAccountInfo']),
  },
}
</script>

<style scoped lang="scss">
.router-link-active {
  color: white;
}
.light .router-link-active {
  color: rgba(0,0,0,0.9);
}
</style>
