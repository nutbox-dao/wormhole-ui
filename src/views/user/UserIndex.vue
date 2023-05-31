<template>
  <div id="user-index"
       class="overflow-x-hidden h-full flex flex-col no-scroll-bar"
       @scroll="pageScroll"
       ref="userIndexRef">
    <button v-show="scroll>300"
            @click="$refs.userIndexRef.scrollTo({top: 0, behavior: 'smooth'})"
            class="flex items-center justify-center bg-color62
                   h-44px w-44px min-w-44px 2xl:w-2.2rem 2xl:min-w-2.2rem 2xl:h-2.2rem
                   rounded-full mt-0.5rem c-text-bold fixed bottom-12rem right-1.5rem sm:right-2.5rem z-9999">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-arrow-top.svg" alt="">
    </button>
    <template v-if="!loading">
      <div class="container max-w-50rem mx-auto mb-30px px-15px">
        <div class="flex justify-end pt-1rem 2md:hidden">
          <Menu></Menu>
        </div>
        <div class="mt-1rem flex items-center">
          <img
              class="w-6rem h-6rem md:w-4.8rem md:h-4.8rem mr-15px rounded-full gradient-border border-1px"
              @error="replaceEmptyImg"
              :src="profileImg"
              alt=""/>
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
          <div class="flex items-center mx-15px gap-15px 2md:hidden">
            <el-tooltip popper-class="shadow-popper-tip">
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
                    <span class="percentage-value">{{ percentage.toFixed(2) }}%</span>
                  </template>
                </el-progress>
              </button>
            </el-tooltip>
            <el-tooltip popper-class="shadow-popper-tip">
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
                    <span class="percentage-value">{{ percentage.toFixed(2) }}%</span>
                  </template>
                </el-progress>
              </button>
            </el-tooltip>

          </div>
        </div>

        <div class="flex">
          <div class="hidden sm:block w-6rem min-w-6rem h-6rem
                      md:w-4.8rem md:min-w-4.8rem md:max-w-4.8rem md:h-4.8rem mr-15px"></div>
          <div class="w-full sm:max-w-500px">
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
            <div class="p-15px bg-color62/30 light:bg-colorEF mt-1rem flex items-center justify-between rounded-12px">
              <div class="flex-1 flex items-center overflow-hidden mr-20px">
                <div class="w-30px min-w-30px h-30px rounded-full bg-color62 flex justify-center items-center mr-10px">
                  <img class="w-14px" src="~@/assets/icon-wallet.svg" alt="">
                </div>
                <span v-if="getAccountInfo?.ethAddress" class="flex items-center truncate">
                    <span class="flex-1 whitespace-nowrap text-color7D truncate text-12px truncate">
                      {{getAccountInfo ? getAccountInfo.ethAddress : ''}}
                    </span>
                    <img class="w-14px min-w-14px ml-3px mr-8px"
                         @click.stop="copyAddress(getAccountInfo.ethAddress)"
                         src="~@/assets/icon-copy-primary.svg" alt="">
                  </span>
                <span v-else class="whitespace-nowrap text-color7D truncate"> {{$t('tips.notRegisterUser')}}</span>
              </div>
              <button @click="$router.push('/wallet/' + getAccountInfo.twitterUsername + '/wallet')"
                      class="bg-color1A h-30px px-15px rounded-full font-bold text-white text-14px">
                {{$t('community.enter')}}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full sticky -top-1px z-9 2md:top-0 bg-primaryBg light:bg-white shadow-tab sm:shadow-none">
        <div class="text-14px 2md:text-18px font-bold px-15px
                    border-b-0.5px border-color8B/30 light:border-color7F">
          <div class="container mx-auto sm:max-w-30rem flex items-center justify-center">
            <router-link :to="`/profile/${$route.params.user}/post`" v-slot="{isActive}"
                         class="flex-1">
              <button class="w-full h-48px flex items-center justify-center"
                      :class="isActive?'c-active-tab text-color62':'text-color7D'">
                {{$t('profileView.onChainTweet')}}
              </button>
            </router-link>
            <router-link v-if="getAccountInfo && (getAccountInfo.isRegistry === 1 || getAccountInfo.source === 3)"
                         :to="`/profile/${$route.params.user}/curations`" v-slot="{isActive}"
                         class="flex-1">
              <button class="w-full h-48px flex items-center justify-center"
                      :class="isActive?'c-active-tab text-color62':'text-color7D'">
                {{$t('profileView.curations')}}
              </button>
            </router-link>
          </div>
        </div>
      </div>
      <div class="container max-w-50rem mx-auto flex-1 2md:px-15px">
        <div class="sm:bg-blockBg light:sm:bg-transparent light:sm:shadow-color1A my-20px rounded-16px sm:px-15px">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name"/>
            </keep-alive>
            <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name"/>
          </router-view>
        </div>
      </div>
    </template>
    <div class="c-text-black text-1.8rem mb-3rem" v-else>
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <van-popup class="c-tip-drawer 2xl:w-2/5" v-model:show="tipDrawer" :position="position">
      <div class="modal-bg relative w-full md:min-w-560px max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
                  rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:p-1rem">
        <button class="absolute right-20px top-2rem"
                @click="tipDrawer=false">
          <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
        </button>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar pb-2rem text-left">
          <div class="c-text-black mt-1rem mb-2rem text-20px 2xl:text-1rem md:text-center w-full">
            {{$t('postView.tweetTip')}}
          </div>
          <!-- tip post -->
          <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem light:text-color46">
            {{$t('postView.tip1')}}
          </div>
          <div class="bg-black/40 light:bg-colorF2 light:border-1 light:border-colorE3 rounded-1rem h-min-8rem p-1rem relative">
            <div class="text-left break-all 2xl:text-0.8rem text-14px">
              <span class="text-color8F">{content} </span>
              <span class="text-color62">#iweb3</span>
            </div>
            <button
              @click="gotoPost" class="text-color8B flex items-center justify-center border-1px border-color8B rounded-full
                2xl:h-2.2rem text-12px 2xl:text-0.9rem h-28px px-1rem absolute bottom-1rem right-1rem">
              <img
                class="w-1rem h-1rem mr-0.4rem"
                src="~@/assets/icon-twitter.svg"
                alt=""/>
              <span class="text-color8F">{{$t('postView.goTweet')}}</span>
            </button>
          </div>
          <div class="text-white light:text-color7D text-12px 2xl:text-0.8rem 2x:leading-1rem mt-0.5rem italic text-left">
            {{$t('postView.tips')}}:<br />{{$t('postView.p2')}}
          </div>
          <!-- tip tip -->
          <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem">
            {{$t('postView.tip2')}}
          </div>
          <div class="bg-black/40 light:bg-colorF2 light:border-1 light:border-colorE3 rounded-1rem h-min-8rem p-1rem relative">
            <div class="text-left break-all 2xl:text-0.8rem text-14px">
              <span class="text-color62 light:text-color62">@wormhole_3 !tip </span>
              <span class="text-color8F">{0.5 STEEM} to {@vitalik}</span>
            </div>
            <button
              @click="gotoTip"
              class="text-color8B flex items-center justify-center border-1px border-color8B rounded-full
                2xl:h-2.2rem text-12px 2xl:text-0.9rem h-28px px-1rem absolute bottom-1rem right-1rem">
              <img
                class="w-1rem h-1rem mr-0.4rem"
                src="~@/assets/icon-twitter.svg"
                alt=""/>
              <span class="text-color8F">{{$t('postView.goTweet')}}</span>
            </button>
          </div>
          <div class="text-white light:text-color7D text-12px 2xl:text-0.8rem 2x:leading-1rem mt-0.5rem italic text-left">
            {{$t('postView.tips')}}: <br />
            {{$t('postView.p9')}}
          </div>
          <!-- tip send -->
          <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem light:text-color46">
            {{$t('postView.tip3')}}
          </div>
          <div class="bg-black/40 light:bg-colorF2 light:border-1 light:border-colorE3 rounded-1rem h-min-8rem p-1rem relative">
            <div class="text-left break-all 2xl:text-0.8rem text-14px">
              <span class="text-color62 light:text-color62">@wormhole_3 !send </span>
              <span class="text-color8F">{0.5 STEEM} to {wormhole3}</span>
            </div>
            <button
              @click="gotoSend" class="text-color8B flex items-center justify-center border-1px border-color8B rounded-full
                2xl:h-2.2rem text-12px 2xl:text-0.9rem h-28px px-1rem absolute bottom-1rem right-1rem">
              <img
                class="w-1rem h-1rem mr-0.4rem"
                src="~@/assets/icon-twitter.svg"
                alt=""/>
              <span class="text-color8F">{{$t('postView.goTweet')}}</span>
            </button>
          </div>
          <div class="text-white light:text-color7D text-12px 2xl:text-0.8rem 2x:leading-1rem mt-0.5rem italic text-left">
            {{$t('postView.tips')}}:<br />
            {{$t('postView.p3')}}
          </div>
        </div>
      </div>
    </van-popup>
    <el-dialog
      v-model="showRegistering"
      class="c-dialog c-dialog-lg c-dialog-center"
    >
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        {{$t('postView.p4')}}<br />
        {{$t('postView.p5')}}<br />
        <div class="mx-auto">
          <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-model="showNotSendTwitter"
      class="c-dialog c-dialog-lg c-dialog-center"
    >
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        {{$t('postView.p6')}}
      </div>
    </el-dialog>
    <el-dialog v-model="modalVisible" class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <GetNft @close="modalVisible=false" :username="getAccountInfo.twitterUsername" :reputation="getAccountInfo.reputation"></GetNft>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { notify } from "@/utils/notify";
