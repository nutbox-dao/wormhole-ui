<template>
  <div class="h-full flex flex-col overflow-hidden relative" id="square-index" >
    <div class="light:bg-transparent">
      <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem">
        <div class="flex justify-between items-center py-5px mt-14px">
          <div class="flex flex-1 overflow-x-auto overflow-y-hidden no-scroll-bar">
            <button v-for="(tag, index) of subTagList.slice(0, 10)" :key="index"
                    class="text-14px whitespace-nowrap mr-10px px-12px py-5px rounded-full border-1 border-color62"
                    :class="selectedTag===tag?'text-white bg-color62':'text-color62'"
                    @click="setSelectTag(tag)">{{tag}}</button>
          </div>
          <div class="flex items-center relative pl-4px">
            <div class="w-1px h-36px bg-color62/34 filter blur-3px"></div>
            <button class="font-500 text-white light:text-blueDark px-12px hidden 2md:block text-14px"
                    @click="showMoreTag=!showMoreTag">
              {{ $t('common.more') }}
            </button>
            <el-dropdown class="bg-color8B/30 light:bg-color62/10 rounded-8px c-small-select h-26px">
              <button class="flex items-center px-4px">
                <img class="filter invert-80 light:invert-0 w-26px h-26px min-w-26px 2md:hidden"
                     :src="rankOptions[rankValue]['icon']" alt="">
                <span class="text-14px hidden 2md:block ml-6px mr-4px">
                  {{$t(`${rankOptions[rankValue].label}`)}}
                </span>
                <img class="w-10px ml-3px mr-6px" src='~@/assets/icon-arrow-primary.svg' alt="">
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in rankOptions"
                                    :key="item.value" @click="rankValue=item.value">
                    {{$t(`${item.label}`)}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
<!--            <el-select v-model="rankValue" placement="bottom-end"-->
<!--                       class="w-100px bg-color8B/30 light:bg-color62/10 rounded-8px c-small-select"-->
<!--                       size="small">-->
<!--              <el-option-->
<!--                  v-for="item in rankOptions"-->
<!--                  :key="item.value"-->
<!--                  :label="$t(`${item.label}`)"-->
<!--                  :value="item.value"-->
<!--              />-->
<!--            </el-select>-->
          </div>
        </div>
        <el-collapse-transition>
          <div v-show="showMoreTag" class="pb-15px">
            <div class="flex flex-wrap items-center gap-10px bg-blockBg light:bg-white rounded-12px shadow-sm p-15px">
              <button v-for="(mTag, index) of moreTag" :key="index"
                      class="text-14px px-12px py-5px rounded-full border-1 border-color62 whitespace-nowrap"
                      :class="mTag===selectedTag?'text-white bg-color62':'text-color62'"
                      @click="setSelectTag(mTag)">
                {{mTag}}
              </button>
              <button v-for="(cTag, cIndex) of customizeTagList" :key="cIndex"
                      class="text-14px px-12px py-5px rounded-full border-1 border-color62 whitespace-nowrap
                             flex items-center"
                      :class="cTag===selectedTag?'text-white bg-color62':'text-color62'"
                      @click="setSelectTag(cTag)">
                {{cTag}}
                <img class="w-14px h-14px ml-4px border-white rounded-full"
                     :class="cTag===selectedTag?'border-1':''"
                     @click.stop="deleteCustomizeTag(cIndex)"
                     src="~@/assets/icon-delete-primary.svg" alt="">
              </button>
            </div>
          </div>
        </el-collapse-transition>
        <div v-if="customizeTag"
             class="flex items-center bg-blockBg light:bg-white rounded-12px px-15px py-10px  shadow-sm">
          <span class="mr-10px c-text-black text-white light:text-blueDark text-14px">Selected Topic: </span>
          <button class="text-14px px-12px py-5px rounded-full border-1 border-color62 whitespace-nowrap
                         flex items-center text-color62"
                  @click="addCustomizeTag(selectedTag)">
            <span>{{selectedTag}}</span>
            <img class="w-14px h-14px ml-4px" src="~@/assets/icon-add-primary.svg" alt="">
          </button>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-auto no-scroll-bar" ref="postPageRef" @scroll="pageScroll">
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
            <div class="container sm:px-15px mx-auto max-w-50rem md:max-w-48rem"
                 :class="postsList && postsList.length>0?'md:p-1rem':''">
              <div v-if="postsList && postsList.length === 0"
                   class="py-3rem bg-blockBg light:bg-white rounded-12px shadow-card">
                <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
                <div class="text-zinc-400 text-0.8rem leading-1.4rem p-3">
                  {{$t('curationsView.p2')}}
                </div>
              </div>
              <div v-else class="-mt-15px sm:-mt-0px md:-mt-15px">
                <div v-for="(post, index) of postsList" :key="post.postId"
                     class="p-15px border-b-0.5px border-color8B/30 light:border-colorD8
                            sm:rounded-16px sm:border-b-0 light:sm:bg-white light:sm:shadow-color1A mb-15px">
                  <div v-if="!post.spaceId">
                    <Blog :post="post"
                          @click="gotoDetail(post, index)"
                          avatar-class="min-w-35px min-h-35px w-35px h-35px md:w-3rem md:h-3rem">
                    </Blog>
                  </div>
                  <div v-else class="">
                    <Space :space="post"
                           @click="gotoDetail(post, index)"
                           avatar-class="min-w-35px min-h-35px w-35px h-35px md:w-3rem md:h-3rem"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>

      </van-pull-refresh>
    </div>
<!--    <router-link to="/word-cloud"-->
<!--                 class="flex items-center justify-center-->
<!--                        h-44px w-44px min-w-44px xl:w-2.8rem xl:min-w-2.8rem xl:h-2.8rem-->
<!--                        mt-0.5rem c-text-bold fixed bottom-6rem 2md:bottom-2rem-->
<!--                        right-1.5rem sm:right-2.5rem xl:right-2.2rem z-999">-->
<!--      <img class="w-full" src="~@/assets/word-cloud-entrance.png" alt="">-->
<!--    </router-link>-->
    <!-- back top  -->
    <button v-show="scroll>200"
            @click="$refs.postPageRef.scrollTo({top: 0, behavior: 'smooth'})"
            class="flex items-center justify-center bg-color62
                   h-40px w-40px min-w-40px 2xl:w-2rem 2xl:min-w-2rem 2xl:h-2rem
                   rounded-full mt-0.5rem c-text-bold fixed bottom-10rem 2md:bottom-2rem right-1.5rem sm:right-2.5rem z-9999">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-arrow-top.svg" alt="">
    </button>
  </div>
</template>

<script>
import CurationsTip from "@/components/CurationsTip";
import { mapGetters, mapState } from 'vuex'
import { getTrendingTags, getPostByTrending, getPostByTime, getCuratedPostByNew } from '@/api/api'
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
      // rankOptions: [{value: 0, label: 'trending'}, {value: 1, label: 'new'}, {value: 2, label: 'promoted'}],
      rankOptions: [
          {value: 0, label: 'trending', icon: require('@/assets/post-type-icon0.svg')},
        {value: 1, label: 'new', icon: require('@/assets/post-type-icon1.svg')}
      ],
      rankValue: 0,
      customizeTagList: [],
      selectedPost: null,
      selectedPostIndex: 0,
      emitter: null
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('postsModule', ['ongoingListByTag', 'trendingListByTag', 'trendingCurationListByTag', 'selectedTag']),
    postsList() {
        if (this.rankValue === 0) {
          return this.trendingListByTag[this.selectedTag] ?? []
        }else if (this.rankValue === 1){
          return this.ongoingListByTag[this.selectedTag] ?? []
        }else {
          return this.trendingCurationListByTag[this.selectedTag] ?? []
        }
    },
    moreTag() {
      return this.subTagList.slice(10)
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
        }else if (this.rankValue == 1) {
          posts = this.ongoingListByTag[tag]
          cursor = Math.floor(posts.length / 12);
        }else {
          posts = this.trendingCurationListByTag[tag];
          cursor = Math.floor(posts.length / 12)
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
        }else if(this.rankValue === 1) {
          mutationStr = 'saveOngoingListByTag'
          morePosts = await getPostByTime(tag, cursor, null, twitterId)
          this.ongoingListByTag[tag] = posts.concat(morePosts)
         this.$store.commit('postsModule/'+mutationStr, this.ongoingListByTag ?? {})
        }else {
          mutationStr = 'saveTrendingCurationListByTag'
          morePosts = await getCuratedPostByNew(tag, cursor, null, twitterId)
          this.trendingCurationListByTag[tag] = posts.concat(morePosts)
         this.$store.commit('postsModule/'+mutationStr, this.trendingCurationListByTag ?? {})
        }
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
        }else if (this.rankValue === 1) {
          posts = await getPostByTime(tag, null, null, twitterId)
          this.ongoingListByTag[tag] = posts
          this.$store.commit('postsModule/saveOngoingListByTag', this.ongoingListByTag ?? {})
        }else {
          posts = await getCuratedPostByNew(tag, null, null, twitterId)
          this.trendingCurationListByTag[tag] = posts
          this.$store.commit('postsModule/saveTrendingCurationListByTag', this.trendingCurationListByTag ?? {})
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
      console.log(post)
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
      // Modify data
      if(this.selectedPost && postDetail && (this.selectedPost.postId === postDetail.postDetail.postId)) {
        this.postsList[this.selectedPostIndex] = postDetail.postDetail
      }
    })
    this.customizeTagList = localStorage.getItem('customizeTagList')?
        JSON.parse(localStorage.getItem('customizeTagList')):[]
    getTrendingTags().then(topics => {
      this.subTagList = ['All'].concat(topics.map(t => t.tag))
    }).catch()
    this.onRefresh();
  }
}
</script>

<style scoped>
.shadow-right {
  box-shadow: 0 0 10px 5px rgba(26,26,26,0.05);
}
</style>
