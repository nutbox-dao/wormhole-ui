<template>
  <div class="h-full flex flex-col overflow-hidden relative" id="square-index" >
    <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem pt-20px">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 overflow-x-auto overflow-y-hidden no-scroll-bar">
          <button v-for="(tag, index) of subTagList.slice(0, 5)" :key="index"
                  class="c-text-black text-16px leading-18px 2xl:text-0.8rem 2xl:leading-0.9rem whitespace-nowrap mr-50px"
                  :class="selectedTag===tag?'light:text-color18':'text-color59/50'"
                  @click="setSelectTag(tag)">{{tag}}</button>
        </div>
        <button class="c-text-black text-white light:text-blueDark pl-8px" @click="showMoreTag=!showMoreTag">
         More >>>
        </button>
      </div>
      <el-collapse-transition>
        <div v-show="showMoreTag" class="mt-1rem">
          <div class="flex flex-wrap items-center gap-25px bg-blockBg light:bg-white rounded-12px shadow-sm p-1.5rem">
            <button v-for="(mTag, index) of moreTag" :key="index"
                    class="c-text-black text-16px leading-18px 2xl:text-0.8rem 2xl:leading-0.9rem
                         whitespace-nowrap"
                    :class="mTag===selectedTag?'text-white light:text-blueDark':'text-color59/50'"
                    @click="setSelectTag(mTag)">
              {{mTag}}
            </button>
            <button v-for="(cTag, cIndex) of customizeTagList" :key="cIndex"
                    class="c-text-black text-16px leading-18px 2xl:text-0.8rem 2xl:leading-0.9rem
                           flex items-center whitespace-nowrap"
                    :class="cTag===selectedTag?'text-white':'text-color59/50'"
                    @click="setSelectTag(cTag)">
              {{cTag}}
              <img class="w-14px h-14px ml-4px"
                   @click.stop="deleteCustomizeTag(cIndex)"
                   src="~@/assets/icon-delete-primary.svg" alt="">
            </button>
          </div>
        </div>
      </el-collapse-transition>
      <div v-if="customizeTag"
           class="flex items-center bg-blockBg light:bg-white rounded-12px px-1.5rem py-12px mb-10px shadow-sm mt-10px">
        <span class="mr-10px c-text-black">Selected Topic: </span>
        <button class="text-14px 2xl:text-0.8rem border-1 border-color62 rounded-4px px-12px py-4px
                       flex items-center whitespace-nowrap text-color62"
                @click="addCustomizeTag(selectedTag)">
          <span>{{selectedTag}}</span>
          <img class="w-14px h-14px ml-4px" src="~@/assets/icon-add-primary.svg" alt="">
        </button>
      </div>
      <div class="flex justify-end items-center my-10px">
        <button class="mr-10px">
          <img class="h-20px w-20px lg:w-1.4rem lg:h-1.4rem" src="~@/assets/icon-rank.png" alt="">
        </button>
        <el-select v-model="rankValue" placement="bottom-end"
                   class="w-100px bg-color8B/30 light:bg-color62/10 rounded-8px c-small-select"
                   size="small">
          <el-option
              v-for="item in rankOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="flex-1 overflow-auto" ref="postPageRef" @scroll="pageScroll">
      <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="refreshing && (!postsList || postsList.length === 0)">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <van-pull-refresh v-else
                        class="min-h-full"
                        v-model="refreshing"
                        @refresh="onRefresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <van-list :loading="listLoading"
                  :finished="listFinished"
                  :immediate-check="false"
                  :loading-text="$t('common.loading')"
                  :finished-text="postsList.length!==0?$t('common.noMore'):''"
                  @load="onLoad">
          <div class="sm:px-15px">
            <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem"
                 :class="postsList && postsList.length>0?'md:p-1rem':''">
              <div v-if="postsList && postsList.length === 0"
                   class="py-3rem bg-blockBg light:bg-white rounded-12px shadow-card">
                <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
                <div class="text-zinc-400 text-0.8rem leading-1.4rem p-3">
                  {{$t('curationsView.p2')}}
                </div>
              </div>
              <div v-else class="-mt-25px">
                <div v-for="(post, index) of postsList" :key="post.postId"
                     class="py-20px border-b-1 border-color8B/30 light:border-colorF4">
                  <div v-if="!post.spaceId">
                    <Blog :post="post"
                    @click="gotoDetail(post, index)"
                          avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem">
                    </Blog>
                  </div>
                  <div v-else
                      class="h-140px md:h-10rem overflow-hidden relative my-10px">
                    <Space :space="post" class="rounded-15px h-full bg-tag-gradient"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>

      </van-pull-refresh>
    </div>
    <!-- back top  -->
    <button v-show="scroll>200"
            @click="$refs.postPageRef.scrollTo({top: 0, behavior: 'smooth'})"
            class="flex items-center justify-center bg-color62
                   h-44px w-44px min-w-44px 2xl:w-2.2rem 2xl:min-w-2.2rem 2xl:h-2.2rem
                   rounded-full mt-0.5rem c-text-bold fixed bottom-6rem right-1.5rem sm:right-2.5rem z-9999">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-arrow-top.svg" alt="">
    </button>
    <!-- create curation   -->
    <button
        class="flex items-center justify-center bg-color62 sm:hidden
               h-44px w-44px min-w-44px 2xl:w-2.2rem 2xl:min-w-2.2rem 2xl:h-2.2rem
               rounded-full mt-0.5rem c-text-bold absolute bottom-2rem right-1.5rem sm:right-2.5rem z-2"
        @click="createCuration">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-add-white.svg" alt="">
    </button>
  </div>
