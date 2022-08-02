<template>
  <div class="h-full flex flex-col">
    <div class="container mx-auto max-w-50rem" v-if="!showDetail">
      <div class="px-0.725rem relative h-3rem flex items-center justify-center md:mb-1rem">
        <img class="absolute left-1rem top-1/2 transform -translate-y-1/2 rotate-180 md:w-2.5rem w-2rem cursor-pointer"
             @click="$router.back()"
             src="~@/assets/icon-forward-circle.svg" alt="">
        <div class="c-text-bold md:text-1.2rem text-1.5rem max-w-3/5">{{ accountInfo ? accountInfo.twitterName : "" }}</div>
      </div>
    </div>
    <div id="user-index" class=" overflow-x-hidden h-full flex flex-col no-scroll-bar" ref="wrapper">
      <post-detail v-if="showDetail" :post="post" @hide="showDetail=false"/>
      <div v-show="!showDetail">
        <template v-if="!loading">
          <div class="border-b-2 border-listBgBorder md:border-b-1 border-white/20">
            <div class="container max-w-50rem mx-auto">
              <div class="px-1rem mt-1rem flex items-center">
                <img class="
              w-6rem
              h-6rem
              md:w-4.8rem
              md:h-4.8rem
              mr-1.5rem
              rounded-full
              gradient-border
              border-3px
            " @error="replaceEmptyImg" :src="profileImg" alt="" />
              <div class="
              flex-1 flex
              justify-between
              sm:flex-row sm:items-center
              flex-col
            ">
                  <div class="text-left">
                    <div class="c-text-black text-1.6rem">
                      {{ accountInfo ? accountInfo.twitterName : "" }}
                    </div>
                    <div class="
                  text-text8F text-0.8rem
                  flex
                  mt-0.7rem
                  font-bold
                  sm:flex-row sm:items-center
                  flex-col
                ">
                    <span @click="gotoTwitter" class="mr-0.5rem hover">@{{
                        accountInfo ? accountInfo.twitterUsername : " "
                      }}</span>
                      <div class="flex items-center justify-start sm:mt-0 mt-0.5rem"
                           v-if="accountInfo && accountInfo.steemId">
                        <img class="w-0.8rem h-0.8rem mr-0.5rem" src="~@/assets/icon-checked.svg" alt="" />
                        <span class="hover" @click="gotoSteem">#{{ accountInfo ? accountInfo.steemId : "" }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col sm:items-center">
                    <div class="
                  gradient-text gradient-text-bottom
                  c-text-black
                  text-1.2rem
                  md:text-2rem
                  sm:mt-0
                  mt-0.8rem
                ">
                    {{ totalValue }}
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-blockBg md:bg-transparent rounded-t-1rem mt-1rem">
              <div class="flex text-1.2rem leading-1.5rem c-text-medium md:max-w-30rem mx-auto">
                <div  class="flex-1 py-0.8rem px-1rem cursor-pointer"
                      :class="selectIndex===0?'border-b-2 border-primaryColor text-primaryColor':''"
                      @click="selectIndex = 0">Social assets</div>
                <div  class="flex-1 py-0.8rem px-1rem cursor-pointer"
                      :class="selectIndex===1?'border-b-2 border-primaryColor text-primaryColor':''"
                      @click="selectIndex = 1">Web3 wallet</div>
                <!-- <router-link class="flex-1 py-0.8rem px-1rem" :to="`/account-info/${$route.params.user}/post`">Social assets
                </router-link>
                <router-link class="flex-1 py-0.8rem px-1rem" :to="`/account-info/${$route.params.user}/wallet`">Web3 wallet
                </router-link> -->
              </div>
            </div>
          </div>
        </div>
        <div class="bg-blockBg md:bg-transparent container max-w-50rem mx-auto flex-1 pb-2rem sm:px-1rem">
          <component is="post" v-show="selectIndex === 0"
            :accountInfo="accountInfo"
            :steemBalance="steemBalance"
            :key="$route.params.user"
            @gotoDetail="gotoPostDetail"/>
          <wallet-view v-if="selectIndex === 1" :accountInfo="accountInfo" :steemBalance="steemBalance" :erc20Balances="erc20Balances"/>
          <!-- <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
            </keep-alive>
            <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name" />
          </router-view> -->
        </div>
      </template>
      <div class="c-text-black text-1.8rem mb-3rem" v-else>
        <img src="~@/assets/profile-loading.gif" alt="" />
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { notify } from "@/utils/notify";
import { formatPrice, formatAmount } from "@/utils/helper";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import Post from './Post'
import WalletView  from "./WalletView";
import PostDetail from "./PostDetail";
import { getUserInfo, FetchingStatus } from "@/utils/account";
import { ethers } from "ethers";
import { getTokenBalance } from "@/utils/asset";
import { ERC20List, TWITTER_MONITOR_RULE, EVM_CHAINS } from "@/config";
import { getSteemBalance } from "@/utils/steem";

export default {
  name: "AccountInfo",
  components: {
    Post,
    WalletView,
    PostDetail
  },
  data() {
    return {
      userIsExist: true,
      loading: false,
      selectIndex: 0,
      tipDrawer: false,
      showRegistering: false,
      showNotSendTwitter: false,
      position: document.body.clientWidth < 768 ? "bottom" : "center",
      accountInfo: null,
      steemBalance: 0,
      erc20Balances: {},
      ethBalance: 0,
      showDetail: false,
      post: {}
    };
  },
  computed: {
    ...mapState([
      "prices"
    ]),
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
        EVM_CHAINS.STEEM.scan + "@" + this.accountInfo.steemId,
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
        TWITTER_MONITOR_RULE +
        " !post ",
        "__blank"
      );
    },
    gotoPostDetail(post) {
      this.post = post
      this.showDetail = true
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
      const { steemId, ethAddress } = this.accountInfo;

      if (steemId) {
        // get steem balance
        getSteemBalance(steemId)
          .then((balance) => {
            this.steemBalance = balance.steemBalance
          })
          .catch((err) => console.log("get steem balance fail:", err));
      } else {
      }

      if (ethAddress) {
        this.erc20Balances = await getTokenBalance(ethAddress, false);

      }
    } catch (e) {

    } finally {
      this.loading = false
    }

  },
};
</script>

<style scoped>
.router-link-active {
  border-bottom: 2px solid var(--primary-custom);
  color: var(--primary-custom);
}
</style>
