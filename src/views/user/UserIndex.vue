<template>
  <div
      id="user-index"
    class="
      overflow-x-hidden
      h-full
      flex flex-col
      no-scroll-bar
    "
    ref="wrapper"
  >
    <template v-if="!loading">
      <div class="md:border-b-1 border-listBgBorder md:border-b-1 border-white/20">
        <div class="container max-w-50rem mx-auto">
          <div class="px-1rem mt-1rem flex items-center">
            <img
                class="
                w-6rem
                h-6rem
            md:w-4.8rem
            md:h-4.8rem
            mr-1.5rem
            rounded-full
            gradient-border
            border-1px
          "
                @error="replaceEmptyImg"
                :src="profileImg"
                alt=""
            />
            <div
                class="
            flex-1 flex
            justify-between
            sm:flex-row sm:items-center
            flex-col
          "
            >
              <div class="text-left">
                <div
                    class="c-text-black text-1.6rem"
                >
                  {{ getAccountInfo ? getAccountInfo.twitterName : "" }}
                </div>
                <div
                    class="
                text-text8F text-0.8rem
                flex
                mt-0.7rem
                font-bold
                sm:flex-row sm:items-center
                flex-col
              "
                >
                  <div @click="gotoTwitter" class="cursor-pointer mr-0.5rem w-max flex items-center text-color8B bg-white/10 rounded-full h-1.8rem md:1rem px-0.5rem">
                    <img class="w-1.5rem md:w-1rem mr-0.3rem" src="~@/assets/icon-twitter-blue.svg" alt="">
                    <span>@{{getAccountInfo ? getAccountInfo.twitterUsername : " "}}</span>
                  </div>
                  <div
                      class="flex items-center justify-start sm:mt-0 mt-0.5rem text-color8B"
                      v-if="getAccountInfo && getAccountInfo.steemId"
                  >
