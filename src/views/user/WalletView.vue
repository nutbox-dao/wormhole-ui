<template>
  <div class="absolute left-0 right-0 bottom-0 top-0 flex flex-col text-14px xl:text-0.8rem">
    <div class="flex-1">
      <div class="md:pb-4rem md:max-w-600px lg:max-w-35rem mx-auto h-full flex flex-col">
        <div class="px-1.5rem pt-25px sm:px-0 container mx-auto max-w-53rem md:max-w-48rem">
          <div class="w-min relative ">
            <!--        <div class="w-full h-7px gradient-line absolute bottom-3px rounded-full"></div>-->
            <span class="text-16px xl:text-1rem c-text-black relative whitespace-nowrap light:text-black">
          {{$t('myWallet')}}
        </span>
          </div>
        </div>
        <div class="bg-blockBg light:bg-white mt-5rem pt-5rem md:mt-9rem md:pt-1rem rounded-12px basis-full md:basis-auto relative">
          <div v-if="getAccountInfo && getAccountInfo.ethAddress"
               class="gradient-bg gradient-bg-color3 rounded-12px overflow-hidden mx-1.5rem sm:mx-0
                  absolute -top-3rem left-0 right-0 md:-top-8rem">
            <div class="px-17px py-12px mb-1rem flex items-center justify-between cursor-pointer"
                 @click="$router.push('/transaction/' + getAccountInfo.twitterId)">
              <span class="c-text-black text-white text-14px 2xl:text-0.8rem">{{$t('profileView.ethWallet')}}</span>
              <i class="w-1rem h-1rem min-w-14px min-h-14px icon-notification"></i>
              <!-- <button>
                <img class="w-1.2rem ml-0.5rem" src="~@/assets/icon-question-black.svg" alt="">
              </button> -->
            </div>
            <div class="border-1 gradient-border gradient-border-colorCB overflow-hidden rounded-5px
                  mx-0.4rem mb-1rem p-5px min-h-30px
                  font-700 text-0.8rem leading-1.4rem light:text-blueDark
                  break-all flex items-center justify-between">
              <span class="sm:hidden">{{ getAccountInfo ? formatAddress(getAccountInfo.ethAddress, 16, 16) : '' }}</span>
              <span class="hidden sm:block">{{ getAccountInfo ? getAccountInfo.ethAddress : ' ' }}</span>
              <i class="w-1.3rem h-1.3rem ml-1rem cursor-pointer icon-copy"
                 @click="copy(getAccountInfo.ethAddress)"></i>
            </div>
          </div>
          <div class="px-1.5rem text-14px w-min flex gap-1rem mt-1rem font-bold">
            <router-link :to="`/profile/${$route.params.user}/wallet`"
                         class="flex items-center rounded-full
                     border-1 border-white/20 leading-14px text-14px py-10px px-24px
                     light:bg-colorF2 light:text-color7D">{{$t('common.nft')}}</router-link>
            <router-link :to="`/profile/${$route.params.user}/wallet/token`"
                         class="flex items-center rounded-full
                     border-1 border-white/20 leading-14px text-14px py-10px px-24px
                     light:bg-colorF2 light:text-color7D">{{$t('common.token')}}</router-link>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {ethers} from "ethers";
import {notify} from "@/utils/notify";
import {formatAddress} from "@/utils/tool";

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo'])
  },
  methods: {
    formatAddress,
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
  background: linear-gradient(135.53deg, #917AFD 2.61%, #6246EA 96.58%);
  color: white!important;
  border: none;
}
</style>
