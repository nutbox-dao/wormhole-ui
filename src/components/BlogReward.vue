<template>
  <div class="flex items-center">
    <el-tooltip v-if="isPopover" :show-after="500" :teleported="teleported">
      <template #content>
        <div v-if="showCuratedTip" class="text-white light:text-black max-w-240px">
          <template v-if="rewards && rewards.length > 0">
            <div v-for="reward of rewards"
                 :key="post.postId + reward.token">
              <ChainTokenIcon  height="20px" width="20px"
                               class="bg-color62 my-4px p-2px"
                               :token="{symbol: reward.tokenSymbol, address: reward.token, icon: post.communityIcon}"
                               :chainName="reward.chainId?.toString()">
                <template #amount>
                  <span class="px-8px c-text-black text-white whitespace-nowrap flex items-right text-14px 2xl:text-0.8rem">
                    {{reward.reward + " " + reward.tokenSymbol}}
                  </span>
                </template>
              </ChainTokenIcon>
              <div class="border-1 border-color8B/30 bg-white rounded-full h-20px text-12px
                          flex items-center light:shadow-color1A px-8px mt-6px">
                <span class="text-color62 mr-4px">{{$t('common.author')}}:</span>
                <span class="text-black">{{ reward.authorReward }} {{reward.tokenSymbol}}</span>
              </div>
              <div class="border-1 border-color8B/30 bg-white rounded-full h-20px text-12px
                          flex items-center light:shadow-color1A px-8px mt-6px">
                <span class="text-color62 mr-4px">{{$t('common.curator')}}:</span>
                <span class="text-black">{{ reward.curationReward }} {{reward.tokenSymbol}}</span>
              </div>
            </div>
          </template>
          <div v-if="post.endtime*1000>new Date().getTime()">
            <div class="text-12px mt-8px text-left"><span class="text-color62">estimated</span> amount for reference</div>
            <div class="flex items-center text-12px font-bold">
              <span class="whitespace-nowrap mr-10px mt-8px">{{ $t('curation.endTime') }}:</span>
              <van-count-down v-if="post.endtime" class="text-color62 mt-8px"
                              :time="countdown(post.endtime)">
                <template #default="timeData">
                  <span v-if="timeData.days>0">
                    {{ timeData.days }} d {{ timeData.hours }} h {{ timeData.minutes }} m
                  </span>
                  <span v-else-if="timeData.hours>0">
                    {{ timeData.hours }} h {{ timeData.minutes }} m {{ timeData.seconds }} s
                  </span>
                  <span v-else>
                    {{ timeData.minutes }} m {{ timeData.seconds }} s
                  </span>
                </template>
              </van-count-down>
            </div>
          </div>
          <div v-else class="text-12px mt-6px text-left">amount settled already</div>
        </div>
        <div v-else class="min-w-130px text-center">
          <img class="w-20px mx-auto my-8px" src="~@/assets/icon-loading.svg" alt="">
        </div>
      </template>
      <button @click.stop @mouseover="getTip" class="flex items-center">
        <img class="w-14px h-14px min-w-14px" src="~@/assets/icon-coin-primary.svg" alt="">
        <span class="px-8px font-700 text-12px text-color62">{{ totalPrice }}</span>
      </button>
    </el-tooltip>
    <div v-else class="text-white light:text-black flex-1 relative">
      <div class="h-24px absolute right-0 flex items-center">({{totalPrice}})</div>
      <template v-if="rewards && rewards.length > 0">
        <div v-for="reward of rewards"
             :key="post.postId + reward.token" class="w-full">
          <ChainTokenIcon  height="20px" width="20px"
                           class="bg-color62 my-4px p-2px"
                           :token="{symbol: reward.tokenSymbol, address: reward.token, icon: post.communityIcon}"
                           :chainName="reward.chainId?.toString()">
            <template #amount>
                  <span class="px-8px c-text-black text-white whitespace-nowrap flex items-right text-14px 2xl:text-0.8rem">
                    {{reward.reward + " " + reward.tokenSymbol}}
                  </span>
            </template>
          </ChainTokenIcon>
          <div class="w-full flex flex-wrap justify-between gap-x-8px gap-y-2px mb-6px">
            <div class="border-1 flex-1 border-color8B/30 bg-white rounded-full h-20px text-12px
                          flex items-center light:shadow-color1A px-8px mt-6px whitespace-nowrap">
              <span class="text-color62 mr-4px">{{$t('common.author')}}:</span>
              <span class="text-black whitespace-nowrap">{{ reward.authorReward }} {{reward.tokenSymbol}}</span>
            </div>
            <div class="border-1 flex-1 border-color8B/30 bg-white rounded-full h-20px text-12px
                          flex items-center light:shadow-color1A px-8px mt-6px whitespace-nowrap">
              <span class="text-color62 mr-4px">{{$t('common.curator')}}:</span>
              <span class="text-black whitespace-nowrap">{{ reward.curationReward }} {{reward.tokenSymbol}}</span>
            </div>
          </div>
          <template v-if="post.endtime*1000>new Date().getTime()">
            <div class="text-12px text-left"><span class="text-color62">estimated</span> amount for reference</div>
            <div class="flex items-center text-12px font-bold">
              <span class="whitespace-nowrap mr-10px mt-8px">{{ $t('curation.endTime') }}:</span>
              <van-count-down v-if="post.endtime" class="text-color62 mt-8px"
                              :time="countdown(post.endtime)">
                <template #default="timeData">
                  <span v-if="timeData.days>0">
                    {{ timeData.days }} d {{ timeData.hours }} h {{ timeData.minutes }} m {{ timeData.seconds }} s
                  </span>
                  <span v-else-if="timeData.hours>0">
                    {{ timeData.hours }} h {{ timeData.minutes }} m {{ timeData.seconds }} s
                  </span>
                  <span v-else>
                    {{ timeData.minutes }} m {{ timeData.seconds }} s
                  </span>
                </template>
              </van-count-down>
            </div>
          </template>
          <div v-else class="text-12px text-left">amount settled already</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ChainTokenIcon from "@/components/ChainTokenIcon";
