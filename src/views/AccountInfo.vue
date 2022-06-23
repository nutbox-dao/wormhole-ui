<template>
  <div class="container mx-auto max-w-49rem px-0.725rem py-3rem">
    <img class="w-8rem h-8rem mx-auto rounded-full gradient-border border-3px"
         src="~@/assets/icon-default-avatar.svg" alt="">
    <div class="text-text8F text-1.8rem font-bold mt-1.2rem">@terry3t1</div>
    <div class="c-text-black text-3.2rem gradient-text gradient-text-right mx-auto leading-3.6rem flex">
      <span>Web3  wallet</span>
      <img class="ml-1rem mt-0.5rem w-1.3rem h-1.3rem cursor-pointer"
           @click="tipDrawer=true"
           src="~@/assets/icon-question.svg" alt="">
    </div>
    <div class="text-left text-1.2rem mt-4.6rem">1. Web3 ETH wallet address</div>
    <div class="gradient-bg gradient-bg-color3 rounded-2rem p-0.2rem mt-0.8rem mb-3rem">
      <div class="text-1.4rem font-bold py-1rem text-primaryColor bg-primaryBg rounded-t-1.8rem">
        Web3 ETH Address
      </div>
      <div class="c-text-bold text-1.2rem leading-1.9rem py-1.2rem px-2.1rem break-all flex items-center justify-center">
        2AoUZoTCNMbjTgrUnq7EMme6Z5WG95UKgAqUJPqRugK1
        <img class="w-1.5rem h-1.5rem ml-1rem" src="~@/assets/icon-copy.svg" alt="">
      </div>
    </div>
    <div class="text-left text-1.2rem">
      2. One-click transfer of assets from Wormhole3 wallet to Web3 wallet
    </div>
    <div class="border-1px border-text8F rounded-1rem h-min-10rem p-1rem mt-0.8rem relative">
      <div class="text-left break-all">
        <span class="text-primaryColor">#wormhole3 !send </span>
        <span class="text-text8F">all ETH to 0x77B8DF624d19c8f537E22397fCa899836E539e74</span>
      </div>
      <button class="text-text53 flex items-center justify-center border-1px border-text53 rounded-full h-2.45rem px-1.7rem absolute bottom-1rem right-1rem">
        <img class="w-1rem h-1rem mr-1rem" src="~@/assets/icon-twitter.svg" alt="">
        <span class="text-white">GO tweet</span>
      </button>
    </div>
    <div class="text-primaryColor italic text-1.2rem text-left leading-1.5rem mt-0.8rem">
      tips: please confirm that the receiving wallet address is your own web3 wallet address.
    </div>
    <el-drawer v-model="tipDrawer"
               :direction="direction"
               :with-header="false"
               :size="direction==='rtl'?560:''"
               custom-class="c-tip-drawer">
      <template #default>
        <div class="w-full bg-dialogBg md:p-5rem py-4rem px-1.5rem md:rounded-1.5rem rounded-t-1.5rem text-left relative">
          <div class="gradient-text gradient-text-bottom c-text-black md:text-2rem md:leading-3.6rem text-1.8rem leading-2.4rem text-center w-full">
            What is a wormhole3 <br>
            wallet or web3 wallet?
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-4rem">
            1. Transfer ETH/STEEM to a twitter account or an ETH address
          </div>
          <div class="text-text8F text-0.8rem leading-1rem mt-0.5rem">
            tips:    please replace {***} to real content. and also you could replace   {@twitter_username} with a wallet address.
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-2rem">
            2. Add a post  to web3
          </div>
          <div class="text-text8F text-0.8rem leading-1rem mt-0.5rem">
            tips:    replace {***} to real content.
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-2rem">
            3. Add a post  to web3
          </div>
          <div class="text-text8F text-0.8rem leading-1rem mt-0.5rem">
            tips:    replace {***} to real content.
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-2rem">
            4. Add a post  to web3
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
  </div>
</template>

<script>
export default {
  name: "AccountInfo",
  data() {
    return {
      tipDrawer: false,
      direction: document.body.clientWidth < 560?'btt':'rtl'
    }
  }
}
</script>

<style scoped>

</style>
