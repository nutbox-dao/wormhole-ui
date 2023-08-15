<template>
  <div class="h-full overflow-hidden flex flex-col">
    <div class="border-b-0.5px border-color8B/30 light:border-colorD6
                bg-primaryBg light:bg-transparent z-9 overflow-auto no-scroll-bar">
      <div class="container mx-auto max-w-600px xl:max-w-30rem w-min px-15px relative
                  flex items-center justify-center gap-30px
                  2md:h-70px 2md:pt-23px 2md:h-48px 2md:pt-0 text-14px font-bold">
        <router-link :to="`/wallet/${$route.params.user}/reward`" v-slot="{isActive}">
          <button class="w-full h-48px w-min flex items-center justify-center px-15px whitespace-nowrap"
                  :class="isActive?'c-active-tab text-color62':'text-color7D'">
            {{$t('myReward')}}
          </button>
        </router-link>
        <router-link :to="`/wallet/${$route.params.user}/space-reward`" v-slot="{isActive}">
          <button class="w-full h-48px flex items-center justify-center px-15px whitespace-nowrap"
                  :class="isActive?'c-active-tab text-color62':'text-color7D'">
            {{$t('walletView.spaceReward')}}
          </button>
        </router-link>
        <router-link :to="`/wallet/${$route.params.user}/promotion-reward`" v-slot="{isActive}">
          <button class="w-full h-48px flex items-center justify-center px-15px whitespace-nowrap"
                  :class="isActive?'c-active-tab text-color62':'text-color7D'">
            {{$t('walletView.promotionReward')}}
          </button>
        </router-link>
        <router-link :to="`/wallet/${$route.params.user}/ref-reward`" v-slot="{isActive}">
          <button class="w-full h-48px flex items-center justify-center px-15px whitespace-nowrap"
                  :class="isActive?'c-active-tab text-color62':'text-color7D'">
            {{$t('ref.rewards')}}
          </button>
        </router-link>
        <router-link v-if="getAccountInfo && getAccountInfo.isRegistry === 1"
                     :to="`/wallet/${$route.params.user}/wallet`" v-slot="{isActive}">
          <button class="w-full h-48px flex items-center justify-center px-15px whitespace-nowrap"
                  :class="isActive?'c-active-tab text-color62':'text-color7D'">
            {{$t('myWallet')}}
          </button>
        </router-link>
      </div>
    </div>
    <div class="flex-1 overflow-auto no-scroll-bar lg:px-15px">
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
