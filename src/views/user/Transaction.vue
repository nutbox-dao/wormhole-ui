<template>
  <div class="container mx-auto sm:max-w-600px lg:max-w-35rem px-1rem pb-2rem">
    <div class="bg-blockBg rounded-1rem mt-2rem">
      <div v-if="transactions.length===0" class="py-4rem px-1.5rem">
        <div class="c-text-black text-zinc-700 text-2rem mb-2rem">None</div>
        <div class="text-zinc-400 text-0.8rem leading-1.4rem">
          This service is still in Beta. Please be careful and do not deposit anything more than you can lose.
          By depositing into this account, you are agreeing to our terms of service.
        </div>
      </div>
      <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh"
                loading-text="Loading"
                pulling-text="Pull to refresh data"
                loosing-text="Release to refresh">
        <van-list :loading="loading"
                  :finished="finished"
                  :immediate-check="false"
                  loosing-text="Pull to refresh data"
                  loading-text="Loading..."
                  finished-text="No more data"
                  @load="onLoad">
          <div class="text-left p-1rem c-text-black md:text-1.2rem text-1.5rem">Recent transactions</div>
          <div class="border-b-1px border-listBgBorder p-1rem"
               v-for="(item, index) of transactions" :key="index">
            <div class="flex justify-between">
              <div class="flex-1 flex items-center">
                <img v-if="!isReceive(item)" class="w-2.2rem"
                     src="~@/assets/icon-up-arrow.svg" alt="">
                <img v-else class="w-2.2rem"
                     src="~@/assets/icon-down-arrow.svg" alt="">
                <div class="text-text8F flex flex-col items-start sm:ml-1rem ml-0.5rem">
                  <div class="text-1.1rem md:text-0.8rem leading-1.2rem text-left text-color8B">
                    <strong class="c-text-black text-white">{{ isReceive(item) ? 'Receive from' : 'send to' }}</strong> {{ getTargetAccount(item) }}
                  </div>
                  <div class="text-0.7rem mt-0.5rem text-color8B">{{ item.postTime.replace("T", " ").substring(0, 19) }}</div>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <div class="c-text-black text-0.8rem leading-1.2rem whitespace-nowrap">
                  {{ isReceive(item) ? '+' : '-' }} {{ item.amount }} {{ item.asset }}
                </div>
                <div class="c-text-medium text-0.7rem mt-0.5rem text-color8B">{{ getValue(item) }}</div>
              </div>
            </div>
            <div class="text-right mt-1rem c-text-medium text-0.6rem">
              <a v-if="item.sendResult===0"
                 class="text-white rounded-full border-1 border-white/20 py-4px px-0.7rem"
                 :href="chains[item.chainName].scan+'tx/'+item.hash" target="_blank">View on blockchain</a>
              <el-tooltip v-else-if="item.sendStatus!==0">
                <template #content>{{failResult(item)}}</template>
                <button class="text-redColor rounded-full border-1 border-redColor py-4px px-0.7rem">Fail</button>
              </el-tooltip>
              <span v-else class="text-primaryColor rounded-full border-1 border-primaryColor py-4px px-0.7rem">Waiting...</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { getUsersTransaction } from '@/api/api'
import { mapState, mapGetters } from 'vuex'
import { EVM_CHAINS } from '@/config'
import { sleep, formatAmount } from '@/utils/helper'
import { ethers } from 'ethers'

export default {
  name: "Transaction",
  data() {
    return {
      refreshing: true,
      loading: false,
      finished: false,
      pageSize: 10,
      pageIndex: 0,
      chains: EVM_CHAINS
    }
  },
  computed: {
    ...mapState(['accountInfo', 'transactions', 'prices']),
    ...mapGetters(['getAccountInfo'])
  },
  methods: {
    isReceive(trans) {
      return trans.username !== this.getAccountInfo.twitterUsername
    },
    failResult(trans) {
      switch(trans.sendResult) {
        case 0:
          return 'success'
        case 1:
          return 'Insufficient balance'
        case 2:
          return 'Insufficient gas fee'
        case 3:
          return 'Transaction fail'
        case 4:
          return 'Target account not registered'
      }
    },
    getValue(trans) {
      const amount = parseFloat(trans.amount)
      const symbol = trans.asset.toLowerCase()
      return '$' + formatAmount(amount * this.prices[symbol])
    },
    formatAmount(a) {
      return formatAmount(a)
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
    onRefresh() {
      console.log('refresh')
      this.refreshing = true
      let time;
      if (this.transactions && this.transactions.length > 0) {
        time = this.transactions[0].postTime
      }
      getUsersTransaction(this.getAccountInfo.twitterId, this.pageSize, time, true).then(res => {
        this.$store.commit('saveTransactions', res.concat(this.transactions))
        this.refreshing = false
      }).catch(e => {
        console.log(2, e);
        this.refreshing = false
      })
    },
    onLoad() {
      console.log('load more')
      if (this.finished || this.loading) return;
      let time;
      if (this.transactions && this.transactions.length > 0) {
        this.loading = true
        time = this.transactions[this.transactions.length - 1].postTime
        getUsersTransaction(this.getAccountInfo.twitterId, this.pageSize, time, false).then(res => {
          this.$store.commit('saveTransactions', this.transactions.concat(res))
          if (res.length < this.pageSize) {
            this.finished = true
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.finished = true
        })
      }
    }
  },
  async mounted () {
    while(!this.getAccountInfo || !this.getAccountInfo.twitterUsername){
      await sleep(1)
    }
    this.onRefresh()
  },
}
</script>

<style scoped>

</style>
