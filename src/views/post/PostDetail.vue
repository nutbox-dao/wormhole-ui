<template>
  <div>
    <template v-if="currentShowingDetail">
      <div class="container mx-auto w-full sm:max-w-50rem sticky top-0 lg:relative bg-primaryBg light:bg-white
                  border-b-1 xs:border-b-0 border-color8B/30 light:border-color7F z-99">
        <div class="flex h-70px pt-23px justify-center items-center relative">
          <span class="text-20px c-text-black max-w-2/3 truncate lg:hidden">{{currentShowingDetail.name}}</span>
          <button @click="$router.go(-1)"
                  class="w-20px xs:w-40px h-40px xs:bg-white/20 xs:light:bg-colorF7 rounded-full
                         flex items-center justify-center absolute left-15px">
            <i class="icon-back w-20px h-20px"></i>
          </button>
        </div>
      </div>
      <div class="container px-15px mx-auto max-w-50rem pb-2rem pt-15px xs:pt-0">
        <van-list :loading="listLoading"
                  :finished="listFinished"
                  :immediate-check="false"
                  :finished-text="''"
                  @load="onLoad">
          <div class="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-1.5rem">
            <div class="col-span-1 lg:col-span-3 xl:col-span-2 h-max">
              <div class="md:bg-blockBg md:light:bg-white light:lg:shadow-lg rounded-12px md:p-15px">
                <Space v-if="currentShowingDetail.spaceId" ref="postRef"
                       :space="currentShowingDetail"
                       :is-detail='true'
                       avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem"></Space>
                <Blog v-else ref="postRef"
                      :post="currentShowingDetail"
                      avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem"
                      :is-detail='true'/>
                <div class="flex gap-x-0.8rem font-200 text-0.6rem flex-wrap text-color8B light:text-color7D ">
                  <button class="border-1 border-color62 py-3px px-6px rounded-full mt-10px
                                 whitespace-nowrap cursor-pointer"
                          :class="selectedTag === cTag?'bg-color62 text-white':'light:text-color46 bg-color62/20'"
                          v-for="cTag of JSON.parse(currentShowingDetail.topics || '[]')" :key="cTag"
                          @click.stop="onSelectTag(cTag)">
                    {{cTag}}
                  </button>
                </div>
                <div class="border-0 light:border-1 gradient-border gradient-border-color91
                          my-1rem rounded-15px overflow-hidden">
                  <div class="h-min bg-color62 text-white text-left cursor-pointer tip-bg">
                    <div class="text-white light:text-blueDark pl-60px sm:pl-60px pr-18px font-bold min-h-54px
                        flex-1 flex justify-between items-center truncate relative"
                         @click.stop="tip">
                      <el-carousel v-if="tips && tips.length>0"
                                   class="w-full hidden sm:block"
                                   height="54px" indicator-position="none" :loop="true"
                                   direction="vertical" :autoplay="true"
                                   :interval="2500">
                        <el-carousel-item v-for="item in tips" :key="item" class="flex items-center">
                          <div class="flex-1 c-text-black text-12px xl:text-0.7rem text-white">{{tipStr(item)}}</div>
                        </el-carousel-item>
                      </el-carousel>
                      <van-notice-bar class="w-full bg-transparent px-0 sm:hidden"
                                      scrollable :speed="100"
                                      v-if="tips && tips.length>0">
                        <template #default>
                    <span v-for="item in tips" :key="item"
                          class="mr-4rem c-text-black text-12px xl:text-0.7rem text-white">{{tipStr(item)}}</span>
                        </template>
                      </van-notice-bar>
                      <span v-else class="text-14px absolute w-full h-full top-0 left-0 flex items-center justify-center font-bold text-white">
                      {{$t('curation.tipToUser', {user: currentShowingDetail.username})}}
                    </span>
                      <button v-if="top3Tip && top3Tip.length > 0" @click.stop="tipCollapse=!tipCollapse"
                              class="ml-10px bg-black rounded-full text-white h-24px min-w-60px flex items-center justify-center
                             leading-18px text-12px 2xl:text-0.7rem 2xl:leading-0.8rem px-3px">Top3</button>
                    </div>
                    <el-collapse-transition>
                      <div v-show="tipCollapse" class="pb-10px px-18px">
                        <div class="px-25px py-6px bg-white text-black rounded-10px">
                          <div class="h-32px flex justify-between items-center text-12px"
                               v-for="(tip, index) of top3Tip" :key="'tops' + tip.hash">
                            <div class="flex items-center">
                              <img class="w-18px" :src="top3Icons[index]" alt="">
                              <span>{{tip.fromUsername}}</span>
                            </div>
                            <span>{{tip.amount}} STEEM</span>
                          </div>
                        </div>
                      </div>
                    </el-collapse-transition>
                  </div>
                </div>
              </div>
              
              <div v-show="isWeb" class="border-1 border-color84/30 rounded-20px overflow-hidden mt-12px light:bg-white">
                  <div class="flex items-center bg-inputBg light:bg-color84/5 px-20px pt-24px pb-10px">
                    <div class="c-text-black mr-4px light:text-blueDark text-left text-20px">
                      {{$t('curation.createdCurations')}}
                    </div>
                    <el-popover placement="bottom" :width="200" trigger="hover">
                      <template #reference>
                        <img class="w-16px h-16px min-w-16px min-h-16px" src="~@/assets/icon-question-purple.svg" alt="">
                      </template>
                      <div>{{ $t('postView.curationTips') }}</div>
                    </el-popover>
                  </div>
                  <div class="px-20px pb-24px">
                    <div v-if="curationLoading" class="c-text-black text-1.8rem min-h-1rem">
                      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
                    </div>
                    <div v-if="!curationLoading && curationList.length===0" class="py-2rem">
                      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
                      <div class="text-color8B light:text-color7D text-12px mt-4px">{{$t('common.none')}}</div>
                    </div>
                    <PostCreatedCuration v-if="curationList.length > 0"
                                         class="py-15px "
                                         :curation-data="curationList[0]"
                                         :post="currentShowingDetail"/>
                  </div>
              </div>
              
              <div class="lg:bg-blockBg lg:light:bg-white light:lg:shadow-lg rounded-12px lg:mt-15px lg:px-15px">
                <div class="c-text-black text-left text-1.2rem lg:block py-15px">
                  {{ $t('common.comments') }}
                </div>
                <div v-if="commentLoading" class="c-text-black text-1.8rem mb-3rem min-h-1rem">
                  <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
                </div>
                <template v-else-if="comments.length > 0">
                  <div class="border-b-1 lg:border-t-1 lg:border-b-0 border-color8B/30 light:border-colorF4
                              px-15px lg:px-0"
                       v-for="c of (comments || [])" :key="c.commentId">
                    <Comment class="py-15px" :comment="c"/>
                  </div>
                </template>
                <div v-else class="py-2rem">
                  <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
                  <div class="text-color8B light:text-color7D text-12px mt-4px">{{$t('common.none')}}</div>
                </div>
              </div>
            </div>
            <div class="col-span-1 lg:col-span-2 xl:col-span-1 hidden lg:block">
              <div class="border-1 border-color84/30 rounded-20px overflow-hidden mt-12px light:bg-white">
                <div class="flex items-center bg-inputBg light:bg-color84/5 px-20px pt-24px pb-10px">
                  <div class="c-text-black mr-4px light:text-blueDark text-left">
                    {{$t('curation.createdCurations')}}
                  </div>
                  <el-popover placement="bottom" :width="200" trigger="hover">
                    <template #reference>
                      <img class="w-16px h-16px min-w-16px min-h-16px" src="~@/assets/icon-question-purple.svg" alt="">
                    </template>
                    <div>{{ $t('postView.curationTips') }}</div>
                  </el-popover>
                </div>
                <div class="px-20px pb-24px">
                  <div v-if="curationLoading" class="c-text-black text-1.8rem min-h-1rem">
                    <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
                  </div>
                  <div v-if="!curationLoading && curationList.length===0" class="py-2rem">
                    <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
                    <div class="text-color8B light:text-color7D text-12px mt-4px">{{$t('common.none')}}</div>
                  </div>
                  <PostCreatedCuration v-if="curationList.length > 0"
                                       class="py-15px "
                                       :curation-data="curationList[0]"
                                       :post="currentShowingDetail"/>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </template>
    <van-popup class="md:w-600px bg-black light:bg-transparent"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               v-model:show="showTip"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="showTip"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden min-h-60vh">
          <button class="absolute right-20px top-24px"
                  @click="showTip=false">
            <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
          </button>
          <TipModalVue class="pt-70px 2xl:pt-3.5rem h-60vh"
                       :tipToUser="currentShowingDetail"
                       :parent-tweet-id="currentShowingDetail.postId"
                       @close="showTip=false"
                       @back="showTip=false"></TipModalVue>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>
