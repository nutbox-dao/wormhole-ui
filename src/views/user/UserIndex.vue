<template>
  <div class="container mx-auto max-w-42rem px-0.725rem fade-in">
    <div class="mt-4rem flex justify-between items-center">
      <div class="flex items-center">
        <img class="w-8rem h-8rem rounded-full"
             :src="'https://profile-images.heywallet.com/' + (accountInfo ? accountInfo.id : '')" alt="">
        <div class="text-left ml-1.5rem">
          <div class="c-text-black text-1.8rem">{{accountInfo ? accountInfo.name : ''}}</div>
          <div class="text-text8F flex items-center mt-0.5rem">
            <span>@{{accountInfo ? accountInfo.username : ''}}</span>
            <span class="ml-1rem" v-if="accountInfo && accountInfo.steemId">#{{accountInfo ? accountInfo.steemId : ''}}</span>
          </div>
        </div>
      </div>
      <div class="gradient-text gradient-text-bottom c-text-black text-3.2rem">$0.0</div>
    </div>
    <template v-if="accountInfo && accountInfo.ethAddress">
      <div class="text-1.6rem c-text-medium font-bold my-1.5rem">
        Your binded ETH Address
        <span class="ml-2">👇</span>
      </div>
      <div class="c-text-black text-1.2rem leading-1.8rem gradient-border border-4px rounded-1rem p-1rem break-all user-key">
        {{ accountInfo ? accountInfo.ethAddress : '' }}
      </div>
    </template>
    <div class="border-b-1px border-dark-50 flex text-1.2rem c-text-medium gap-1.5rem my-1.5rem">
      <router-link class="py-1rem" :to="`/profile/${$route.params.user}`">Tokens</router-link>
      <router-link class="py-1rem" :to="`/profile/${$route.params.user}/nft`">NFTs</router-link>
      <router-link class="py-1rem" :to="`/profile/${$route.params.user}/transaction`">Transactions</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSteemBalance } from '@/utils/steem'
import { mapState } from 'vuex'
import { getTwitterAccount, getUserBindInfo, getRegisterOp } from '@/api/api'
import { notify } from "@/utils/notify";

export default {
  name: "User",
  data() {
    return {
    }
  },
  data() {
    return {
        steemBalance: 0
    }
  },
  computed: {
      ...mapState(['accountInfo']),
  },
  methods: {
      showNotify(message, duration, type) {
          notify({message, duration, type})
      },
  },
  async mounted() {
    const twitterUsername = this.$route.params.user.startsWith('@') ? this.$route.params.user.substring(1) : this.$route.params.user
        
        if (this.accountInfo && twitterUsername == this.accountInfo.twitterUsername) {
        }else {
            // check twitter account
            try{
                const account = await getTwitterAccount(twitterUsername)
                console.log(7323, account);
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
                    console.log(325, this.accountInfo);
                }
            }catch(e) {
                this.showNotify(e, 5000, 'error')
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
        }
  }
}
</script>

<style scoped>
.router-link-exact-active {
  color:  var(--primary-custom);
  border-bottom: 1px solid var(--primary-custom);
}
.user-key {
  /*animation: pulsate-fwd 2s ease-in-out infinite both;*/
}
@keyframes pulsate-fwd {
 0% {
   transform: scale(1);
 }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
</style>
