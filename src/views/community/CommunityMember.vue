<template>
  <div class="py-10px">
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="listLoading && (!members || members.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!listLoading && (!members || members.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <van-list v-else
              :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              :loading-text="$t('common.loading')"
              :finished-text="members.length!==0?$t('common.noMore'):''"
              @load="onLoad">
      <div class="flex justify-between items-center px-15px c-text-black text-14px py-10px gap-5px">
        <span class="flex-1 text-left">{{$t('community.member')}}</span>
        <span class="flex-1 text-right">{{$t('community.joinTime')}}</span>
        <span class="flex-1 text-right">{{$t('community.communityToken')}}</span>
      </div>
      <div class="flex justify-between items-center px-15px py-10px gap-5px"
           v-for="(item, index) of members" :key="index">
        <div class="flex items-center flex-1 truncate">
          <img class="w-32px min-w-32px h-32px rounded-full mr-5px"
               :src="item.profileImg || defaultAvatar" alt="">
          <span class="truncate text-14px">{{item.username}}</span>
        </div>
        <span class="flex-1 text-right text-12px">{{ parseTimestamp(item.joinTime) }}</span>
        <span class="flex-1 text-right text-12px">{{ item.showingBalance }}</span>
      </div>
    </van-list>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/icon-default-avatar.svg'
import { getCommunityMembers } from '@/api/api'
import { mapState } from 'vuex'
import { sleep, formatAmount, formatPrice, parseTimestamp } from '@/utils/helper'
import { notify } from '@/utils/notify'
import { getTokenBalancesOfUsers } from '@/utils/asset'
import { EVM_CHAINS, EVM_CHAINS_ID } from '@/config'

export default {
  name: "CommunityMember",
  computed: {
    ...mapState('community', ['showingCommunity', 'members']),
    chainName() {
      if (this.showingCommunity) {
        for (let chainName of Object.keys(EVM_CHAINS)){
          if (EVM_CHAINS[chainName].id === this.showingCommunity.chainId) {
            return chainName;
          }
        }
      }
      return false;
    }
  },
  data() {
    return {
      defaultAvatar,
      refreshing: false,
      listLoading: false,
      listFinished: false,
      communityId: ''
    }
  },
  activated() {
    if (this.members.length === 0 && this.communityId !== this.showingCommunity.communityId) {
      this.communityId = this.showingCommunity.communityId
      this.refresh()
    }
  },
  methods: {
    parseTimestamp,
    async onLoad() {
      if (this.listFinished || this.finished) return;
      try {
        this.listLoading = true;
        let members = await getCommunityMembers(this.showingCommunity.communityId, 20, parseInt((this.members -1) / 20) + 1);
        members = await this.getBalances(members)
        this.$store.commity('community/saveMembers', this.members.concat(members ?? []));
        if(memebers.length === 0) {
          this.finished = true
        }
      } catch (e) {
        notify({message: e, type: 'error'})
      }finally{
        this.listLoading = false
      }
    },
    async refresh() {
      try {
        this.listLoading = true;
        this.refreshing = true;
        let members = await getCommunityMembers(this.showingCommunity.communityId);
        console.log(12, members);
        members = await this.getBalances(members)
        this.$store.commit('community/saveMembers', members ?? []);
      } catch (e) {
        notify({message: e, type: 'error'})
      }finally{
        this.refreshing = false
        this.listLoading = false
      }
    },
    async getBalances(mem){
      const balances = await getTokenBalancesOfUsers(EVM_CHAINS_ID[this.showingCommunity.chainId], this.showingCommunity.rewardToken, mem.map(m => m.ethAddress))
      mem = mem.map(m => {
        let balance = balances[m.ethAddress]
        balance = balance ? balance.toString() / (10 ** this.showingCommunity.rewardTokenDecimals) : 0;
        const price = formatPrice(balance * this.showingCommunity.rewardPrice)
        balance = formatAmount(balance);
        return {
          ...m,
          showingBalance: `${balance}/${price}`
        }
      })
      return mem
    }
  },
  async mounted () {
    let count = 0;
    while (!this.showingCommunity || !this.showingCommunity.communityId || count++ < 30) {
      await sleep(0.2)
    }
  },
}
</script>

<style scoped>

</style>
