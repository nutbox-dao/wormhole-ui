<template>
  <div class="pl-0.5rem pr-1rem pb-4rem">
    <div v-if="posts.length===0">
      <div class="c-text-black text-zinc-700 text-2rem my-4rem">None</div>
      <div class="text-zinc-400 text-0.8rem leading-1.4rem">
        This service is still in Beta. Please be careful and do not deposit anything more than you can lose.
        By depositing into this account, you are agreeing to our terms of service.
      </div>
    </div>
    <div v-else class="border-b-1px border-white/20 py-1rem" v-for="p of posts" :key="p.postId"
        >
         <!-- @click.capture="$router.push(`post-detail?id=${p.postId}`)" -->
      <Blog :post="p"/>
    </div>
  </div>
</template>

<script>
import Blog from "@/views/user/components/Blog";
import { mapState } from 'vuex'
import { getUsersPosts } from '@/api/api'
import { sleep } from '@/utils/helper'

export default {
  name: "Transaction",
  components: {Blog},
  computed: {
    ...mapState(['accountInfo', 'posts'])
  },
  data() {
    return {
      dataList: []
    }
  },
  async mounted () {
    while(!this.accountInfo || !this.accountInfo.twitterUsername){
      await sleep(1)
    }
    getUsersPosts(this.accountInfo.twitterUsername).then(res => {
      console.log(1, res);
      this.$store.commit('savePosts', res)
    })
  },
}
</script>

<style scoped>
</style>
