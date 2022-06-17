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
              <span class="mr-0.5rem">@{{accountInfo ? accountInfo.twitterUsername : ' '}}</span>
              <div class="flex items-center justify-start sm:mt-0 mt-1rem" v-if="accountInfo && accountInfo.steemId">
                <img class="w-1.1rem h-1.1rem mr-0.5rem" src="~@/assets/icon-checked.svg" alt="">
                <span>#{{accountInfo ? accountInfo.steemId : ''}}</span>
              </div>
            </div>
          </div>
          <div class="gradient-text gradient-text-bottom c-text-black text-2.4rem sm:mt-0 mt-0.8rem">{{ totalValue }}</div>
        </div>
      </div>
      <template v-if="accountInfo && accountInfo.ethAddress">
        <div class="gradient-bg gradient-bg-color3 rounded-2rem p-0.2rem mt-2.5rem sm:mb-5rem mb-2rem">
          <div class="text-1.4rem font-bold py-0.8rem text-primaryColor bg-primaryBg rounded-t-1.8rem">
            Your binded ETH Address
            <span class="ml-2">👇</span>
          </div>
          <div class="c-text-bold text-1.4rem leading-1.9rem py-1.2rem px-2.1rem break-all">
            {{ accountInfo ? accountInfo.ethAddress : '' }}
          </div>
        </div>
      </template>
      <div class="border-b-1px border-primaryColor flex text-1.2rem leading-1.5rem c-text-medium gap-1.5rem sm:mt-5rem sm:mb-4rem text-text8F">
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}`">Tokens</router-link>
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}/nft`">NFTs</router-link>
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}/post`">Posts</router-link>
      </div>
      <router-view></router-view>
    </template>
    <div class="c-text-black text-1.8rem mb-3rem" v-else>
      <img src="~@/assets/profile-loading.gif" alt="">
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import { notify } from "@/utils/notify";
import { formatPrice, formatAmount } from '@/utils/helper'
import emptyAvatar from '@/assets/icon-default-avatar.svg'
import { ERC20List } from '@/config';
import { getUserInfo, FetchingStatus } from '@/utils/account'

export default {
  name: "User",
  data() {
    return {
        userIsExist: true,
        loading: false
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
  },
  async mounted() {
    const twitterUsername = this.$route.params.user.startsWith('@') ? this.$route.params.user.substring(1) : this.$route.params.user
    // getUserInfo
    if (this.accountInfo && twitterUsername == this.accountInfo.twitterUsername) {
    }else {
        try{
            this.loading = true
            const result = await getUserInfo(twitterUsername, null, status => {
              // if (status === FetchingStatus.MATCH_TICKETS) {
              // } else if(status === FetchingStatus.REGISTERING) {
              //   this.showRegistering = true
              // } else if(status === FetchingStatus.NOT_SEND_TWITTER) {
              //   this.showNotSendTwitter = true
              // }
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
