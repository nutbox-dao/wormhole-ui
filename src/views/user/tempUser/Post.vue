<template>
  <div class="grid md:grid-cols-3 md:gap-1rem pb-2rem">
    <div class="md:col-start-3 md:col-end-4 border-1 border-dividerColor px-1rem rounded-15px md:my-2rem my-1.5rem h-min overflow-hidden mx-1.5rem md:mx-0">
      <div class="text-1.2rem border-b-1 border-dividerColor px-1rem py-0.8rem flex items-center justify-between md:justify-center">
        <span class="c-text-black">Social token</span>
        <div class="md:hidden c-text-black flex-1 flex justify-end items-center">
          <span class="text-colorB5 mr-1rem">{{ steemBalance }} STEEM</span>
          <span class="text-white c-text-black">{{ steemValue}} </span>
        </div>
      </div>
      <div class="mt-2rem md:mt-1rem mb-1.5rem">
        <div class="hidden md:block md:mb-1rem text-right">
          <div class="text-colorB5 mb-0.5rem">{{ steemBalance }} STEEM</div>
          <div class="text-1.6rem">{{ steemValue}} </div>
        </div>
        <div class="flex justify-between items-center mb-0.8rem">
          <div class="flex items-center justify-center">
            <span class="text-color8B text-12px font-bold">Resource Credits</span>
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
          <span class="c-text-black text-1rem">{{rcPercent}}%</span>
        </div>
        <el-progress class="c-progress" :text-inside="false" :stroke-width="20"
                     :show-text="false"
                     :percentage="Number(rcPercent)" />
      </div>
    </div>
    <div class="md:col-start-1 md:col-end-3 md:row-start-1 md:mt-2rem">
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
              You havn't post any content to wormhole3, Please try to start from Twitter by wormhole3.
            </div>
          </div>
          <div class="bg-blockBg rounded-12px overflow-hidden">
            <div class="" v-for="p of posts" :key="p.postId">
              <Blog @click="$emit('gotoDetail', p)"
                    :post="p" class="border-b-1 border-white/20 md:border-listBgBorder"/>
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
  name: "Post",
  components: {Blog},
  props: {
    accountInfo: {
      type: Object
    },
    steemBalance: {
      type: Number
    }
  },
  computed: {
    ...mapState(['prices']),
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
      pageIndex: 0,
      scroll: 0,
      rcPercent: 0,
      posts: []
    }
  },
  async mounted () {
    while(!this.accountInfo || !this.accountInfo.twitterUsername){
      await sleep(1)
    }

    getAccountRC(this.accountInfo.steemId).then(rc => {
      this.rcPercent = parseFloat(rc[0] / rc[1] * 100).toFixed(2)
    }).catch()
    this.onRefresh()
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
        this.posts = posts.concat(this.posts)
        this.refreshing = false
      }).catch(e => {
        this.refreshing = false
      })
    },
    onLoad() {
      console.log('load more')
      if (this.finished || this.loading) return;
      let time;
      if (this.posts && this.posts.length > 0) {
        this.loading = true
        time = this.posts[this.posts.length - 1].postTime
        getUsersPosts(this.accountInfo.twitterUsername, this.pageSize, time, false).then(async (res) => {
         const posts = await getPosts(res)
         this.posts = this.posts.concat(posts)
          if (res.length < this.pageSize) {
            this.finished = true
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.finished = true
        })
      }
    },
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
