<template>
  <div class="mt-1.6rem">
    <template v-if="currentShowingDetail">
      <!-- <div class="md:border-b-1 border-dividerColor light:border-colorF4 mb-1rem">
        <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px
                    flex items-center md:justify-start justify-center h-2.8rem">
          <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem light:text-blueDark">{{$t('common.post')}}</div>
        </div>
      </div> -->
      <div class="container px-15px mx-auto max-w-50rem pb-2rem md:px-1rem">
        <van-list :loading="listLoading"
                  :finished="listFinished"
                  :immediate-check="false"
                  :finished-text="$t('common.noMore')"
                  @load="onLoad">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-1.5rem">
            <div class="col-span-1 lg:col-span-3 h-max">
              <div class="md:bg-blockBg md:light:bg-white light:shadow-lg rounded-12px md:p-15px">
                <Blog :post="currentShowingDetail"
                      avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem"
                      :isDetail='true'/>
                <div class="border-0 light:border-1 gradient-border gradient-border-color91
                          my-1rem rounded-15px overflow-hidden">
                  <div class="h-min bg-color62 text-white text-left cursor-pointer tip-bg">
                    <div class="text-white light:text-blueDark pl-60px sm:pl-60px pr-18px font-bold min-h-54px
                        flex-1 flex justify-between items-center truncate relative"
                         @click.stop="showTip=true">
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
              <div class="lg:hidden border-b-1 border-color8B/30 light:border-colorF4
                          flex items-center text-14px mb-15px">
                <button class="flex-1 h-40px c-text-black border-b-3"
                        :class="tabIndex===0?'border-color62':'border-transparent'"
                        @click="tabIndex=0">
                  Comments ( {{ comments ? comments.length : 0 }} )
                </button>
                <button class="flex-1 h-40px c-text-black border-b-3"
                        :class="tabIndex===1?'border-color62':'border-transparent'"
                        @click="tabIndex=1">
                  Curation
                </button>
              </div>
              <div v-show="tabIndex===0 || isWeb"
                   class="md:bg-blockBg md:light:bg-white light:shadow-lg rounded-12px lg:mt-15px md:px-15px">
                <div v-if="commentLoading" class="c-text-black text-1.8rem mb-3rem min-h-1rem">
                  <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
                </div>
                <div v-else-if="comments && comments.length > 0"
                     class="pt-1rem border-white/20 md:border-listBgBorder">
                  <div class="c-text-black text-left text-1.2rem hidden lg:block">
                    Comments ( {{ comments ? comments.length : 0 }} )
                  </div>
                  <div class="border-b-1 border-color8B/30 light:border-colorF4"
                       v-for="c of (comments || [])" :key="c.commentId">
                    <Comment class="py-15px" :comment="c"/>
                  </div>
                </div>
              </div>
              <div v-show="tabIndex===1">
                <div v-if="curationLoading" class="c-text-black text-1.8rem mb-3rem min-h-1rem">
                  <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
                </div>
                <template v-else>
                  <div class="c-text-black mr-1rem light:text-blueDark text-left">
                    {{$t('curation.createdPromotion')}}
                  </div>
                  <PostRecommendItem class="mb-15px"
                                     v-for="i of 3" :key="i"
                                     :recommend-data="testData"/>
                  <div class="c-text-black mr-1rem light:text-blueDark text-left">
                    {{$t('curation.createdCurations')}}
                  </div>
                  <PostCreatedCuration :curation-data="testData"/>
                </template>
              </div>
            </div>
            <div class="col-span-1 lg:col-span-2 hidden lg:block">
              <div v-if="curationLoading" class="c-text-black text-1.8rem mb-3rem min-h-1rem">
                <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
              </div>
              <template v-else>
                <div class="c-text-black mr-1rem light:text-blueDark text-left">
                  {{$t('curation.createdPromotion')}}
                </div>
                <PostRecommendItem class="mb-15px"
                                   v-for="i of 3" :key="i"
                                   :recommend-data="testData"/>
                <div class="c-text-black mr-1rem light:text-blueDark text-left">
                  {{$t('curation.createdCurations')}}
                </div>
                <PostCreatedCuration :curation-data="testData"/>
              </template>
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
                       :parent-tweet-id="currentShowingDetail.tweetId"
                       @close="showTip=false"
                       @back="showTip=false"></TipModalVue>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>
