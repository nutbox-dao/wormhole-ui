<template>
  <div class="text-left px-1.25rem pb-1.5rem min-h-28rem">
    <div class="text-1.2rem c-text-black mb-1rem">Tip</div>
    <template v-if="step===1">
      <div>You can send tips directly to any twitter account, regardless he/she has a wallet or not</div>
      <div class="c-text-black mt-2rem">Host</div>
      <div class="py-1rem flex flex-wrap gap-x-2rem">
        <div class="flex items-center">
          <img v-if="host.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(host.profileImg)" alt="">
          <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
          <span>{{host.name}}</span>
        </div>
        <div class="flex items-center" v-for="u of coHosts" :key="i" @click="step=2">
          <img v-if="u.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(u.profileImg)" alt="">
          <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
          <span>{{u.name}}</span>
        </div>
      </div>
      <div class="c-text-black mt-2rem">Speakers</div>
      <div class="py-1rem flex flex-wrap gap-x-2rem">
        <div class="flex items-center" v-for="s of speakers" :key="s" @click="step=2">
          <img v-if="s.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(s.profileImg)" alt="">
          <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
          <span>{{s.name}}</span>
        </div>
      </div>
    </template>
    <template v-if="step===2">
      <AssetsOptions :chain="form.chain"
                     :address="form.address"
                     :token="form.token"
                     :showsteem="false"
                     @chainChange="selectChain"
                     @tokenChagne="selectToken"
                     @addressChange="selectAddress"
                     @balanceChange="selectBalance">
        <template #amount>
          <input class="bg-transparent h-full w-full px-0.5rem"
                 v-model="form.amount"
                 type="number" :placeholder="$t('curation.inputRewardsAmount')">
        </template>
      </AssetsOptions>
      <div class="flex items-center justify-center gap-x-1rem">
        <button class="gradient-btn w-16rem h-3.6rem rounded-full mt-3rem" @click="step=1">
          back
        </button>
        <button class="gradient-btn w-16rem h-3.6rem rounded-full mt-3rem">
          Tweet and Send
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import AssetsOptions from "@/components/AssetsOptions";
export default {
  name: "SpeakerTipModal",
  props: {
    space: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      step: 1,
      host: {},
      coHosts: [],
      speakers:[],
      form: {
        maxReward: 10,
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
  },
  mounted () {
    if (this.space.hosts && this.space.hosts.length > 0) {
      this.host = this.space.hosts.find(h => h.twitterId === this.space.creatorId)
      this.coHosts = this.space.hosts.filter(h => h.twitterId !== this.space.creatorId);
      this.speakers = this.space.speakers;
      console.log(3, this.speakers, this.space.speakers);
    };
  },
}
</script>

<style scoped>

</style>
