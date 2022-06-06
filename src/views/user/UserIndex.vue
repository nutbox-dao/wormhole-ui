<template>
  <div class="container mx-auto max-w-42rem px-0.725rem fade-in">
    <div class="mt-4rem flex justify-between items-center">
      <div class="flex items-center">
        <img class="w-8rem h-8rem rounded-full"
             :src="userInfo.profileImageUrl" alt="">
        <div class="text-left ml-1.5rem">
          <div class="c-text-black text-1.8rem">{{userInfo.name}}</div>
          <div class="text-text8F flex items-center mt-0.5rem">
            <span>@{{userInfo.username}}</span>
            <span class="ml-1rem">#{{userInfo.number}}</span>
          </div>
        </div>
      </div>
      <div class="gradient-text gradient-text-bottom c-text-black text-3.2rem">$0.0</div>
    </div>
    <div class="text-1.6rem c-text-medium font-bold my-1.5rem">
      Deposit SOL into your new wallet
      <span class="ml-2">👇</span>
    </div>
    <div class="c-text-black text-1.2rem leading-1.8rem gradient-border border-4px rounded-1rem p-1rem break-all user-key">
      {{userInfo.walletPublicKey}}
    </div>

    <div class="border-b-1px border-dark-50 flex text-1.2rem c-text-medium gap-1.5rem my-1.5rem">
      <router-link class="py-1rem" :to="`/${$route.params.user}`">Tokens</router-link>
      <router-link class="py-1rem" :to="`/${$route.params.user}/nft`">NFTs</router-link>
      <router-link class="py-1rem" :to="`/${$route.params.user}/transaction`">Transactions</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      userInfo: {
        claimed: true,
        name: "terry3t",
        number: 44783,
        profileImageUrl: "https://profile-images.heywallet.com/1412585243085844481",
        username: "terry3t1",
        walletPublicKey: "2AoUZoTCNMbjTgrUnq7EMme6Z5WG95UKgAqUJPqRugK1",
        whitelisted: false
      }
    }
  },
  mounted() {
    console.log(this.$route.params)
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
