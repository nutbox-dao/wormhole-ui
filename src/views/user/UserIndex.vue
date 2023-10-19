<template>
  <div id="user-index"
       class="overflow-x-hidden h-full flex flex-col no-scroll-bar lg:px-15px"
       @scroll="pageScroll"
       ref="userIndexRef">
    <button v-show="scroll>300"
            @click="$refs.userIndexRef.scrollTo({top: 0, behavior: 'smooth'})"
            class="flex items-center justify-center bg-color62
                   h-40px w-40px min-w-40px 2xl:w-2rem 2xl:min-w-2rem 2xl:h-2rem
                   rounded-full mt-0.5rem c-text-bold fixed bottom-10rem 2md:bottom-2rem right-1.5rem sm:right-2.5rem z-9999">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-arrow-top.svg" alt="">
    </button>
    <div class="container max-w-50rem mx-auto grid grid-cols-1 2md:grid-cols-5 xl:grid-cols-3 gap-15px sm:my-15px">
      <div class="col-span-1 2md:col-span-3 xl:col-span-2 p-15px sm:bg-blockBg light:sm:bg-white sm:rounded-16px">
        <div class="flex justify-end 2md:hidden">
          <Menu></Menu>
        </div>
        <div class="mt-1rem flex items-center">
          <img class="w-6rem h-6rem md:w-4.8rem md:h-4.8rem mr-15px rounded-full gradient-border border-1px"
                @error="replaceEmptyImg"
                :src="profileImg" alt=""/>
          <div class="flex-1 overflow-hidden">
            <div class="font-bold text-20px leading-22px light:text-blueDark text-left mb-8px">
              {{ getAccountInfo ? getAccountInfo.twitterName : "" }}
            </div>
            <div @click="gotoTwitter"
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
          <UserEnergyBar class="flex items-center mx-15px gap-15px 2md:hidden"></UserEnergyBar>
        </div>
        <div class="flex overflow-hidden 2md:-mt-15px">
          <div class="hidden sm:block w-6rem min-w-6rem h-6rem
                    md:w-4.8rem md:min-w-4.8rem md:max-w-4.8rem md:h-4.8rem mr-15px"></div>
          <div class="flex-1 overflow-hidden sm:max-w-500px">
            <div class="flex gap-5px mt-15px sm:mt-0">
              <button v-if="getAccountInfo?.reputation > 0"
                      class="border-1 border-color62 px-8px rounded-full text-12px h-20px
                            bg-color62 text-white light:bg-colorF1 light:text-color62 ">
                Twitter Reputation:{{getAccountInfo ? getAccountInfo.reputation : 0}}
              </button>
              <button v-if="getAccountInfo && getAccountInfo.steemId"
                      class="border-1 border-color62 px-8px rounded-full text-12px h-20px
                            bg-color62 text-white light:bg-colorF1 light:text-color62 "
                      @click="gotoSteem">
                #{{ getAccountInfo ? getAccountInfo.steemId : "" }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="2md:col-span-2 xl:col-span-1 hidden 2md:flex flex-col gap-15px">
        <div class="flex-1 bg-blockBg light:bg-white rounded-16px py-20px px-1/10 flex items-center justify-between gap-20px">
          <div class="h-60px overflow-hidden relative">
            <HalfCircleProgress class="c-progress-dashboard w-100px h-100px relative"
                                type="dashboard"
                                color="#68E796"
                                :stroke-width="10"
                                :width="100"
                                :percentage="Number(rc) / MAX_RC * 100">
              <template #default><span></span></template>
              <template #label><span></span></template>
            </HalfCircleProgress>
          </div>
          <div class="flex-1">
            <div class="c-text-black text-20px mb-20px">{{(Number(rc) / MAX_RC * 100).toFixed(2)}}%</div>
            <div class="flex items-center justify-between">
              <span class="text-color8B text-14px">OP</span>
              <el-tooltip popper-class="shadow-popper-tip" :show-after="1500">
                <template #content>
                  <div class="max-w-14rem text-white light:text-blueDark">
                    {{$t('postView.p1')}}
                  </div>
                </template>
                <button>
                  <img src="~@/assets/icon-warning-grey.svg" alt="">
                </button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="flex-1 bg-blockBg light:bg-white rounded-16px py-20px px-1/10 flex items-center justify-between gap-20px">
          <div class="h-60px overflow-hidden relative">
            <HalfCircleProgress class="c-progress-dashboard w-100px h-100px relative"
                                type="dashboard"
                                color="#7700E0"
                                :stroke-width="10"
                                :width="100"
                                :percentage="Number(vp) / MAX_VP * 100">
              <template #default><span></span></template>
              <template #label><span></span></template>
            </HalfCircleProgress>
          </div>
          <div class="flex-1">
            <div class="c-text-black text-20px mb-20px">{{(Number(vp) / MAX_VP * 100).toFixed(2)}}%</div>
            <div class="flex items-center justify-between">
              <span class="text-color8B text-14px">VP</span>
              <el-tooltip popper-class="shadow-popper-tip" :show-after="1500">
                <template #content>
                  <div class="max-w-14rem text-white light:text-blueDark">
                    {{$t('postView.vpDes')}}
                  </div>
                </template>
                <button>
                  <img src="~@/assets/icon-warning-grey.svg" alt="">
                </button>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container max-w-50rem mx-auto flex-1 bg-blockBg light:bg-white light:shadow-color1A
                sm:rounded-16px sm:mb-15px">
      <div class="w-full sticky top-0 z-9 bg-blockBg light:bg-white rounded-t-16px shadow-tab sm:shadow-none">
        <div class="text-14px 2md:text-18px font-bold px-15px
                    border-b-0.5px border-color8B/30 light:border-color7F">
          <div class="container mx-auto sm:max-w-30rem flex items-center justify-center">
            <div class="flex-1">
              <button class="w-full h-48px flex items-center justify-center"
                      :class="selectedTab == 0?'c-active-tab text-color62':'text-color7D'"
                      @click="selectedTab=0">
                {{ $t('profileView.onChainTweet') }}
              </button>
            </div>
            <div class="flex-1">
              <button class="w-full h-48px flex items-center justify-center"
                      :class="selectedTab == 1?'c-active-tab text-color62':'text-color7D'"
                      @click="selectedTab=1">
                {{ $t('profileView.liked') }}
              </button>
            </div>
            <div class="flex-1">
              <button class="w-full h-48px flex items-center justify-center"
                      :class="selectedTab == 2?'c-active-tab text-color62':'text-color7D'"
                      @click="selectedTab=2">
                {{ $t('profileView.quoted') }}
              </button>
            </div>
            <div class="flex-1">
              <button class="w-full h-48px flex items-center justify-center"
                      :class="selectedTab == 3?'c-active-tab text-color62':'text-color7D'"
                      @click="selectedTab=3">
                {{ $t('profileView.retweeted') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="text-14px xl:text-0.8rem sm:p-1rem">
        <Post :selected="selectedTab"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { notify } from "@/utils/notify";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { ethers } from "ethers";
import { ERC20List, TWITTER_MONITOR_RULE, SteemScan, TWITTER_POST_TAG, MAX_VP, MAX_RC } from "@/config";
import Menu from "@/components/layout/Menu";
import {copyAddress} from "@/utils/tool";
import UserEnergyBar from "@/components/UserEnergyBar.vue";
import HalfCircleProgress from "@/components/HalfCircleProgress.vue";
import Post from './Post.vue'

export default {
  name: "User",
  components: {
    Menu,
    Post,
    UserEnergyBar,
    HalfCircleProgress
  },
  data() {
    return {
      userIsExist: true,
      loading: false,
      tipDrawer: false,
      showRegistering: false,
      showNotSendTwitter: false,
      selectedTab: 0,
      modalVisible: false,
      position: document.body.clientWidth < 768 ? "bottom" : "center",
      scroll: 0,
      MAX_VP,
      MAX_RC
    };
  },
  computed: {
    ...mapState([
      "accountInfo",
      "prices",
      "ethBalance",
      "erc20Balances",
      "steemBalance",
      "rc",
      'vp'
    ]),
    ...mapGetters(["getAccountInfo"]),
    profileImg() {
      if (!this.getAccountInfo) return "";
      if (this.getAccountInfo.profileImg) {
        return this.getAccountInfo.profileImg.replace("normal", "400x400");
      } else {
        return (
          "https://profile-images.heywallet.com/" +
          this.getAccountInfo.twitterId
        );
      }
    },
  },
  methods: {
    copyAddress,
    pageScroll() {
      this.scroll = this.$refs.userIndexRef.scrollTop
    },
    showNotify(message, duration, type) {
      notify({ message, duration, type });
    },
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    gotoTwitter() {
      window.open(
        "https://twitter.com/" + this.getAccountInfo.twitterUsername,
        "__blank"
      );
    },
    gotoSteem() {
      window.open(
        SteemScan + "@" + this.getAccountInfo.steemId,
        "__blank"
      );
    },
    gotoSend() {
      window.open(
        "https://twitter.com/intent/tweet?text=" +
          TWITTER_MONITOR_RULE +
          " !send  STEEM to ",
        "__blank"
      );
    },
    gotoTip(){
      window.open(
        "https://twitter.com/intent/tweet?text=" +
          TWITTER_MONITOR_RULE +
          " !tip  STEEM to ",
        "__blank"
      );
    },
    gotoPost() {
      window.open(
        "https://twitter.com/intent/tweet?text=" +
          TWITTER_POST_TAG,
        "__blank"
      );
    },
    copy(address) {
      if (ethers.utils.isAddress(address)) {
        navigator.clipboard.writeText(address).then(
          () => {
            this.showNotify("Copied address:" + address, 5000, "success");
          },
          (e) => {
            console.log(e);
          }
        );
      }
    },
  },
  async activated() {
    const twitterUsername = this.$route.params.user.startsWith("@")
      ? this.$route.params.user.substring(1)
      : this.$route.params.user;
    // getUserInfo
    if (
      this.getAccountInfo &&
      twitterUsername == this.getAccountInfo.twitterUsername
    ) {

    } else {
      this.$router.replace('/')
    }
  },
  async mounted() {
    const twitterUsername = this.$route.params.user.startsWith("@")
      ? this.$route.params.user.substring(1)
      : this.$route.params.user;
    // getUserInfo
    if (
      this.getAccountInfo &&
      twitterUsername == this.getAccountInfo.twitterUsername
    ) {

    } else {
      this.$router.replace('/')
    }
  },
};
</script>

<style scoped lang="scss">
</style>
