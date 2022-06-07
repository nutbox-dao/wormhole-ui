<template>
  <div class="container mx-auto max-w-49rem px-0.725rem fade-in">
    <template v-if="userIsExist">
      <div class="mt-4rem flex justify-between items-center">
        <div class="flex items-center">
          <img class="w-8rem h-8rem rounded-full gradient-border border-3px" @error="replaceEmptyImg"
               :src="'https://profile-images.heywallet.com/' + (accountInfo ? accountInfo.id : '')" alt="">
          <div class="text-left ml-1.5rem">
            <div class="c-text-bold text-1.8rem gradient-text gradient-text-right">
              {{accountInfo ? accountInfo.name : ''}}
            </div>
            <div class="text-text8F text-1.2rem flex items-center mt-0.7rem font-bold">
              <span>@{{accountInfo ? accountInfo.username : ' '}}</span>
              <template v-if="accountInfo && accountInfo.steemId">
                <img class="w-1.1rem h-1.1rem mx-0.5rem" src="~@/assets/icon-checked.svg" alt="">
                <span class="ml-1rem">#{{accountInfo ? accountInfo.steemId : ''}}</span>
              </template>
            </div>
          </div>
        </div>
        <div class="gradient-text gradient-text-bottom c-text-black text-2.4rem">{{ totalValue }}</div>
      </div>
      <template v-if="accountInfo && accountInfo.ethAddress">
        <div class="gradient-bg gradient-bg-color3 rounded-2rem p-0.2rem mt-2.5rem mb-5rem">
          <div class="text-1.4rem font-bold py-0.8rem text-primaryColor bg-primaryBg rounded-t-1.8rem">
            Your binded ETH Address
            <span class="ml-2">👇</span>
          </div>
          <div class="c-text-bold text-1.4rem leading-1.9rem py-1.2rem px-2.1rem break-all">
            {{ accountInfo ? accountInfo.ethAddress : '' }}
          </div>
        </div>
      </template>
      <div class="border-b-1px border-primaryColor flex text-1.2rem leading-1.5rem c-text-medium gap-1.5rem mt-5rem mb-4rem text-text8F">
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}`">Tokens</router-link>
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}/nft`">NFTs</router-link>
        <router-link class="py-0.2rem px-1rem" :to="`/profile/${$route.params.user}/transaction`">Transactions</router-link>
      </div>
      <router-view></router-view>
    </template>
    <div v-else class="gradient-border border-4px max-w-40rem mx-auto py-2.5rem px-2rem my-5rem">
      <div class="c-text-black text-1.8rem mb-3rem">
        This Twitter account doesn’t exist. Try searching for another.
      </div>
      <router-link to="/" class="underline text-1rem">Retry</router-link>
    </div>
  </div>

</template>

<script>
import { getSteemBalance } from '@/utils/steem'
import { mapState } from 'vuex'
import { getTwitterAccount, getUserBindInfo, getRegisterOp } from '@/api/api'
import { notify } from "@/utils/notify";
import { formatPrice, formatAmount } from '@/utils/helper'
import emptyAvatar from '@/assets/icon-default-avatar.svg'
import { getTokenBalance, getMainChainBalance } from '@/utils/asset'
import { ERC20List } from '@/config';

export default {
  name: "User",
  data() {
    return {
        userIsExist: true
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
  
        if (this.accountInfo && twitterUsername == this.accountInfo.twitterUsername) {
        }else {
            // check twitter account
            try{
                const account = await getTwitterAccount(twitterUsername)
                if (account.errors && account.errors.length > 0) {
                    console.log('Not exsit');
                    this.showNotify('This twitter account is invalid.', 5000, 'error')
                    this.$router.push('/')
                    return;
                }else {
                    // get bind account
                    const bindInfo = await getUserBindInfo(account.data.id)
  
                    // store bind account
                    this.$store.commit('saveAccountInfo', {...JSON.parse(bindInfo), ...account.data})
                }
            }catch(e) {
                this.showNotify("Server error", 5000, 'error')
                this.$router.push('/')
                return;
            }
        }
        // get and show account balance
        const { steemId, ethAddress } = this.accountInfo
        if (steemId) {
            // get steem balance
            getSteemBalance(steemId).then(balance => this.$store.commit('saveSteemBalance', balance))
                .catch(err => console.log('get steem balance fail:', err))
        }
        if (ethAddress) {
            //get eth balances
            getTokenBalance(ethAddress)
            getMainChainBalance(ethAddress)
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
