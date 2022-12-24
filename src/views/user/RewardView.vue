<template>
  <div class="absolute left-0 right-0 bottom-0 top-0 flex flex-col text-14px xl:text-0.8rem">
    <div class="flex-1">
      <div class="border-b-1 border-color84/30 light:border-colorF4 sticky top-0 z-2 bg-primaryBg light:bg-white">
        <div class="px-1.5rem pt-25px sm:px-0 container mx-auto sm:max-w-600px lg:max-w-35rem">
          <div class="flex overflow-hidden text-16px xl:text-0.9rem font-bold ">
            <router-link v-if="getAccountInfo && (getAccountInfo.isRegistry === 1 || getAccountInfo.source === 3)"
                         :to="`/profile/${$route.params.user}/wallet`" v-slot="{isActive}"
                         class="flex-1 cursor-pointer">
              <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4"
                   :class="isActive?'text-color62 border-color62':'text-color7D border-transparent'">
                {{$t('myWallet')}}
              </div>
            </router-link>
            <router-link :to="`/profile/${$route.params.user}/reward`" v-slot="{isActive}"
                         class="flex-1 cursor-pointer">
              <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4"
                   :class="isActive?'text-color62 border-color62':'text-color7D border-transparent'">
                {{$t('myReward')}}
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="md:pb-4rem sm:max-w-600px lg:max-w-35rem mx-auto flex flex-col">
        <div class="bg-blockBg light:bg-white mt-5rem pt-5rem md:mt-9rem md:pt-1rem rounded-12px basis-full md:basis-auto relative">
          <div class="gradient-bg gradient-bg-color3 rounded-12px overflow-hidden mx-1.5rem sm:mx-0
                  absolute -top-3rem left-0 right-0 md:-top-8rem">
            <div class="px-17px py-12px mb-1rem flex items-center justify-between cursor-pointer">
              <span class="c-text-black text-white text-14px 2xl:text-0.8rem">{{$t('common.summary')}}</span>
<!--              <i class="w-1rem h-1rem min-w-14px min-h-14px icon-notification"></i>-->
            </div>
            <div class="border-1 gradient-border light:gradient-border-colorCB
                        overflow-hidden rounded-5px mx-17px mb-1rem min-h-30px">
              <div class="bg-color62/20 light:bg-white p-5px
                          font-700 text-0.8rem leading-1.4rem light:text-blueDark
                          break-all flex items-center justify-between">
                <span class="text-1.6rem">$0.000</span>
              </div>
            </div>
          </div>

          <div class="px-1.5rem text-14px w-min flex gap-1rem mt-1rem font-bold">
            <button class="flex items-center rounded-full
                    border-1 border-white/20 leading-14px text-14px py-10px px-24px
                    light:bg-colorF2 light:text-color7D"
                    :class="tabIndex===0?'active-tab':''"
                    @click="tabIndex=0">{{$t('curations')}}</button>
            <button class="flex items-center rounded-full
                     border-1 border-white/20 leading-14px text-14px py-10px px-24px
                     light:bg-colorF2 light:text-color7D"
                    :class="tabIndex===1?'active-tab':''"
                    @click="tabIndex=1">{{$t('common.post')}}</button>
          </div>
          <RewardCuration v-show="tabIndex===0"/>
          <RewardPost v-show="tabIndex===1"/>
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
import RewardCuration from "@/views/user/RewardCuration";
import RewardPost from "@/views/user/RewardPost";

export default {
  components: {RewardCuration, RewardPost},
  data() {
    return {
      tabIndex: 0
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
.active-tab {
  background: linear-gradient(135.53deg, #917AFD 2.61%, #6246EA 96.58%);
  color: white!important;
  border: none;
}
</style>
