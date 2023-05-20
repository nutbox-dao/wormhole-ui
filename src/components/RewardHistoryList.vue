<template>
  <div class="flex flex-col">
    <div class="font-bold text-left text-20px py-10px">{{$t('walletView.record')}}</div>
    <div class="flex-1 overflow-auto no-scroll-bar">
      <div v-for="(item, index) of list" :key="index"
           v-infinite-scroll="onLoad"
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
  </div>
</template>

<script>
import ChainTokenIcon from "@/components/ChainTokenIcon";
import {formatAmount, parseTimestamp} from "@/utils/helper";

export default {
  name: "RewardHistoryList",
  components: {ChainTokenIcon},
  props: {
    chainName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    formatAmount,
    parseTimestamp,
    gotoDetail() {},
    onLoad() {

    }
  }
}
</script>

<style scoped>

</style>
