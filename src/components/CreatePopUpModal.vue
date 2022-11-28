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
                   @balanceChange="selectBalance"
                   @selectGift="selectGift">
      <template #amount>
        <input class="bg-transparent h-full w-full px-0.5rem"
               v-model="form.amount"
               type="number" :placeholder="$t('curation.inputRewardsAmount')">
      </template>
    </AssetsOptions>
    <div class="text-center mt-2rem">
      <button class="gradient-btn h-3.6rem w-1/3 rounded-full" @click="onSubmit">Send</button>
    </div>
    <van-popup v-if="modalVisible" class="c-tip-drawer 2xl:w-2/5"
                v-model:show="modalVisible"
               :close-on-click-overlay="TextTrackCueList"
               :position="position">
      <div class="modal-bg w-full md:max-w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">
          <SendTokenTipVue
                     :token="selectedToken"
                     :amount="form.amount"
                     :chainName="form.chain"
                     :address="form.address"
                     :approveContract="EVM_CHAINS[form.chain].popup"
                     @create="createPopup"
                     @confirmComplete="modalVisible=false"
                     @close="modalVisible=false"></SendTokenTipVue>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import AssetsOptions from "@/components/AssetsOptions";
import { EVM_CHAINS } from '@/config'
import SendTokenTipVue from "./SendTokenTip.vue";

export default {
  name: "CreatePopUpModal",
  components: {AssetsOptions, SendTokenTipVue},
  data() {
    return {
      stepType: 'createContent',
      form: {
        maxReward: 100,
        chain: '',
        address: '',
        token: '',
        amount: 0,
      },
      EVM_CHAINS,
      modalVisible: false,
      selectedToken: {},
      selectedBalance: '',
      approvement: false,
      approving: false,
      creating: false
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
    selectGift(amount) {
      this.form.amount = amount
    },
    onSubmit() {
      this.modalVisible = true
    },
    async createPopup() {

    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
