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
                  :pulling-text="'Loading...'"
                  :loosing-text="''"
                  :success-text="''"
                  @refresh="onRefresh">
      <div class="my-1rem max-w-35rem mx-auto">
        <div class="flex items-center justify-center mb-0.5rem">
          <span class="text-primaryColor text-1rem font-bold">Resource Credits</span>
          <el-tooltip>
            <template #content>
              <div class="max-w-14rem">
                Every your post upload to the blockchain will cost you resource credits(RC), so your post can't be synced to blockchain if the RC is too lower. The RC will recover 20% every day.
              </div>
            </template>
            <button>
              <img class="w-1.2rem ml-0.5rem" src="~@/assets/icon-warning-primary.svg" alt="">
            </button>
          </el-tooltip>
        </div>
        <el-progress class="c-progress" :text-inside="true" :stroke-width="20" :percentage="rcPercent" />
      </div>
      <div class="border-b-1px border-white/20 py-1rem" v-for="p of posts" :key="p.postId">
        <Blog :post="p"/>
      </div>
      <div class="my-1rem text-center">
        <c-spinner class="w-2.4rem h-2.4rem mx-auto" v-show="loading"></c-spinner>
        <button v-if="!loading && !finished"
                @click="onLoad">Load more</button>
        <div v-if="finished">No more data</div>
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
import { getPost, getPosts, getAccountRC } from '@/utils/steem'

export default {
  name: "Transaction",
  components: {Blog, PullRefresh},
  computed: {
    ...mapState(['accountInfo', 'posts', 'rcPercent'])
  },
  data() {
    return {
      refreshing: true,
      loading: false,
      finished: false,
      pageSize: 30,
      pageIndex: 0
    }
  },
  async mounted () {
   while(!this.accountInfo || !this.accountInfo.twitterUsername){
      await sleep(1)
    }
    this.onRefresh()
    getAccountRC(this.accountInfo.steemId).then(rc => {
      this.$store.commit('saveRcPercent', parseFloat(rc[0] / rc[1] * 100).toFixed(2))
    }).catch()
  },
  methods: {
    onRefresh() {
      console.log('refresh')
      this.refreshing = true
      let time;
      if (this.posts && this.posts.length > 0) {
        time = this.posts[0].postTime
      }
      getUsersPosts(this.accountInfo.twitterUsername, this.pageSize, time, true).then(async (res) => {
        const posts = await getPosts(res)
        this.$store.commit('savePosts', posts.concat(this.posts))
        this.refreshing = false
      }).catch(e => {
        this.refreshing = false
      })
    },
    onLoad() {
      console.log('load more')
      if (this.finished) return;
      let time;
      if (this.posts && this.posts.length > 0) {
        this.loading = true
        time = this.posts[this.posts.length - 1].postTime
        getUsersPosts(this.accountInfo.twitterUsername, this.pageSize, time, false).then(async (res) => {
          const posts = await getPosts(res)
          this.$store.commit('savePosts', this.posts.concat(posts))
          if (res.length < this.pageSize) {
            this.finished = true
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>
@media (min-width: 560px) {
  .lb-pull-refresh {
    user-select: auto;
  }
}
</style>
