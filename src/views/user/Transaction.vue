<template>
  <div class="pb-6rem">
    <div v-if="dataList.length===0">
      <div class="c-text-black text-zinc-700 text-2rem my-4rem">None</div>
      <div class="text-zinc-400 text-0.8rem leading-1.4rem">
        This service is still in Beta. Please be careful and do not deposit anything more than you can lose.
        By depositing into this account, you are agreeing to our terms of service.
      </div>
    </div>
    <div class="border-b-1px border-white/20 pt-1rem pb-1.4rem"
         v-for="(item, index) of dataList" :key="index">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <img v-if="item.isSend" class="w-2.4rem" src="~@/assets/icon-up-arrow.svg" alt="">
          <img v-else class="w-2.4rem" src="~@/assets/icon-down-arrow.svg" alt="">
          <div class="text-text8F flex flex-col items-start sm:ml-2rem ml-0.5rem">
            <div class="text-1.2rem leading-1.5rem">
              <strong class="c-text-black text-white">Receive from</strong> @vitalik
            </div>
            <div class="text-1rem mt-0.5rem">22:45:23  17/06/22 </div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="c-text-black text-1.2rem leading-1.5rem">+ 0.5 ETH</div>
          <div class="c-text-medium text-1rem mt-0.5rem">$612.36</div>
        </div>
      </div>
      <div class="text-right mt-1rem c-text-medium text-1rem">
        <a v-if="item.status==='complete'"
           class="text-primaryColor underline"
           href="/" target="_blank">view on blockchain</a>
        <el-tooltip v-else-if="item.status==='fail'">
          <template #content>{{item.failMsg}}</template>
          <button class="text-redColor underline">Fail</button>
        </el-tooltip>
        <span v-else-if="item.status==='waiting'">Waiting</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Transaction",
  data() {
    return {
      dataList: [
        {isSend: false, status: 'complete'},
        {isSend: true, status: 'fail', failMsg: '交易失败：余额不足'},
        {isSend: true, status: 'waiting'},
      ]
    }
  }
}
</script>

<style scoped>

</style>
