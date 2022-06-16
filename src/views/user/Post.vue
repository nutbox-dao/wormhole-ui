<template>
  <div class="pl-0.5rem pr-1rem pb-4rem">
    <div class="border-b-1px border-white/20 py-1rem" v-for="i of 2" :key="i"
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
