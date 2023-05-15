<template>
  <div class="w-13rem 2xl:w-15rem min-w-200px flex flex-col justify-between
              border-r-1 border-headerBorder light:border-headerBorderLight pb-2rem">
    <div class="flex flex-col items-start gap-15px px-15px xl:px-1rem 2xl:px-2rem">
      <router-link to="/" class="flex-1">
        <button  class="w-full h-60px flex justify-center items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon0.svg" alt="">
          <span>{{$t('slider.home')}}</span>
        </button>
      </router-link>
      <router-link to="/community" class="flex-1">
        <button  class="w-full h-60px flex justify-center items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon1.svg" alt="">
          <span>{{$t('slider.community')}}</span>
        </button>
      </router-link>
      <router-link to="/influence" class="flex-1">
        <button  class="w-full h-60px flex justify-center items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon3.svg" alt="">
          <span>{{$t('slider.influence')}}</span>
        </button>
      </router-link>
      <router-link to="/influence" class="flex-1">
        <button  class="w-full h-60px flex justify-center items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon3.svg" alt="">
          <span>{{$t('slider.info')}}</span>
        </button>
      </router-link>
      <router-link to="/create-curation" class="flex-1">
        <button  class="w-full h-60px flex justify-center items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon2.svg" alt="">
          <span>{{$t('slider.create')}}</span>
        </button>
      </router-link>
    </div>
    <div class="px-15px xl:px-1rem 2xl:px-2rem">
      <button v-if="!getAccountInfo"
              @click="$emit('login')"
              class="flex justify-center items-center mr-1 min-w-70px px-13px bg-color62
                     text-white c-text-black text-0.8rem h-25px 2xl:h-1.4rem rounded-full">
        <img src="~@/assets/tabbar/tab-icon4.svg" alt="">
      </button>
      <router-link v-else :to="`/profile/@${getAccountInfo.twitterUsername}/post`"
                   class="flex items-center">
        <img class="w-50px h-50px min-w-50px min-h-50px rounded-full mr-10px"
             :src="profileImg" @error="replaceEmptyImg" alt="">
        <div class="flex flex-col items-center justify-start">
          <div class="c-text-black text-16px xl:text-1rem light:text-blueDark mr-5px text-left mb-6px">
            {{ getAccountInfo ? getAccountInfo.twitterName : "" }}
          </div>
          <div @click="gotoTwitter"
               class="flex items-center">
            <i class="icon-twitter w-16px h-16px"></i>
            <span class="text-12px 2xl:text-0.7rem">@{{getAccountInfo ? getAccountInfo.twitterUsername : " "}}</span>
          </div>
        </div>
      </router-link>
      <Menu class="mt-10px">
        <template #menuName>
          <span class="whitespace-nowrap ml-10px">{{$t('common.more')}}</span>
        </template>
      </Menu>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import Menu from "@/components/layout/Menu";

export default {
  name: "SliderBar",
  components: {Menu},
  props: {
    profileImg: {
      type: String,
      default: ''
    },
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
  },
  methods: {
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    gotoTwitter() {
      window.open(
          "https://twitter.com/" + this.getAccountInfo.twitterUsername,
          "__blank"
      );
    },
  }
}
</script>

<style scoped>

</style>
