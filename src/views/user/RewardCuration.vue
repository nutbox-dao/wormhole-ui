<template>
  <div class="px-1.5rem">
        <div class="c-list">
          <div v-for="(item, index) of rewards" :key="index"
               class="border-b-1px border-listBgBorder py-1rem flex justify-between items-center">
            <ChainTokenIcon height="40px" width="40px" class=" p-2px"
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
import { formatAmount, parseTimestamp } from "@/utils/helper";

export default {
  name: "RewardCuration",
  components: {ChainTokenIcon},
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
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    gotoDetail(curation) {
      // this.$store.commit('curation/saveDetailCuration', curation);
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
