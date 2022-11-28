<template>
  <div class="text-left pb-1.5rem h-80vh flex flex-col text-14px 2xl:text-0.8rem overflow-auto">
    <div class="relative">
      <div class="flex justify-center items-center py-20px">
        <i v-for="i of 2" :key="i"
           class="block w-10px h-10px min-w-10px h-min-10px rounded-full mx-15px"
           :class="step===i?'bg-color62':'bg-colorD6'"></i>
      </div>
      <button v-show="step>1" class="absolute left-20px top-1/2 transform -translate-y-1/2"
              @click="step-=1">
        <i class="w-20px h-20px 2xl:w-1.2rem 2xl:h-1.2rem icon-back"></i>
      </button>
      <button class="absolute right-20px top-1/2 transform -translate-y-1/2"
           @click="$emit('close')">
        <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
      </button>
    </div>
    <div class="text-20px 2xl:text-1.2rem c-text-black text-left sm:text-center px-1.5rem mt-2rem">
      Create a Pop-up reply action
    </div>
    <div v-if="step===1" class="flex-1 px-1.5rem mt-0.5rem flex flex-col">
      <div class="flex-1">
        <div class="mt-0.5rem mb-2rem text-color7D">Currently only support replying on tweets actions</div>
        <div class="flex justify-between items-center mt-35px">
          <span class="font-bold text-14px 2xl:text-0.8rem mb-10px">Quick Tweet</span>
        </div>
        <div class="w-full bg-blockBg light:bg-white
                  border-1 border-color8B/30 light:border-colorE3 hover:border-primaryColor
                  rounded-8px min-h-40px 2xl:min-h-2rem">
          <textarea class="bg-transparent h-full w-full p-0.5rem leading-24px"
                    v-model="form.content"
                    rows="4" placeholder="Type the contents"></textarea>
          <div class="p-0.5rem text-right text-color62 font-bold">#iweb3</div>
        </div>
        <div class="flex justify-between items-center mt-2rem">
          <span class="font-bold text-14px 2xl:text-0.8rem mb-10px">Duration</span>
        </div>
        <div class="w-full bg-black/40 border-1 border-color8B/30
                    light:bg-white light:border-colorE3 flex items-center
                    rounded-8px overflow-hidden h-44px 2xl:h-2.1rem">
          <CustomSelect v-model="form.duration">
            <template #options>
              <div class="bg-block light:bg-white border-1 border-color8B/30
                          light:border-colorE3 rounded-8px overflow-hidden">
                <el-option
                    v-for="item in durationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </div>
            </template>
          </CustomSelect>
        </div>
      </div>
      <div class="text-center mb-1.4rem mt-2rem">
        <button class="gradient-btn h-44px 2xl:h-2.2rem w-full rounded-full text-16px 2xl:text-0.8rem"
                @click="step=2">Next</button>
      </div>
    </div>
    <div v-if="step===2" class="flex-1 px-1.5rem mt-0.5rem flex flex-col">
      <div class="flex-1">
        <div class="flex justify-between items-center mt-45px">
          <span class="font-bold text-14px 2xl:text-0.8rem mb-10px">Maximum reward users</span>
        </div>
        <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                  flex justify-between items-center
                  light:bg-white light:border-colorE3 hover:border-primaryColor
                  rounded-8px h-44px 2xl:h-2.1rem">
          <input class="bg-transparent h-full w-full px-12px text-color7D"
                 v-model="form.maxReward"
                 type="number"
                 placeholder="">
          <span class="whitespace-nowrap px-12px text-colorD6">limited 100</span>
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
            <input class="bg-transparent h-full w-full px-12px"
                   v-model="form.amount"
                   type="number" :placeholder="$t('curation.inputRewardsAmount')">
          </template>
        </AssetsOptions>
      </div>
      <div class="text-center mt-2rem">
        <button class="gradient-btn gradient-btn-disabled-grey
                       h-44px 2xl:h-2.2rem w-full rounded-full text-16px 2xl:text-0.8rem"
                @click="onSubmit">Send</button>
      </div>
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
import CustomSelect from "@/components/CustomSelect";

export default {
  name: "CreatePopUpModal",
  components: {AssetsOptions, SendTokenTipVue, CustomSelect},
  data() {
    return {
      step: 2,
      durationOptions: [
        {label: '1 min', value: 1},
        {label: '10 min', value: 10},
        {label: '30 min', value: 30},
        {label: '60 min', value: 60},
      ],
      form: {
        content: '',
        duration: 1,
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
      creating: false,
      durationPopper:false
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
