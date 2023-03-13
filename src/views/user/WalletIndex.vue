<template>
  <div class="absolute left-0 right-0 bottom-0 top-0 flex flex-col text-14px xl:text-0.8rem">
    <div class="flex-1">
      <div class="border-b-1 border-color84/30 light:border-colorF4 sticky -top-1 z-2 bg-primaryBg light:bg-white">
        <div class="px-1.5rem pt-25px sm:px-0 container mx-auto sm:max-w-600px lg:max-w-35rem">
          <div class="flex overflow-hidden text-16px xl:text-0.9rem font-bold ">
            <router-link v-if="getAccountInfo && getAccountInfo.isRegistry === 1"
                         :to="`/wallet/${$route.params.user}/wallet`" v-slot="{isActive}"
                         class="flex-1 cursor-pointer">
              <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4"
                   :class="isActive?'text-color62 border-color62':'text-color7D border-transparent'">
                {{$t('myWallet')}}
              </div>
            </router-link>
            <router-link :to="`/wallet/${$route.params.user}/reward`" v-slot="{isActive}"
                         class="flex-1 cursor-pointer">
              <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4"
                   :class="isActive?'text-color62 border-color62':'text-color7D border-transparent'">
                {{$t('myReward')}}
              </div>
            </router-link>
            <router-link :to="`/wallet/${$route.params.user}/transaction`" v-slot="{isActive}"
                         class="flex-1 cursor-pointer">
              <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4"
                   :class="isActive?'text-color62 border-color62':'text-color7D border-transparent'">
                {{$t('walletView.tipHistory')}}
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name"/>
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name"/>
      </router-view>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "WalletIndex",
  computed: {
    ...mapGetters(['getAccountInfo'])
  },
}
</script>

<style scoped>

</style>
