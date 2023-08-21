<template>
  <div class="">
    <div v-for="(item, index) of rewards" :key="index"
         class="flex justify-between items-center py-8px">
      <div class="flex-1 flex justify-between items-center">
        <ChainTokenIcon height="30px" width="30px"
                        :token="{symbol: item.tokenSymbol, address: item.token}"
                        :chainName="chainName">
          <template #amount>
          <span class="px-8px whitespace-nowrap flex items-center text-12px text-white light:text-color66 font-500">
            {{ formatAmount(item.amount.toString() / ( 10 ** item.decimals)) + ' ' + item.tokenSymbol }}
          </span>
          </template>
        </ChainTokenIcon>
        <span class="text-color8B text-12px font-500">{{ parseTimestamp(item.createAt) }}</span>
      </div>
      <button class="flex items-center"
              @click="gotoDetail(item)">
        <img class="w-12px transform -rotate-90 ml-10px"
             src="~@/assets/icon-select-arrow.svg" alt="">
      </button>
    </div>
    <div class="text-center">
      <button class="text-color8B flex items-center justify-center mx-auto"
              @click="$emit('fold')">
        <span>{{$t('common.fold')}}</span>
        <img class="w-12px transform -rotate-90 ml-10px"
             src="~@/assets/icon-select-arrow.svg" alt="">
      </button>
    </div>
  </div>

</template>

<script>
// This vue is for promotion page card list
import ChainTokenIcon from "@/components/ChainTokenIcon";
import { formatAmount, parseTimestamp } from "@/utils/helper";
import {useWindowSize} from "@vant/use";

export default {
  name: "RewardCuration",
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
    },
    token: {
      type: String,
      default: ''
    }
  },
  data() {
    return{
      refreshing: false,
      loading: false,
      finished: false,
    }
  },
  mounted() {
    this.onLoad()
  },
  methods: {
    formatAmount,
    parseTimestamp,
    onLoad() {
    },
    onRefresh() {
    },
    gotoDetail(curation) {
      this.$store.commit('postsModule/saveCurrentShowingDetail', null);
      this.$router.push('/post-detail/' + curation.tweetId);
    }
  }
}
</script>

<style scoped>
.c-list :last-child {
  border: none;
}
</style>