</template>

<script>
import CurationsTip from "@/components/CurationsTip";
import { mapGetters, mapState } from 'vuex'
import { getTrendingTags, getPostByTrending, getPostByTime } from '@/api/api'
import { showError } from '@/utils/notify'
import Blog from "@/components/Blog";
import Space from "@/components/Space";

export default {
  name: "PostsIndex",
  components: {CurationsTip, Blog, Space},
  data() {
    return {
      listLoading: false,
      listsFinished: {},
      refreshing: false,
      subTagList: ['All'],
      subActiveTagIndex: 0,
      modalVisible: false,
      position: document.body.clientWidth < 768?'bottom':'center',
      scroll: 0,
      showMoreTag: false,
      rankOptions: [{value: 0, label: 'Trending'}, {value: 1, label: 'New'}],
      rankValue: 0,
      customizeTagList: [],
      selectedPost: null,
      selectedPostIndex: 0,
      emitter: null
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('postsModule', ['ongoingListByTag', 'trendingListByTag', 'selectedTag']),
    postsList() {
        if (this.rankValue === 0) {
          return this.trendingListByTag[this.selectedTag] ?? []
        }else{
          return this.ongoingListByTag[this.selectedTag] ?? []
        }
    },
    moreTag() {
      return this.subTagList.slice(5)
    },
    customizeTag() {
      return this.selectedTag && this.subTagList.indexOf(this.selectedTag) <0 && this.moreTag.indexOf(this.selectedTag) < 0 && this.customizeTagList.indexOf(this.selectedTag) < 0
    },
    listFinished() {
      return this.listsFinished[this.selectedTag];
    }
  },
  watch: {
    rankValue(newValue, oldValue) {
      this.onRefresh();
    },
    selectedTag(val) {
      this.onRefresh();
    }
  },
  activated() {
    if(this.scroll > 0) this.$refs.postPageRef.scrollTo({top: this.scroll})
    if (this.postsList.length > 0) return;
    this.onRefresh()
  },
  methods: {
    setSelectTag(tag) {
      this.$store.commit('postsModule/saveSelectedTag', tag)
    },
    addCustomizeTag(tag) {
      if (this.customizeTagList.indexOf(tag) > 0) return;
      this.customizeTagList.push(tag)
      localStorage.setItem('customizeTagList', JSON.stringify(this.customizeTagList))
    },
    deleteCustomizeTag(index) {
      this.customizeTagList.splice(index, 1)
    },
    pageScroll() {
      this.scroll = this.$refs.postPageRef.scrollTop
    },
    async onLoad() {
      if(this.refreshing || this.listLoading) return
      try{
        let posts;
        let cursor;
        const tag = this.selectedTag;
        this.listLoading = true;
        if (this.rankValue === 0) {
          posts = this.trendingListByTag[tag]
          cursor = Math.floor(posts.length / 12);
        }else {
          posts = this.ongoingListByTag[tag]
          cursor = Math.floor(posts.length / 12);
        }

        if (!posts || posts.length === 0) {
          this.listsFinished[tag] = true
          return;
        }

        let morePosts = [];

        let mutationStr = ''
        const twitterId = this.getAccountInfo ? this.getAccountInfo.twitterId : null;

        if (this.rankValue === 0) {
          mutationStr = 'saveTrendingListByTag'
          morePosts = await getPostByTrending(tag, cursor, null, twitterId)
          this.trendingListByTag[tag] = posts.concat(morePosts)
          this.$store.commit('postsModule/'+mutationStr, this.trendingListByTag ?? {})
        }else {
          mutationStr = 'saveOngoingListByTag'
          morePosts = await getPostByTime(tag, cursor, null, twitterId)
          this.ongoingListByTag[tag] = posts.concat(morePosts)
         this.$store.commit('postsModule/'+mutationStr, this.ongoingListByTag ?? {})
        }
        console.log(3, morePosts.length);
        if (morePosts.length < 12) {
          this.listsFinished[tag] = true
        }else {
          this.listsFinished[tag] = false
        }
      } catch(e) {
        console.log('Get more posts fail:', e);
        showError(501)
      } finally {
        this.listLoading = false
      }
    },
    async onRefresh() {
      this.refreshing = true
      try{
        let tag = this.selectedTag;
        let posts = []
        const twitterId = this.getAccountInfo ? this.getAccountInfo.twitterId : null
        if (this.rankValue === 0) {
          posts = await getPostByTrending(tag, null, null, twitterId)
          this.trendingListByTag[tag] = posts
          this.$store.commit('postsModule/saveTrendingListByTag', this.trendingListByTag ?? {})
        }else{
          posts = await getPostByTime(tag, null, null, twitterId)
          this.ongoingListByTag[tag] = posts
          this.$store.commit('postsModule/saveOngoingListByTag', this.ongoingListByTag ?? {})
        }
        if (!posts || posts.length < 12) {
          this.listsFinished[tag] = true
        }else {
          this.listsFinished[tag] = false
        }
      } catch(e) {
        console.log('Refresh posts fail:', e);
        showError(501)
      } finally {
        this.refreshing = false
      }
    },
    gotoDetail(post, index) {
      this.selectedPost = post
      this.selectedPostIndex = index
      this.$store.commit('postsModule/saveCurrentShowingDetail', post);
      this.$router.push('/post-detail/' + post.postId);
    },
    createCuration() {
      if (this.getAccountInfo && this.getAccountInfo.twitterId) {
        this.$router.push('/create-curation')
      }else {
        this.$store.commit('saveShowLogin', true)
      }
    }
  },
  mounted () {
    this.$bus.on('updatePostIndetail', (postDetail) => {
      console.log('update post', postDetail)
      // 修改数据
      if(this.selectedPost.postId === postDetail.postId) {
        console.log('============', this.selectedPost)
        this.postsList[this.selectedPostIndex] = postDetail
      }
    })
    this.customizeTagList = localStorage.getItem('customizeTagList')?
        JSON.parse(localStorage.getItem('customizeTagList')):[]
    getTrendingTags().then(topics => {
      this.subTagList = ['All'].concat(topics.map(t => t.tag))
    })
    this.onRefresh();
  }
}
</script>

<style scoped>

</style>
