<template>
  <div class="pl-0.5rem pr-1rem pb-2rem">
    <div v-if="posts.length===0">
      <div class="c-text-black text-zinc-700 text-2rem my-4rem">None</div>
      <div class="text-zinc-400 text-0.8rem leading-1.4rem">
        This service is still in Beta. Please be careful and do not deposit anything more than you can lose.
        By depositing into this account, you are agreeing to our terms of service.
      </div>
    </div>
    <pull-refresh v-else  v-model="refreshing"
                  class="min-h-20rem"
                  :pulling-text="'加载中...'"
                  :loosing-text="''"
                  :success-text="''"
                  @refresh="onRefresh">
      <div class="border-b-1px border-white/20 py-1rem" v-for="p of posts" :key="p.postId">
        <Blog :post="p"/>
      </div>
      <div class="my-1rem text-center">
        <c-spinner class="w-2.4rem h-2.4rem mx-auto" v-show="loading"></c-spinner>
        <button v-if="!loading && !finished"
                @click="onLoad">加载更多</button>
        <div v-if="finished">暂无更多</div>
      </div>
    </pull-refresh>
  </div>
</template>

<script>
import Blog from "@/views/user/components/Blog";
import { mapState } from 'vuex'
import { getUsersPosts } from '@/api/api'
import { sleep } from '@/utils/helper'
import PullRefresh from 'pull-refresh-vue3'

export default {
  name: "Transaction",
  components: {Blog, PullRefresh},
  computed: {
    ...mapState(['accountInfo', 'posts'])
  },
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false
    }
  },
  async mounted () {
    while(!this.accountInfo || !this.accountInfo.twitterUsername){
      await sleep(1)
    }
    if (this.posts && this.posts.length > 0){
      getUsersPosts(this.accountInfo.twitterUsername).then(res => {
        this.$store.commit('savePosts', res)
      })
    }
    else {
      getUsersPosts(this.accountInfo.twitterUsername).then(res => {
        this.$store.commit('savePosts', res)
      })
    }
  },
  methods: {
    onRefresh() {
      console.log('refresh')
      setTimeout(() => {
        this.refreshing = false
      }, 2000)
    },
    onLoad() {
      console.log('load more')
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    }
  }
}
</script>

<style scoped>
</style>
