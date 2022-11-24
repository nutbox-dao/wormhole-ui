<template>
  <div class="text-left px-1.25rem pb-1.5rem min-h-28rem">
    <div class="text-1.2rem c-text-black mb-1rem">Tip</div>
    <template v-if="step===1">
      <div>You can send tips directly to any twitter account, regardless he/she has a wallet or not</div>
      <div class="c-text-black mt-2rem">Host</div>
      <div class="py-1rem flex flex-wrap gap-x-2rem">
        <div class="flex items-center" v-for="i of 2" :key="i" @click="step=2">
          <img class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
          <span>name</span>
        </div>
      </div>
      <div class="c-text-black mt-2rem">Speakers</div>
      <div class="py-1rem flex flex-wrap gap-x-2rem">
        <div class="flex items-center" v-for="i of 4" :key="i" @click="step=2">
          <img class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
          <span>name</span>
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
  components: {AssetsOptions},
  data() {
    return {
      step: 1,
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
  }
}
</script>

<style scoped>

</style>
