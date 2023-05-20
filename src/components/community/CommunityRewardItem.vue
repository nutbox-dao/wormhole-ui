<template>
  <div class="bg-blockBg light:bg-colorF7F9/50 light:shadow-md p-15px rounded-12px mt-15px
              2md:flex 2md:gap-15px">
    <div class="flex-1 flex flex-col justify-between">
      <div class="flex items-center">
        <img class="bg-color62 rounded-12px w-34px h-34px"
             src="~@/assets/icon-default-avatar.svg" alt="">
        <span class="ml-10px c-text-black">SpaceX</span>
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
                        flex justify-between items-center">
        <div class="flex items-center">
          <img class="w-40px h-40px rounded-full mr-10px" :src="TokenIcon['MATIC']" alt="">
          <div class="flex flex-col items-start">
            <span class="font-bold mb-4px">MATIC</span>
            <span class="text-14px text-color7D">0.001</span>
          </div>
        </div>
        <button class="gradient-btn gradient-bg-color3 rounded-full px-25px h-34px">
          {{$t('walletView.withdraw')}}
        </button>
      </div>
    </div>
    <div class="mt-15px 2md:mt-0 flex-1 flex flex-col overflow-hidden"
         :class="rewards.length>2?' 2md:h-212px':''">
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
      <div class="flex-1 overflow-auto no-scroll-bar">
        <div v-for="(item, index) of list" :key="index"
             class="border-b-1px border-listBgBorder py-15px flex justify-between items-center">
          <ChainTokenIcon height="30px" width="30px"
                          :token="{symbol: item.tokenSymbol, address: item.token}"
                          :chainName="chainName">
            <template #amount>
                <span class="px-8px c-text-black whitespace-nowrap flex items-center text-14px 2xl:text-0.8rem">
                  {{ formatAmount(item.amount.toString() / ( 10 ** item.decimals)) + ' ' + item.tokenSymbol }}
                </span>
            </template>
          </ChainTokenIcon>
          <div class="flex flex-col items-end">
            <button class="border-1 border-color62 rounded-full h-24px 2xl:h-1.4rem w-min whitespace-nowrap px-12px mb-8px"
                    @click="gotoDetail(item)">
              {{ $t('common.viewMore') }}
            </button>
            <span class="text-12px text-color8B light:text-color7D">{{ parseTimestamp(item.createAt) }}</span>
          </div>
        </div>
      </div>
      <div class="text-center" v-if="rewards.length>3 && list.length<rewards.length">
        <button class="text-color62 my-10px flex items-center justify-center mx-auto px-15px py-8px"
                @click="list = rewards">
          <span>{{$t('common.viewMore')}}</span>
          <img class="w-12px h-12px ml-10px" src="~@/assets/icon-arrow-primary.svg" alt="">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
import ChainTokenIcon from "@/components/ChainTokenIcon";
import {useWindowSize} from "@vant/use";
import {parseTimestamp, formatAmount} from "@/utils/helper";

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
    rewards: {
      type: Array,
      default: []
    },
    chainName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      TokenIcon,
      tabIndex: 0,
      list: [],
    }
  },
  mounted() {
    this.list = (this.width>=961? this.rewards : this.rewards.slice(0,3))
  },
  methods: {
    parseTimestamp,
    formatAmount,
    gotoDetail() {}
  }
}
</script>

<style scoped>

</style>
