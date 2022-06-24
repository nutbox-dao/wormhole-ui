<template>
  <div class="container mx-auto max-w-49rem px-0.725rem fade-in overflow-x-hidden">
    <template v-if="!loading">
      <div class="mt-1rem flex items-center">
        <img class="w-8rem h-8rem mr-1.5rem rounded-full gradient-border border-3px" @error="replaceEmptyImg"
             :src="'https://profile-images.heywallet.com/' + (accountInfo ? accountInfo.twitterId : '')" alt="">
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
                    sm:left-auto sm:bottom-auto sm:transform-none"
                    @click="tipDrawer=true">
              <img class="w-1.5rem h-1.5rem mr-0.5rem" src="~@/assets/icon-warning.svg" alt="">
              Tweet action tips
            </button>
          </div>
        </div>
      </div>
      <template v-if="accountInfo && accountInfo.web25ETH">
        <div class="gradient-bg gradient-bg-color3 rounded-2rem p-0.2rem mt-2.5rem sm:mb-5rem mb-2rem">
          <div class="text-1.4rem font-bold py-0.8rem text-primaryColor bg-primaryBg rounded-t-1.8rem">
            Your binded ETH Address
            <span class="ml-2">👇</span>
          </div>
          <div class="c-text-bold text-1.4rem leading-1.9rem py-1.2rem px-2.1rem break-all flex items-center justify-center">
            {{ accountInfo ? accountInfo.web25ETH : '' }}
            <img class="w-1.5rem h-1.5rem ml-1rem hover"  @click="copy(accountInfo.web25ETH)" src="~@/assets/icon-copy.svg" alt="">
          </div>
        </div>
      </template>
      <div class="border-b-1px border-primaryColor flex text-1.2rem leading-1.5rem c-text-medium gap-1.5rem sm:mt-5rem sm:mb-2rem text-text8F overflow-x-auto no-scroll-bar">
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}`">Tokens</router-link>
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}/nft`">NFTs</router-link>
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}/post`">Posts</router-link>
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}/transaction`">Transactions</router-link>
      </div>
      <router-view></router-view>
    </template>
    <div class="c-text-black text-1.8rem mb-3rem" v-else>
      <img src="~@/assets/profile-loading.gif" alt="">
    </div>
    <el-drawer v-model="tipDrawer"
               :direction="direction"
               :with-header="false"
               :size="direction==='rtl'?560:''"
               custom-class="c-tip-drawer">
      <template #default>
        <div class="w-full bg-dialogBg md:p-5rem py-4rem px-1.5rem md:rounded-1.5rem rounded-t-1.5rem text-left relative">
          <div class="gradient-text gradient-text-bottom c-text-black md:text-2rem md:leading-3.6rem text-1.8rem leading-2.4rem w-full">
            Tweet action tips
          </div>
          <div class="text-primaryColor text-0.9rem font-bold">Need to activate your wallet at wormhole3 first.</div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-4rem">
            1. Transfer ETH/STEEM to a twitter account or an ETH address
          </div>
          <div class="bg-black rounded-1rem h-min-10rem p-1rem mt-0.8rem relative">
            <div class="text-left break-all">
              <span class="text-primaryColor">#wormhole3 !send </span>
              <span class="text-text8F">{0.5 ETH} to {@vitalik}</span>
            </div>
            <button @click="gotoSend" class="text-text53 flex items-center justify-center border-1px border-text53 rounded-full h-2.45rem px-1.7rem absolute bottom-1rem right-1rem">
              <img class="w-1rem h-1rem mr-1rem" src="~@/assets/icon-twitter.svg" alt="">
              <span class="text-white">GO tweet</span>
            </button>
          </div>
          <div class="text-text8F text-0.8rem leading-1rem mt-0.5rem italic">
            tips:    please replace {***} to real content.<br> And you could replace   {@twitter_username} with an ETH address.
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-2rem">
            2. Add a post  to web3
          </div>
          <div class="bg-black rounded-1rem h-min-10rem p-1rem mt-0.8rem relative">
            <div class="text-left break-all">
              <span class="text-primaryColor">#wormhole3 !post </span>
              <span class="text-text8F">{content}</span>
            </div>
            <button @click="gotoPost" class="text-text53 flex items-center justify-center border-1px border-text53 rounded-full h-2.45rem px-1.7rem absolute bottom-1rem right-1rem">
              <img class="w-1rem h-1rem mr-1rem" src="~@/assets/icon-twitter.svg" alt="">
              <span class="text-white">GO tweet</span>
            </button>
          </div>
          <div class="text-text8F text-0.8rem leading-1rem mt-0.5rem italic">
            tips:    replace {***} to real content.
          </div>
          <img v-if="direction==='rtl'"
               @click="tipDrawer=false"
               class="absolute left-1rem top-1/2 translate-y-1/2 w-1rem"
               src="~@/assets/icon-drawer-arrow.svg" alt="">
          <img v-else @click="tipDrawer=false"
               class="absolute transform top-1rem left-1/2 translate-x-1/2 w-1rem rotate-90"
               src="~@/assets/icon-drawer-arrow.svg" alt="">
        </div>
      </template>
    </el-drawer>
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
import { ERC20List } from '@/config';
import { getUserInfo, FetchingStatus } from '@/utils/account'
import { ethers } from 'ethers'

export default {
  name: "User",
  data() {
    return {
        userIsExist: true,
        loading: false,
        tipDrawer: false,
        showRegistering: false,
        showNotSendTwitter: false,
        direction: document.body.clientWidth < 560?'btt':'rtl'
    }
  },
  computed: {
      ...mapState(['accountInfo', 'prices', 'ethBalance', 'erc20Balances', 'steemBalance']),
     totalValue() {
       if (this.prices && this.ethBalance >= 0 && this.erc20Balances && this.steemBalance >= 0) {
         let t = 0
         t += this.ethBalance * this.prices['eth']
         t += this.steemBalance * this.prices['steem']
         for (let erc20 of ERC20List) {
           t += this.erc20Balances[erc20.symbol] * this.prices[erc20.symbol.toLowerCase()]
         }
         return formatPrice(t)
       }
       return '$0.00'
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
      window.open('https://steemit.com/@' + this.accountInfo.steemId, '__blank')
     },
     gotoSend() {
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_RULE + ' !send   ETH to ', '__blank')
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
.router-link-exact-active {
  background-image: linear-gradient(to bottom, var(--gradient-primary-color1), var(--gradient-primary-color2));
  border-radius: 8px 8px 0 0;
  color: white;
}
</style>
