<template>
  <div class="pb-4rem md:max-w-600px lg:max-w-35rem mx-auto">
    <div class="rounded-12px md:my-2rem my-1.5rem overflow-hidden mx-1.5rem sm:mx-0">
      <div class="gradient-bg gradient-bg-color3 text-1rem px-1rem py-0.8rem flex items-center justify-center">
        <span class="c-text-black"> ETH wallet</span>
        <!-- <button>
          <img class="w-1.2rem ml-0.5rem" src="~@/assets/icon-question-black.svg" alt="">
        </button> -->
      </div>
      <div class="border-1 border-t-0 border-dividerColor overflow-hidden rounded-b-12px p-1.5rem c-text-bold text-0.8rem leading-1.4rem break-all flex items-center justify-center">
        {{ getAccountInfo ? getAccountInfo.ethAddress : '' }}
        <img class="w-1.3rem h-1.3rem ml-1rem cursor-pointer"
             @click="copy(getAccountInfo.ethAddress)"
             src="~@/assets/icon-copy.svg" alt="">
      </div>
    </div>
    <div class="bg-blockBg md:py-1.5rem rounded-12px">
      <div class="px-1.5rem text-14px w-min flex gap-1rem h-2rem md:h-1.6rem">
        <router-link :to="`/profile/${$route.params.user}/wallet`"
                     class="px-0.8rem flex items-center rounded-full border-1 border-white/20 text-15px">Token</router-link>
        <router-link :to="`/profile/${$route.params.user}/wallet/nft`"
                     class="px-0.8rem flex items-center rounded-full border-1 border-white/20 text-15px">NFTs</router-link>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {ethers} from "ethers";
import {notify} from "@/utils/notify";

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo'])
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
