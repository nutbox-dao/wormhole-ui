<template>
  <div class="flex items-center">
    <el-tooltip :show-after="500" :teleported="false">
      <template #content>
        <div v-if="showCuratedTip" class="text-white light:text-black max-w-200px">
          <template v-if="rewards && rewards.length > 0">
            <ChainTokenIcon v-for="reward of rewards"
                            :key="post.postId + reward.token" height="20px" width="20px"
                            class="bg-color62 my-4px p-2px"
                            :token="{symbol: reward.tokenSymbol, address: reward.token}"
                            :chainName="reward.chainId?.toString()">
              <template #amount>
                  <span class="px-8px c-text-black text-white whitespace-nowrap flex items-right text-14px 2xl:text-0.8rem">
                    {{reward.reward + " " + reward.tokenSymbol}}
                  </span>
              </template>
            </ChainTokenIcon>
          </template>
        </div>
        <div v-else class="min-w-130px text-center">
          <img class="w-20px mx-auto my-8px" src="~@/assets/icon-loading.svg" alt="">
        </div>
      </template>
      <button @click.stop @mouseover="getTip" class="flex items-center">
        <img class="w-14px h-14px min-w-14px" src="~@/assets/icon-coin-primary.svg" alt="">
        <span class="px-8px font-700 text-12px text-color62">{{ price }}</span>
      </button>
    </el-tooltip>
  </div>
</template>

<script>
import ChainTokenIcon from "@/components/ChainTokenIcon";
import debounce from "lodash.debounce";
import {getCurationRewardsOfPost} from "@/api/api";
import {formatAmount, formatPrice} from "@/utils/helper";
import {getPriceFromOracle} from "@/utils/asset";
export default {
  name: "BlogReward",
  components: {ChainTokenIcon},
  props: {
    post: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      showCuratedTip: true,
      rewards: [],
      price: '0.00'
    }
  },
  mounted() {
    this.getRewards()
  },
  methods: {
    getTip: debounce(function t() {
      // get rewards
      // if (this.rewards && this.rewards.length > 0) {
      //   this.showCuratedTip = true
      // }else {
      //   this.getRewards();
      // }
    }, 500),
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
