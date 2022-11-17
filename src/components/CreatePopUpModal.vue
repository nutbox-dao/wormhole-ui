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
             v-model="popUpData.maxReward"
             type="number"
             placeholder="">
      <span class="whitespace-nowrap px-10px">limited 100</span>
    </div>
    <div class="flex justify-between items-center mt-2rem">
      <span class="c-text-black">Chain</span>
    </div>
    <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                  flex items-center justify-between
                  light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                  rounded-12px h-40px 2xl:h-2rem">
      <el-select v-model="popUpData.chain" class="w-full" size="large">
        <el-option
            v-for="item in chainOptions"
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
             v-model="popUpData.maxReward"
             type="number"
             placeholder="">
      <div class="h-20px 2xl:h-1.5rem w-1px bg-color7D"></div>
      <el-select v-model="popUpData.token" class="w-1/5" size="large">
        <el-option
            v-for="item in tokenOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
    <div class="text-right">Balance: 65.32 BUSD ($700.92 USD)</div>
    <div class="text-center mt-2rem">
      <button class="gradient-btn h-3.6rem w-1/3 rounded-full">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreatePopUpModal",
  data() {
    return {
      stepType: 'createContent',
      popUpData: {
        maxReward: 10,
        chain: 'ethereum',
        token: 'eth',
        amount: 0
      },
      chainOptions: [
          {label: 'Ethereum', value: 'ethereum'},
          {label: 'BSC', value: 'bsc'}
      ],
      tokenOptions: [{label: 'Eth', value: 'eth'}]
    }
  }
}
</script>

<style scoped>

</style>
