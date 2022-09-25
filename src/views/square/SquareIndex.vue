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
              <div class="w-full h-7px gradient-line absolute bottom-3px rounded-full"></div>
              <span class="text-2rem leading-2.5rem md:text-2.4rem md:leading-3rem c-text-bold relative whitespace-nowrap">{{$t('square')}}</span>
            </div>
            <button class="flex items-center justify-center gradient-btn gradient-btn-shadow h-2.7rem px-1rem rounded-full c-text-black text-1.2rem
                    absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
                    @click="publishTweet">
              {{$t('postView.tweetPost')}}
            </button>
          </div>
          <div class="text-color8B mt-10px text-left leading-20px">{{$t('squareView.p1')}}</div>
        </div>
        <div class="border-b-1px border-dividerColor mt-0.5rem sticky -top-1px bg-primaryBg z-2 sm:px-1rem">
          <div class="px-1.5rem sm:px-0 container mx-auto max-w-53rem md:max-w-48rem flex justify-between items-center">
            <div class="flex-1 overflow-x-auto no-scroll-bar">
              <div class="text-14px 2xl:text-0.9rem w-min flex gap-1.5rem h-3rem">
              <span class="whitespace-nowrap leading-3rem cursor-pointer hover:text-primaryColor transform hover:font-bold hover:scale-110"
              :class="currentTagIndex === -1?'text-white border-b-4px border-primaryColor':'text-color8B'"
              @click="onTagChange(-1)"
              >Activities</span>
              <span v-for="(tag, index) of tagList" :key="index"
                    class="whitespace-nowrap leading-3rem cursor-pointer hover:text-primaryColor transform hover:font-bold hover:scale-110"
                    :class="currentTagIndex===index?'text-white border-b-4px border-primaryColor':'text-color8B'"
                    @click="onTagChange(index)">{{('#' + tag)}}</span>
              </div>
            </div>
            <router-link class="pl-1rem" to="/square/topics">
              <img class="w-2rem" src="~@/assets/icon-forward-circle.svg" alt="">
            </router-link>
          </div>
        </div>
        <div class="sm:mt-1rem sm:px-1rem">
          <div class="container mx-auto max-w-53rem md:max-w-48rem sm:bg-blockBg rounded-12px" :class="currentPosts && currentPosts.length>0?'md:p-1rem':''">
            <div v-show="currentTagIndex !== -1" class="px-1.5rem sm:px-0 border-b-1px border-white/20 sm:border-b-0 py-0.8rem text-14px flex flex-wrap gap-x-1.5rem gap-y-0.8rem ">
              <span v-for="(tag, index) of subTagList" :key="index"
                    class="leading-30px whitespace-nowrap px-0.6rem rounded-full font-500 h-30px cursor-pointer"
                    :class="subActiveTagIndex===index?'bg-primaryColor':'border-1 border-white/40'"
                    @click="changeSubIndex(index)">{{tag}}</span>
            </div>
            <div class="c-text-black text-1.8rem mb-3rem" v-if="refreshing && (!currentPosts || currentPosts.length === 0)">
              <img src="~@/assets/profile-loading.gif" alt="" />
            </div>
            <div v-else-if="currentPosts && currentPosts.length === 0" class="py-3rem bg-blockBg rounded-12px">
              <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
              <div class="text-zinc-400 text-0.8rem leading-1.4rem p-3">
                {{$t('squareView.p2')}}
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
      <van-popup class="c-tip-drawer 2xl:w-2/5" v-model:show="modalVisible"
                 :position="position">
        <div class="modal-bg w-full md:min-w-560px max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:p-2rem">
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
import { getTagAggregation, getPostsByTagTime, getPostsByTagValue, postErr } from '@/api/api';
import { mapState, mapGetters } from 'vuex'
import { notify, showError } from "@/utils/notify";
import { getPosts } from '@/utils/steem'
import { getDateString } from '@/utils/helper'

