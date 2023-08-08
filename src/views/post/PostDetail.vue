<template>
  <div class="h-full overflow-hidden flex flex-col">
    <template v-if="currentShowingDetail">
      <div class="w-full sticky top-0 lg:relative bg-primaryBg light:bg-white light:md:bg-transparent
                  border-b-0.5px xs:border-b-0 border-color8B/30 light:border-color7F z-99">
        <div class="flex h-60px justify-center items-center relative container mx-auto max-w-50rem">
          <span class="text-20px c-text-black max-w-2/3 truncate lg:hidden">{{currentShowingDetail.name}}</span>
          <button @click="$router.go(-1)"
                  class="w-20px xs:w-40px h-40px xs:bg-white/20 xs:light:bg-colorF7 rounded-full
                         flex items-center justify-center absolute left-15px">
            <i class="icon-back w-20px h-20px"></i>
          </button>
        </div>
      </div>
      <div class="container px-15px mx-auto max-w-50rem py-15px xs:py-0 flex-1 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-15px h-full overflow-hidden">
          <div class="col-span-1 lg:col-span-3 h-full overflow-auto no-scroll-bar">
            <van-list :loading="listLoading"
                      :finished="listFinished"
                      :immediate-check="false"
                      :finished-text="''"
                      @load="onLoad">
              <div class="md:bg-blockBg md:light:bg-white light:lg:shadow-color1A rounded-12px md:p-15px">
                <Space v-if="currentShowingDetail.spaceId" ref="postRef"
                       :space="currentShowingDetail"
                       :is-detail='true'
                       avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem">
                </Space>
                <Blog v-else ref="postRef"
                      :post="currentShowingDetail"
                      avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem"
                      :is-detail='true'>
                </Blog>
                <div class="flex gap-x-0.8rem font-200 text-0.6rem flex-wrap text-color8B light:text-color7D ">
                  <button class="border-1 border-color62 py-3px px-6px rounded-full mt-10px
                                 whitespace-nowrap cursor-pointer"
                          :class="selectedTag === cTag?'bg-color62 text-white':'light:text-color46 bg-color62/20'"
                          v-for="cTag of JSON.parse(currentShowingDetail.topics || '[]')" :key="cTag"
                          @click.stop="onSelectTag(cTag)">
                    {{cTag}}
                  </button>
                </div>
                <div v-if="!currentShowingDetail.spaceId"
                     class="border-0 light:border-1 gradient-border gradient-border-color91
                            mt-1rem rounded-15px overflow-hidden">
                  <div class="h-min bg-color62 text-white text-left cursor-pointer tip-bg">
                    <div class="text-white light:text-blueDark pl-60px sm:pl-60px pr-18px font-bold min-h-54px
                                flex-1 flex justify-between items-center truncate relative"
                         @click.stop="tip">
                      <span class="text-14px absolute w-full h-full top-0 left-0
                                   flex items-center justify-center font-bold text-white">
                        {{$t('curation.tipToUser', {user: currentShowingDetail.username})}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="curationLoading || participant.length > 0" class="bg-color62/20  rounded-12px px-15px py-8px min-h-54px md:mt-15px
                          flex lg:hidden justify-between items-center">
                <img v-if="curationLoading|| participantLoading"
                     class="h-40px mx-auto"
                     src="~@/assets/profile-loading.gif" alt="" />
                <template v-if="participant.length>0">
                  <span class="flex-1 text-left">
                    {{$t('curation.attendedNum', {num:participant[0].totalCount})}}
                  </span>
                  <div class="flex items-center" @click="showAttendedList=true">
                    <div v-for="p of participant.slice(0,3)" :key="p">
                      <img v-if="p.profileImg"
                           class="h-30px w-30px min-w-30px min-h-30px rounded-full border-2 border-color62 light:border-white bg-color8B/10 -ml-10px"
                           @error="replaceEmptyImg"
                           :src="p.profileImg.replace('normal', '200x200')" alt="">
                      <img v-else
                           class="h-30px w-30px min-w-30px min-h-30px rounded-full border-2 border-color62 light:border-white bg-color8B/10"
                           src="~@/assets/icon-default-avatar.svg" alt="">
                    </div>
                    <button class="text-12px ml-5px">{{$t('common.more')}} >>></button>
                  </div>
                </template>
              </div>
              <div class="md:bg-blockBg md:light:bg-white light:lg:shadow-color1A rounded-12px
                          md:pb-15px md:mt-15px md:px-15px mb-15px">
                <div class="c-text-black text-left text-16px 2xl:text-18px lg:block py-15px">
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
            </van-list>
          </div>
          <!--Space-->
          <div v-if="currentShowingDetail.spaceId"
               class="col-span-1 lg:col-span-2 hidden lg:block h-full overflow-hidden pb-15px">
            <div class="max-h-full overflow-hidden flex flex-col">
              <SpaceIncome class="rounded-16px bg-blockBg light:bg-white light:shadow-color1A"
                           :space="currentShowingDetail"></SpaceIncome>
              <div class="rounded-16px bg-blockBg light:bg-white light:shadow-color1A mt-15px">
                <div class="flex items-center justify-center gap-30px h-48px text-14px font-bold
                            border-b-0.5px border-color8B/30 light:border-color7F
                            px-15px w-min min-w-full">
                  <button class="h-full px-5px 2md:px-10px whitespace-nowrap"
                          :class="spaceTabType==='curation'?'c-active-tab text-color62':'text-color7D'"
                          @click="spaceTabType='curation'">
                    {{$t('common.curation')}}
                  </button>
                  <button class="h-full px-5px 2md:px-10px whitespace-nowrap"
                          :class="spaceTabType==='space'?'c-active-tab text-color62':'text-color7D'"
                          @click="spaceTabType='space'">Space</button>
                </div>
                <div v-if="(curationLoading || participantLoading) && participant.length===0"
                     class="c-text-black py-2rem min-h-1rem">
                  <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
                </div>
                <div v-else-if="(!curationLoading && !participantLoading) && participant.length===0"
                     class="c-text-black py-2rem min-h-1rem">
                  <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
                  <div class="text-12px text-color8B mt-10px">{{$t('common.none')}}</div>
                </div>
                <CurationAttendedList class="flex-1 overflow-hidden"
                                      v-else-if="curationList.length>0"
                                      :records="participant"
                                      :post="currentShowingDetail"
                                      :curation="curationList[0]"
                                      :state="curationList[0].curationStatus"
                                      @close="showAttendedList=false">
                  <template #top-info>
                    <div class="flex-1 flex justify-between flex-col xs:flex-row xs:items-center">
                      <div class="c-text-black text-20px py-6px">
                        {{$t('curation.participants')}}
                      </div>
                      <div class="h-24px flex items-center text-12px">
                        {{$t('curation.attendedNum', {num:participant.length>0?participant[0].totalCount:'--'})}}
                      </div>
                    </div>
                  </template>

                </CurationAttendedList>
              </div>
            </div>
          </div>
          <div v-else class="col-span-1 lg:col-span-2 hidden lg:block h-full overflow-hidden pb-15px">
            <div class="rounded-16px bg-blockBg light:bg-white light:shadow-color1A
                        max-h-full overflow-hidden flex flex-col">
              <div v-if="(curationLoading || participantLoading) && participant.length===0"
                   class="c-text-black py-2rem min-h-1rem">
                <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
              </div>
              <CurationAttendedList class="flex-1 overflow-hidden"
                                    v-else-if="curationList.length>0"
                                    :records="participant"
                                    :post="currentShowingDetail"
                                    :curation="curationList[0]"
                                    :state="curationList[0].curationStatus"
                                    @close="showAttendedList=false">
                <div class="h-24px flex items-center text-12px">
                  {{$t('curation.attendedNum', {num:participant.length>0?participant[0].totalCount:'--'})}}
                </div>
              </CurationAttendedList>
            </div>
          </div>
        </div>
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
    <van-popup class="md:w-600px bg-black light:bg-transparent"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               v-model:show="showAttendedList"
               teleport="body"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="showAttendedList"
             class="dark:bg-glass light:bg-white rounded-t-12px">
          <CurationAttendedList class="max-h-60vh min-h-60vh"
                                :records="participant"
                                :post="currentShowingDetail"
                                :curation="curationList[0]"
                                :state="curationList[0].curationStatus"
                                @close="showAttendedList=false">
              <div class="h-24px flex items-center">
                {{$t('curation.attendedNum', {num:participant[0].totalCount})}}
              </div>
          </CurationAttendedList>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>
import Blog from "@/components/Blog";
import Space from "@/components/Space";
import SpaceIncome from "@/components/SpaceIncome.vue";
import Comment from '@/views/user/components/Comment'
import { mapState, mapGetters } from 'vuex'
import {
  getPostById,
  getCommentsByPostid,
  getCurationsOfTweet,
  getAllTipsByTweetId,
  getTopTipsOfTweetId,
  getAutoCurationRecord
} from '@/api/api'
import { getPosts } from '@/utils/steem'
import { EVM_CHAINS } from '@/config'
import {formatAmount, formatPrice, parseSpaceStartTime} from '@/utils/helper'
import iconTop1 from "@/assets/icon-top1.svg";
import iconTop2 from "@/assets/icon-top2.svg";
import iconTop3 from "@/assets/icon-top3.svg";
import PostRecommendItem from "@/components/PostRecommendItem";
import PostCreatedCuration from "@/components/PostCreatedCuration";
import TipModalVue from "@/components/TipModal";
import { useWindowSize } from '@vant/use';
import {ref, watch} from 'vue';
import {getCuratorNFT, getPriceFromOracle} from '@/utils/asset'
import { notify } from "@/utils/notify";
import PostButtonGroup from "@/components/PostButtonGroup";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import CurationAttendedList from "@/components/CurationAttendedList.vue";
import ChainTokenIcon from "@/components/ChainTokenIcon.vue";
import {isNumeric} from "@/utils/tool";

export default {
  name: "PostDetail",
  components: {Blog, Comment, PostRecommendItem, PostCreatedCuration, TipModalVue, Space, PostButtonGroup,
    CurationAttendedList, ChainTokenIcon, SpaceIncome},
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
  watch: {
    curationList(val) {
      if(val.length>0) this.getParticipant()
    }
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
      creatingCuration: false,
      participant: [],
      count: 0,
      participantLoading: false,
      showAttendedList: false,
      spaceTabType: 'curation'
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
    countdown(time) {
      if(!time || !isNumeric(time)) return 0
      return time*1000 - new Date().getTime()
    },
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
        if (comments.length < 10) {
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
    getParticipant() {
      if(this.participantLoading) return
      const id = this.curationList[0].curationId;
      this.participantLoading = true
      getAutoCurationRecord(id).then(res => {
        this.participant = res ?? []
      }).catch(console.log).finally(() => {this.participantLoading = false})
    },
    updateCurationInfo() {
      const postId = this.$route.params.postId
      // update tip info
      if (this.count++ % 3 === 0 && this.curationList.length>0) this.getParticipant()
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