import Blog from "@/components/Blog";
import Space from "@/components/Space";
import Comment from '@/views/user/components/Comment'
import { mapState, mapGetters } from 'vuex'
import { getPostById, getCommentsByPostid, getCurationsOfTweet, getAllTipsByTweetId, getTopTipsOfTweetId } from '@/api/api'
import { getPosts } from '@/utils/steem'
import { EVM_CHAINS } from '@/config'
import { formatAmount } from '@/utils/helper'
import iconTop1 from "@/assets/icon-top1.svg";
import iconTop2 from "@/assets/icon-top2.svg";
import iconTop3 from "@/assets/icon-top3.svg";
import PostRecommendItem from "@/components/PostRecommendItem";
import PostCreatedCuration from "@/components/PostCreatedCuration";
import TipModalVue from "@/components/TipModal";
import { useWindowSize } from '@vant/use';
import {ref, watch} from 'vue';
import { getCuratorNFT } from '@/utils/asset'
import { notify } from "@/utils/notify";
import PostButtonGroup from "@/components/PostButtonGroup";

export default {
  name: "PostDetail",
  components: {Blog, Comment, PostRecommendItem, PostCreatedCuration, TipModalVue, Space, PostButtonGroup},
  computed: {
    ...mapState('postsModule', ['currentShowingDetail']),
    ...mapGetters(['getAccountInfo']),
    ...mapState('curation', ['selectedTag']),
    curationList() {
      if (this.curations) {
        return this.curations.filter(c => c.isPromotion)
      }
      return []
    },
    promotionList() {
      if (this.curations) {
        return this.curations.filter(c => !c.isPromotion)
      }
      return []
    },
    top3Tip() {
      if (this.tips && this.tips.length > 0) {
        const steemTips = this.tips.filter(t => t.chainName == 'STEEM');
        return steemTips.sort((a, b) => b.amount - a.amount).slice(0, 3)
      }
      return []
    },
  },
  setup() {
    const { width, height } = useWindowSize();
    const isWeb = ref()
    watch([width, height], () => {
      isWeb.value = width>1024
    });
    return {
      isWeb
    }
  },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      listLoading: false,
      listFinished: false,
      refreshing: false,
      postId: '',
      list: [1,2,3,4],
      tabIndex: 0,
      comments: [],
      commentLoading: true,
      showTip: false,
      tips: [],
      top3Icons: [iconTop1, iconTop2, iconTop3],
      tipCollapse: false,
      curationLoading:false,
      curations: [],
      updateInterval: null,
      creatingCuration: false
    }
  },
  mounted() {
    const postId = this.$route.params.postId
    this.postId = postId
    this.$gtag.pageview('/post-detail/' + postId)
    // this.onLoad()
    if (!this.currentShowingDetail) {
      // get post
      getPostById(this.getAccountInfo?.twitterId, postId).then(async (p) => {
        if (p) {
          this.$store.commit('postsModule/saveCurrentShowingDetail', p)
          getCommentsByPostid(postId).then(async comments => {
            this.comments = await getPosts(comments.map(c => ({
              ...c,
              postId: c.commentId
            })))
          }).finally(() => {
            this.commentLoading = false
          })
        }
      })
    }else {
      getCommentsByPostid(postId).then(async comments => {
        this.comments = await getPosts(comments.map(c => ({
            ...c,
            postId: c.commentId
          })))
        this.commentLoading = false
      }).finally(() => {
        this.commentLoading = false
      })
    }
    this.curationLoading = true
    getCurationsOfTweet(postId).then(curations => {
      this.curations = curations
    }).catch(e => console.log('get curation of tweet fail:', e)).finally(() => {
      this.curationLoading = false
    })
    this.updateCurationInfo()
    this.updateInterval = setInterval(this.updateCurationInfo, 10000);
  },
  methods: {
    formatAmount,
    async onLoad() {
      if(this.listLoading || this.listFinished) return
      try{
        this.listLoading = true;
        if (!this.comments || this.comments.length === 0) {
          return;
        }
        const comments = await getCommentsByPostid(this.postId, this.comments[this.comments.length - 1].commentTime);
        if (comments && comments.length > 0) {
          this.comments = this.comments.concat(comments);
        }
        if (comments.length < 20) {
          this.listFinished = true
        }
      } catch (e) {
        console.log('get more comments fail:', e);
      } finally {
        this.listLoading = false
      }
    },
    onRefresh() {
      // this.listFinished = false
      // this.onLoad()
    },
    updateCurationInfo() {
      const postId = this.$route.params.postId
      // update tip info
      getAllTipsByTweetId(postId).then(res => {
          if (!res) return;
          this.tips = res
        })
    },
    tipStr(tip) {
      if (tip.chainName === 'STEEM') {
        return `@${tip.fromUsername} tips ${tip.emoji ? (tip.emoji + '(' + tip.amount + ' STEEM)') : (tip.amount + ' STEEM')} to @${tip.toUsername}`
      }else {
        let chainName;
        for (let chain in EVM_CHAINS) {
          if (EVM_CHAINS[chain].id === parseInt(tip.chainName)) {
            chainName = chain;
            break;
          }
        }
        return `@${tip.fromUsername} tips ${formatAmount(tip.amount / (10 ** tip.decimals))} ${tip.symbol}(${chainName}) to @${tip.toUsername}`
      }
    },
    tip() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      this.showTip = true
    },
    createPromotion() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      if (this.currentShowingDetail.spaceId) {
        this.$router.push({
          name: 'create-curation',
          state: {
            type: 'space',
            author: this.currentShowingDetail.username,
            tweetId: this.currentShowingDetail.postId
          }
        })
      }else {
        this.$router.push({
          name :'create-curation',
          state: {
            type: 'tweet',
            author: this.currentShowingDetail.username,
            tweetId: this.currentShowingDetail.postId
          }
        })
      }
    },
    async createCuration() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      try{
        // check user nft
        const balance = await getCuratorNFT(this.getAccountInfo.ethAddress)
        this.creatingCuration = true
        if (balance < 1) {
          this.$router.push({
            name: 'create-curation',
            state: {
              type: 'curation',
              author: this.currentShowingDetail.username,
              tweetId: this.currentShowingDetail.postId
            }
          })
          return;
        }
        this.$refs.postRef.onQuote()
      } catch(e) {
        console.log('create curation fail', e);
      } finally {
        this.creatingCuration = false
      }
    },
    onSelectTag(tag) {
      this.$store.commit('curation/saveSelectedTag', tag)
    },
  },
  beforeDestroy () {
    this.$store.commit('postsModule/saveCurrentShowingDetail', null)
  },
  beforeUnmount () {
    clearInterval(this.updateInterval)
  },
  unmounted() {
    clearInterval(this.updateInterval)
  }
}
</script>

<style scoped>
.tip-bg {
  background-image: url("~@/assets/tips-img.svg");
  background-repeat: no-repeat;
  background-size: 24px 24px;
  background-position: 18px 15px;
}
.c-list-item:last-child {
  border: none;
}
</style>
