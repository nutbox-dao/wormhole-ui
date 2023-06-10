<template>
  <div class="w-13rem 2xl:w-15rem min-w-200px flex flex-col justify-between
              border-r-0.5px border-headerBorder light:border-headerBorderLight pb-2rem">
    <div class="flex flex-col items-start gap-15px px-15px xl:px-1rem 2xl:px-2rem text-18px">
      <router-link to="/square" class="flex-1 w-full" v-slot="{isActive}">
        <button  class="w-full h-60px flex items-center" :class="isActive?'text-color62':'text-color99'">
          <img v-show="isActive" class="w-16px min-w-16px" src="~@/assets/nav-home-active.svg" alt="">
          <img v-show="!isActive" class="w-16px min-w-16px" src="~@/assets/nav-home.svg" alt="">
          <span class="ml-8px">{{$t('slider.home')}}</span>
        </button>
      </router-link>
      <router-link to="/community" class="flex-1 w-full" v-slot="{isActive}">
        <button  class="w-full h-60px flex items-center" :class="isActive?'text-color62':'text-color99'">
          <img v-show="isActive" class="w-16px min-w-16px" src="~@/assets/nav-community-active.svg" alt="">
          <img v-show="!isActive" class="w-16px min-w-16px" src="~@/assets/nav-community.svg" alt="">
          <span class="ml-8px">{{$t('slider.community')}}</span>
        </button>
      </router-link>
      <router-link to="/influence" class="flex-1 w-full" v-slot="{isActive}">
        <button  class="w-full h-60px flex items-center" :class="isActive?'text-color62':'text-color99'">
          <img v-show="isActive" class="w-16px min-w-16px" src="~@/assets/nav-influence-active.svg" alt="">
          <img v-show="!isActive" class="w-16px min-w-16px" src="~@/assets/nav-influence.svg" alt="">
          <span class="ml-8px">{{$t('slider.influence')}}</span>
        </button>
      </router-link>
      <router-link to="/info" class="flex-1 w-full" v-slot="{isActive}">
        <button  class="w-full h-60px flex items-center" :class="isActive?'text-color62':'text-color99'">
          <img v-show="isActive" class="w-16px min-w-16px" src="~@/assets/nav-message-active.svg" alt="">
          <img v-show="!isActive" class="w-16px min-w-16px" src="~@/assets/nav-message.svg" alt="">
          <span class="ml-8px" :class="newMessage ?  'relative c-badge' : ''">{{$t('slider.info')}}</span>
        </button>
      </router-link>
      <router-link to="/create-curation" class="flex-1 w-full" v-slot="{isActive}">
        <button  class="w-full h-60px flex items-center" :class="isActive?'text-color62':'text-color99'">
          <img v-show="isActive" class="w-16px min-w-16px" src="~@/assets/nav-create-active.svg" alt="">
          <img v-show="!isActive" class="w-16px min-w-16px" src="~@/assets/nav-create.svg" alt="">
          <span class="ml-8px">{{$t('slider.create')}}</span>
        </button>
      </router-link>
      <Menu class="" @show="(data) => {isShowMenu=data}">
        <template #menu-toggle>
          <button class="w-full h-60px flex items-center" :class="isShowMenu?'text-color62':'text-color99'">
            <img v-show="isShowMenu" class="w-16px min-w-16px" src="~@/assets/nav-more-active.svg" alt="">
            <img v-show="!isShowMenu" class="w-16px min-w-16px" src="~@/assets/nav-more.svg" alt="">
            <span class="ml-8px">{{$t('common.more')}}{{$refs.menuBox}}</span>
          </button>
        </template>
      </Menu>
    </div>
    <div class="px-15px xl:px-1rem 2xl:px-2rem">
      <button v-if="!getAccountInfo"
              @click="$emit('login')"
              class="flex justify-center items-center mr-1 w-3/5 h-40px px-13px bg-color62
                     text-white c-text-black text-0.8rem rounded-full">
        {{$t('signIn')}}
      </button>
      <template v-else>
        <UserEnergyBar class="flex items-center gap-15px mb-15px"></UserEnergyBar>
        <router-link :to="`/profile/@${getAccountInfo.twitterUsername}/post`"
                     class="flex items-center">
          <img class="w-50px h-50px min-w-50px min-h-50px rounded-full mr-10px"
              @error="replaceEmptyImg"
              :src="profileImg"
              alt=""/>
          <div class="flex-1 overflow-hidden text-white light:text-color1A">
            <div class="font-bold text-16px leading-20px light:text-blueDark text-left mb-4px">
              {{ getAccountInfo ? getAccountInfo.twitterName : "" }}
            </div>
            <div @click.stop="gotoTwitter"
                 class="cursor-pointer flex items-center">
              <div class="w-14px h-14px min-w-14px min-h-14px p-3px bg-color8B light:bg-black rounded-full mr-5px
                          flex items-center justify-center">
                <img src="~@/assets/icon-twitter-white.svg" alt="">
              </div>
              <span class="text-12px">
                @{{getAccountInfo ? getAccountInfo.twitterUsername : " "}}
              </span>
            </div>
          </div>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import Menu from "@/components/layout/Menu";
import {MAX_RC, MAX_VP} from "@/config";
import UserEnergyBar from "@/components/UserEnergyBar.vue";

export default {
  name: "SliderBar",
  components: {Menu, UserEnergyBar},
  props: {
    profileImg: {
      type: String,
      default: ''
    },
  },
  computed: {
    ...mapState(["rc", 'vp']),
    ...mapGetters(['getAccountInfo']),
    newMessage(){
      const newNoti = this.$store.state.noti.newNotis
      return newNoti && newNoti.length > 0
    }
  },
  data() {
    return {
      searchModalVisible: false,
      MAX_RC,
      MAX_VP,
      isShowMenu: false
    }
  },
  mounted() {
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
