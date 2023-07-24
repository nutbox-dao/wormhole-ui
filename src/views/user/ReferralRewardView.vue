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
          <div v-if="(!inviteRewards || Object.keys(inviteRewards).length === 0)" class="py-2rem">
            <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
            <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
          </div>
          <ReferralRewardItem v-else v-for="communityId of Object.keys(inviteRewards)" :key="communityId"
                              :community-id="communityId"></ReferralRewardItem>
        </div>
      </div>
    </van-list>

    <el-dialog v-model="historyModalVisible"
               class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <RewardHistoryList
        :chain-id="chainIds[chainTab]"
        :type="'promotion'"
          class="max-h-70vh overflow-hidden bg-blockBg light:bg-white p-15px rounded-12px"></RewardHistoryList>
    </el-dialog>
  </van-pull-refresh>
</template>
<!-- this is for promotion reward -->
<script>
import { mapGetters, mapState } from 'vuex'
import {notify} from "@/utils/notify";
import {formatAddress} from "@/utils/tool";
import { EVM_CHAINS, EVM_CHAINS_ID } from '@/config';
import { formatAmount } from '@/utils/helper'
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { setupNetwork } from '@/utils/web3/web3'
import { setCurationIsFeed,
  getCommunityPendingRewards, getCommunityAuthorPendingRewards, setCommunityRewardClaimed,
  setCommunityAuthorRewardClaimed, getPendingClaimSummary } from '@/api/api'
import {TokenIcon} from "@/config";
import {useWindowSize} from "@vant/use";
import ReferralRewardItem from "@/components/ReferralRewardItem";

import RewardHistoryList from "@/components/RewardHistoryList";

export default {
  components: {ReferralRewardItem, RewardHistoryList},
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
      loadingCommunityRewards: false,
      collapseNames: [],
      listLoading: false,
      listFinished: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('curation', ['getRewardCommunityInfo', 'getCommunityRewards', 'getCommunityAuthorRewards']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapState('curation', ['rewardLists', 'communityRewards', 'communityAuthorRewards', 'inviteRewards']),
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
      this.getCommunityRewardsM(true);
    },
    async getCommunityRewardsM(force = false) {
      try{
        if (this.loadingCommunityRewards) return;
        this.loadingCommunityRewards = true;
        const currentList = this.inviteRewards;
        if (currentList && Object.keys(currentList).length > 0 && !force) {
          return;
        }
        let summary = await getPendingClaimSummary(this.getAccountInfo.twitterId)
        this.$store.commit('curation/saveInviteRewards', summary)
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
        }
        console.log('error', e);
      } finally {
        this.loadingCommunityRewards = false
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
    checkboxGroupChange(token) {
      const index = this.checkRewardList.indexOf(token)
      if(index>=0) {
        this.checkRewardList.splice(index, 1)
      } else {
        this.checkRewardList.push(token)
      }
    },
    onLoad() {

    }
  },
  mounted () {
    if (this.twitterId && !this.getAccountInfo) {
      this.needLogin = true
    }
    this.getCommunityRewardsM(true);
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
