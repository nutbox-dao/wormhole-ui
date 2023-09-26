<template>
  <div class="flex flex-col">
    <div class="font-bold text-left text-20px py-10px">{{$t('walletView.record')}}</div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="refreshing && (!list || list.length === 0)">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <div v-else-if="!refreshing && (!list || list.length === 0)" class="py-2rem">
        <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
        <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
      </div>
    <div v-else class="flex-1 overflow-auto no-scroll-bar">
      <van-list :loading="loading"
                  :finished="finished"
                  :immediate-check="false"
                  :loading-text="$t('common.loading')"
                  :finished-text="list.length!==0?$t('common.noMore'):''"
                  @load="onLoad">
          <div v-for="(item, index) of list" :key="index"
              v-infinite-scroll="onLoad"
              class="border-b-1px border-listBgBorder py-15px flex justify-between items-center">
            <ChainTokenIcon height="30px" width="30px"
                            :token="{symbol: item.tokenSymbol, address: item.token}"
                            :chainName="EVM_CHAINS_ID[chainId || community.chainId]">
              <template #amount>
                    <span class="px-8px c-text-black whitespace-nowrap flex items-center text-14px 2xl:text-0.8rem">
                      {{ formatAmount(type === 'space' 
                        ? item.totalAmount 
                        : (item.amount ? item.amount.toString() / ( 10 ** item.decimals) : 0)) + ' ' + item.tokenSymbol 
                      }}
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
        </van-list>
     
    </div>
  </div>
</template>

<script>
import ChainTokenIcon from "@/components/ChainTokenIcon";
import {formatAmount, parseTimestamp} from "@/utils/helper";
import { curationRewardListHistory, getCommunityHistoryRewards, getCommunityAuthorHistoryRewards, getSpaceCurationHistoryRewardList } from '@/api/api';
import { mapGetters } from "vuex";
import { EVM_CHAINS, EVM_CHAINS_ID } from "@/chain-config";

export default {
  name: "RewardHistoryList",
  components: {ChainTokenIcon},
  props: {
    chainId: {
      type: Number,
      default: 0
    },
    community: {
      type: Object,
      default: {}
    },
    type: {
      type: String,
      default: 'promotion'
    },
    isAuthor: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('curation', ['getRewardCommunityInfo', 'getCommunityRewards', 'getCommunityAuthorRewards']),
  },
  watch: {
    chainId(newValue, oldValue) {
      this.list = []
      this.finished = false;
      this.refreshing = false;
      this.loading = false;
      this.refresh()
    },
    isAuthor() {
      this.list = []
      this.finished = false;
      this.refreshing = false;
      this.loading = false;
      this.refresh()
    }
  },
  data() {
    return {
      list: [],
      refreshing: false,
      loading: false,
      finished: false,
      EVM_CHAINS_ID,
    }
  },
  methods: {
    formatAmount,
    parseTimestamp,
    gotoDetail() {},
    async onLoad() {
      try{
        if (this.refreshing || this.loading || this.finished || this.list.length === 0) return;
        this.loading = true;
        let list = [];
        if (this.type === 'promotion') {
          list = await curationRewardListHistory(this.getAccountInfo.twitterId, this.chainId, this.list[this.list.length - 1].createAt);
          this.list = this.list.concat(list);
        }else if (this.type === 'space') {
          list = await getSpaceCurationHistoryRewardList(this.getAccountInfo.twitterId, this.community.communityId, this.list[this.list.length - 1].createAt)
          list = this.handleSpaceRewardsAmount(list)
          this.list = this.list.concat(list);
        }else {
          if (this.isAuthor) {
            list = await getCommunityAuthorHistoryRewards(this.getAccountInfo?.twitterId, this.community.communityId, this.list[this.list.length - 1].createAt)
            this.list = this.list.concat(list);
          }else {
            list = await getCommunityHistoryRewards(this.getAccountInfo?.twitterId, this.community.communityId, this.list[this.list.length - 1].createAt)
            this.list = this.list.concat(list);
          }
        }
        if (list.length === 0) {
          this.finished = true;
        }
      } catch (e) {
        console.log(44, e);
      } finally {
        this.loading = false
      }
    },
    async refresh() {
      try{
        if (this.refreshing || this.loading) {
          return
        }
        this.refreshing = true
        let list = []
        if (this.type === 'promotion') {
          list = await curationRewardListHistory(this.getAccountInfo.twitterId, this.chainId);
          this.list = list;
        }else if (this.type === 'space') {
          list = await getSpaceCurationHistoryRewardList(this.getAccountInfo.twitterId, this.community.communityId)
          list = this.handleSpaceRewardsAmount(list)
          this.list = list;
        }else {
          if (this.isAuthor) {
            list = await getCommunityAuthorHistoryRewards(this.getAccountInfo?.twitterId, this.community.communityId)
            this.list = list;
          }else {
            list = await getCommunityHistoryRewards(this.getAccountInfo?.twitterId, this.community.communityId)
            this.list = list;
          }
        }
        if (list.length === 0) {
          this.finished = true;
        }
      } catch (e) {
        console.log(55, e);
      } finally {
        this.refreshing = false
      }
    },
    gotoDetail(curation) {
      this.$store.commit('postsModule/saveCurrentShowingDetail', null);
      this.$router.push('/post-detail/' + curation.tweetId);
    },
    handleSpaceRewardsAmount(rewards) {
      if (rewards.length == 0) return rewards;
      rewards.forEach(r => {
        r.hostNum = r.hostAmount / (10 ** r.decimals);
        r.speakerNum = r.speakerAmount / (10 ** r.decimals);
        r.curateNum = r.curateAmount / (10 ** r.decimals);
        r.totalAmount = r.hostNum + r.speakerNum + r.curateNum;
      });
      return rewards;
    }
  },
  mounted () {
    this.refresh();
  },
}
</script>

<style scoped>

</style>
