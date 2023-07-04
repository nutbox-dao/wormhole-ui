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

      <div class="mt-8px text-12px text-color62 text-center italic px-10px">{{$t('curation.rewardTip')}}</div>
      <div class="flex justify-between items-center px-15px pt-15px pb-8px text-left border-b-0.5px border-color8B/30 gap-10px">
        <span class="w-3/7">{{$t('curation.attended')}}</span>
        <span class="w-2/7 text-right">{{$t('community.curationCredit')}}</span>
        <span class="w-2/7 text-right">{{$t('curation.reward')}}</span>
      </div>
    </div>
    <div class="flex-1 overflow-auto pb-15px no-scroll-bar">
      <div class="flex justify-between items-center py-1rem px-1.5rem text-left border-b-0.5px border-color8B/30 gap-10px"
           v-for="record of (records ?? [])" :key="record.id">
        <div class="w-3/7 flex items-center cursor-pointer truncate"
             @click="$router.push('/account-info/@' + record.twitterUsername)">
          <img class="w-30px min-w-30px h-30px rounded-full border-1 gradient-border "
               :src="record.profileImg" alt="">
          <div class="text-12px leading-18px ml-8px truncate">
            {{record.twitterUsername}}
          </div>
        </div>
        <div class="w-2/7 text-right">10000</div>
        <div class="w-2/7 text-right">$0.0</div>
      </div>
    </div>
  </div>
</template>

<script>
import {parseTimestamp, formatAmount, formatPrice} from "@/utils/helper";
import ChainTokenIcon from "@/components/ChainTokenIcon";
import {getPriceFromOracle} from "@/utils/asset";
import BlogReward from "@/components/BlogReward.vue";
import {isNumeric} from "@/utils/tool";

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
      rewards: [],
      price: '0.00'
    }
  },
  mounted() {
    this.getRewards()
  },
  methods: {
    countdown(time) {
      if(!time || !isNumeric(time)) return 0
      return time*1000 - new Date().getTime()
    },
    parseTimestamp,
    formatAmount,
    async getRewards() {
      // getCurationRewardsOfPost(this.post.postId).then(async res => {
      const res = this.post.reward
      if (res && res.length > 0) {
        this.rewards = res.map(r => {
          let reward = '???'
          let amount = '???'

          if (r.amount > 0) {
            amount = r.amount / (10 ** r.decimals)
            if (r.authorReward > 0 && r.isPromotion == 1) {
              amount += r.authorReward / (10 ** r.decimals)
            }
            reward = formatAmount(amount);
          }
          return {
            ...r,
            reward,
            amount
          }
        });
        const prices = await Promise.all(this.rewards.map(reward => getPriceFromOracle(reward.chainId, [reward])));
        let price = 0;
        for (let i = 0; i < prices.length; i++) {
          const p = prices[i];
          if (p) {
            if (this.rewards[i].amount !== '???'){
              price += parseFloat(this.rewards[i].amount) * parseFloat(p[this.rewards[i].token] ?? 0)
            }
          }
        }
        if (price > 0) {
          this.price = formatPrice(price)
        }
      }else {
        this.rewards = []
      }
      // }).catch(e => {this.rewards = []; console.log(4, e)}).finally(() => this.showCuratedTip = true)
    },
  }
}
</script>

<style scoped>

</style>
