<template>
    <div class="text-left px-1.25rem pb-1.5rem min-h-28rem">
        <div class="text-1.2rem c-text-black mb-1rem">Tip</div>
        <div>To @{{tipToUser.username}}</div>
        <AssetsOptions :chain="'steem'"
                        :showEvm="!!tipToUser.ethAddress"
                        :showsteem="true"
                        @chainChange="selectChain"
                        @tokenChagne="selectToken"
                        @addressChange="selectAddress"
                        @balanceChange="selectBalance"
                        @selectGift="selectGift">
            <template #amount>
            <input class="bg-transparent h-full w-full px-0.5rem"
                    v-model="form.amount"
                    type="number" :placeholder="$t('curation.inputRewardsAmount')">
            </template>
        </AssetsOptions>
        <div class="flex items-center justify-center gap-x-1rem">
            <button class="gradient-btn w-16rem h-3.6rem rounded-full mt-3rem" @click="$emit('back')">
            back
            </button>
            <button class="gradient-btn w-16rem h-3.6rem rounded-full mt-3rem"
            @click="send"
            :disabled="form.amount>selectedBalance || form.amount === 0">
            Send
            </button>
        </div>
    </div>
  </template>
  
  <script>
  import { EVM_CHAINS, TWITTER_MONITOR_RULE } from '@/config'
  import AssetsOptions from "@/components/AssetsOptions";
  import { mapGetters } from "vuex";
  import { sendTokenToUser } from '@/utils/asset'
  import { tipEVM } from '@/utils/curation'
  import { ethers } from 'ethers';
  
  export default {
    name: "SpeakerTipModal",
    props: {
        tipToUser: {
            type: Object,
            default: {}
        },
    },
    components: {
      AssetsOptions,
    },
    computed: {
      ...mapGetters(['getAccountInfo']),
      ...mapGetters('curation', ['getPendingTip']),
    },
    data() {
      return {
        step: 1,
        host: {},
        coHosts: [],
        speakers:[],
        form: {
          chain: '',
          address: '',
          token: '',
          amount: 0
        },
        selectedToken: {},
        selectedBalance: ''
      }
    },
    methods: {
      avatar(url) {
        return url.replace('normal', '200x200')
      },
      selectChain(chain){
        this.form.chain = chain
      },
      selectAddress(address) {
        this.form.address = address
      },
      selectToken(token) {
        this.selectedToken = token;
        this.form.token = token.address;
      },
      selectBalance(balance) {
        this.selectedBalance = balance
      },
      selectGift(amount) {
        this.form.amount = amount
      },
      async send() {
        try {
          if (this.form.chain === 'steem') {
            window.open(`https://twitter.com/intent/tweet?in_reply_to=${this.parentTweetId}&text=${TWITTER_MONITOR_RULE} !tip ${this.form.amount} STEEM to @${this.tipToUser.username}`,'__blank')
          }else {
            const transHash = await sendTokenToUser(this.selectedToken, this.form.amount, this.tipToUser.ethAddress)
            const tip = {
              twitterId: this.getAccountInfo.twitterId,
              targetTwitterId: this.tipToUser.twitterId,
              fromAddress: this.form.address,
              toAddress: this.tipToUser.ethAddress,
              transHash,
              chainName: EVM_CHAINS[this.form.chain].id,
              token: this.form.token,
              symbol: this.selectedToken.symbol,
              decimals: this.selectedToken.decimals,
              amount: ethers.utils.parseUnits(this.form.amount.toString(), this.selectedToken.decimals).toString(),
              parentTweetId: this.parentTweetId
            }
            this.$store.commit('curation/savePendingTip', tip)
            await tipEVM(tip);
            this.$store.commit('curation/savePendingTip', null)
          }
          this.$emit('close')
        }catch(e) {
          console.log('Tip to user fail:', e);
        }
      }
    },
    mounted () {
      const pendingTip = this.getPendingTip;
      if (pendingTip) {
        tipEVM(pendingTip).then(res => {
          this.$store.commit('curation/savePendingTip', null)
        }).catch(e => {
          console.log('upload cache tip fail:', e);
        }).finally(() => {
        })
      }
    },
  }
  </script>
  
  <style scoped>
  
  </style>
  