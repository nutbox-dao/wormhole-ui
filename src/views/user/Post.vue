<template>
  <div class="text-14px xl:text-0.8rem sm:p-1rem">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                      loading-text="Loading"
                      pulling-text="Pull to refresh data"
                      loosing-text="Release to refresh">
      <van-list :loading="loading"
                :finished="finished"
                :immediate-check="false"
                :finished-text="showingPosts.length > 0 ? $t('common.noMore') : ''"
                @load="onLoad">
        <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
             v-if="refreshing && (!showingPosts || showingPosts.length === 0)">
          <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
        </div>
        <div v-if="showingPosts.length===0 && !refreshing"
             class="py-3rem rounded-12px">
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
        <div class="" v-for="p of showingPosts" :key="p.postId">
          <Blog @click="gotoDetail(p)"
                :post="p"
                class="border-b-0.5px border-white/20 light:border-black/16 md:border-listBgBorder py-20px px-15px sm:px-0"/>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Blog from "@/components/Blog";
import { mapState, mapGetters } from 'vuex'
import { getUserCreatedCurations, getUserLikedCurations, getUserQuotedCurations, getUserRetweetedCurations } from '@/api/api'
import { sleep, formatPrice } from '@/utils/helper'
import { getPost, getPosts, getAccountRC } from '@/utils/steem'

export default {
  name: "Transaction",
  components: {Blog},
  computed: {
    ...mapGetters(['getAccountInfo']),
    showingPosts() {
      if (this.selected === 0) {
        return this.tweets
      }else if(this.selected === 1) {
        return this.likes
      }else if (this.selected === 2) {
        return this.quotes
      }else if (this.selected === 3) {
        return this.retweets
      }
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
      tweets: [],
      likes: [],
      quotes: [],
      retweets: []
    }
  },
  watch: {
    selected(newValue, oldValue) {
      this.finished = false;
      this.onRefresh();
    }
  },
  props: {
    selected: {
      type: Number,
      default: 0
    },
  },
  async mounted () {
    while(!this.getAccountInfo || !this.getAccountInfo.twitterUsername){
      if (this.getAccountInfo && this.getAccountInfo.isPending) {
        this.refreshing = false
        return;
      }
      await sleep(1)
    }
    this.onRefresh()
  },
  methods: {
    async onRefresh() {
      console.log('refresh')
      this.refreshing = true
      try{
        const twitterId = this.getAccountInfo.twitterId;
        let posts = [];
        if (this.selected === 0) {
          posts = await getUserCreatedCurations(twitterId, twitterId);
          this.tweets = posts;
        }else if(this.selected === 1) {
          posts = await getUserLikedCurations(twitterId, twitterId);
          this.likes = posts;
        }else if(this.selected === 2) {
          posts = await getUserQuotedCurations(twitterId, twitterId);
          this.quotes = posts;
        }else {
          posts = await getUserRetweetedCurations(twitterId, twitterId);
          this.retweets = posts;
        }
        if (posts.length === 0) {
          this.finished = true;
        }
      } catch (e) {
        console.log('get user related posts fail:', e)
      } finally {
        this.refreshing = false
      }
    },
    async onLoad() {
      console.log('load more')
      if (this.finished || this.loading || this.refreshing || this.showingPosts.length === 0) return;
      this.loading = true
      try{
        const twitterId = this.getAccountInfo.twitterId;
        const curationCreatedAt = this.showingPosts[this.showingPosts.length - 1].curationCreatedAt;
        let posts = [];
        if (this.selected === 0) {
          posts = await getUserCreatedCurations(twitterId, twitterId, curationCreatedAt);
          this.tweets = this.tweets.concat(posts);
        }else if(this.selected === 1) {
          posts = await getUserLikedCurations(twitterId, twitterId, curationCreatedAt);
          this.likes = this.likes.concat(posts);
        }else if(this.selected === 2) {
          posts = await getUserQuotedCurations(twitterId, twitterId, curationCreatedAt);
          this.quotes = this.quotes.concat(posts);
        }else {
          posts = await getUserRetweetedCurations(twitterId, twitterId, curationCreatedAt);
          this.retweets = this.retweets.concat(posts);
        }
        if (posts.length === 0) {
          this.finished = true;
        }
      } catch (e) {
        console.log('get user related posts fail:', e)
      } finally {
        this.loading = false
      }
    },
    gotoDetail(p) {
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
