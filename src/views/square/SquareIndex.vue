<template>
  <div class="h-full overflow-auto" id="square-index">
    <div >
      <van-list :loading="listLoading"
                :finished="listFinished"
                :immediate-check="false"
                loosing-text="Pull to refresh data"
                loading-text="Loading..."
                finished-text="No more data"
                @load="onLoad">
        <div class="px-1rem pt-25px sm:px-0 container mx-auto max-w-53rem md:max-w-48rem">
          <div class="flex sm:items-center sm:justify-between">
            <div class="w-min relative ">
              <div class="w-full h-7px bg-primaryColor absolute bottom-3px rounded-full"></div>
              <span class="text-2rem leading-2.5rem md:text-2.4rem md:leading-3rem c-text-bold relative">Square</span>
            </div>
            <button class="flex items-center justify-center gradient-btn border-3px h-2.7rem px-1rem rounded-full c-text-bold
                    absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
                    @click="publishTweet">
              Tweet a post
            </button>
          </div>
          <div class="text-white/40 mt-10px text-left leading-20px">Post twitter content on chain and earn rewards</div>
        </div>
        <div class="border-b-1px border-white/20 mt-0.5rem sticky -top-1px bg-primaryBg z-2 sm:px-1rem">
          <div class="px-1.5rem sm:px-0 container mx-auto max-w-53rem md:max-w-48rem flex justify-between items-center">
            <div class="flex-1 overflow-x-auto no-scroll-bar">
              <div class="text-14px 2xl:text-0.9rem w-min flex gap-1.5rem h-3rem">
              <span v-for="(tag, index) of tagList" :key="index"
                    class="whitespace-nowrap leading-3rem cursor-pointer hover:text-primaryColor transform hover:font-bold hover:scale-110"
                    :class="currentTagIndex===index?'text-white border-b-4px border-primaryColor':'text-white/60'"
                    @click="onTagChange(index)">{{tag === 'wormhole3' ? 'All' : ('#' + tag)}}</span>
              </div>
            </div>
            <router-link class="pl-1rem" to="/square/topics">
              <img class="w-2rem" src="~@/assets/icon-forward-circle.svg" alt="">
            </router-link>
          </div>
        </div>
        <div class="sm:mt-1rem sm:px-1rem">
          <div class="container mx-auto max-w-53rem md:max-w-48rem sm:bg-blockBg rounded-12px" :class="currentPosts && currentPosts.length>0?'md:p-1rem':''">
            <!-- <div class="px-1.5rem sm:px-0 border-b-1px border-white/20 sm:border-b-0 py-0.8rem text-14px flex flex-wrap gap-x-1.5rem gap-y-0.8rem ">
              <span v-for="(tag, index) of subTagList" :key="index"
                    class="leading-30px whitespace-nowrap px-0.6rem rounded-full font-500 h-30px cursor-pointer"
                    :class="subActiveTagIndex===index?'bg-primaryColor':'border-1 border-white/40'"
                    @click="subActiveTagIndex=index">{{tag}}</span>
            </div> -->
            <div class="c-text-black text-1.8rem mb-3rem" v-if="refreshing && (!currentPosts || currentPosts.length === 0)">
              <img src="~@/assets/profile-loading.gif" alt="" />
            </div>
            <div v-else-if="currentPosts && currentPosts.length === 0" class="py-3rem bg-blockBg rounded-12px">
              <div class="c-text-black text-zinc-700 text-2rem mb-2rem">None</div>
              <div class="text-zinc-400 text-0.8rem leading-1.4rem p-3">
                There's no related posts about this topic. Please check other topic for try.
              </div>
            </div>
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                              loading-text="Loading"
                              pulling-text="Pull to refresh data"
                              loosing-text="Release to refresh"
                              v-else
            >
              <div class="" v-for="p of currentPosts" :key="p.postId">
                <Blog @click="gotoDetail(p)"
                      :post="p" class="bg-blockBg sm:bg-transparent sm:border-b-1 sm:border-listBgBorder mb-1rem md:mb-0"/>
              </div>
            </van-pull-refresh>
          </div>
        </div>
      </van-list>
      <van-popup class="c-tip-drawer" v-model:show="modalVisible"
                 :position="position">
        <div class="modal-bg w-full md:w-49rem max-h-80vh overflow-auto flex flex-col rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:p-2rem">
          <div v-if="position === 'bottom'"
               @click="modalVisible=false"
               class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
          <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">
            <PostTip v-if="getAccountInfo" class="pb-2rem text-left"/>
            <Login v-else class="text-center sm:my-1rem mb-2rem"/>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import Blog from "@/components/Blog";
