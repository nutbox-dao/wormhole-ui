<template>
  <div class="relative flex flex-col text-14px">
    <div>
      <div class="flex justify-between items-center pt-12px pb-15px px-15px">
        <div class="flex-1 flex justify-between flex-col xs:flex-row xs:items-center">
          <div class="c-text-black text-20px py-6px">
            {{$t('curation.participants')}}
          </div>
          <slot></slot>
        </div>
        <button class="lg:hidden"
                @click="$emit('close')">
          <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
        </button>
      </div>
      <div class="px-15px relative">
        <BlogReward :is-popover="false" :post="post"></BlogReward>
      </div>

      <div class="mt-8px text-12px text-color62 text-left italic px-15px">{{$t('curation.rewardTip')}}</div>
      <div class="flex justify-between items-center px-15px pt-15px pb-8px text-left border-b-0.5px border-color8B/30 gap-10px">
        <span class="w-3/7">{{$t('curation.attended')}}</span>
        <!-- <span class="w-2/7 text-right">{{$t('community.curationCredit')}}</span> -->
        <span class="w-2/7 text-right">{{$t('curation.reward')}}</span>
      </div>
    </div>
    <div class="flex-1 overflow-auto pb-15px no-scroll-bar">
      <div class="flex justify-between items-center py-15px px-15px text-left border-b-0.5px border-color8B/30 gap-10px"
           v-for="record of (list ?? [])" :key="record.id">
        <div class="w-4/7 flex items-center cursor-pointer truncate"
             @click="$router.push('/account-info/@' + record.twitterUsername)">
          <img class="w-30px min-w-30px h-30px rounded-full border-1 gradient-border "
               :src="record.profileImg" alt="">
          <div class="text-12px leading-18px ml-8px truncate">
            {{record.twitterUsername}}
          </div>
        </div>
        <!-- <div class="w-2/7 text-right">10000</div> -->
        <div class="w-3/7 text-right">{{ showingReward(record) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {parseTimestamp, formatAmount, formatPrice} from "@/utils/helper";
import ChainTokenIcon from "@/components/ChainTokenIcon";
import { getAutoCurationRecord } from '@/api/api'
import {getPriceFromOracle} from "@/utils/asset";
import BlogReward from "@/components/BlogReward.vue";
import {isNumeric} from "@/utils/tool";
import { mapState } from "vuex";
import { EVM_CHAINS_ID } from '@/config'

export default {
  name: "CurationAttendedList",
  components: {ChainTokenIcon, BlogReward},
  props: {
    records: {
      type: Array,
      default: []
    },
    state: {
      type: Number,
      default: 0
    },
    curation: {
      type: Object,
      default: {}
    },
    post: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      price: 0,
      list: []
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity'])
  },
  async mounted() {
    this.list = this.records;
    if (this.showingCommunity && this.showingCommunity.rewardPrice) {
      this.price = this.showingCommunity.rewardPrice
    }else {
      const prices = await getPriceFromOracle(EVM_CHAINS_ID[this.curation.chainId], [{token: this.curation.token, decimals: this.curation.decimals}])
      this.price = prices[this.curation.token]
    }
  },
  methods: {
    parseTimestamp,
    formatAmount,
    showingReward(reward) {
      let amount = 0;
      let p = 0;
      if (reward.amount > 0) {
        amount = reward.amount / (10 ** reward.decimals)
      }else if (reward.estimateAmount > 0) {
        amount = reward.estimateAmount / (10 ** reward.decimals)
      }
      return `${formatAmount(amount)}(${formatPrice(amount * this.price)})`
    },
    onLoad() {
      let time;
      if (this.list.length > 0 && !this.refreshing) {
        time = this.list[this.list.length - 1].createAt
      }
      getAutoCurationRecord(this.curation.curationId, time).then(list=>{
          if(this.refreshing) this.list = []
          this.refreshing = false
          this.finished = list.length<30
          this.list = this.list.concat(list)
        }).finally(r => {
          this.loading = false
          this.refreshing = false
        })
    }
  }
}
</script>

<style scoped>

</style>
