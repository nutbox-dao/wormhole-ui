<template>
  <div class="text-left px-1.25rem pb-1.5rem min-h-28rem">
    <div class="text-1.2rem c-text-black mb-1rem text-center">
      Create a Pop-up action
    </div>
    <div class="flex justify-between items-center mt-2rem">
      <span class="c-text-black">Maximum reward users</span>
    </div>
    <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                flex justify-between items-center
                light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                rounded-12px h-40px 2xl:h-2rem">
      <input class="bg-transparent h-full w-full px-0.5rem"
             v-model="form.maxReward"
             type="number"
             placeholder="">
      <span class="whitespace-nowrap px-10px">limited 100</span>
    </div>
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
    <div class="text-center mt-2rem">
      <button class="gradient-btn h-3.6rem w-1/3 rounded-full">Send</button>
    </div>
  </div>
</template>

<script>
import AssetsOptions from "@/components/AssetsOptions";
export default {
  name: "CreatePopUpModal",
  components: {AssetsOptions},
  data() {
    return {
      stepType: 'createContent',
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
