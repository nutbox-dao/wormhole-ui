<template>
  <van-pull-refresh v-model="isRefresh" @refresh="onRefresh"
                    class="h-full"
                    :loading-text="$t('common.loading')"
                    pulling-text="Pull to refresh data"
                    loosing-text="Release to refresh">
    <div class="h-full overflow-auto">
      <div class="sm:max-w-600px lg:max-w-35rem mx-auto px-15px">
        <div class="mt-30px">
          <div class="text-16px c-text-black active-tab w-max">{{$t('walletView.communityReward')}}</div>
          <img v-if="loadingCommunityRewards && getRewardCommunityInfo.length===0"
               class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
          <div v-else-if="(!getRewardCommunityInfo || getRewardCommunityInfo.length === 0)" class="py-2rem">
            <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
            <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
          </div>
          <CommunityRewardItem v-else v-for="communityId of getRewardCommunityInfo" :key="communityId"
                               :community-id="communityId"></CommunityRewardItem>
        </div>
      </div>
    </div>
  </van-pull-refresh>
</template>
<!-- this is for promotion reward -->
<script>
import { mapGetters, mapState } from 'vuex'
import {formatAddress} from "@/utils/tool";
import { EVM_CHAINS, EVM_CHAINS_ID } from '@/chain-config';
import { checkCommunityRewards } from '@/utils/curation'
import ChainTokenIcon from '@/components/ChainTokenIcon'
import { formatAmount } from '@/utils/helper'
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { setupNetwork } from '@/utils/web3/web3'
import { getCommunityPendingRewards, getCommunityAuthorPendingRewards } from '@/api/api'
import {TokenIcon} from "@/chain-config";
import {useWindowSize} from "@vant/use";
import CommunityRewardItem from "@/components/community/CommunityRewardItem";
import RewardHistoryList from "@/components/RewardHistoryList";

export default {
  components: { ChainTokenIcon, CommunityRewardItem, RewardHistoryList},
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
      isRefresh: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('curation', ['getRewardCommunityInfo', 'getCommunityRewards', 'getCommunityAuthorRewards']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapState('curation', ['rewardLists', 'communityRewards', 'communityAuthorRewards']),
    chainNames() {
      return Object.keys(EVM_CHAINS)
    },
    chainIds() {
      return Object.values(EVM_CHAINS).map(c => c.id)
    },
    showingList() {
      return this.rewardLists[this.chainTab]
    },
    summaryList() {
      if (this.rewardLists[this.chainTab].length > 0) {
        let result = {}
        for (let reward of this.rewardLists[this.chainTab]) {
          const sum = (result[reward.token]?.amount ?? 0)
          result[reward.token] = {
            ...reward,
            amount: sum + (reward.amount.toString() / (10 ** reward.decimals))
          }
        }
        return Object.values(result)
      }
      return []
    },
    accountMismatch() {
      return this.getAccountInfo.ethAddress !== this.account
    }
  },
  methods: {
    formatAddress,
    formatAmount,
    selectTab(index) {
      this.chainTab = index;
      this.checkRewardList = []
    },
    onRefresh() {
      this.isRefresh = true
      this.getCommunityRewardsM(true);
      this.isRefresh = false
    },
    async getCommunityRewardsM(force = false) {
      try{
        if (this.loadingCommunityRewards) return;
        this.loadingCommunityRewards = true;
        const currentList = this.communityRewards;
        if (currentList && currentList.length > 0 && !force) {
          return;
        }
        let [rewards, authorRewards] =
          await Promise.all([
            getCommunityPendingRewards(this.getAccountInfo.twitterId),
            getCommunityAuthorPendingRewards(this.getAccountInfo.twitterId)])

        if (rewards && rewards.length > 0) {
          this.$store.commit('curation/saveCommunityRewards', rewards)
        }
        if (authorRewards && authorRewards.length > 0) {
          this.$store.commit('curation/saveCommunityAuthorRewards', authorRewards)
        }
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
    }
  },
  mounted () {
    if (this.twitterId && !this.getAccountInfo) {
      this.needLogin = true
    }
    this.getCommunityRewardsM(true);
    accountChanged().catch()
    getAccounts(true).then(wallet => {
    }).catch();
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
