<template>
  <div class="bg-blockBg light:bg-colorF7F2/50 light:shadow-md p-15px rounded-12px mt-15px
              2md:flex 2md:gap-15px text-14px">
    <div class="flex-1 flex flex-col justify-between">
      <div class="flex items-center">
        <img class="bg-color62 rounded-full w-34px h-34px"
             :src="community.communityIcon" alt="">
        <span class="ml-10px c-text-black">{{ community.communityName }}</span>
      </div>
      <div class="flex overflow-hidden rounded-full border-1 border-color62 mt-20px">
        <button class="tab h-32px text-12px sm:text-14px flex-1"
                :class="tabIndex===0?'bg-color62 text-white':'bg-colorF1 text-color62'"
                @click="tabIndex=0">
          {{ $t('common.curation') }}
        </button>
        <button class="tab h-32px text-12px sm:text-14px flex-1"
                :class="tabIndex===1?'bg-color62 text-white':'bg-colorF1 text-color62'"
                @click="tabIndex=1">
          {{ $t('common.author') }}
        </button>
      </div>
      <div class="bg-color62/10 reward-box rounded-12px overflow-hidden p-15px mt-15px
                  flex flex-col justify-between items-center">
        <div class="w-full flex items-center">
          <img class="w-40px h-40px rounded-full mr-10px" :src="TokenIcon[community.tokenSymbol]" alt="">
          <div class="flex flex-col items-start">
            <span class="font-bold mb-4px text-14px">{{ community.tokenSymbol }}</span>
            <span class="text-12px text-color7D">{{ formatAmount(totalReward) }}({{ formatPrice(totalReward * price) }})</span>
          </div>
        </div>
        <button class="gradient-btn gradient-bg-color3 w-full rounded-full px-15px h-30px text-4px mt-5px">
          {{$t('walletView.withdraw')}}
        </button>
      </div>
    </div>
    <div class="mt-15px 2md:mt-0 flex-1 flex flex-col overflow-hidden"
         :class="list.length>2?'2md:h-212px 2md:max-h-212px':''">
      <div class="flex justify-between items-center mb-8px">
        <span class="font-bold text-left text-16px">{{$t('walletView.record')}}</span>
        <button class="flex items-center text-14px">
          <span class="light:opacity-40">{{$t('walletView.historyRecord')}}</span>
          <i class="icon-back w-12px h-12px transform -rotate-180 light:opacity-40"></i>
        </button>
      </div>
      <div v-if="list.length===0"
           class="px-1.5rem rounded-12px min-h-160px flex justify-center items-center">
        <div class="c-text-black text-color7D text-14px mb-2rem">{{$t('walletView.claimedAllRewards')}}</div>
      </div>
      <div v-else
           class="flex-1 no-scroll-bar 2md:overflow-auto reward-list"
           :class="isExpand?'expand':''">
        <div v-for="(item, index) of list" :key="index"
             class="border-b-1px border-listBgBorder py-15px flex justify-between items-center">
          <div class="flex-1 flex justify-between items-center">
            <ChainTokenIcon height="30px" width="30px"
                            :token="{symbol: item.tokenSymbol, address: item.token}"
                            :chainName="EVM_CHAINS_ID[community.chainId]">
              <template #amount>
                <span class="px-8px c-text-black whitespace-nowrap flex items-center text-14px 2xl:text-0.8rem">
                  {{ formatAmount(item.amount.toString() / ( 10 ** item.decimals)) + ' ' + item.tokenSymbol }}
                </span>
              </template>
            </ChainTokenIcon>
            <span class="text-color8B text-12px font-500">
              {{ parseTimestamp(item.createAt) }}
            </span>
          </div>
          <button class="flex items-center"
                  @click="gotoDetail(item)">
            <img class="w-12px transform -rotate-90 ml-10px"
                 src="~@/assets/icon-select-arrow.svg" alt="">
          </button>
        </div>
      </div>
      <div class="2md:hidden pt-15px">
        <button class="text-color8B flex items-center justify-center mx-auto" @click="isExpand=!isExpand">
<!--          <span>{{$t('common.all')}}</span>-->
          <img class="w-12px transform spin-slow"
               :class="isExpand?'rotate-180':'rotate-0'"
               src="~@/assets/icon-select-arrow.svg" alt="">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
import ChainTokenIcon from "@/components/ChainTokenIcon";
import {useWindowSize} from "@vant/use";
import {parseTimestamp, formatAmount, formatPrice} from "@/utils/helper";
import { mapGetters } from 'vuex'
import { EVM_CHAINS, EVM_CHAINS_ID } from "@/config";
import { getPriceFromOracle } from '@/utils/asset'


export default {
  name: "CommunityRewardItem",
  components: {ChainTokenIcon},
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  props: {
    communityId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      TokenIcon,
      tabIndex: 0,
      rewardList: [],
      authorList: [],
      EVM_CHAINS_ID,
      EVM_CHAINS,
      price: {},
      isExpand: false
    }
  },
  computed: {
    ...mapGetters('curation', ['getRewardCommunityInfo', 'getCommunityRewards', 'getCommunityAuthorRewards']),
    community() {
      if (this.rewards && this.rewards.length > 0) {
        return this.rewards[0]
      }
      return {}
    },
    rewards() {
      if (this.communityId) {
        return this.getCommunityRewards(this.communityId);
      }
      return []
    },
    authorRewards() {
      if (this.communityId) {
        return this.getCommunityAuthorRewards(this.communityId);
      }
      return []
    },
    totalRewards() {
      if (this.rewards.length > 0) {
        return this.rewards.reduce((s, t) => s + t.amount / (10 ** t.decimals), 0)
      }
      return 0
    },
    totalAuthorReward() {
      if (this.authorRewards.length > 0) {
        return this.authorRewards.reduce((s, t) => s + t.amount / (10 ** t.decimals), 0)
      }
      return 0
    },
    totalReward() {
      if (this.tabIndex === 0) {
        return this.totalRewards;
      }else {
        return this.totalAuthorReward;
      }
    },
    list() {
      if (this.tabIndex === 0) {
        return this.rewardList;
      }else {
        return this.authorList
      }
    }
  },
  mounted() {
    getPriceFromOracle(EVM_CHAINS_ID[this.community.chainId], [
      this.community
    ]).then(res => {
      this.price = res[this.community.token];
    })
    this.rewardList = (this.width>=961? this.rewards : this.rewards.slice(0,3))
    this.authorList = (this.width>=961? this.authorRewards : this.authorRewards.slice(0,3))
  },
  methods: {
    parseTimestamp,
    formatAmount,
    formatPrice,
    gotoDetail() {}
  }
}
</script>

<style scoped lang="scss">
@media (max-width: 960px) {

  .reward-list {
    transition: max-height ease-in-out 0.5s;
    max-height: 183px;
    overflow: hidden;
    &.expand {
      max-height: 10000px;
    }
  }
}
</style>