import Blog from "@/components/Blog";
import Comment from '@/views/user/components/Comment'
import { mapState, mapGetters } from 'vuex'
import { getPostById, getCommentsByPostid } from '@/api/api'
import { getPosts } from '@/utils/steem'
import iconTop1 from "@/assets/icon-top1.svg";
import iconTop2 from "@/assets/icon-top2.svg";
import iconTop3 from "@/assets/icon-top3.svg";
import PostRecommendItem from "@/components/PostRecommendItem";
import PostCreatedCuration from "@/components/PostCreatedCuration";
import TipModalVue from "@/components/TipModal";
import { useWindowSize } from '@vant/use';
import {ref, watch} from 'vue';

export default {
  name: "PostDetail",
  components: {Blog, Comment, PostRecommendItem, PostCreatedCuration, TipModalVue},
  computed: {
    ...mapState('postsModule', ['currentShowingDetail']),
    ...mapGetters(['getAccountInfo']),
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
      listLoading: false,
      listFinished: false,
      refreshing: false,
      list: [1,2,3,4],
      tabIndex: 0,
      comments: [],
      commentLoading: true,
      showTip: false,
      tips: [],
      top3Icons: [iconTop1, iconTop2, iconTop3],
      tipCollapse: false,
      curationLoading:false,
      testData: {
        "curationId": "6f9ebb0fca5a",
        "creatorTwitter": "1379879665343549440",
        "creatorETH": "0x29f3121af1ce4a5cb874282fe53af0f41b59f2d1",
        "description": "NFT it your way 丨Slash is a one-stop Web3 SaaS platform for NFTs.",
        "token": "0x705931A83C9b22fB29985f28Aee3337Aa10EFE11",
        "amount": "2000000000000000000000",
        "decimals": 18,
        "maxCount": 9999999,
        "minReputation": 0,
        "endtime": 1676800800,
        "tweetId": "1625851685045428233",
        "createdTime": "2023-02-15T13:35:37.000Z",
        "topics": "[\"LunarNewYear\",\"NFT\",\"DAO\",\"NULS \"]",
        "tasks": 28,
        "authorId": "1379879665343549440",
        "spaceId": null,
        "curationType": 1,
        "chainId": 56,
        "followers": "[]",
        "isPromotion": 0,
        "tokenName": "Peanut",
        "tokenSymbol": "PNUT",
        "curationStatus": 0,
        "createStatus": 1,
        "creatorProfileImg": "https://pbs.twimg.com/profile_images/1541648464315969536/pKQB7HZF_normal.jpg",
        "creatorTwitterName": "Slash.sg",
        "creatorTwitterUsername": "Slash_DAO",
        "creatorSteemId": "slashdao",
        "username": "Slash_DAO",
        "name": "Slash.sg",
        "profileImg": "https://pbs.twimg.com/profile_images/1541648464315969536/pKQB7HZF_normal.jpg",
        "ethAddress": "0x29F3121Af1ce4A5CB874282fe53af0f41b59F2d1",
        "postId": "1625851685045428233",
        "content": "📢 Partnership with @wormhole_3, a content distribution platform base on a decentralized curation protocol.\n\n🎁 20 Rabbit Holder NFT \n\n⏰ 2.15 - 2.19\n\nJoin curation to earn 💰\n\nsee details: FYI =&gt; https://alpha.wormhole3.io/#/curation-detail/6f9ebb0fca5a \n\nLet’s embrace Web3 together 🫂  #iweb3\nhttps://pbs.twimg.com/media/FpAvea0aYAAGt8_.jpg",
        "postTime": "2023-02-15T13:37:03.000Z",
        "tags": "[\"iweb3\"]",
        "steemId": "slashdao",
        "retweetInfo": null,
        "pageInfo": null,
        "hostIds": null,
        "speakerIds": null,
        "spaceTitle": null,
        "spaceState": null,
        "spaceStartedAt": null,
        "spaceEndedAt": null,
        "score": 31610,
        "quoted": 0,
        "replied": 0,
        "liked": 609,
        "followed": 529,
        "retweeted": 466
      }
    }
  },
  mounted() {
    const postId = this.$route.params.postId
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
      })
    }
  },
  methods: {
    async onLoad() {
      // if(this.listLoading || this.listFinished) return
      // this.listLoading = true
      // const res = await this.getData()
      // if(this.refreshing) this.list = []
      // this.listLoading = false
      // this.refreshing = false
      // this.list = this.list.concat(res)
      // // 加载完成
      // if (this.list.length >= 10) this.listFinished = true
    },
    onRefresh() {
      // this.listFinished = false
      // this.onLoad()
    },
  },
  beforeDestroy () {
    this.$store.commit('postsModule/saveCurrentShowingDetail', null)
  },
}
</script>

<style scoped>

</style>
