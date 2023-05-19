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
            <img
                class="w-60px h-60px md:w-4.8rem md:h-4.8rem mr-1.5rem rounded-full gradient-border border-1px"
                @error="replaceEmptyImg"
                :src="profileImg"
                alt=""/>
            <div class="flex-1 overflow-hidden">
              <div class="c-text-black text-16px xl:text-1rem light:text-blueDark mr-5px text-left mb-10px">
                {{ accountInfo ? accountInfo.twitterName : "" }}
              </div>
              <div @click="gotoTwitter"
                   class="cursor-pointer mr-0.5rem w-max flex items-center
                                  text-color8B light:text-color7D
                                  bg-white/10 light:bg-colorF2
                                  light:border-1 light:border-colorE3
                                  rounded-full min-h-24px h-1.4rem md:1rem px-0.5rem">
                <img class="w-16px 2xl:w-1.2rem md:w-1rem mr-0.3rem" src="~@/assets/icon-twitter-blue.svg" alt="">
                <span class="text-12px 2xl:text-0.7rem">@{{accountInfo ? accountInfo.twitterUsername : " "}}</span>
              </div>
            </div>
            <div class="flex items-center mx-15px gap-15px">
              <el-tooltip popper-class="shadow-popper-tip">
                <template #content>
                  <span class="text-color8B light:text-color7D whitespace-nowrap text-12px">
                    {{$t('postView.resourceCredits')}}
                  </span>
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
                               :percentage="Number(rc)">
                    <template #default="{ percentage }">
                      <span class="percentage-value">{{ percentage }}%</span>
                    </template>
                  </el-progress>
                </button>
              </el-tooltip>
              <el-tooltip popper-class="shadow-popper-tip">
                <template #content>
                  <span class="text-color8B light:text-color7D whitespace-nowrap text-12px">
                    {{$t('postView.votingPower')}}
                  </span>
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
                               :percentage="Number(vp)">
                    <template #default="{ percentage }">
                      <span class="percentage-value">{{ percentage }}%</span>
                    </template>
                  </el-progress>
                </button>
              </el-tooltip>

            </div>
          </div>
          <div class="flex">
            <div class="hidden sm:block w-60px h-60px md:w-4.8rem md:h-4.8rem mr-1.5rem"></div>
            <div class="w-full sm:max-w-500px">
              <div class="flex gap-20px mt-15px">
                <div v-if="accountInfo?.reputation > 0"
                     class="flex items-center justify-start text-color7D/60 cursor-pointer">
                  Twitter Reputation:{{accountInfo ? accountInfo.reputation : 0}}
                </div>
                <div class="flex items-center justify-start text-color7D/60 cursor-pointer"
                     v-if="accountInfo && accountInfo.steemId"
                     @click="gotoSteem">
                  #{{ accountInfo ? accountInfo.steemId : "" }}
                </div>
              </div>
              <div class="p-15px bg-color62/30 light:bg-colorEF mt-1rem flex items-center justify-between rounded-12px">
                <div class="flex-1 flex items-center overflow-hidden mr-20px">
                  <div class="w-30px min-w-30px h-30px rounded-full bg-color62/20 flex justify-center items-center mr-10px">
                    <i class="icon-wallet w-15px h-15px min-w-15px"></i>
                  </div>
                  <span v-if="accountInfo?.ethAddress" class="flex items-center truncate">
                    <span class="flex-1 whitespace-nowrap text-color7D truncate text-12px truncate">
                      Address:{{accountInfo ? accountInfo.ethAddress : ''}}
                    </span>
                    <img class="w-16px min-w-16px light:opacity-30 ml-3px mr-8px"
                         @click.stop="copyAddress(accountInfo.ethAddress)"
                         src="~@/assets/icon-copy-primary.svg" alt="">
                  </span>
                  <span v-else class="whitespace-nowrap text-color7D truncate"> {{$t('tips.notRegisterUser')}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="border-b-1 border-color84/30 sticky -top-1px z-9 bg-primaryBg light:bg-white">
          <div class="bg-blockBg sm:bg-transparent overflow-hidden
                      light:bg-white light:sm:bg-transparent pt-7px">
            <div class="flex overflow-hidden text-16px xl:text-0.9rem font-bold md:max-w-30rem mx-auto">
              <div class="flex-1 h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4 cursor-pointer"
                   :class="selectIndex===1?'text-color62 border-color62':'text-color7D border-transparent'"
                   @click="selectIndex = 1">{{$t('profileView.post')}}</div>
              <div class="flex-1 h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4 cursor-pointer"
                   :class="selectIndex===0?'text-color62 border-color62':'text-color7D border-transparent'"
                   @click="selectIndex = 0">{{$t('profileView.curations')}}</div>
            </div>
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:sm:bg-transparent sm:bg-transparent
                      container max-w-50rem mx-auto flex-1 pb-2rem sm:px-1rem">
          <Curations :accountInfo="accountInfo" v-show="selectIndex===0"/>
          <Post v-show="selectIndex === 1"
                :accountInfo="accountInfo"
                :steemBalance="steemBalance"
                :key="$route.params.user"/>
        </div>
      </template>
      <div class="c-text-black text-1.8rem mb-3rem" v-else>
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
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

export default {
  name: "AccountInfo",
  components: {
    Post,
    WalletView,
    Curations,
    TipModalVue,
    PostDetail
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
