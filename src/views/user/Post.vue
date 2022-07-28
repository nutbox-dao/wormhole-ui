<template>
  <div class="grid md:grid-cols-3 md:gap-1rem pb-2rem">
    <div class="md:col-start-3 md:col-end-4 top-box rounded-2rem mt-2.5rem mb-2rem h-min overflow-hidden mx-1.5rem md:mx-0">
      <div class="gradient-bg gradient-bg-color text-1rem px-1rem py-0.8rem flex items-center justify-between md:justify-center">
        <span class="text-black c-text-bold">Social token</span>
        <div class="md:hidden c-text-medium flex-1 flex justify-end items-center">
          <span class="text-text2C/60 mr-1rem">{{ steemBalance }} STEEM</span>
          <span class="text-white">{{ steemValue}} </span>
        </div>
      </div>
      <div class="mt-2.5rem md:mt-1rem mb-1.5rem px-1rem">
        <div class="md:mb-1rem">
          <div class="c-text-bold text-1.4rem mb-0.5rem">{{ steemBalance }} STEEM</div>
          <div class="text-white text-colorB6">{{ steemValue}} </div>
        </div>
        <div class="flex justify-between items-center mb-0.8rem">
          <div class="flex items-center justify-center">
            <span class="text-primaryColor text-0.8rem font-bold">Resource Credits</span>
            <el-tooltip>
              <template #content>
                <div class="max-w-14rem">
                  Every your post upload to the blockchain will cost you resource credits(RC), so your post can't be synced to blockchain if the RC is too lower. The RC will recover 20% every day.
                </div>
              </template>
              <button>
                <img class="w-1rem ml-0.5rem" src="~@/assets/icon-warning-primary.svg" alt="">
              </button>
            </el-tooltip>
          </div>
          <span class="c-text-bold text-primaryColor text-1rem">{{rcPercent}}%</span>
        </div>
        <el-progress class="c-progress" :text-inside="false" :stroke-width="20"
                     :show-text="false"
                     :percentage="Number(rcPercent)" />
      </div>
    </div>
    <div class="md:col-start-1 md:col-end-3 md:row-start-1 md:mt-2.5rem">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                        loading-text="Loading"
                        pulling-text="Pull to refresh data"
                        loosing-text="Release to refresh">
        <van-list :loading="loading"
                  :finished="finished"
                  :immediate-check="false"
                  :finished-text="'No more data'"
                  @load="onLoad">

          <div v-if="posts.length===0 && !refreshing" class="py-3rem bg-blockBg rounded-12px">
            <div class="c-text-black text-zinc-700 text-2rem mb-2rem">None</div>
            <div class="text-zinc-400 text-0.8rem leading-1.4rem">
              This service is still in Beta. Please be careful and do not deposit anything more than you can lose.
              By depositing into this account, you are agreeing to our terms of service.
            </div>
          </div>
          <div class="bg-blockBg rounded-12px overflow-hidden">
            <div class="" v-for="p of posts" :key="p.postId">
              <Blog :post="p" class="border-b-1 border-white/20 md:border-listBgBorder"/>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Blog from "@/components/Blog";
import { mapState, mapGetters } from 'vuex'
import { getUsersPosts } from '@/api/api'
import { sleep, formatPrice } from '@/utils/helper'
import { getPost, getPosts, getAccountRC } from '@/utils/steem'

export default {
  name: "Transaction",
  components: {Blog},
  computed: {
    ...mapState(['accountInfo', 'posts', 'rcPercent', 'steemBalance', 'prices']),
    ...mapGetters(['getAccountInfo']),
    steemValue() {
      return formatPrice(this.steemBalance * this.prices['steem'])
    }
  },
  data() {
    return {
      refreshing: true,
      loading: false,
      finished: false,
      pageSize: 10,
      pageIndex: 0
    }
  },
  async mounted () {
    while(!this.getAccountInfo || !this.getAccountInfo.twitterUsername){
      await sleep(1)
    }
    this.onRefresh()

    getAccountRC(this.getAccountInfo.steemId).then(rc => {
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

      getUsersPosts(this.getAccountInfo.twitterUsername, this.pageSize, time, true).then(async (res) => {
        const posts = await getPosts(res)
        this.$store.commit('savePosts', posts.concat(this.posts))
        this.refreshing = false
      }).catch(e => {
        this.refreshing = false
      })
      console.log(this.posts)
    },
    onLoad() {
      console.log('load more')
      if (this.finished || this.loading) return;
      let time;
      if (this.posts && this.posts.length > 0) {
        this.loading = true
        time = this.posts[this.posts.length - 1].postTime
        getUsersPosts(this.getAccountInfo.twitterUsername, this.pageSize, time, false).then(async (res) => {
         const posts = await getPosts(res)
          this.$store.commit('savePosts', this.posts.concat(posts))
          if (res.length < this.pageSize) {
            this.finished = true
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.finished = true
        })
      }
    }
  }
}
</script>

<style scoped>
.top-box {
  background: linear-gradient(99.28deg, rgba(83, 83, 83, 0.8) 0.41%, rgba(78, 72, 61, 0.8) 75.78%);
  border: 1px solid #323436;
  border-radius: 12px;
}

</style>