import debounce from "lodash.debounce";
import {getCurationRewardsOfPost} from "@/api/api";
import {formatAmount, formatPrice} from "@/utils/helper";
import {getPriceFromOracle} from "@/utils/asset";
import {isNumeric} from "@/utils/tool";
import { EVM_CHAINS_ID } from '@/config'
export default {
  name: "BlogReward",
  components: {ChainTokenIcon},
  props: {
    isPopover: {
      type: Boolean,
      default: true
    },
    post: {
      type: Object,
      default: () => {
        return {}
      }
    },
    teleported: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showCuratedTip: true,
      rewards: [],
      totalPrice: '0.00',
      curationPrice: '0.00',
      authorPrice: '0.00'
    }
  },
  computed: {
    curationType() {
      return this.post.curationType
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
            // total reward
            let reward = '???'
            let amount = '???'
            // curator reward
            let curationReward = '???'
            let curationAmount = '???'
            // author reward
            let authorReward = '???'
            let authorAmount = '???'

            if (r.amount && r.amount != 0 && r.amount !='0') {
              amount = r.amount / (10 ** r.decimals)
              curationAmount = amount
              curationReward = formatAmount(amount)
              if (r.authorReward > 0 && r.isPromotion == 1) {
                amount += r.authorReward / (10 ** r.decimals)
                authorAmount = r.authorReward / (10 ** r.decimals);
                authorReward = formatAmount(authorAmount)
              }
              reward = formatAmount(amount);
            }else if(r.estimateAmount && r.estimateAmount != 0 && r.estimateAmount != '0') {
              amount = r.estimateAmount / (10 ** r.decimals)
              curationAmount = amount
              curationReward = formatAmount(curationAmount)
              if (r.isPromotion === 1) {
                amount += r.estimateAuthorReward / (10 ** r.decimals)
                authorAmount = r.estimateAuthorReward / (10 ** r.decimals);
                authorReward = formatAmount(authorAmount)
              }
              reward = formatAmount(amount)
            }
            return {
              ...r,
              reward,
              amount,
              curationAmount,
              curationReward,
              authorAmount,
              authorReward
            }
          });
          let totalPrice = 0;
          let curationPrice = 0;
          let authorPrice = 0;
          let communityPrice = this.showingCommunity?.rewardPrice ?? 0;

          if (!communityPrice) {
            communityPrice = await getPriceFromOracle(res[0].chainId, res)
            communityPrice = communityPrice[res[0].token]
          };
          if (this.rewards[0].amount !== '???'){
            totalPrice += parseFloat(this.rewards[0].amount) * parseFloat(communityPrice ?? 0)
            curationPrice += parseFloat(this.rewards[0].curationAmount) * parseFloat(communityPrice ?? 0)
            authorPrice += parseFloat(this.rewards[0].authorAmount) * parseFloat(communityPrice ?? 0)
          }
          if (totalPrice > 0) {
            this.totalPrice = formatPrice(totalPrice)
            this.curationPrice = formatPrice(curationPrice)
            this.authorPrice = formatPrice(authorPrice)
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
