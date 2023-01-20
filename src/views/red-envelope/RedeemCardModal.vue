<template>
  <div class="relative text-left pb-3rem flex flex-col text-14px 2xl:text-0.8rem bg-white text-blueDark">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <img class="w-26px h-26px min-w-26px" src="~@/assets/red-envelope/icon-close.svg" alt="">
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-3rem mb-2rem">
      {{$t('ny.redeemCards')}}
    </div>
    <div class="px-20px xs:px-1/10 leading-20px">
      {{$t('ny.redeemCardDesc', {totalNum: userActivityInfo.mintBoxCounts, notOpenNum: userActivityInfo.mintBoxCounts - userActivityInfo.openBoxCounts})}}
    </div>
    <ConnectMainchainBTNVue class="ny-gradient-btn gradient-btn-disabled-grey mt-2rem mx-auto
                   flex items-center justify-center px-20px
                   min-w-10rem rounded-full h-44px 2xl:h-2.2rem text-white font-bold" v-if="chainId !== CHAIN_ID"/>
    <button v-else class="ny-gradient-btn gradient-btn-disabled-grey mt-2rem mx-auto
                   flex items-center justify-center px-20px
                   min-w-10rem rounded-full h-44px 2xl:h-2.2rem text-white font-bold"
            :disabled="loading || accountMismatch"
            @click="onRedeem">
      {{$t('ny.redeem')}}
      <c-spinner v-show="loading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
    </button>
    <div v-if="accountMismatch" class="text-center mt-6px text-redColor">
      {{ $t('ny.accountMismatch') }}
    </div>
  </div>
</template>

<script>
import ConnectMainchainBTNVue from './ConnectMainchainBTN.vue'
import { mapState, mapGetters } from 'vuex'
import { NEW_YEAR_CARD_CONTRACT, CHAIN_ID } from '@/ny-config'
import { accountChanged } from '@/utils/web3/account'

export default {
  name: "RedeemCardModal",
  components: {
    ConnectMainchainBTNVue,
  },
  computed: {
    ...mapState('newYear', ['userActivityInfo']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapGetters(['getAccountInfo']),
    accountMismatch() {
      return this.getAccountInfo.ethAddress !== this.account
    },
  },
  data() {
    return {
      loading: false,
      CHAIN_ID
    }
  },
  methods: {
    async onRedeem() {
      try{
        this.loading = true
        this.$emit('close')
      } catch(e) {
        console.log('redeem fail:', e);
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    accountChanged().catch();
  },
}
</script>

<style scoped>

</style>
