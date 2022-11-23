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
      <div class="flex justify-between items-center mt-2rem">
        <span class="c-text-black">Chain</span>
      </div>
      <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                  flex items-center justify-between
                  light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                  rounded-12px h-40px 2xl:h-2rem">
        <el-select v-model="popUpData.chain" class="w-full" size="large">
          <el-option label="Steem" value="steem"></el-option>
          <div class="w-full h-1px bg-color8B/30 my-0.5rem"></div>
          <div class="flex justify-between items-center px-1.5rem ">
            <span class="c-text-black">Other</span>
            <span class="text-color8B">Only available for registered Wormhole3 users</span>
          </div>
          <el-option
              v-for="item in chainOptions"
              :disabled="false"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
      <div class="flex justify-between items-center mt-2rem">
        <span class="c-text-black">Amount</span>
      </div>
      <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                  flex items-center justify-between
                  light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                  rounded-12px h-40px 2xl:h-2rem">
        <input class="bg-transparent h-full w-full px-0.5rem flex-1"
               v-model="popUpData.amount"
               type="number"
               placeholder="">
        <div class="h-20px 2xl:h-1.5rem w-1px bg-color7D"></div>
        <el-select v-model="popUpData.token" class="w-1/3" size="large">
          <el-option
              v-for="item in tokenOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
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
export default {
  name: "SpeakerTipModal",
  data() {
    return {
      step: 1,
      popUpData: {
        chain: '',
        amount: 0,
        token: 'steem'
      },
      chainOptions: [
          {label: 'Ethereum', value: 'ethereum'},
          {label: 'BSC', value: 'bsc'},
          {label: 'Polygon', value: 'polygon'},
      ],
      tokenOptions: [
          {label: 'Steem', value: 'steem'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
