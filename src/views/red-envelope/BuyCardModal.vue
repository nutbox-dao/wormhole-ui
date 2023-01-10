<template>
  <div class="relative text-left pb-3rem sm:pb-1.5rem flex flex-col text-14px 2xl:text-0.8rem overflow-auto">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-3rem">
      {{$t('ny.buyCard')}}
    </div>
    <div class="w-240px mx-auto mt-3rem">
      <div class="relative">
        <img class="w-full" src="~@/assets/red-envelope/card0.png" alt="">
        <div class="absolute top-15px left-20px font-bold text-shadow-lg opacity-70 text-white">Leek Rabbit</div>
        <div class="absolute bottom-30px right-30px text-shadow-lg font-bold text-white opacity-70">
          {{$t('common.balance')}}: {{ blessCardBalance[5] }}
        </div>
      </div>
      <div class="flex justify-between items-center mt-1rem px-15px">
        <div class="w-1/2">
          <el-input-number class="c-number-input w-full" v-model="buyNum" :step="1" step-strictly/>
        </div>
        <div>{{buyAmount}} USDT</div>
      </div>
      <div>
        {{ $t('common.balance') }}: {{ formatAmount(usdtBalance) }}
      </div>
    </div>
    <ConnectMainchainBTNVue v-if="chainId !== CHAIN_ID"/>
    <div v-else class="text-center my-2rem">
      <button v-if="!approved" class="gradient-bg gradient-btn-disabled-grey w-10rem h-44px 2xl:h-2.2rem
                     text-white rounded-12px font-bold"
                     :disabled="isApproving || accountMismatch"
                     @click="approve">
        {{ $t('common.approve') }}
        <c-spinner v-show="isApproving" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
      </button>
      <button v-else class="gradient-bg gradient-btn-disabled-grey w-10rem h-44px 2xl:h-2.2rem
                     text-white rounded-12px font-bold"
                     :disabled="isBuying || accountMismatch"
                     @click="buy">
        {{$t('ny.buy')}}
        <c-spinner v-show="isBuying" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
      </button>
    </div>
    <div v-if="accountMismatch">
      {{ $t('ny.accountMismatch') }}
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getUSDTBalance, checkUSDTApproved, approveUSDTToCollect, buyRareCard, getUserNYCards } from '@/utils/new-year'
import { notify } from '@/utils/notify'
import { formatAmount } from '@/utils/helper'
import { NEW_YEAR_CARD_CONTRACT, CHAIN_ID, BLESS_CARD_NAME } from '@/ny-config'
import ConnectMainchainBTNVue from './ConnectMainchainBTN.vue'
import {accountChanged, getAccounts} from "@/utils/web3/account";

export default {
  name: "BuyCardModal",
  components: {
    ConnectMainchainBTNVue,
  },
  computed: {
    ...mapState('newYear', ['blessCardBalance', 'getUSDTBalance', 'approvedUSDT', 'usdtBalance']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapGetters(['getAccountInfo']),
    buyAmount () {
      return (this.buyNum * 0.2).toFixed(1)
    },
    approved() {
      return parseFloat(this.approvedUSDT) >= parseFloat(this.buyAmount)
    },
    accountMismatch() {
      return this.getAccountInfo.ethAddress !== this.account
    }
  },
  data() {
    return {
      buyNum: 1,
      isBuying: false,
      isApproving: false,
      CHAIN_ID,
    }
  },
  methods: {
    formatAmount,
    async approve() {
      try{
        this.isApproving = true
        await approveUSDTToCollect(this.getAccountInfo.ethAddress)
      } catch (e) {
        notify({message: this.$t('curation.approveFail'), duration: 5000, type: 'error'})
      } finally {
        this.isApproving = false
      }   
    },
    async buy() {
      try{
        this.isBuying = true
        await buyRareCard(this.buyNum, this.getAccountInfo.ethAddress)
        await Promise.all([ getUSDTBalance(this.account), getUserNYCards(this.account)])
        this.$emit('close')
      } catch (e) {
        console.log(35, e);
        notify({message: this.$t('curation.approveFail'), duration: 5000, type: 'error'})
      } finally {
        this.isBuying = false
      }
    }
  },
  mounted () {
    if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
      return;
    }
    const account = this.getAccountInfo.ethAddress
    getUSDTBalance(account).catch();
    checkUSDTApproved(account).catch();
    accountChanged().catch()
    getAccounts(true).then(wallet => {
      this.account = wallet
    }).catch();
  },
}
</script>

<style scoped>

</style>
