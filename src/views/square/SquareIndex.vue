<template>
  <div class="">
    <van-list :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              loosing-text="Pull to refresh data"
              loading-text="Loading..."
              finished-text="No more data"
              @load="onLoad">
      <div class="px-1.5rem sm:px-0 container mx-auto max-w-49rem">
        <div class="mt-25px flex sm:items-center sm:justify-between">
          <div class="w-min relative ">
            <div class="w-full h-7px bg-primaryColor absolute bottom-3px rounded-full"></div>
            <span class="text-2.4rem leading-30px c-text-bold relative">Square</span>
          </div>
          <button class="flex items-center justify-center gradient-btn h-2.7rem px-1rem rounded-full c-text-bold
                    absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
                  @click="publishTweet">
            Tweet a post
          </button>
        </div>
        <div class="text-white/40 mt-10px text-left">Post twitter content on chain and earn rewards</div>
      </div>
      <div class="border-b-1px border-white/20 mt-0.5rem">
        <div class="px-1.5rem sm:px-0 container mx-auto max-w-49rem flex justify-between items-center">
          <div class="flex-1 overflow-x-auto no-scroll-bar">
            <div class="text-14px w-min flex gap-1.5rem h-3rem">
              <span v-for="(tag, index) of tagList" :key="index"
                    class="whitespace-nowrap leading-3rem cursor-pointer"
                    :class="currentTagIndex===index?'text-white border-b-4px border-primaryColor':'text-white/60'"
                    @click="onTagChange(index)">{{tag === 'wormhole3' ? 'All' : ('#' + tag)}}</span>
            </div>
          </div>
          <router-link class="pl-1rem" to="/square/topics">
            <img class="w-2rem" src="~@/assets/icon-forward-circle.svg" alt="">
          </router-link>
        </div>
      </div>
      <div class="container mx-auto max-w-49rem pt-3">
        <!-- <div class="px-1.5rem sm:px-0 border-b-1px border-white/20 sm:border-b-0 py-0.8rem text-14px flex flex-wrap gap-x-1.5rem gap-y-0.8rem ">
          <span v-for="(tag, index) of subTagList" :key="index"
                class="leading-30px whitespace-nowrap px-0.6rem rounded-full font-500 h-30px cursor-pointer"
                :class="subActiveTagIndex===index?'bg-primaryColor':'border-1 border-white/40'"
                @click="subActiveTagIndex=index">{{tag}}</span>
        </div> -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
          loading-text="Loading"
          pulling-text="Pull to refresh data"
          loosing-text="Release to refresh"
        >
          <div class="" v-for="p of currentPosts" :key="p.postId">
            <Blog :post="p" class="bg-blockBg mb-1rem sm:rounded-1rem sm:bg-white/10"/>
          </div>
        </van-pull-refresh>
      </div>
    </van-list>
    <van-popup class="c-tip-drawer" v-model:show="modalVisible"
               :position="position">
      <div class="modal-bg w-full md:w-49rem max-h-80vh overflow-auto flex flex-col rounded-t-1.5rem md:rounded-b-1.5rem pt-2rem md:p-2rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-2rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">
<!--          <Login class="text-center"/>-->
          <PostTip class="pb-4rem text-left"/>
        </div>
      </div>
    </van-popup>
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
      listLoading: false,
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
      }
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
  methods: {
    publishTweet(){
      if (this.getAccountInfo){
        this.modalVisible=true
      }else {
        this.$router.push('/login')
      }
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
        this.$store.commit('savePosts', this.allPosts)
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
          console.log(3, time);
        }
        const res = await getPostsByTagTime(tag, 12, time, true)
        console.log(tag, res);
        const postsf = await getPosts(res)
        this.allPosts[tag] = postsf.concat(this.allPosts[tag] || [])
        if (postsf.length < 12) {
          this.listFinished = true
        }else {
          this.listFinished = false
        }
        this.$store.commit('savePosts', this.allPosts)
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
      const posts = this.getPostsByTag(this.tagList[index])
      this.listFinished = false
      this.onRefresh()
      // this.$router.push(`/square/tag/${this.tagList[index]}`)
    }
  }
}
</script>

<style scoped>

</style>
