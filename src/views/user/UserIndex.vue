<template>
  <div class="container mx-auto max-w-49rem fade-in overflow-x-hidden h-full flex flex-col no-scroll-bar">
    <template v-if="!loading">
      <div class="px-0.725rem mt-1rem flex items-center">
        <img class="w-8rem h-8rem mr-1.5rem rounded-full gradient-border border-3px" @error="replaceEmptyImg"
             :src="profileImg" alt="">
        <div class="flex-1 flex justify-between sm:flex-row sm:items-center flex-col">
          <div class="text-left ">
            <div class="c-text-bold text-1.8rem gradient-text gradient-text-right">
              {{accountInfo ? accountInfo.twitterName : ''}}
            </div>
            <div class="text-text8F text-1.2rem flex mt-0.7rem font-bold sm:flex-row sm:items-center flex-col">
              <span @click="gotoTwitter" class="mr-0.5rem hover">@{{accountInfo ? accountInfo.twitterUsername : ' '}}</span>
              <div class="flex items-center justify-start sm:mt-0 mt-1rem" v-if="accountInfo && accountInfo.steemId">
                <img class="w-1.1rem h-1.1rem mr-0.5rem" src="~@/assets/icon-checked.svg" alt="">
                <span class="hover" @click="gotoSteem">#{{accountInfo ? accountInfo.steemId : ''}}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:items-center">
            <div class="gradient-text gradient-text-bottom c-text-black text-2.4rem sm:mt-0 mt-0.8rem">{{ totalValue }}</div>
            <button class="flex items-center justify-center gradient-btn h-2.7rem px-1rem rounded-0.6rem mt-0.5rem c-text-medium
                    absolute bottom-2rem left-1/2 transform -translate-x-1/2 sm:relative
                    sm:left-auto sm:bottom-auto sm:transform-none z-2"
                    @click="tipDrawer=true">
              <img class="w-1.5rem h-1.5rem mr-0.5rem" src="~@/assets/icon-warning.svg" alt="">
              Tweet action tips
            </button>
          </div>
        </div>
      </div>
      <div class="bg-blockBg sm:bg-transparent rounded-t-1rem mt-1rem flex-1">
        <div class="border-b-1px border-dividerColor flex text-1.2rem leading-1.5rem c-text-medium">
          <router-link class="flex-1 py-0.8rem px-1rem" :to="`/profile/${$route.params.user}/post`">Social assets</router-link>
          <router-link class="flex-1 py-0.8rem px-1rem" :to="`/profile/${$route.params.user}/wallet`">Web3 wallet</router-link>
        </div>
        <router-view></router-view>
      </div>
    </template>
    <div class="c-text-black text-1.8rem mb-3rem" v-else>
      <img src="~@/assets/profile-loading.gif" alt="">
    </div>
    <van-popup class="c-tip-drawer"
               v-model:show="tipDrawer"
               :position="position">
      <div class="modal-bg w-full md:w-49rem max-h-80vh overflow-auto flex flex-col rounded-t-1.5rem md:rounded-b-1.5rem pt-2rem md:p-2rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-2rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar pb-3rem">
          <div class="gradient-text gradient-text-bottom c-text-black md:text-2rem md:leading-3.6rem text-1.8rem leading-2.4rem w-full">
            Tweet action tips
          </div>
          <div class="text-primaryColor text-0.9rem font-bold">Need to activate your wallet at wormhole3 first.</div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-4rem">
            1. Transfer STEEM/SBD to a twitter account
          </div>
          <div class="bg-black/40 rounded-1rem h-min-10rem p-1rem mt-0.8rem relative">
            <div class="text-left break-all">
              <span class="text-primaryColor">#wormhole3 !send </span>
              <span class="text-text8F">{0.5 STEEM} to {@vitalik}</span>
            </div>
            <button @click="gotoSend" class="text-text53 flex items-center justify-center border-1px border-text53 rounded-full h-2.45rem px-1.7rem absolute bottom-1rem right-1rem">
              <img class="w-1rem h-1rem mr-1rem" src="~@/assets/icon-twitter.svg" alt="">
              <span class="text-white">GO tweet</span>
            </button>
          </div>
          <div class="text-white text-0.8rem leading-1rem mt-0.5rem italic">
            Tips:<br>Please replace {***} to real content.<br> You can replace   {@twitter_username} with a twitter username.
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-2rem">
            2. Add a post  to web3
          </div>
          <div class="bg-black/40 rounded-1rem h-min-10rem p-1rem mt-0.8rem relative">
            <div class="text-left break-all">
              <span class="text-primaryColor">#wormhole3 !post </span>
              <span class="text-white">{content}</span>
            </div>
            <button @click="gotoPost" class="text-text53 flex items-center justify-center border-1px border-text53 rounded-full h-2.45rem px-1.7rem absolute bottom-1rem right-1rem">
              <img class="w-1rem h-1rem mr-1rem" src="~@/assets/icon-twitter.svg" alt="">
              <span class="text-white">GO tweet</span>
            </button>
          </div>
          <div class="text-white text-0.8rem leading-1rem mt-0.5rem italic">
            Tips: <br>   Replace {***} to real content.
          </div>
        </div>
      </div>
    </van-popup>
    <el-dialog v-model="showRegistering" custom-class="c-dialog c-dialog-lg c-dialog-center">
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        Your account is in the process of registration<br>
        Please wait for a moment<br>
        <div class="mx-auto">
          <img src="~@/assets/loading.gif" alt="" class="w-25 mx-auto mt-2rem">
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="showNotSendTwitter" custom-class="c-dialog c-dialog-lg c-dialog-center">
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        You havn't send twitter yet
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { notify } from "@/utils/notify";
import { formatPrice, formatAmount } from '@/utils/helper'
import emptyAvatar from '@/assets/icon-default-avatar.svg'
import { getUserInfo, FetchingStatus } from '@/utils/account'
import { ethers } from 'ethers'
import { getTokenBalance } from '@/utils/asset'
import { ERC20List, TWITTER_MONITOR_RULE, EVM_CHAINS } from '@/config'
import { getSteemBalance } from '@/utils/steem'

