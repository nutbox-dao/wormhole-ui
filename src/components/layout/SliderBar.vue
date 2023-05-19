<template>
  <div class="w-13rem 2xl:w-15rem min-w-200px flex flex-col justify-between
              border-r-1 border-headerBorder light:border-headerBorderLight pb-2rem">
    <div class="flex flex-col items-start gap-15px px-15px xl:px-1rem 2xl:px-2rem">
      <router-link to="/square" class="flex-1 w-full">
        <button  class="w-full h-60px flex items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon0.svg" alt="">
          <span>{{$t('slider.home')}}</span>
        </button>
      </router-link>
      <router-link to="/community" class="flex-1 w-full">
        <button class="w-full h-60px flex items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon1.svg" alt="">
          <span>{{$t('slider.community')}}</span>
        </button>
      </router-link>
      <router-link to="/influence" class="flex-1 w-full">
        <button class="w-full h-60px flex items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon3.svg" alt="">
          <span>{{$t('slider.influence')}}</span>
        </button>
      </router-link>
      <router-link to="/info" class="flex-1 w-full">
        <button  class="w-full h-60px flex items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon3.svg" alt="">
          <span>{{$t('slider.info')}}</span>
        </button>
      </router-link>
      <router-link to="/create-curation" class="flex-1 w-full">
        <button  class="w-full h-60px flex items-center">
          <img class="filter invert-100 light:invert-0 mr-10px" src="~@/assets/tabbar/tab-icon2.svg" alt="">
          <span>{{$t('slider.create')}}</span>
        </button>
      </router-link>
    </div>
    <div class="px-15px xl:px-1rem 2xl:px-2rem">
      <button v-if="!getAccountInfo"
              @click="$emit('login')"
              class="flex justify-center items-center mr-1 w-3/5 h-40px px-13px bg-color62
                     text-white c-text-black text-0.8rem rounded-full">
        {{$t('signIn')}}
      </button>
      <template v-else>
        <div class="flex items-center gap-15px mb-15px">
          <el-tooltip popper-class="shadow-popper-tip" :show-after="1500">
            <template #content>
              <div class="max-w-14rem text-white light:text-blueDark">
                {{$t('postView.p1')}}
              </div>
            </template>
            <button class="w-50px max-w-50px h-50px">
              <el-progress class="c-progress-green w-full h-full"
                           type="dashboard"
                           color="#68E796"
                           :stroke-width="5"
                           :width="50"
                           :percentage="Number(rc) / MAX_RC * 100">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                </template>
              </el-progress>
            </button>
          </el-tooltip>
          <el-tooltip popper-class="shadow-popper-tip" :show-after="1500">
            <template #content>
              <div class="max-w-14rem text-white light:text-blueDark">
                {{$t('postView.vpDes')}}
              </div>
            </template>
            <button class="w-50px max-w-50px h-50px">
              <el-progress class="c-progress-green"
                           type="dashboard"
                           color="#7700E0"
                           :stroke-width="5"
                           :width="50"
                           :percentage="Number(vp) / MAX_VP * 100">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                </template>
              </el-progress>
            </button>
          </el-tooltip>

        </div>
        <router-link :to="`/profile/@${getAccountInfo.twitterUsername}/post`"
                     class="flex items-center">
          <img class="w-50px h-50px min-w-50px min-h-50px rounded-full mr-10px"
               :src="profileImg" @error="replaceEmptyImg" alt="">
          <div class="flex flex-col items-start">
            <div class="c-text-black text-16px xl:text-1rem light:text-blueDark text-left mb-6px">
              {{ getAccountInfo ? getAccountInfo.twitterName : "" }}
            </div>
            <div @click="gotoTwitter"
                 class="flex items-center">
              <i class="icon-twitter w-16px h-16px"></i>
              <span class="text-12px 2xl:text-0.7rem">@{{getAccountInfo ? getAccountInfo.twitterUsername : " "}}</span>
            </div>
          </div>
        </router-link>
      </template>
      <Menu class="mt-10px">
        <template #menuName>
          <span class="whitespace-nowrap ml-10px">{{$t('common.more')}}</span>
        </template>
      </Menu>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import Menu from "@/components/layout/Menu";
import {MAX_RC, MAX_VP} from "@/config";

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
    ...mapState(["rc", 'vp']),
    ...mapGetters(['getAccountInfo']),
  },
  data() {
    return {
      searchModalVisible: false,
      MAX_RC,
      MAX_VP
    }
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

<style scoped lang="scss">
.router-link-active {
  color: #7851FF;
}
</style>
