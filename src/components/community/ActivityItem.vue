<template>
  <div class="text-left">
    <div class="font-bold c-text-black text-14px mb-10px">{{$t('community.reward')}}</div>
    <div class="text-12px leading-18px">
      {{$t('community.rewardInfo',
        {account: '0x4f...abc3', from: 'Delegate to Peanut', amount: '17646.01', tokenName:'PNUT'}
    )}}
    </div>
    <div class="flex justify-between items-center mt-10px text-12px text-color8B light:text-color7D">
      <div class="flex items-center">
        <img class="w-20px h-20px min-w-20px rounded-full bg-color62 mr-8px"
             src="~@/assets/icon-default-avatar.svg" alt="">
        <span>Name</span>
      </div>
      <span>1 hour ago</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActivityItem"
}
</script>

<style scoped>

</style>
