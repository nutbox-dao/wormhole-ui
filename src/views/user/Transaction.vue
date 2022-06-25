<template>
  <div class="pb-6rem">
    <div v-if="transactions.length===0">
      <div class="c-text-black text-zinc-700 text-2rem my-4rem">None</div>
      <div class="text-zinc-400 text-0.8rem leading-1.4rem">
        This service is still in Beta. Please be careful and do not deposit anything more than you can lose.
        By depositing into this account, you are agreeing to our terms of service.
      </div>
    </div>
    <pull-refresh v-else  v-model="refreshing"
                  class="min-h-20rem"
                  :pulling-text="'Loading...'"
                  :loosing-text="''"
                  :success-text="''"
                  @refresh="onRefresh">
          <div class="border-b-1px border-white/20 pt-1rem pb-1.4rem"
            v-for="(item, index) of transactions" :key="index">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <img v-if="!isReceive(item)" class="w-2.4rem" src="~@/assets/icon-up-arrow.svg" alt="">
              <img v-else class="w-2.4rem" src="~@/assets/icon-down-arrow.svg" alt="">
              <div class="text-text8F flex flex-col items-start sm:ml-2rem ml-0.5rem">
                <div class="text-1.2rem leading-1.5rem">
                  <strong class="c-text-black text-white">{{ isReceive(item) ? 'Receive from' : 'send to' }}</strong> {{ getTargetAccount(item) }}
                </div>
                <div class="text-1rem mt-0.5rem">{{ item.postTime.replace("T", " ").substring(0, 19) }}</div>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <div class="c-text-black text-1.2rem leading-1.5rem">{{ isReceive(item) ? '+' : '-' }} {{ item.amount }} {{ item.asset }}</div>
              <div class="c-text-medium text-1rem mt-0.5rem">{{ getValue(item) }}</div>
            </div>
          </div>
          <div class="text-right mt-1rem c-text-medium text-1rem">
            <a v-if="item.sendResult===0"
              class="text-primaryColor underline"
              :href="chains[item.chainName].scan+'tx/'+item.hash" target="_blank">View on blockchain</a>
            <el-tooltip v-else-if="item.sendStatus!==0">
              <template #content>{{failResult(item)}}</template>
              <button class="text-redColor underline">Fail</button>
            </el-tooltip>
            <span v-else>Waiting</span>
          </div>
        </div>
      <div class="my-1rem text-center">
        <c-spinner class="w-2.4rem h-2.4rem mx-auto" v-show="loading"></c-spinner>
        <button v-if="!loading && !finished"
                @click="onLoad">Load more</button>
        <div v-if="finished">No more data</div>
      </div>
    </pull-refresh>
  </div>
</template>

<script>
import { getUsersTransaction } from '@/api/api'
import PullRefresh from 'pull-refresh-vue3'
import { mapState } from 'vuex'
import { EVM_CHAINS } from '@/config'
import { sleep, formatAmount } from '@/utils/helper'
import { ethers } from 'ethers'

export default {
  name: "Transaction",
  components: {PullRefresh},
  data() {
    return {
      refreshing: true,
      loading: false,
      finished: false,
      pageSize: 30,
      pageIndex: 0,
      chains: EVM_CHAINS
    }
  },
  computed: {
    ...mapState(['accountInfo', 'transactions', 'prices'])
  },
  methods: {
    isReceive(trans) {
      return trans.username !== this.accountInfo.twitterUsername
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
      getUsersTransaction(this.accountInfo.twitterId, this.pageSize, time, true).then(res => {
        this.$store.commit('saveTransactions', res.concat(this.transactions))
        this.refreshing = false
      }).catch(e => {
        console.log(2, e);
        this.refreshing = false
      })
    },
    onLoad() {
      console.log('load more')
      if (this.finished) return;
      let time;
      if (this.transactions && this.transactions.length > 0) {
        this.loading = true
        time = this.transactions[this.transactions.length - 1].postTime
        getUsersTransaction(this.accountInfo.twitterId, this.pageSize, time, false).then(res => {
          this.$store.commit('saveTransactions', this.transactions.concat(res))
          if (res.length < this.pageSize) {
            this.finished = true
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      }
    }
  },
  async mounted () {
    while(!this.accountInfo || !this.accountInfo.twitterUsername){
      await sleep(1)
    }
    this.onRefresh()
  },
}
</script>

<style scoped>

</style>
