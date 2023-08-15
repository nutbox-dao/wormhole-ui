<template>
  <div class="text-14px">
    <div class="h-max overflow-hidden rounded-16px">
      <div class="flex justify-between items-center px-15px pt-12px pb-10px">
        <span class="text-16px font-bold">{{$t('space.income')}}</span>
        <button v-if="isSettle"
                class="text-white h-24px bg-color62 px-10px rounded-full text-12px">{{$t('space.settled')}}</button>
        <button v-else-if="space.spaceState === 4"
                class="text-white h-24px bg-color62 px-10px rounded-full text-12px">{{$t('space.unsettlement')}}</button>
      </div>
      <div v-if="isSettle" class="px-14px pb-8px flex justify-between items-center">
        <div></div>
        <div class="px-18px bg-color62 rounded-full h-36px px-10px text-white text-14px flex items-center">
          <span class="font-bold">
            {{ formatAmount(totalAmount) }} {{ space.tokenSymbol }}
          </span>
          &nbsp;
          <span class="font-bold orange-color">
            ({{ formatPrice(totalAmount * price) }})
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-10px px-15px pb-15px">
        <div class="col-span-1 border-0.5px border-color8B/30 rounded-10px p-8px">
          <div class="flex justify-between items-center text-12px ">
            <div class="flex items-center gap-4px">
              <img class="w-14px h-14px min-w-14px"
                   src="~@/assets/icon-curator-primary.svg" alt="">
              <span>{{$t('common.curator')}}</span>
            </div>
            <div class="">{{ space.curatorCount }} {{$t('common.people')}}</div>
          </div>
          <div v-if="isSettle" class="mt-10px c-text-black">{{ amount }} {{ space.tokenSymbol }}</div>
        </div>
        <div class="col-span-1 border-0.5px border-color8B/30 rounded-10px p-8px">
          <div class="flex justify-between items-center text-12px text-color8B light:text-color7D">
            <div class="flex items-center gap-4px">
              <img class="w-14px h-14px min-w-14px"
                   src="~@/assets/icon-host-primary.svg" alt="">
              <span>{{$t('curation.host')}}</span>
            </div>
            <div class="">1 {{$t('common.people')}}</div>
          </div>
          <div v-if="isSettle" class="mt-10px c-text-black">{{ amount }} {{ space.tokenSymbol }}</div>
        </div>
        <div class="col-span-1 border-0.5px border-color8B/30 rounded-10px p-8px">
          <div class="flex justify-between items-center text-12px text-color8B light:text-color7D">
            <div class="flex items-center gap-4px">
              <img class="w-14px h-14px min-w-14px"
                   src="~@/assets/icon-co-host-primary.svg" alt="">
              <span>{{$t('curation.coHost')}}</span>
            </div>
            <div class="">{{ space.hosts ? space.hosts.length - 1 : 0 }} {{$t('common.people')}}</div>
          </div>
          <div v-if="isSettle" class="mt-10px c-text-black">{{ amount }} {{ space.tokenSymbol }}</div>
        </div>
        <div class="col-span-1 border-0.5px border-color8B/30 rounded-10px p-8px">
          <div class="flex justify-between items-center text-12px text-color8B light:text-color7D">
            <div class="flex items-center gap-4px">
              <img class="w-14px h-14px min-w-14px"
                   src="~@/assets/icon-speaker-primary.svg" alt="">
              <span>{{$t('curation.speaker')}}</span>
            </div>
            <div class="">{{ space.speakder ? space.speakers.length : 0 }} {{$t('common.people')}}</div>
          </div>
          <div v-if="isSettle" class="mt-10px c-text-black">{{ amount }} {{ space.tokenSymbol }}</div>
        </div>
      </div>
      <div v-if="pendingCalc" class="px-15px py-8px bg-color62 rounded-b-12px text-14px text-white">
        Space收益将在
        <Countdown class="text-white text-14px inline-flex"
                   :time="space.endtime * 1000"/>
        后结算
      </div>
      <div v-if="space.spaceCancelType > 1" class="px-15px py-8px bg-color62 text-12px text-left leading-18px text-white">
        <div class="flex items-center mb-4px">
          <img class="w-14px h-14px min-w-14px inline-flex mr-4px"
               src="~@/assets/icon-warning-white.svg" alt="">
          <span class="font-bold">{{$t('space.spaceWarning')}}</span>
        </div>
        <div>{{$t('space.spaceWarningTip' + sapce.spaceCancelType)}}</div>
        <!--      <div>{{$t('space.spaceWarningTip2')}}</div>-->
        <!--      <div>{{$t('space.spaceWarningTip3')}}</div>-->
      </div>
      <div v-if="space.spaceCancelType === 1" class="px-15px py-8px bg-color62 rounded-b-12px text-14px text-white">
        {{ $t('space.spaceWaringTip1') }}
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Countdown from "@/components/Countdown.vue";
import BlogReward from "@/components/BlogReward.vue";
import { mapState } from 'vuex'
import { formatAmount, formatPrice } from "@/utils/helper";
import { getPriceFromOracle } from "@/utils/asset";
import { EVM_CHAINS_ID } from '@/config'

export default {
  name: "SpaceIncome",
  components: {Countdown, BlogReward},
  props: {
    space: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    ...mapState('community', ['showingCommunity']),
    isSettle() {
      return this.space.isCalc 
    },
    pendingCalc() {
      return this.space.spaceState = 3 && !this.isSettle;
    },
    totalAmount() {
      if (this.space.amount) {
        return parseFloat(this.space.amount / (10 ** this.space.decimals))
      }
      return 0
    },
    amount() {
      return formatAmount(this.totalAmount / 4);
    },
  },
  methods: {
    formatAmount,
    formatPrice
  },
  data() {
    return {
      price: 0
    }
  },
  async mounted () {
    if (this.showingCommunity && this.showingCommunity.rewardPrice) {
      this.price = this.showingCommunity.rewardPrice
    }else {
      const prices = await getPriceFromOracle(EVM_CHAINS_ID[this.space.chainId], [{token: this.space.token, decimals: this.space.decimals}])
      this.price = prices[this.space.token]
    }
  },
}
</script>

<style scoped>
.orange-color {
  color: #e0792a
}
</style>