import Login from "@/views/Login";
import PostTip from "@/views/post/PostTip";
import { getTagAggregation, getPostsByTagTime } from '@/api/api';
import { mapState, mapGetters } from 'vuex'
import { notify, showError } from "@/utils/notify";
import { getPosts } from '@/utils/steem'

export default {
  components: {Blog, Login, PostTip},
  data() {
    return {
      subTagList: ['Trending', 'New'],
      subActiveTagIndex: 0,
      listLoading: true,
      listFinished: false,
      refreshing: false,
      list: [],
      position: document.body.clientWidth < 768?'bottom':'center',
      modalVisible: false,
      testData: {
        children: 0,
        content: "Siguniang mountain, here we are。 （ by https://t.co/ybMGq2pJM9）  https://t.co/549D352xTw\nhttps://pbs.twimg.com/media/FWd8DdiX0AAwfEN.jpg\nhttps://pbs.twimg.com/media/FWd8GByWAAAKHT1.jpg\nhttps://pbs.twimg.com/media/FWd8GCDXgAACfL4.jpg\nhttps://pbs.twimg.com/media/FWd8GCtWIAA-4pp.jpg",
        curatorPayoutValue: "0.574 SBD",
        name: "terry3t.eth",
        pendingPayoutValue: "0.000 SBD",
        postId: "1542338002818666496",
        postTime: "2022-06-30T02:43:29.000Z",
        steemId: "terry3t1493",
        tags: "[\"wormhole3\"]",
        totalPayoutValue: "0.574 SBD",
        username: "terry3t1",
        votes: 1
      },
      scroll: 0
    }
  },
  computed: {
    ...mapState('postsModule', ['tagsAggregation', 'allPosts', 'currentTagIndex']),
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('postsModule', ['getPostsByTag']),
    tagList() {
      if (this.tagsAggregation) {
        return Object.keys(this.tagsAggregation)
      }else {
        return ['wormhole3']
      }
    },
    currentPosts() {
      return this.getPostsByTag(this.tagList[this.currentTagIndex])
    }
  },
  mounted() {
    getTagAggregation().then(tags => {
      this.$store.commit('postsModule/saveTagsAggregation', tags)
      this.onRefresh()
    })
  },
  activated() {
    document.getElementById('square-index').scrollTo({top: this.scroll})
  },
  watch: {
    currentTagIndex(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.onRefresh()
      }
    }
  },
  methods: {
    publishTweet(){
      this.modalVisible=true

      // if (this.getAccountInfo){
      //   this.modalVisible=true
      // }else {
      //   this.$router.push('/login')
      // }
    },
    async onLoad() {
      if(this.listLoading || this.listFinished) return
      try{
        this.listLoading = true
        const tag = this.tagList[this.currentTagIndex]
        const posts = this.getPostsByTag(tag)
        let time;
        if (posts && posts.length > 0) {
          time = posts[posts.length - 1].postTime
        }
        const res = await getPostsByTagTime(tag, 12, time, false)
        const postsf = await getPosts(res)
        this.allPosts[tag] = (this.allPosts[tag] || []).concat(postsf)
        this.$store.commit('postsModule/saveAllPosts', this.allPosts)
        if (postsf.length < 12) {
          this.listFinished = true
        }else {
          this.listFinished = false
        }
      } catch (e) {
        console.log(555, e);
        showError(501)
      } finally {
        this.listLoading = false
      }
    },
    async onRefresh() {
      try{
        this.refreshing = true
        const tag = this.tagList[this.currentTagIndex]
        const posts = this.getPostsByTag(tag)
        let time;
        if (posts && posts.length > 0) {
          time = posts[0].postTime.replace('T', ' ')
          time = time.slice(0, 19)
        }
        const res = await getPostsByTagTime(tag, 12, time, true)
        const postsf = await getPosts(res)
        this.allPosts[tag] = postsf.concat(this.allPosts[tag] || [])
        this.listLoading = false
        this.$store.commit('postsModule/saveAllPosts', this.allPosts)
      } catch (e) {
        console.log(321, e);
        showError(501)
      } finally {
        this.refreshing = false
      }
    },
    onTagChange(index) {
      if(index === this.currentTagIndex) return
      this.$store.commit('postsModule/saveCurrentTagIndex', index)
      // const posts = this.getPostsByTag(this.tagList[index])
      // this.listFinished = false
      // this.onRefresh()
      // this.$router.push(`/square/tag/${this.tagList[index]}`)
    },
    gotoDetail(p) {
      let el = document.getElementById('square-index');
      this.scroll = el.scrollTop
      this.$store.commit('postsModule/saveCurrentShowingDetail', p)
      this.$router.push(`/post-detail/${p.postId}`)
    }
  }
}
</script>

<style scoped>

</style>