export default {
  name: "User",
  data() {
    return {
        userIsExist: true,
        loading: false,
        tipDrawer: false,
        showRegistering: false,
        showNotSendTwitter: false,
        position: document.body.clientWidth < 768?'bottom':'center'
    }
  },
  computed: {
      ...mapState(['accountInfo', 'prices', 'ethBalance', 'erc20Balances', 'steemBalance']),
     totalValue() {
       if (this.erc20Balances && this.erc20Balances.ETH) {
         let t = 0
         // eth
        //  t += this.erc20Balances['ETH'].ETH * this.prices['eth']
         for (let erc20 in this.erc20Balances['ETH']) {
           t += this.erc20Balances.ETH[erc20] * this.prices[erc20.toLowerCase()]
         }
         // steem
         t += this.steemBalance * this.prices['steem']

         // bsc
         for (let erc20 in this.erc20Balances['BNB']) {
           t += this.erc20Balances.BNB[erc20] * this.prices[erc20.toLowerCase()]
         }
        //  // polygon
         for (let erc20 in this.erc20Balances['MATIC']) {
           t += this.erc20Balances.MATIC[erc20] * this.prices[erc20.toLowerCase()]
         }
         return formatPrice(t)
       }
       return '$0.00'
     },
     profileImg() {
      if (!this.accountInfo) return ''
      if (this.accountInfo.profileImg) {
        return this.accountInfo.profileImg.replace('normal', '400x400')
      }else {
        return 'https://profile-images.heywallet.com/' + this.accountInfo.twitterId
      }
     }
  },
  methods: {
      showNotify(message, duration, type) {
          notify({message, duration, type})
      },
     replaceEmptyImg(e) {
        e.target.src = emptyAvatar
     },
     gotoTwitter() {
      window.open('https://twitter.com/' + this.accountInfo.twitterUsername, '__blank')
     },
     gotoSteem() {
      window.open(EVM_CHAINS.STEEM.scan + '@' + this.accountInfo.steemId, '__blank')
     },
     gotoSend() {
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_RULE + ' !send   STEEM to ', '__blank')
     },
     gotoPost() {
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_RULE + ' !post ', '__blank')
     },
     copy(address) {
      if (ethers.utils.isAddress(address)) {
        navigator.clipboard.writeText(address).then(() => {
            this.showNotify('Copied address:'+address, 5000, 'success')
        }, (e) => {
          console.log(e)
        })
      }
     }
  },
  async mounted() {
    const twitterUsername = this.$route.params.user.startsWith('@') ? this.$route.params.user.substring(1) : this.$route.params.user
    // getUserInfo
    if (this.accountInfo && twitterUsername == this.accountInfo.twitterUsername) {
    }else {
        try{
            this.loading = true
            const result = await getUserInfo(twitterUsername, null, status => {
              if (status === FetchingStatus.MATCH_TICKETS) {
              } else if(status === FetchingStatus.REGISTERING) {
                this.showRegistering = true
              } else if(status === FetchingStatus.NOT_SEND_TWITTER) {
                this.showNotSendTwitter = true
              }
            })
            if (!result) {
                console.log('Not exsit');
                this.showNotify('This twitter account is invalid.', 5000, 'error')
                this.$router.push('/')
                return;
            }else {
              if (this.accountInfo) {
              const { steemId, ethAddress, web25ETH } = this.accountInfo

              if (steemId) {
                // get steem balance
                getSteemBalance(steemId).then(balance => {
                  this.$store.commit('saveSteemBalance', balance.steemBalance)
                  this.$store.commit('saveSbdBalance', balance.sbdBalance)
                })
                    .catch(err => console.log('get steem balance fail:', err))
              }else {
                this.$store.commit('saveSteemBalance', 0)
              }

              //get eth balances
              if (ethAddress) {
                getTokenBalance(ethAddress)
              }
            }
            }
        }catch(e) {
            this.showNotify("Server error", 5000, 'error')
            this.$router.push('/')
            return;
        }finally{
          this.loading = false;
        }
    }
  }
}
</script>

<style scoped>
.router-link-active {
  border-bottom: 2px solid var(--primary-custom);
  color: var(--primary-custom);
}
</style>
