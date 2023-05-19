<template>
  <div class="absolute left-0 right-0 bottom-0 top-0 flex flex-col text-14px xl:text-0.8rem">
    <div class="border-b-1 border-color84/30 light:border-colorF4 sticky -top-1 z-2 bg-primaryBg light:bg-white">
      <div class="px-1.5rem pt-25px sm:px-0 container mx-auto sm:max-w-600px lg:max-w-35rem">
        <div class="flex overflow-hidden text-16px xl:text-0.9rem font-bold relative px-1/5">
          <router-link :to="`/profile/${$route.params.user}/post`"
                       class="w-20px xs:w-40px h-40px xs:bg-white/20 xs:light:bg-colorF7 rounded-full
                                flex items-center justify-center absolute left-0 sm:left-15px">
            <i class="icon-back w-20px h-20px mb-2px"></i>
          </router-link>
          <router-link v-if="getAccountInfo && getAccountInfo.isRegistry === 1"
                       :to="`/wallet/${$route.params.user}/wallet`" v-slot="{isActive}"
                       class="flex-1 flex flex-col items-center cursor-pointer">
            <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center"
                 :class="isActive?'text-color62':'text-color7D'">
              {{$t('myWallet')}}
            </div>
            <div class="w-24px h-3px rounded-full" :class="isActive?'bg-color62':'bg-transparent'"></div>
          </router-link>
          <router-link :to="`/wallet/${$route.params.user}/reward`" v-slot="{isActive}"
                       class="flex-1 flex flex-col items-center cursor-pointer">
            <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center"
                 :class="isActive?'text-color62 ':'text-color7D'">
              {{$t('myReward')}}
            </div>
            <div class="w-24px h-3px rounded-full" :class="isActive?'bg-color62':'bg-transparent'"></div>
          </router-link>
          <!--            <router-link :to="`/wallet/${$route.params.user}/transaction`" v-slot="{isActive}"-->
          <!--                         class="flex-1 cursor-pointer">-->
          <!--              <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4"-->
          <!--                   :class="isActive?'text-color62 border-color62':'text-color7D border-transparent'">-->
          <!--                {{$t('walletView.tipHistory')}}-->
          <!--              </div>-->
          <!--            </router-link>-->
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-auto lg:px-15px">
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
