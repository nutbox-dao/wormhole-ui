<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 md:gap-1rem pb-2rem">
    <div class="col-span-1 xl:col-start-3 xl:col-end-4
                light:(bg-social-token-box bg-no-repeat bg-cover)
                border-1 border-dividerColor
                px-1rem rounded-12px xl:my-2rem md:(mb-0 mx-0) my-1.5rem
                h-min overflow-hidden mx-1.5rem">
      <div class="text-1.2rem border-b-1 border-color84/30 light:border-colorE0/80 py-0.8rem flex items-center justify-between md:justify-center">
        <span class="text-center font-900 xl:(text-left font-500 w-full) light:text-colorE0/80 text-15px">{{$t('postView.socialToken')}}</span>
        <div class="md:hidden flex-1 flex justify-end items-center">
          <span class="text-colorB5 light:text-colorE0/80 mr-1rem whitespace-nowrap">{{ steemBalance }} STEEM</span>
          <span class="text-white c-text-black">{{ steemValue}} </span>
        </div>
      </div>
      <div class="mt-2rem md:mt-1rem mb-1.5rem">
        <div class="hidden md:block md:mb-1rem text-right">
          <div class="text-colorB5 light:text-colorE0/80 mb-0.5rem">{{ steemBalance }} STEEM</div>
          <div class="text-1.6rem text-white">{{ steemValue}} </div>
        </div>
        <div class="flex justify-between items-center mb-0.5rem">
          <div class="flex items-center justify-center">
            <span class="text-color8B light:text-colorE0/80 text-14px 2xl:text-1rem whitespace-nowrap">{{$t('postView.resourceCredits')}}</span>
            <el-tooltip popper-class="shadow-popper-tip">
              <template #content>
                <div class="max-w-14rem text-white light:text-blueDark">
                  {{$t('postView.p1')}}
                </div>
              </template>
              <button>
                <img class="w-1rem ml-0.5rem" src="~@/assets/icon-warning-primary.svg" alt="">
              </button>
            </el-tooltip>
          </div>
          <span class="c-text-black text-16px 2xl:text-1.1rem text-white">{{rcPercent}}%</span>
        </div>
        <el-progress class="c-progress" :text-inside="false" :stroke-width="10"
                     :show-text="false"
                     :percentage="Number(rcPercent)" />
      </div>
    </div>
    <div class="col-span-1 xl:col-start-1 xl:col-end-3 xl:row-start-1 xl:mt-2rem">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                        loading-text="Loading"
                        pulling-text="Pull to refresh data"
                        loosing-text="Release to refresh">
        <van-list :loading="loading"
                  :finished="finished"
                  :immediate-check="false"
                  :finished-text="$t('common.noMore')"
                  @load="onLoad">

          <div v-if="posts.length===0 && !refreshing" class="py-3rem bg-blockBg light:bg-white rounded-12px">
            <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
            <div class="text-zinc-400 text-0.8rem leading-1.4rem">
              {{$t('postView.p7')}}
            </div>
          </div>
          <div class="bg-blockBg light:bg-white rounded-12px overflow-hidden">
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

      getUsersPosts(this.accountInfo.twitterId, this.pageSize, time, true).then(async (res) => {
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
        getUsersPosts(this.accountInfo.twitterId, this.pageSize, time, false).then(async (res) => {
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
