<template>
  <van-pull-refresh v-model="loading[chainTab]" @refresh="onRefresh"
                    class=""
                    :loading-text="$t('common.loading')"
                    pulling-text="Pull to refresh data"
                    loosing-text="Release to refresh">
    <van-list :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              :loosing-text="$t('common.pullRefresh')"
              :loading-text="$t('common.loading')"
              :finished-text="$t('common.noMore')"
              @load="onLoad">
      <div class="sm:max-w-600px lg:max-w-35rem mx-auto px-15px">
        <div class="mt-30px">
          <img v-if="loadingSpaceRewards && getSpaceRewardCommunityInfo.length===0"
               class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
          <div v-else-if="(!getSpaceRewardCommunityInfo || getSpaceRewardCommunityInfo.length === 0)" class="py-2rem">
            <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
            <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
          </div>
          <SpaceRewardItem v-else v-for="communityId of getSpaceRewardCommunityInfo" :key="communityId"
                              :community-id="communityId"></SpaceRewardItem>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>
<!-- this is for promotion reward -->
<script>
import { mapGetters, mapState } from 'vuex'
import {notify} from "@/utils/notify";
import {formatAddress} from "@/utils/tool";
import { EVM_CHAINS, EVM_CHAINS_ID } from '@/chain-config';
import { formatAmount } from '@/utils/helper'
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { setupNetwork } from '@/utils/web3/web3'
import { getSpaceCurationRewardList } from '@/api/api'
import {TokenIcon} from "@/chain-config";
import {useWindowSize} from "@vant/use";
import SpaceRewardItem from "@/components/SpaceRewardItem";

import RewardHistoryList from "@/components/RewardHistoryList";

export default {
  components: {SpaceRewardItem, RewardHistoryList},
  name: 'SpaceRewardView',
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  data() {
    return {
      chainTab: 0,
      loading: [false, false, false, false, false, false],
      claiming: false,
      connecting: false,
      prices: [],
      checkRewardList: [],
      TokenIcon,
      historyModalVisible: false,
      loadingSpaceRewards: false,
      collapseNames: [],
      listLoading: false,
      listFinished: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('curation', ['getSpaceCommunityRewards', 'getSpaceRewardCommunityInfo']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapState('curation', ['rewardLists', 'spaceRewards']),
    chainNames() {
      return Object.keys(EVM_CHAINS)
    },
    chainIds() {
      return Object.values(EVM_CHAINS).map(c => c.id)
    },
    accountMismatch() {
      return this.getAccountInfo.ethAddress !== this.account
    }
  },
  methods: {
    formatAddress,
    formatAmount,
    onRefresh() {
      this.getSpaceCurationRewards(true);
    },
    async getSpaceCurationRewards(force = false) {
      try{
        if (this.loadingSpaceRewards) return;
        this.loadingSpaceRewards = true;
        const currentList = this.spaceRewards;
        if (currentList && Object.keys(currentList).length > 0 && !force) {
          return;
        }
        let allRecords = await getSpaceCurationRewardList(this.getAccountInfo.twitterId)
        allRecords = this.handleRewardsAmount(allRecords);

        this.$store.commit('curation/saveSpaceRewards', allRecords ?? [])
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
        }
        console.log('error', e);
      } finally {
        this.loadingSpaceRewards = false
      }
    },
    async connect() {
      try {
        this.connecting = true
        const chainName = this.chainTab >= this.chainNames.length ? 'BNB Smart Chain' : this.chainNames[this.chainTab]
        const connected = await setupNetwork(chainName)
        if (connected) {

        }else {

        }
      } catch (e) {
        console.log('connect wallet fail:', e);
      } finally{
        this.connecting = false
      }
    },
    handleRewardsAmount(rewards) {
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
    if (this.twitterId && !this.getAccountInfo) {
      this.needLogin = true
      this.$router.push('/')
    }
    this.getSpaceCurationRewards(true);
  },
}
</script>

<style scoped lang="scss">
.active-tab {
  position: relative;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    height: 6px;
    width: 100%;
    background: linear-gradient(270deg, #000000 0%, #9B7CF6 42%, #6246EA 100%);
    border-radius: 3px;
    z-index: -1;
  }
}
.light .active-tab::before {
  background: linear-gradient(270deg, #FFFFFF 0%, #9B7CF6 42%, #6246EA 100%);
}
</style>
