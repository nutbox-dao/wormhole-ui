<template>
  <div class="w-13rem 2xl:w-15rem min-w-200px flex flex-col justify-between
              border-r-0.5px border-headerBorder light:border-headerBorderLight pb-2rem"
       :class="$route.name==='word-cloud'?'filter-link':''">
    <div class="flex flex-col items-start gap-5px px-15px xl:px-1rem 2xl:px-2rem text-18px">
      <router-link to="/community" class="flex-1 w-full" v-slot="{isActive}">
        <button  class="w-full h-60px flex items-center brightness-0" :class="isActive?'text-color62':'text-color99'">
          <img v-show="isActive" class="w-16px min-w-16px" src="~@/assets/nav-community-active.svg" alt="">
          <img v-show="!isActive" class="w-16px min-w-16px" src="~@/assets/nav-community.svg" alt="">
          <span class="ml-8px">{{$t('slider.community')}}</span>
        </button>
      </router-link>
      <router-link to="/square" class="flex-1 w-full" v-slot="{isActive}">
        <button class="w-full h-60px flex items-center brightness-0" :class="isActive?'text-color62':'text-color99'">
          <img v-show="isActive" class="w-16px min-w-16px" src="~@/assets/nav-home-active.svg" alt="">
          <img v-show="!isActive" class="w-16px min-w-16px" src="~@/assets/nav-home.svg" alt="">
          <span class="ml-8px">{{$t('slider.square')}}</span>
        </button>
      </router-link>
      <!-- <router-link to="/influence" class="flex-1 w-full" v-slot="{isActive}">
        <button  class="w-full h-60px flex items-center brightness-0" :class="isActive?'text-color62':'text-color99'">
          <img v-show="isActive" class="w-16px min-w-16px" src="~@/assets/nav-influence-active.svg" alt="">
          <img v-show="!isActive" class="w-16px min-w-16px" src="~@/assets/nav-influence.svg" alt="">
          <span class="ml-8px">{{$t('slider.influence')}}</span>
        </button>
      </router-link> -->
      <router-link to="/info" class="flex-1 w-full" v-slot="{isActive}">
        <button class="w-full h-60px flex items-center brightness-0" :class="isActive?'text-color62':'text-color99'">
          <img v-show="isActive" class="w-16px min-w-16px" src="~@/assets/nav-message-active.svg" alt="">
          <img v-show="!isActive" class="w-16px min-w-16px" src="~@/assets/nav-message.svg" alt="">
          <span class="ml-8px" :class="newMessage ?  'relative c-badge' : ''">{{$t('slider.info')}}</span>
        </button>
      </router-link>
      <router-link :to="`/wallet/${getAccountInfo?.twitterUsername ?? 'template'}/reward`"
                   class="flex-1 w-full" v-slot="{isActive}">
        <button class="w-full h-60px flex items-center brightness-0"
                 :class="isActive || isWallet?'text-color62':'text-color99'">
          <img v-show="isActive || isWallet"
               class="w-16px min-w-16px" src="~@/assets/nav-wallet-active.svg" alt="">
          <img v-show="!isActive && !isWallet"
               class="w-16px min-w-16px" src="~@/assets/nav-wallet.svg" alt="">
          <span class="ml-8px">{{$t('slider.wallet')}}</span>
        </button>
      </router-link>
      <router-link v-if="getAccountInfo&&getAccountInfo.twitterUsername"
                   :to="`/profile/@${getAccountInfo.twitterUsername}/post`"
                   class="flex-1 w-full" v-slot="{isActive}">
        <button  class="w-full h-60px flex items-center brightness-0"
                 :class="isActive || isProfile?'text-color62':'text-color99'">
          <img v-show="isActive || isProfile"
               class="w-16px min-w-16px" src="~@/assets/nav-profile-active.svg" alt="">
          <img v-show="!isActive && !isProfile"
               class="w-16px min-w-16px" src="~@/assets/nav-profile.svg" alt="">
          <span class="ml-8px">{{$t('slider.mine')}}</span>
        </button>
      </router-link>
      <Menu class="" @show="(data) => {isShowMenu=data}">
        <template #menu-toggle>
          <button class="w-full h-60px flex items-center brightness-0" :class="isShowMenu?'text-color62':'text-color99'">
            <img v-show="isShowMenu" class="w-16px min-w-16px" src="~@/assets/nav-more-active.svg" alt="">
            <img v-show="!isShowMenu" class="w-16px min-w-16px" src="~@/assets/nav-more.svg" alt="">
            <span class="ml-8px">{{$t('common.more')}}{{$refs.menuBox}}</span>
          </button>
        </template>
      </Menu>
      <router-link v-if="getAccountInfo" to="/create-curation" class="flex-1 w-full" v-slot="{isActive}">
        <button  class="w-full h-44px flex justify-center items-center bg-color62 text-white rounded-full">
          <span class="mr-8px font-bold">{{$t('slider.create')}}</span>
          <img class="w-16px h-16px" src="~@/assets/icon-add-white.svg" alt="">
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
        <UserEnergyBar class="flex items-center gap-15px"></UserEnergyBar>
        <el-popover popper-class="c-popper" trigger="click" :teleported="showLogout" placement="top-start">
          <template #reference>
            <div class="flex items-center cursor-pointer">
              <img class="w-50px h-50px min-w-50px min-h-50px rounded-full mr-10px"
                   @error="replaceEmptyImg"
                   :src="profileImg"
                   alt=""/>
              <div class="flex-1 overflow-hidden text-white light:text-color1A">
                <div class="font-bold text-16px leading-20px light:text-blueDark text-left mb-4px brightness-0">
                  {{ getAccountInfo ? getAccountInfo.twitterName : "" }}
                </div>
                <div @click.stop="gotoTwitter"
                     class="cursor-pointer flex items-center">
                  <div class="w-14px h-14px min-w-14px min-h-14px p-3px bg-color8B light:bg-black rounded-full mr-5px
                          flex items-center justify-center">
                    <img src="~@/assets/icon-twitter-white.svg" alt="">
                  </div>
                  <span class="text-12px brightness-0">
                    @{{getAccountInfo ? getAccountInfo.twitterUsername : " "}}
                  </span>
                </div>
              </div>
            </div>
          </template>
          <button class="h-46px flex justify-between items-center px-15px min-w-160px
                           bg-blockBg light:bg-white light:shadow-color1A rounded-full"
                  @click="signout">
            <span>{{$t('logout')}}</span>
            <i class="w-14px min-w-14px h-14px icon-logout"></i>
          </button>
        </el-popover>
      </template>
      <div class="hidden 2md:flex items-center gap-15px mt-25px">
        <button class="h-24px w-24px bg-color8B light:bg-blueDark rounded-full
                           flex items-center justify-center"
                @click="gotoDC">
          <img class="w-14px min-w-14px h-14px" src="~@/assets/icon-discord.svg" alt="">
        </button>
        <button class="h-24px w-24px bg-color8B light:bg-blueDark rounded-full
                           flex items-center justify-center"
                @click="gotoOfficialTwitter">
          <img class="w-14px min-w-14px h-14px" src="~@/assets/icon-twitter-white.svg" alt="">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import Menu from "@/components/layout/Menu";
import {MAX_RC, MAX_VP} from "@/config";
import UserEnergyBar from "@/components/UserEnergyBar.vue";
import {logout} from "@/utils/account";

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
    },
    isWallet() {
      return /^\/wallet/.test(this.$route.path)
    },
    isProfile() {
      return /^\/profile/.test(this.$route.path)
    }
  },
  data() {
    return {
      searchModalVisible: false,
      MAX_RC,
      MAX_VP,
      isShowMenu: false,
      showLogout: false
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
          "https://twitter.com/" + this.getAccountInfo?.twitterUsername,
          "__blank"
      );
    },
    signout() {
      // this.$refs.menuBox.hide()
      logout(this.getAccountInfo.twitterId).then(res => {
      });
      if (this.$route.meta.gotoHome) {
        this.$router.replace('/')
      }
    },
    gotoDC() {
      // this.$refs.menuBox.hide()
      window.open('https://discord.gg/6QbcvSEDWF', '__blank')
    },
    gotoOfficialTwitter(){
      // this.$refs.menuBox.hide()
      window.open('https://twitter.com/wormhole_3', '__blank')
    },
  }
}
</script>

<style scoped lang="scss">
.router-link-active {
  color: #7851FF;
}
</style>
