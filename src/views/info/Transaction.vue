<template>
  <div class="">
    <div class="py-2rem"
         v-if="refreshing && (!showingList || showingList.length === 0)">
      <img class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!refreshing && (!showingList || showingList.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <van-pull-refresh v-else
                      v-model="refreshing"
                      @refresh="onRefresh"
                      :loading-text="$t('common.loading')"
                      :pulling-text="$t('common.pullRefresh')"
                      :loosing-text="$t('common.loosingRefresh')">
      <van-list :loading="loading"
                :finished="finished"
                :immediate-check="false"
                :loosing-text="$t('common.pullRefresh')"
                :loading-text="$t('common.loading')"
                :finished-text="showingList.length!==0?$t('common.noMore'):''"
                @load="onLoad">
        <div class=" flex items-start px-15px"
             v-for="(item, index) of showingList" :key="index">
          <img v-if="!isReceive(item)" class="w-32px min-w-32px mr-14px mt-15px"
               src="~@/assets/icon-up-arrow.svg" alt="">
          <img v-else class="w-32px min-w-32px mr-14px mt-15px"
               src="~@/assets/icon-down-arrow.svg" alt="">
          <div class="flex-1 flex border-b-0.5px border-listBgBorder py-15px">
            <div class="flex-1 text-text8F flex flex-col items-start">
              <div class="font-bold text-left text-14px"
                   :class="item.tipResult !== 0?'text-redColor':'light:text-blueDark'">
                {{ isReceive(item) ? $t('transactionView.received') : $t('transactionView.sent') }}
                {{item.tipResult !== 0?$t('transactionView.error'):''}}
              </div>
              <div class="text-color8B light:text-color7D text-12px mt-4px mb-6px">
                {{ isReceive(item) ? $t('transactionView.from') : $t('transactionView.to') }} {{ getTargetAccount(item) }}
              </div>
              <div class="mt-0.5rem text-color8B text-12px">{{ parseTime(item.postTime) }}</div>
            </div>
            <div class="flex flex-col justify-between items-end">
              <ChainTokenIconLarge class="bg-color62"
                                   height="28px" width="28px"
                                   :chain-name="item.chainName.toString()"
                                   :token="{address: item.token, symbol: item.symbol}">
                <template #amount>
                        <span class="pl-30px pr-8px h-24px whitespace-nowrap text-white
                                     flex items-center text-12px font-bold">
                          {{ isReceive(item) ? '+' : '-' }} {{ formatAmount(item) }} {{ item.symbol }}
                        </span>
                </template>
              </ChainTokenIconLarge>
              <a v-if="item.tipResult === 0"
                 class="text-white rounded-full border-1 border-white/20 h-20px flex items-center px-8px text-12px
                          light:text-blueDark light:border-colorE3 light:text-color7D"
                 :href="hashLink(item)" target="_blank">View</a>
              <div v-else
                   class="text-redColor text-12px w-full text-right mt-4px sm:ml-1rem">
                {{failResult(item) || ' Tokens has not been sent.'}}
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { EVM_CHAINS, SteemScan } from '@/config'
import { sleep, formatAmount } from '@/utils/helper'
import { ethers } from 'ethers'
import { getUsersTips } from '@/utils/account'
import ChainTokenIconLarge from "@/components/ChainTokenIconLarge.vue";

export default {
  name: "Transaction",
  components: {ChainTokenIconLarge},
  data() {
    return {
      refreshing: true,
      loading: false,
      finished: false,
      selectIndex: 0,
      pageSize: 16,
      pageIndex: 0,
      chains: EVM_CHAINS
    }
  },
  computed: {
    ...mapState(['accountInfo', 'transactions', 'prices', 'tips']),
    ...mapGetters(['getAccountInfo']),
    showingList() {
      return this.tips
    }
  },
  methods: {
    isReceive(trans) {
      return trans.twitterId !== this.getAccountInfo.twitterId
    },
    failResult(trans) {
      switch(trans.tipResult) {
        case 0:
          return 'Success'
        case 1:
          return 'Insufficient balance'
        case 2:
          return 'Insufficient gas fee'
        case 3:
          return 'Transaction fail'
        case 4:
          return 'Target account not exist'
      }
    },
    hashLink(trans) {
      if (trans.chainName === 'STEEM') {
        return SteemScan + 'tx/' + trans.hash
      }else {
        const chain = Object.values(EVM_CHAINS).find(c => c.id === parseInt(trans.chainName));
        if (chain) {
          return chain.scan + 'tx/' + trans.hash
        }
      }
    },
    getValue(trans) {
      const amount = parseFloat(this.formatAmount(trans))
      const symbol = trans.symbol.toLowerCase()
      return '$' + formatAmount(amount * this.prices[symbol])
    },
    formatAmount(trans) {
      if (trans.chainName === 'STEEM')
        return formatAmount(trans.amount)
      const { token, decimals, symbol } = trans;
      const amount = trans.amount / (10 ** decimals);
      return formatAmount(amount)
    },
    getTargetAccount(trans) {
      if (this.isReceive(trans)){
        return '@' + trans.username
      }else {
        if (ethers.utils.isAddress(trans.targetUsername)) {
          return trans.targetUsername.substring(0, 10) + '......'
        }else {
          return '@' + trans.targetUsername
        }
      }
    },
    select(index) {
      this.selectIndex = index
      this.finished = false
      this.onRefresh()
    },
    onRefresh() {
      this.refreshing = true
      let time;
      getUsersTips({twitterId: this.getAccountInfo.twitterId,
            pageSize: this.pageSize,
            time,
            newTips: true}).then(res => {
        this.$store.commit('saveTips', res)
        this.refreshing = false
      }).catch(e => {
        console.log(33, e);
        if (e === 'log out') {
            // this.$router.replace('/')
          }
      })
    },
    onLoad() {
      if (this.finished || this.loading) return;
      let time;
      if (this.tips && this.tips.length > 0) {
        this.loading = true
        time = this.tips[this.tips.length - 1].postTime
        getUsersTips({twitterId: this.getAccountInfo.twitterId,
              pageSize: this.pageSize,
               time,
               newTips: false}).then(res => {
          this.$store.commit('saveTips', this.tips.concat(res))
          if (res.length < this.pageSize) {
            this.finished = true
          }
          this.loading = false
        }).catch(e => {
          console.log(22, e);
          if (e === 'log out') {
            this.$router.replace('/')
          }
          this.loading = false
          this.finished = true
        })
      }
    },
    parseTime(d) {
      const date = new Date(d)
      return date.toLocaleTimeString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute:'2-digit',
        second: '2-digit'
      })
    }
  },
  async mounted () {
    if(!this.getAccountInfo || !this.getAccountInfo.twitterUsername){
      this.$router.replace('/')
    }
    this.onRefresh()
  },
}
</script>

<style scoped>

</style>
