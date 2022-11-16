<template>
  <div class="text-left px-1.25rem pb-1.5rem min-h-28rem">
    <div class="mb-1rem">
      <div class="leading-1.2rem absolute top-1rem"
           v-if="stepType!=='select'"
           @click="stepType='select'">Back</div>
    </div>
    <div class="text-1.2rem c-text-black mb-1rem">Tip</div>
    <template v-if="stepType==='select'">
      <div>You can send tips directly to any twitter account, regardless he/she has a wallet or not</div>
      <div class="py-1rem flex justify-between items-center" v-for="i of 4" :key="i">
        <div class="flex items-center">
          <img class="w-2.5rem h-2.5rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
          <span>Username</span>
        </div>
        <div class="flex items-center">
          <span class="bg-color62/20 px-0.5rem rounded-15px cursor-pointer"
                @click="stepType='steem'">Steem</span>
          <span class="text-12px mx-1rem">Or</span>
          <img class="w-2rem cursor-pointer"
               @click="stepType='metamask'"
               src="~@/assets/icon-metamask.png" alt="">
        </div>
      </div>
    </template>
    <template v-if="stepType==='steem'">
      <div class="mt-2rem">Select token</div>
      <el-select v-model="steemData.token" class="w-full" size="large">
        <el-option
            v-for="item in steemOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <div class="flex justify-between items-center mt-2rem">
        <span>Amount</span>
        <span>Balance: 2.988 STEEM ($4.2352 USD)</span>
      </div>
      <div class="w-full sm:w-4/7 border-1 bg-black/40 border-1 border-color8B/30
                        light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                        rounded-12px h-40px 2xl:h-2rem">
        <input class="bg-transparent h-full w-full px-0.5rem"
               v-model="steemData.amount"
               type="number"
               placeholder="minimum 0">
      </div>
      <button class="gradient-btn w-full h-3.6rem rounded-full mt-3rem">
        Tweet and Send
      </button>
    </template>
    <template v-if="stepType==='metamask'">
      <div class="mt-2rem">Select chain</div>
      <el-select v-model="metamaskData.chain" class="w-full" size="large">
        <el-option
            v-for="item in chainOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <div class="mt-2rem">Select token</div>
      <el-select v-model="metamaskData.token" class="w-full" size="large">
        <el-option
            v-for="item in tokenOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <div class="flex justify-between items-center mt-2rem">
        <span>Amount</span>
        <span>Balance: 0.0565 ETH ($70.92 USD)</span>
      </div>
      <div class="w-full sm:w-4/7 border-1 bg-black/40 border-1 border-color8B/30
                        light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                        rounded-12px h-40px 2xl:h-2rem">
        <input class="bg-transparent h-full w-full px-0.5rem"
               v-model="metamaskData.amount"
               type="number"
               placeholder="minimum 0">
      </div>
      <button class="gradient-btn w-full h-3.6rem rounded-full mt-3rem">
        Send
      </button>
    </template>
  </div>
</template>

<script>
export default {
  name: "SpeakerTipModal",
  data() {
    return {
      stepType: 'select',
      steemOptions: [{label: 'Steem', value: 'steem'}],
      steemData: {
        token: 'steem',
        amount: ''
      },
      chainOptions: [{label: 'Ethereum', value: 'ethereum'}],
      tokenOptions: [{label: 'Eth', value: 'eth'}],
      metamaskData: {
        chain: 'ethereum',
        token: 'eth',
        amount: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
