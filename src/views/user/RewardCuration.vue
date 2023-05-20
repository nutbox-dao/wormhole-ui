<template>
  <div class="">
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
    <div class="text-center" v-if="rewards.length>3 && list.length<rewards.length">
      <button class="text-color62 my-10px flex items-center justify-center mx-auto px-15px py-8px"
              @click="list = rewards">
        <span>{{$t('common.viewMore')}}</span>
        <img class="w-12px h-12px ml-10px" src="~@/assets/icon-arrow-primary.svg" alt="">
      </button>
    </div>
  </div>

</template>

<script>
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
    }
  },
  data() {
    return{
      refreshing: false,
      loading: false,
      finished: false,
      list: []
    }
  },
  mounted() {
    this.onLoad()
  },
  methods: {
    formatAmount,
    parseTimestamp,
    onLoad() {
      this.list = (this.width>=961? this.rewards : this.rewards.slice(0,3))
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.onLoad();
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
