<template>
  <div id="user-index" class="overflow-x-hidden h-full flex flex-col no-scroll-bar" ref="wrapper">
    <template v-if="!loading">
      <div class="border-b-0 md:border-b-1 md:border-color84/30">
        <div class="container max-w-50rem mx-auto">
          <div class="px-1rem mt-1rem flex items-center">
            <img
                class="w-6rem h-6rem md:w-4.8rem md:h-4.8rem mr-1.5rem rounded-full gradient-border border-1px"
                @error="replaceEmptyImg"
                :src="profileImg"
                alt=""/>
            <div class="flex-1 flex justify-between sm:flex-row sm:items-center flex-col items-start">
              <div class="text-left">
                <div class="c-text-black text-1.6rem light:text-blueDark">
                  {{ getAccountInfo ? getAccountInfo.twitterName : "" }}
                </div>
                <div class="text-text8F text-0.8rem flex mt-0.7rem font-bold sm:flex-row sm:items-center flex-col">
                  <div @click="gotoTwitter"
                       class="cursor-pointer mr-0.5rem w-max flex items-center
                              text-color8B light:text-color7D
                              bg-white/10 light:bg-colorF2
                              light:border-1 light:border-colorE3
                              rounded-full h-1.8rem md:1rem px-0.5rem">
                    <img class="w-1.5rem md:w-1rem mr-0.3rem" src="~@/assets/icon-twitter-blue.svg" alt="">
                    <span>@{{getAccountInfo ? getAccountInfo.twitterUsername : " "}}</span>
                  </div>
                  <div class="flex items-center justify-start sm:mt-0 mt-0.5rem text-color8B"
                      v-if="getAccountInfo && getAccountInfo.steemId">
