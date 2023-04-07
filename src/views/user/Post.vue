<template>
  <div class="grid grid-cols-1 pb-2rem text-14px xl:text-0.8rem">
    <div class="col-span-1 mt-2rem w-full ">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                        loading-text="Loading"
                        pulling-text="Pull to refresh data"
                        loosing-text="Release to refresh">
        <van-list :loading="loading"
                  :finished="finished"
                  :immediate-check="false"
                  :finished-text="$t('common.noMore')"
                  @load="onLoad">
          <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
               v-if="refreshing && (!posts || posts.length === 0)">
            <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
          </div>
          <div v-if="posts.length===0 && !refreshing"
               class="py-3rem bg-blockBg light:bg-white rounded-12px">
            <div v-if="getAccountInfo && getAccountInfo.isPending">
              <div class="text-zinc-400 text-0.8rem leading-1.4rem">
                {{$t('postView.p10')}}
              </div>
              <div class="flex items-center justify-center mt-2rem">
                <button class="flex items-center justify-center gradient-btn gradient-btn-shadow h-2.7rem px-1rem
                    rounded-full mt-0.5rem c-text-bold bottom-2rem left-1/2 transform-translate-x-1/2 z-2 w-8rem"
                    @click="$router.push('/signup')">
                    {{$t('common.active')}}
                </button>
              </div>
            </div>
            <div v-else class="px-1.5rem">
              <div class="c-text-black text-color7D text-2rem mb-2rem">{{$t('common.none')}}</div>
              <div class="text-zinc-400 text-0.8rem leading-1.4rem">
                {{$t('postView.p7')}}
              </div>
            </div>
          </div>
          <div class="bg-blockBg light:bg-white rounded-12px overflow-hidden">
            <div class="" v-for="p of posts" :key="p.postId">
              <Blog @click="goteDetail(p)"
                    :post="p"
                    class="border-b-1 border-white/20 light:border-black/16 md:border-listBgBorder px-1.5rem py-1rem"/>
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
      pageIndex: 0,
      scroll: 0
    }
  },
  async mounted () {
    while(!this.getAccountInfo || !this.getAccountInfo.twitterUsername){
      if (this.getAccountInfo && this.getAccountInfo.isPending) {
        break;
      }
      await sleep(1)
    }
    // if (this.getAccountInfo.steemId) {
    //   getAccountRC(this.getAccountInfo.steemId).then(rc => {
    //     this.$store.commit('saveRcPercent', parseFloat(rc[0] / rc[1] * 100).toFixed(2))
    //   }).catch()
    // }else {
    //   this.$store.commit('saveRcPercent',100.00)
    // }
  },
  async activated() {
    // document.getElementById('user-index').scrollTo({top: this.scroll})
    while(!this.getAccountInfo || !this.getAccountInfo.twitterUsername){
      if (this.getAccountInfo && this.getAccountInfo.isPending) {
        this.refreshing = false
        return;
      }
      await sleep(1)
    }
    if(!this.posts || this.posts.length === 0) {
      this.onRefresh()
    }
  },
  methods: {
    onRefresh() {
      console.log('refresh')
      this.refreshing = true
      let time;
      if (this.posts && this.posts.length > 0) {
        time = this.posts[0].postTime
      }

      getUsersPosts(this.getAccountInfo.twitterId, this.getAccountInfo.twitterId).then(async (res) => {
        const posts = await getPosts(res)
        this.$store.commit('savePosts', posts.concat(this.posts))
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
        getUsersPosts(this.getAccountInfo.twitterId, this.getAccountInfo.twitterId, time).then(async (res) => {
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
    },
    goteDetail(p) {
      // let el = document.getElementById('user-index');
      // this.scroll = el.scrollTop
      this.$store.commit('postsModule/saveCurrentShowingDetail', p)
      this.$router.push(`/post-detail/${p.postId}`)
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
