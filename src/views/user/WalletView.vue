<template>
  <div class="pb-4rem md:max-w-600px lg:max-w-35rem mx-auto">
    <div v-if="getAccountInfo && getAccountInfo.ethAddress" class="rounded-12px md:my-2rem my-1.5rem overflow-hidden mx-1.5rem sm:mx-0">
      <div class="gradient-bg gradient-bg-color3 text-1rem px-1rem py-0.8rem flex items-center justify-center">
        <span class="c-text-black text-white">{{$t('profileView.ethWallet')}}</span>
        <!-- <button>
          <img class="w-1.2rem ml-0.5rem" src="~@/assets/icon-question-black.svg" alt="">
        </button> -->
      </div>
      <div class="border-1 border-t-0 border-dividerColor overflow-hidden rounded-b-12px
                  p-1.5rem font-700 text-0.8rem leading-1.4rem light:text-blueDark
                  break-all flex items-center justify-center">
        {{ getAccountInfo ? getAccountInfo.ethAddress : '' }}
        <i class="w-1.3rem h-1.3rem ml-1rem cursor-pointer icon-copy"
           @click="copy(getAccountInfo.ethAddress)"></i>
      </div>
    </div>
    <div class="bg-blockBg light:bg-white md:py-1.5rem rounded-12px mt-1.2rem">
      <div class="px-1.5rem text-14px w-min flex gap-1rem h-2rem md:h-1.6rem">
        <router-link :to="`/profile/${$route.params.user}/wallet`"
                     class="px-0.8rem flex items-center rounded-full
                     border-1 border-white/20 text-15px light:bg-colorF2 light:text-color7D">{{$t('common.token')}}</router-link>
        <router-link :to="`/profile/${$route.params.user}/wallet/nft`"
                     class="px-0.8rem flex items-center rounded-full
                     border-1 border-white/20 text-15px light:bg-colorF2 light:text-color7D">{{$t('common.nft')}}</router-link>
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
.router-link-exact-active {
  background: linear-gradient(96.99deg, #AE88FE -31.47%, #923CFF 55.23%, #00B2FF 147.53%);
  color: white!important;
}
</style>