export default {
  components: {Blog, Login, PostTip},
  data() {
    return {
      subTagList: ['New', 'Value'],
      subActiveTagIndex: 0,
      listLoading: true,
      listFinished: false,
      refreshing: false,
      list: [],
      position: document.body.clientWidth < 768?'bottom':'center',
      modalVisible: false,
      scroll: 0
    }
  },
  computed: {
    ...mapState('postsModule', ['tagsAggregation', 'allPosts', 'currentTagIndex', 'allPostsTagValue']),
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('postsModule', ['getPostsByTag', 'getPostsByTagValue']),
    tagList() {
      if (this.tagsAggregation) {
        return Object.keys(this.tagsAggregation)
      }else {
        return ['iweb3']
      }
    },
    currentPosts() {
      if (this.subActiveTagIndex === 0){
        if (this.currentTagIndex === -1) {
          let posts = this.getPostsByTag('token2049')
          if (!posts || posts.length === 0) return []
          let activities = []
          for(let post of posts) {
            const acInfo = this.activityInfo(post)
            if (acInfo) {
              activities.push({
                ...post,
                acInfo
              })
            }
          }
          if (activities.length === 0) return [];

          let now = getDateString(new Date(), 480);
          now = new Date().getTime()
          activities.sort((a,b) => new Date(a.acInfo.sdate).getTime() - new Date(b.acInfo.sdate).getTime())
          const pastAc = activities.filter(a => {
            alert('test:' + new Date(a.acInfo.sdate).getTime() + ':' + now)
            return new Date(a.acInfo.sdate).getTime() <= now
          })
          const pendingAc = activities.filter(a => new Date(a.acInfo.sdate).getTime() > now)
          if (pastAc.length === 0) alert(2);
          if (pendingAc.length === 0) alert(3);
          const result = pendingAc.concat(pastAc.reverse());
          if (result.length ===0) alert(4)
          return result
        }
        return this.getPostsByTag(this.tagList[this.currentTagIndex])
      }else if(this.subActiveTagIndex === 1) {
        const postsByTag = this.getPostsByTagValue(this.tagList[this.currentTagIndex])
        if (postsByTag && postsByTag.posts) {
          return postsByTag.posts
        }
        return []
      }
    }
  },
  mounted() {
    getTagAggregation().then(tags => {
      console.log(23, tags);
      const t = tags['token2049']
      tags = {
        token2049: t ?? 1,
        ...tags
      }
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
        this.listFinished = false
        if (newValue === -1) {
          this.subActiveTagIndex = 0
        }
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
    changeSubIndex(index) {
      this.subActiveTagIndex = index
      this.listFinished = false
      this.onRefresh()
    },
    async onLoad() {
      if(this.listLoading || this.listFinished) return
      try{
        this.listLoading = true
        const tag = this.currentTagIndex === -1 ? "token2049" : this.tagList[this.currentTagIndex]
        if (this.subActiveTagIndex === 0) {
          const posts = this.getPostsByTag(tag)
          let time;
          if (posts && posts.length > 0) {
            time = posts[posts.length - 1].postTime
          }
          const res = await getPostsByTagTime(tag, 16, time, false)
          const postsf = await getPosts(res)
          this.allPosts[tag] = (this.allPosts[tag] || []).concat(postsf)
          this.$store.commit('postsModule/saveAllPosts', this.allPosts)
          if (postsf.length < 16) {
            this.listFinished = true
          }else {
            this.listFinished = false
          }
        } else if(this.subActiveTagIndex === 1) {
          let postsTag = this.getPostsByTagValue(tag);
          if (!postsTag) return;
          const pageNum = postsTag.pageNum ?? 0
          let posts = await getPostsByTagValue(tag, 16, pageNum);
          posts = await getPosts(posts)
          postsTag.pageNum = pageNum + 1;
          postsTag.posts = postsTag.posts.concat(posts)
          this.allPostsTagValue[tag] = postsTag
          this.$store.commit('postsModule/saveAllPostsTagValue', this.allPostsTagValue)
          if (posts.length < 16) {
            this.listFinished = true
          }else {
            this.listFinished = false
          }
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
        const tag = this.currentTagIndex === -1 ? "token2049" : this.tagList[this.currentTagIndex]
        if (this.subActiveTagIndex === 0) {
          const posts = this.getPostsByTag(tag)
          let time;
          if (posts && posts.length > 0) {
            time = posts[0].postTime.replace('T', ' ')
            time = time.slice(0, 19)
          }
          const res = await getPostsByTagTime(tag, this.currentTagIndex === -1 ? 200 : 16, time, true)
          const postsf = await getPosts(res)
          this.allPosts[tag] = postsf.concat(this.allPosts[tag] || [])
          this.listLoading = false
          this.$store.commit('postsModule/saveAllPosts', this.allPosts)
        }else if (this.subActiveTagIndex === 1) {
          // by tag and post value
          let posts = await getPostsByTagValue(tag);
          posts = await getPosts(posts)
          this.allPostsTagValue[tag] = {
            pageNum: 1,
            posts
          }
          this.listLoading = false
          this.$store.commit('postsModule/saveAllPostsTagValue', this.allPostsTagValue)
        }
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
    },
    activityInfo(p) {
      const content = p.content;
      let ac = content.split('#token2049')
      if (ac.length > 1) {
        ac = ac[1]
        let infos = ac.replace(/：/g, ':');
        try {
          const sponsor = infos.split('Sponsor:')[1].split('Start')[0].trim();
          const sdate = infos.split('Start:')[1].split('End')[0].trim()
          const edate = infos.split('End:')[1].split('Place')[0].trim()
          const place = infos.split('Place:')[1].split('Location')[0].trim()
          let location = infos.split('Location:')[1].match(/(\[)([0-9 .,\-]+)(\])/)[2].replace(/[ ]+/g, '')
          return {
            sponsor,
            sdate,
            edate,
            place,
            location
          }
        }catch(e) {
          // try{
          //   postErr('Token2049', 'Get activity fail', `${infos}
          //   ${e}`)
          // }catch(e) {}
          console.log('Get act info fail:', e);
          return false
        }
      }
      return false
    }
  }
}
</script>

<style scoped>

</style>