import GetNft from "./components/GetNft.vue";
import { formatPrice, formatAmount } from "@/utils/helper";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { ethers } from "ethers";
import { getTokenBalance } from "@/utils/asset";
import { ERC20List, TWITTER_MONITOR_RULE, SteemScan, TWITTER_POST_TAG, MAX_VP, MAX_RC } from "@/config";
import { getSteemBalance } from "@/utils/steem";
import Menu from "@/components/layout/Menu";
import {copyAddress} from "@/utils/tool";
export default {
  name: "User",
  components: {
    GetNft,
    Menu
  },
  data() {
    return {
      userIsExist: true,
      loading: false,
      tipDrawer: false,
      showRegistering: false,
      showNotSendTwitter: false,
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
    totalValue() {
      let t = 0;
      if (this.steemBalance) {
        // eth
        //  t += this.erc20Balances['ETH'].ETH * this.prices['eth']
        // for (let erc20 in this.erc20Balances["ETH"]) {
        //   t += this.erc20Balances.ETH[erc20] * this.prices[erc20.toLowerCase()];
        // }
        // steem
        t += this.steemBalance * this.prices["steem"];

        // bsc
        // for (let erc20 in this.erc20Balances["BNB"]) {
        //   t += this.erc20Balances.BNB[erc20] * this.prices[erc20.toLowerCase()];
        // }
        //  // polygon
      }
      if(this.getAccountInfo && this.erc20Balances["MATIC"]) {
        for (let erc20 in this.erc20Balances["MATIC"]) {
          t += this.erc20Balances.MATIC[erc20] * (this.prices[erc20.toLowerCase()] ?? 0);
        }
      }
      return formatPrice(t ?? 0);
      return "$0.00";
    },
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
      const { steemId, ethAddress, web25ETH, steemAmount, twitterId } = this.getAccountInfo;
      if (steemId) {
        // get steem balance
        getSteemBalance(steemId)
          .then((balance) => {
            this.$store.commit("saveSteemBalance", balance.steemBalance);
            this.$store.commit("saveSbdBalance", balance.sbdBalance);
          })
          .catch((err) => console.log("get steem balance fail:", err));
      } else {
        this.$store.commit("saveSteemBalance", steemAmount ?? 0);
      }

      //get eth balances
      if (ethAddress) {
        getTokenBalance(ethAddress);
      }
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
