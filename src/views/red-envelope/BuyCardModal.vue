<template>
  <div class="relative text-left pb-3rem flex flex-col text-14px 2xl:text-0.8rem overflow-auto bg-white rounded-20px">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <img class="w-26px h-26px min-w-26px" src="~@/assets/red-envelope/icon-close.svg" alt="">
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-3rem text-blueDark">
      {{$t('ny.buyCard')}}
    </div>
    <div class="w-200px mx-auto mt-2rem">
      <div class="relative text-white">
        <img class="w-full" src="~@/assets/red-envelope/rare-card.png" alt="">
        <div class="w-full h-full px-18px absolute top-0 pt-1/6 pb-1/9
                        flex flex-col justify-between items-center">
          <img class="w-full rounded-8px" src="~@/assets/red-envelope/card4.png" alt="">
          <div class="flex flex-col items-center">
            <div class="flex items-center justify-between sm:px-10px mt-10px w-full">
              <img src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
              <span class="text-12px xs:text-18px xs:whitespace-nowrap px-2px">
                  {{BLESS_CARD_NAME[4]}}
              </span>
              <img class="transform rotate-180" src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
            </div>
            <div class="bg-white/10 w-max px-12px py-2px text-14px leading-18px rounded-full mt-6px xs:mt-10px">
              {{$t('common.balance')}}: {{ blessCardBalance[5] }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <el-input-number class="c-number-input w-130px my-1.2rem"
                         v-model="buyNum" :step="1" step-strictly/>
        <div class="text-12px text-blueDark mb-4px">{{$t('ny.price')}}</div>
        <div class="text-24px c-text-black text-blueDark">{{buyAmount}} USDT</div>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <ConnectMainchainBTNVue class="my-1rem" v-if="chainId !== CHAIN_ID"/>
      <div v-else class="text-center my-1rem">
        <button v-if="!approved"
                class="gradient-bg gradient-btn-disabled-grey w-10rem h-44px 2xl:h-2.2rem
                       text-white rounded-full font-bold flex justify-center items-center"
                :disabled="isApproving || accountMismatch"
                @click="approve">
          {{ $t('common.approve') }}
          <c-spinner v-show="isApproving" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
        </button>
        <button v-else
                class="buy-btn w-10rem h-44px 2xl:h-2.2rem flex justify-center items-center
                       text-white rounded-full font-bold"
                :disabled="isBuying || accountMismatch"
                @click="buy">
          {{$t('ny.buy')}}
          <c-spinner v-show="isBuying" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
        </button>
        <div class="text-center mt-10px text-color8B">
          {{ $t('common.balance') }}: {{ formatAmount(usdtBalance) }}
        </div>
      </div>
      <div v-if="accountMismatch" class="text-color8B">
        {{ $t('ny.accountMismatch') }}
      </div>
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
    ...mapState('newYear', ['blessCardBalance', 'approvedUSDT', 'usdtBalance']),
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
      BLESS_CARD_NAME
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
        console.log('buy rare card fail', e);
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
.buy-btn {
  background-image: linear-gradient(180deg, #F5319D 0%, #FC6767 100%);
  border: 2px solid #FFF7E8;
}
</style>
