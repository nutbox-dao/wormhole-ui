<template>
  <div class="pl-0.5rem pr-1rem pb-4rem">
    <div v-if="dataList.length===0">
      <div class="c-text-black text-zinc-700 text-2rem my-4rem">None</div>
      <div class="text-zinc-400 text-0.8rem leading-1.4rem">
        This service is still in Beta. Please be careful and do not deposit anything more than you can lose.
        By depositing into this account, you are agreeing to our terms of service.
      </div>
    </div>
    <div v-else class="border-b-1px border-white/20 py-1rem" v-for="i of 2" :key="i"
         @click.capture="$router.push(`post-detail?id=${i}`)">
      <Blog />
    </div>
  </div>
</template>

<script>
import Blog from "@/views/user/components/Blog";
export default {
  name: "Transaction",
  components: {Blog},
  data() {
    return {
      dataList: []
    }
  }
}
</script>

<style scoped>
</style>
