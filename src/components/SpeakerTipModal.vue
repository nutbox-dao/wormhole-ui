<template>
  <div class="text-left px-1.25rem pb-1.5rem min-h-28rem">
    <template v-if="step===1">
      <div class="text-1.2rem c-text-black mb-1rem">Tip</div>
      <div>You can send tips directly to any twitter account, regardless he/she has a wallet or not</div>
      <div class="c-text-black mt-2rem">Host</div>
      <div class="py-1rem flex flex-wrap gap-x-2rem">
        <div class="flex items-center" @click="tip(host)">
          <img v-if="host.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(host.profileImg)" alt="">
          <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
          <span>{{host.name}}</span>
        </div>
        <div class="flex items-center" v-for="u of coHosts" :key="i" @click="tip(u)">
          <img v-if="u.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(u.profileImg)" alt="">
          <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
          <span>{{u.name}}</span>
        </div>
      </div>
      <div class="c-text-black mt-2rem">Speakers</div>
      <div class="py-1rem flex flex-wrap gap-x-2rem">
        <div class="flex items-center" v-for="s of speakers" :key="s" @click="tip(s)">
          <img v-if="s.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(s.profileImg)" alt="">
          <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
          <span>{{s.name}}</span>
        </div>
      </div>
    </template>
    <template v-if="step===2">
      <TipModalVue :tipToUser="tipToUser" @close="$emit('close')" @back="step=1"/>
    </template>
  </div>
</template>

<script>
import { EVM_CHAINS, TWITTER_MONITOR_RULE } from '@/config'
import { mapGetters } from "vuex";
import { sendTokenToUser } from '@/utils/asset'
import { tipEVM } from '@/utils/curation'
import { ethers } from 'ethers';
import TipModalVue from './TipModal.vue';

export default {
  name: "SpeakerTipModal",
  props: {
    space: {
      type: Object,
      default: {}
    },
    // Parent tweet id, need to comment to this tweet if chose tip steem
    parentTweetId: {
      type: String
    }
  },
  components: {
    TipModalVue
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
      tipToUser: {},
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
      console.log(6, balance);
      this.selectedBalance = balance
    },
    selectGift(amount) {
      this.form.amount = amount
    },
    tip(user) {
      this.tipToUser = user;
      this.step = 2;
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
    if (this.space.hosts && this.space.hosts.length > 0) {
      this.host = this.space.hosts.find(h => h.twitterId === this.space.creatorId)
      this.coHosts = this.space.hosts.filter(h => h.twitterId !== this.space.creatorId);
      this.speakers = this.space.speakers;
    };

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
