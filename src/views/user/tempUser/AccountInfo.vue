<template>
  <div id="user-index"
       class="overflow-x-hidden h-full flex flex-col no-scroll-bar"
       @scroll="pageScroll"
       ref="userIndexRef">
    <button v-show="scroll>100"
            @click="$refs.userIndexRef.scrollTo({top: 0, behavior: 'smooth'})"
            class="flex items-center justify-center bg-color62
                   h-44px w-44px min-w-44px 2xl:w-2.2rem 2xl:min-w-2.2rem 2xl:h-2.2rem
                   rounded-full mt-0.5rem c-text-bold fixed bottom-2rem right-1.5rem sm:right-2.5rem z-9999">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-arrow-top.svg" alt="">
    </button>
    <post-detail v-if="showDetail" :post="post" @hide="showDetail=false"/>
    <template v-else>
      <div class="container mx-auto w-full sm:max-w-50rem sticky top-0 lg:relative bg-primaryBg light:bg-white
                  border-b-1 xs:border-b-0 border-color8B/30 light:border-color7F z-99">
        <div class="flex h-70px justify-center items-center relative">
          <span class="text-20px c-text-black max-w-2/3 truncate lg:hidden">{{accountInfo?.twitterName}}</span>
          <button @click="$router.go(-1)"
                  class="w-20px xs:w-40px h-40px xs:bg-white/20 xs:light:bg-colorF7 rounded-full
                         flex items-center justify-center absolute left-15px">
            <i class="icon-back w-20px h-20px"></i>
          </button>
        </div>
      </div>
      <template v-if="!loading">
        <div class="container max-w-50rem mx-auto mb-30px px-1rem">
          <div class="mt-1rem flex items-center">
            <img class="w-6rem h-6rem md:w-4.8rem md:h-4.8rem mr-15px rounded-full gradient-border border-1px"
                 @error="replaceEmptyImg"
                 :src="profileImg" alt=""/>
            <div class="flex-1 overflow-hidden">
              <div class="font-bold text-20px leading-22px light:text-blueDark text-left mb-8px">
                {{ accountInfo ? accountInfo.twitterName : "" }}
              </div>
              <div @click="gotoTwitter"
                   class="cursor-pointer flex items-center">
                <div class="w-14px h-14px min-w-14px min-h-14px p-3px bg-color8B light:bg-black rounded-full mr-5px
                          flex items-center justify-center">
                  <img src="~@/assets/icon-twitter-white.svg" alt="">
                </div>
                <span class="text-12px">
                  @{{accountInfo ? accountInfo.twitterUsername : " "}}
                </span>
              </div>
            </div>
            <UserEnergyBar class="flex items-center mx-15px gap-15px"
                           :rc-value="Number(rc)"
                           :vp-value="Number(vp)"></UserEnergyBar>
          </div>
          <div class="flex">
            <div class="hidden sm:block w-6rem min-w-6rem h-6rem
                        md:w-4.8rem md:min-w-4.8rem md:max-w-4.8rem md:h-4.8rem mr-15px"></div>
            <div class="w-full sm:max-w-500px">
              <div class="flex gap-5px mt-15px sm:mt-0">
                <button v-if="accountInfo?.reputation > 0"
                        class="border-1 border-color62 px-8px rounded-full text-12px h-20px
                             bg-color62 text-white light:bg-colorF1 light:text-color62 ">
                  Twitter Reputation:{{accountInfo ? accountInfo.reputation : 0}}
                </button>
                <button v-if="accountInfo && accountInfo.steemId"
                        class="border-1 border-color62 px-8px rounded-full text-12px h-20px
                             bg-color62 text-white light:bg-colorF1 light:text-color62 "
                        @click="gotoSteem">
                  #{{ accountInfo ? accountInfo.steemId : "" }}
                </button>
              </div>
              <div class="p-15px bg-color62/30 light:bg-colorEF mt-1rem flex items-center justify-between rounded-12px">
                <div class="flex-1 flex items-center overflow-hidden">
                  <div class="w-30px min-w-30px h-30px rounded-full bg-color62 flex justify-center items-center mr-10px">
                    <img class="w-14px" src="~@/assets/icon-wallet.svg" alt="">
                  </div>
                  <span v-if="accountInfo?.ethAddress" class="flex items-center truncate">
                    <span class="flex-1 whitespace-nowrap text-color7D truncate text-12px truncate">
                      {{accountInfo ? accountInfo.ethAddress : ''}}
                    </span>
                    <img class="w-14px min-w-14px ml-3px mr-8px"
                         @click.stop="copyAddress(accountInfo.ethAddress)"
                         src="~@/assets/icon-copy-primary.svg" alt="">
                  </span>
                  <span v-else class="whitespace-nowrap text-color7D truncate"> {{$t('tips.notRegisterUser')}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full sticky -top-1px z-9 2md:top-0 bg-primaryBg light:bg-white shadow-tab sm:shadow-none">
          <div class="text-14px 2md:text-18px font-bold px-15px
                    border-b-0.5px border-color8B/30 light:border-color7F">
            <div class="container mx-auto sm:max-w-30rem flex items-center justify-center">
              <button class="w-full h-48px flex items-center justify-center"
                      :class="selectIndex===1?'c-active-tab text-color62':'text-color7D'"
                      @click="selectIndex = 1">{{$t('profileView.post')}}</button>
              <button class="w-full h-48px flex items-center justify-center"
                      :class="selectIndex===0?'c-active-tab text-color62':'text-color7D'"
                      @click="selectIndex = 0">{{$t('profileView.curations')}}</button>
            </div>
          </div>
        </div>
        <div class="container max-w-50rem mx-auto flex-1 2md:px-15px">
          <div class="sm:bg-blockBg light:sm:bg-transparent light:sm:shadow-color1A
                      sm:my-20px rounded-16px sm:px-15px">
            <Curations :accountInfo="accountInfo" v-show="selectIndex===0"/>
            <Post v-show="selectIndex === 1"
                  :accountInfo="accountInfo"
                  :steemBalance="steemBalance"
                  :key="$route.params.user"/>
          </div>
        </div>
      </template>
      <div class="py-2rem" v-else>
        <img class="w-5rem mx-auto " src="~@/assets/profile-loading.gif" alt="" />
      </div>
    </template>
    <van-popup class="md:w-600px bg-black light:bg-transparent rounded-t-12px"
               v-model:show="showTip"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="showTip"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden">
          <TipModalVue class="flex-1 mt-40px" :tipToUser="{...accountInfo, username: accountInfo.twitterUsername}" @close="showTip=false" @back="showTip=false"/>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { notify } from "@/utils/notify";
import { formatPrice, formatAmount } from "@/utils/helper";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import Post from './Post'
import WalletView  from "./WalletView";
import Curations from './Curations'
import TipModalVue from "@/components/TipModal.vue";
import { getUserInfo } from "@/utils/account";
import { ethers } from "ethers";
import { getTokenBalance } from "@/utils/asset";
import { ERC20List, TWITTER_MONITOR_RULE, SteemScan, TWITTER_POST_TAG, VP_RECOVER_DAY, MAX_VP, MAX_RC, RC_RECOVER_DAY } from "@/config";
import {getAccountRC, getSteemBalance} from "@/utils/steem";
import {copyAddress} from "@/utils/tool";
import PostDetail from "@/views/post/PostDetail";
import { getUserVPRC } from '@/api/api'
import UserEnergyBar from "@/components/UserEnergyBar.vue";

export default {
  name: "AccountInfo",
  components: {
    Post,
    WalletView,
    Curations,
    TipModalVue,
    PostDetail,
    UserEnergyBar
  },
  data() {
    return {
      userIsExist: true,
      loading: false,
      selectIndex: 1,
      tipDrawer: false,
      showRegistering: false,
      showNotSendTwitter: false,
      position: document.body.clientWidth < 768 ? "bottom" : "center",
      accountInfo: null,
      steemBalance: 0,
      erc20Balances: {},
      ethBalance: 0,
      showDetail: false,
      post: {},
      showTip: false,
      scroll: 0,
      vp: 0,
      rc: 0
    };
  },
  computed: {
    ...mapState([
      "prices"
    ]),
    ...mapGetters(['getAccountInfo']),
    totalValue() {
      if (this.erc20Balances && this.erc20Balances.ETH) {
        let t = 0;
        // eth
        //  t += this.erc20Balances['ETH'].ETH * this.prices['eth']
        for (let erc20 in this.erc20Balances["ETH"]) {
          t += this.erc20Balances.ETH[erc20] * this.prices[erc20.toLowerCase()];
        }
        // steem
        t += this.steemBalance * this.prices["steem"];

        // bsc
        for (let erc20 in this.erc20Balances["BNB"]) {
          t += this.erc20Balances.BNB[erc20] * this.prices[erc20.toLowerCase()];
        }
        //  // polygon
        for (let erc20 in this.erc20Balances["MATIC"]) {
          t +=
            this.erc20Balances.MATIC[erc20] * this.prices[erc20.toLowerCase()];
        }
        return formatPrice(t);
      }
      return "$0.00";
    },
    profileImg() {
      if (!this.accountInfo) return "";
      if (this.accountInfo.profileImg) {
        return this.accountInfo.profileImg.replace("normal", "400x400");
      } else {
        return (
          "https://profile-images.heywallet.com/" +
          this.accountInfo.twitterId
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
        "https://twitter.com/" + this.accountInfo.twitterUsername,
        "__blank"
      );
    },
    gotoSteem() {
      window.open(
        SteemScan + "@" + this.accountInfo.steemId,
        "__blank"
      );
    },
    gotoSend() {
      window.open(
        "https://twitter.com/intent/tweet?text=" +
        TWITTER_MONITOR_RULE +
        " !send   STEEM to ",
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
    tip() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true);
        return;
      }
      this.showTip = true
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
  async mounted() {
    const twitterUsername = this.$route.params.user.startsWith("@")
      ? this.$route.params.user.substring(1)
      : this.$route.params.user;
    // getUserInfo
    try {
      this.loading = true
      this.accountInfo = await getUserInfo(twitterUsername)
      const { twitterId, steemId } = this.accountInfo;

       // get user vp
       getUserVPRC(twitterId).then(res => {
       if (res) {
        let { votingPower, lastUpdateTime, rc, lastUpdateRCTime } = res;
        const now = Date.now();
        let vp = votingPower + (now - lastUpdateTime) * MAX_VP / (VP_RECOVER_DAY * 86400000)
        this.vp = parseFloat((vp > MAX_VP ? MAX_VP : vp) / MAX_VP * 100).toFixed(2);
        rc = rc + (now - lastUpdateRCTime) * MAX_RC / (RC_RECOVER_DAY * 86400000)
        this.rc = parseFloat((rc > MAX_RC ? MAX_RC : rc) / MAX_RC * 100).toFixed(2);
       }
      }).catch(e => {
        console.log(34, e);
      })

    } catch (e) {
      console.log('get user info fail:', e);
    } finally {
      this.loading = false
    }
  },
};
</script>

<style scoped>
.active-tab {
  background-image: linear-gradient(96.99deg, #AE88FE -31.47%, #923CFF 55.23%, #00B2FF 147.53%);
  background-repeat: no-repeat;
  background-size: 100% 0.3rem;
  background-position: center bottom;
}
.dark .inactive-tab {
  background-image: linear-gradient(#8483914D, #8483914D);
  background-repeat: no-repeat;
  background-size: 100% 0.3rem;
  background-position: center bottom;
}
</style>