<!--                    <img-->
<!--                        class="w-0.8rem h-0.8rem mr-0.5rem"-->
<!--                        src="~@/assets/icon-checked.svg"-->
<!--                        alt=""-->
<!--                    />-->
                    <span class="hover" @click="gotoSteem">
                      #{{ getAccountInfo ? getAccountInfo.steemId : "" }}
                      </span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:items-center">
                <div class="c-text-black text-1.2rem md:text-2rem sm:mt-0 mt-0.8rem light:text-blueDark">
                  {{ totalValue }}
                </div>
                <template v-if="getAccountInfo && (getAccountInfo.source === 1 || getAccountInfo.source ===3)">
                  <button v-if="getAccountInfo.isRegistry === 1 && $route.name === 'profile-curations'"
                          class="flex items-center justify-center gradient-btn gradient-btn-shadow h-2.7rem px-1rem
                                rounded-full mt-0.5rem c-text-bold absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
                          @click="$router.push('/create-curation')">
                    {{$t('curationsView.createBtn')}}
                  </button>
                  <button v-else-if="getAccountInfo.source === 3 && getAccountInfo.isRegistry === 0" class="text-0.8rem md:text-1rem whitespace-nowrap flex items-center justify-center gradient-btn gradient-btn-shadow
                            h-2.7rem px-1rem rounded-full mt-0.5rem c-text-bold absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
                      @click="$router.push('/signup')">
                      <img
                          class="w-1.5rem h-1.5rem mr-0.5rem"
                          src="~@/assets/icon-warning.svg"
                          alt=""
                      />
                      {{$t('common.active')}}
                  </button>
                  <button v-else class="text-0.8rem md:text-1rem whitespace-nowrap flex items-center justify-center gradient-btn gradient-btn-shadow
                            h-2.7rem px-1rem rounded-full mt-0.5rem c-text-bold absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
                      @click="tipDrawer = true">
                    <img
                        class="w-1.5rem h-1.5rem mr-0.5rem"
                        src="~@/assets/icon-warning.svg"
                        alt=""
                    />
                    {{ $t('postView.tweetTip')}}
                  </button>
                </template>
                <button v-else class="flex items-center justify-center gradient-btn gradient-btn-shadow h-2.7rem px-1rem
                    rounded-full mt-0.5rem c-text-bold absolute bottom-2rem left-1/2 transform-translate-x-1/2 z-2"
                    @click="$router.push('/signup')">
                    {{$t('common.active')}}
                  </button>
              </div>
            </div>
          </div>

          <div class="bg-blockBg light:bg-white  light:md:bg-transparent md:bg-transparent rounded-t-1rem mt-1rem">
            <div class="flex text-15px 2xl:text-0.75rem leading-1.5rem c-text-medium md:max-w-30rem mx-auto">
              <router-link
                  class="flex-1 py-0.5rem px-1rem text-color8B"
                  :to="`/profile/${$route.params.user}/post`"
              >{{$t('profileView.socialAsset')}}</router-link>
              <router-link
                  v-if="getAccountInfo && (getAccountInfo.isRegistry === 1 || getAccountInfo.source === 3)"
                  class="flex-1 py-0.5rem px-1rem text-color8B"
                  :to="`/profile/${$route.params.user}/curations`" >{{$t('profileView.curations')}}</router-link>
              <router-link
                  class="flex-1 py-0.5rem px-1rem text-color8B"
                  :to="`/profile/${$route.params.user}/wallet`"
              >{{$t('profileView.web3Wallet')}}</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-blockBg light:bg-white  light:md:bg-transparent md:bg-transparent container max-w-50rem mx-auto flex-1 pb-2rem sm:px-1rem">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name"/>
          </keep-alive>
          <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name"/>
        </router-view>
      </div>
    </template>
    <div class="c-text-black text-1.8rem mb-3rem" v-else>
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <van-popup class="c-tip-drawer 2xl:w-2/5" v-model:show="tipDrawer" :position="position">
      <div class="modal-bg w-full md:min-w-560px max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:p-1rem">
        <div
          v-if="position === 'bottom'"
          @click="modalVisible = false"
          class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"
        ></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar pb-2rem text-left">
          <div class="c-text-black my-2rem md:text-1.6rem md:leading-2rem text-1.2rem leading-1.6rem md:text-center w-full">
            {{$t('postView.tweetTip')}}
          </div>
          <!-- tip post -->
          <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem light:text-color46">
            {{$t('postView.tip1')}}
          </div>
          <div class="bg-black/40 light:bg-colorF2 light:border-1 light:border-colorE3 rounded-1rem h-min-8rem p-1rem relative">
            <div class="text-left break-all 2xl:text-0.8rem text-14px">
              <span class="text-color8F">{content} </span>
              <span class="text-primaryColor">#iweb3</span>
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
              <span class="text-primaryColor light:text-color62">@wormhole_3 !tip </span>
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
              <span class="text-primaryColor light:text-color62">@wormhole_3 !send </span>
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
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { notify } from "@/utils/notify";
import { formatPrice, formatAmount } from "@/utils/helper";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { ethers } from "ethers";
import { getTokenBalance } from "@/utils/asset";
import { ERC20List, TWITTER_MONITOR_RULE, EVM_CHAINS, TWITTER_POST_TAG } from "@/config";
import { getSteemBalance } from "@/utils/steem";

export default {
  name: "User",
  data() {
    return {
      userIsExist: true,
      loading: false,
      tipDrawer: false,
      showRegistering: false,
      showNotSendTwitter: false,
      position: document.body.clientWidth < 768 ? "bottom" : "center",
    };
  },
  computed: {
    ...mapState([
      "accountInfo",
      "prices",
      "ethBalance",
      "erc20Balances",
      "steemBalance",
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
        EVM_CHAINS.STEEM.scan + "@" + this.getAccountInfo.steemId,
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
      const { steemId, ethAddress, web25ETH, steemAmount } = this.getAccountInfo;
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
      const { steemId, ethAddress, web25ETH, steemAmount } = this.getAccountInfo;
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
};
</script>

<style scoped lang="scss">
.dark .router-link-active, .light .router-link-active {
  background-image: linear-gradient(96.99deg, #AE88FE -31.47%, #923CFF 55.23%, #00B2FF 147.53%);
  background-repeat: no-repeat;
  background-size: 100% 0.3rem;
  background-position: center bottom;
}
.dark a{
  background-image: linear-gradient(#8483914D, #8483914D);
  background-repeat: no-repeat;
  background-size: 100% 0.3rem;
  background-position: center bottom;
  color: #8B949E;
}
.dark .router-link-active {
  color: white;
}
.light a {
  color: #7D7F88;
}
.light .router-link-active {
  color: #1A1E25;
}
</style>