<!--                    <img-->
<!--                        class="w-0.8rem h-0.8rem mr-0.5rem"-->
<!--                        src="~@/assets/icon-checked.svg"-->
<!--                        alt=""-->
<!--                    />-->
                    <span class="hover" @click="gotoSteem"
                    >#{{ getAccountInfo ? getAccountInfo.steemId : "" }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="flex flex-col sm:items-center">
                <div
                    class="

                c-text-black
                text-1.2rem
                md:text-2rem
                sm:mt-0
                mt-0.8rem
              "
                >
                  {{ totalValue }}
                </div>
                <button
                    class="text-0.8rem md:text-1rem whitespace-nowrap
                flex
                items-center
                justify-center
                gradient-btn
                gradient-btn-shadow
                h-2.7rem
                px-1rem
                rounded-full
                mt-0.5rem
                c-text-bold
                absolute
                bottom-2rem
                left-1/2
                transform
                -translate-x-1/2
                z-2
              "
                    @click="tipDrawer = true"
                >
                  <img
                      class="w-1.5rem h-1.5rem mr-0.5rem"
                      src="~@/assets/icon-warning.svg"
                      alt=""
                  />
                  Tweet action tips
                </button>
              </div>
            </div>
          </div>
          <div class="bg-blockBg md:bg-transparent rounded-t-1rem mt-1rem">
            <div class="flex text-1.1rem md:text-1.2rem leading-1.5rem c-text-medium md:max-w-30rem mx-auto">
              <router-link
                  class="flex-1 py-0.8rem px-1rem border-b-2 md:border-b-4px border-dividerColor text-color8B"
                  :to="`/profile/${$route.params.user}/post`"
              >Social assets</router-link
              >
              <router-link
                  class="flex-1 py-0.8rem px-1rem border-b-2 md:border-b-4px border-dividerColor text-color8B"
                  :to="`/profile/${$route.params.user}/wallet`"
              >Web3 wallet</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div class="bg-blockBg md:bg-transparent container max-w-50rem mx-auto flex-1 pb-2rem sm:px-1rem">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name"/>
          </keep-alive>
          <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name"/>
        </router-view>
      </div>
    </template>
    <div class="c-text-black text-1.8rem mb-3rem" v-else>
      <img src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <van-popup
      class="c-tip-drawer 2xl:w-2/5"
      v-model:show="tipDrawer"
      :position="position"
    >
      <div
        class="
          modal-bg
          w-full
          md:min-w-560px
          max-h-80vh
          2xl:max-h-28rem
          overflow-auto
          flex flex-col
          rounded-t-1.5rem
          md:rounded-b-1.5rem
          pt-1rem
          md:p-1rem
        "
      >
        <div
          v-if="position === 'bottom'"
          @click="modalVisible = false"
          class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"
        ></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar pb-2rem text-left">
          <div
            class="
              c-text-black
              md:text-1.6rem md:leading-2rem text-1.2rem leading-1.6rem
              md:text-center
              w-full
            "
          >
            Tweet action tips
          </div>
          <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem">
            1. Transfer STEEM/SBD to a twitter account
          </div>
          <div
            class="
              bg-black/40
              rounded-1rem
              h-min-8rem
              p-1rem
              relative
            "
          >
            <div class="text-left break-all 2xl:text-0.8rem text-14px">
              <span class="text-primaryColor">#wormhole3 !send </span>
              <span class="text-text8F">{0.5 STEEM} to {@vitalik}</span>
            </div>
            <button
              @click="gotoSend"
              class="
                text-color8B
                flex
                items-center
                justify-center
                border-1px border-color8B
                rounded-full
                2xl:h-2.2rem
                text-12px
                2xl:text-0.9rem
                h-28px
                px-1rem
                absolute
                bottom-1rem
                right-1rem
              "
            >
              <img
                class="w-1rem h-1rem mr-0.4rem"
                src="~@/assets/icon-twitter.svg"
                alt=""
              />
              <span class="text-text8F">GO tweet</span>
            </button>
          </div>
          <div class="text-white text-12px 2xl:text-0.8rem 2x:leading-1rem mt-0.5rem italic text-left">
            Tips:<br />Please replace {***} to real content.<br />
            You can replace {@twitter_username} with a twitter username.
          </div>
          <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem">
            2. Add a post to web3
          </div>
          <div
            class="
              bg-black/40
              rounded-1rem
              h-min-8rem
              p-1rem
              relative
            "
          >
            <div class="text-left break-all 2xl:text-0.8rem text-14px">
              <span class="text-text8F">{content} </span>
              <span class="text-primaryColor">#iweb3</span>
            </div>
            <button
              @click="gotoPost"
              class="
                text-color8B
                flex
                items-center
                justify-center
                border-1px border-color8B
                rounded-full
                2xl:h-2.2rem
                text-12px
                2xl:text-0.9rem
                h-28px
                px-1rem
                absolute
                bottom-1rem
                right-1rem
              "
            >
              <img
                class="w-1rem h-1rem mr-0.4rem"
                src="~@/assets/icon-twitter.svg"
                alt=""
              />
              <span class="text-text8F">GO tweet</span>
            </button>
          </div>
          <div class="text-white text-12px 2xl:text-0.8rem 2x:leading-1rem mt-0.5rem italic text-left">
            Tips: <br />
            Replace {***} to real content.
          </div>
        </div>
      </div>
    </van-popup>
    <el-dialog
      v-model="showRegistering"
      custom-class="c-dialog c-dialog-lg c-dialog-center"
    >
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        Your account is in the process of registration<br />
        Please wait for a moment<br />
        <div class="mx-auto">
          <img
            src="~@/assets/loading.gif"
            alt=""
            class="w-25 mx-auto mt-2rem"
          />
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-model="showNotSendTwitter"
      custom-class="c-dialog c-dialog-lg c-dialog-center"
    >
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        You havn't send twitter yet
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { notify } from "@/utils/notify";
import { formatPrice, formatAmount } from "@/utils/helper";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { login, FetchingStatus } from "@/utils/account";
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
    if (
      this.getAccountInfo &&
      twitterUsername == this.getAccountInfo.twitterUsername
    ) {
      const { steemId, ethAddress, web25ETH } = this.getAccountInfo;

      if (steemId) {
        // get steem balance
        getSteemBalance(steemId)
          .then((balance) => {
            this.$store.commit("saveSteemBalance", balance.steemBalance);
            this.$store.commit("saveSbdBalance", balance.sbdBalance);
          })
          .catch((err) => console.log("get steem balance fail:", err));
      } else {
        this.$store.commit("saveSteemBalance", 0);
      }


      //get eth balances
      if (ethAddress) {
        getTokenBalance(ethAddress);
      }
    } else {
      this.$router.replace('/')
      return;
      try {
        this.loading = true;
        const result = await login(twitterUsername, null, (status) => {
          if (status === FetchingStatus.MATCH_TICKETS) {
          } else if (status === FetchingStatus.REGISTERING) {
            this.showRegistering = true;
          } else if (status === FetchingStatus.NOT_SEND_TWITTER) {
            this.showNotSendTwitter = true;
          }
        });
        if (!result) {
          console.log("Not exsit");
          this.showNotify("This twitter account is invalid.", 5000, "error");
          this.$router.push("/");
          return;
        } else {
          if (this.getAccountInfo) {
            const { steemId, ethAddress, web25ETH } = this.getAccountInfo;

            if (steemId) {
              // get steem balance
              getSteemBalance(steemId)
                .then((balance) => {
                  this.$store.commit("saveSteemBalance", balance.steemBalance);
                  this.$store.commit("saveSbdBalance", balance.sbdBalance);
                })
                .catch((err) => console.log("get steem balance fail:", err));
            } else {
              this.$store.commit("saveSteemBalance", 0);
            }

            //get eth balances
            if (ethAddress) {
              getTokenBalance(ethAddress);
            }
          }
        }
      } catch (e) {
        this.showNotify("Server error", 5000, "error");
        this.$router.push("/");
        return;
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped lang="scss">
.router-link-active {
  box-sizing: border-box;
  color: white;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 5px;
    background: linear-gradient(93.84deg, #9120EE 0%, #AE88FE 181.77%);
    border-radius: 1px;
    bottom: -5px;
    left: 0;
  }
}
@media (max-width: 768px) {
  .router-link-active {
    &::after {
      height: 2px;
      bottom: -2px;
    }
  }
}
</style>
