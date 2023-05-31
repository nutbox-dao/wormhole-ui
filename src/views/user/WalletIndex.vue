<template>
  <div class="">
    <div class="w-full sticky -top-1px z-9 2md:top-0 bg-primaryBg light:bg-white shadow-tab sm:shadow-none">
      <div class="border-b-0.5px border-color8B/30 light:border-colorD6
                  bg-primaryBg light:bg-white light:2md:bg-transparent z-9">
        <div class="container mx-auto max-w-600px xl:max-w-30rem px-15px relative
                    flex items-center justify-center gap-30px h-70px pt-23px 2md:h-48px 2md:pt-0 text-14px font-bold">
          <router-link :to="`/profile/${$route.params.user}/post`"
                       class="absolute left-15px 2md:hidden">
            <i class="icon-back w-20px h-20px"></i>
          </router-link>
          <router-link v-if="getAccountInfo && getAccountInfo.isRegistry === 1"
                       :to="`/wallet/${$route.params.user}/wallet`" v-slot="{isActive}"
                       class="flex-1">
            <button class="w-full h-48px flex items-center justify-center"
                    :class="isActive?'c-active-tab text-color62':'text-color7D'">
              {{$t('myWallet')}}
            </button>
          </router-link>
          <router-link :to="`/wallet/${$route.params.user}/reward`" v-slot="{isActive}"
                       class="flex-1">
            <button class="w-full h-48px flex items-center justify-center"
                    :class="isActive?'c-active-tab text-color62':'text-color7D'">
              {{$t('myReward')}}
            </button>
          </router-link>
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
