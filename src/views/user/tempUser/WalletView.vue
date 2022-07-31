<template>
  <div class="pb-4rem md:max-w-600px lg:max-w-35rem mx-auto">
    <div class="top-box rounded-2rem mt-2.5rem mb-2rem overflow-hidden mx-1.5rem sm:mx-0">
      <div class="gradient-bg gradient-bg-color3 text-1rem px-1rem py-0.8rem flex items-center justify-center">
        <span class="text-black c-text-bold"> ETH wallet</span>
        <button>
          <img class="w-1.2rem ml-0.5rem" src="~@/assets/icon-question-black.svg" alt="">
        </button>
      </div>
      <div class="p-1.5rem c-text-bold text-0.8rem leading-1.4rem text-primaryColor break-all flex items-center justify-center">
        {{ accountInfo ? accountInfo.ethAddress : '' }}
        <img class="w-1.3rem h-1.3rem ml-1rem cursor-pointer"
             @click="copy(accountInfo.ethAddress)"
             src="~@/assets/icon-copy-primary.svg" alt="">
      </div>
    </div>
    <div class="bg-blockBg md:py-1.5rem rounded-12px">
      <div class="px-1.5rem text-14px w-min flex gap-1.5rem h-2.2rem">
        <div class="px-0.8rem flex items-center rounded-full border-1 border-white/20" @click="selectIndex = 0">Token</div>
        <div class="px-0.8rem flex items-center rounded-full border-1 border-white/20" @click="selectIndex = 1">NFTs</div>
        <!-- <router-link :to="`/profile/${$route.params.user}/wallet`"
                     class="px-0.8rem flex items-center rounded-full border-1 border-white/20">Token</router-link>
        <router-link :to="`/profile/${$route.params.user}/wallet/nft`"
                     class="px-0.8rem flex items-center rounded-full border-1 border-white/20">NFTs</router-link> -->
      </div>
      <Token v-show="selectIndex===0"></Token>
      <NFT v-show="selectIndex===1"></NFT>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {ethers} from "ethers";
import {notify} from "@/utils/notify";
import Token from './Token'
import NFT from './NFT'

export default {
  data() {
    return {
      selectIndex: 0
    }
  },
  computed: {
    ...mapState(['steemBalance', 'prices', 'ethBalance', 'erc20Balances', 'accountInfo'])
  },
  components: {
    Token,
    NFT
  },
  methods: {
    copy(address) {
      if (ethers.utils.isAddress(address)) {
        navigator.clipboard.writeText(address).then(() => {
          notify({
            message: 'Copied address:'+address,
            duration: 5000,
            type: 'success'
          })
        }, (e) => {
          console.log(e)
        })
      }
    }
  }
}
</script>

<style scoped>
.top-box {
  background: linear-gradient(99.28deg, rgba(83, 83, 83, 0.8) 0.41%, rgba(78, 72, 61, 0.8) 75.78%);
  border: 1px solid #323436;
  border-radius: 12px;
}
.router-link-exact-active {
  background-color: var(--primary-custom);
}
</style>
