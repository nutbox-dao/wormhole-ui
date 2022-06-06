<template>
  <div>
    <div v-if="dataList.length===0">
      <div class="c-text-black text-zinc-700 text-2rem my-4rem">None</div>
      <div class="text-zinc-400 text-0.8rem leading-1.4rem">
        This service is still in Beta. Please be careful and do not deposit anything more than you can lose.
        By depositing into this account, you are agreeing to our terms of service.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NFT",
  data() {
    return {
      dataList: []
    }
  }
}
</script>

<style scoped>

</style>
