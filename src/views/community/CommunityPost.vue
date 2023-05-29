<template>
  <div class="py-10px">
    <div class="w-full" ref="wRef"></div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
        v-if="refreshing && (!announces || announces.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!refreshing && (!announces || announces.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <template v-else>
      <van-swipe :loop="false"
                  :autoplay="0"
                  :width="width<640?width*0.85:$refs.wRef.clientWidth"
                  :initial-swipe="activeAnnounceIndex"
                  :show-indicators="false"
                  class="px-8px sm:px-0">
        <van-swipe-item
            v-for="(post, index) of announces" :key="post.postId"
            class="p-7px">
          <RecommendPost class="rounded-12px border-1 border-color8B/30 light:border-color7F"
                          @click="gotoDetail(post, index)"
                          :post="post"></RecommendPost>
        </van-swipe-item>
      </van-swipe>
      <div class="hidden sm:flex justify-center items-center">
        <button class="w-30px h-30px bg-color62/20 rounded-full flex justify-center items-center
                        disabled:opacity-30"
                :disabled="activeAnnounceIndex===0"
                @click="activeAnnounceIndex-=1">
          <img class="w-12px h-12px transform rotate-90" src="~@/assets/icon-arrow-primary.svg" alt="">
        </button>
        <div class="flex items-center gap-5px mx-20px">
          <span v-for="i of announces.length" :key="i"
                class="w-4px h-4px min-w-4px min-h-4px rounded-full bg-color62 block"
                :class="activeAnnounceIndex+1===i?'':'opacity-10'"></span>
        </div>
        <button class="w-30px h-30px bg-color62/20 rounded-full flex justify-center items-center
                        disabled:opacity-30"
                :disabled="activeAnnounceIndex===announces.length-1"
                @click="activeAnnounceIndex+=1">
          <img class="w-12px h-12px transform -rotate-90" src="~@/assets/icon-arrow-primary.svg" alt="">
        </button>
      </div>
<!--      <div class="w-7/10 mx-auto h-1px bg-color8B/30 light:bg-color7F my-20px sm:hidden"></div>-->
    </template>
    <div class="px-15px">
      <div class="flex items-center justify-between mt-10px">
        <span class="c-text-black text-14px">Post ({{ showingCommunity.curationCount }})</span>
        <el-dropdown>
          <button class="text-14px text-color62 flex items-center">
            <span class="font-bold">{{postType[typeIndex]}}</span>
            <img class="w-12px ml-4px" src="~@/assets/icon-arrow-primary.svg" alt="">
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(type, index) of postType" :key="type"
                                @click="typeIndex=index">
            <span class="text-12px" :class="typeIndex===index?'text-color62':''">
              {{type}}
            </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
          v-if="refreshing && (!postsList || postsList.length === 0)">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <div v-else-if="!refreshing && (!postsList || postsList.length === 0)" class="py-2rem">
        <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
        <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
      </div>
      <van-pull-refresh v-else
                        class="min-h-40vh"
                        v-model="refreshing"
                        @refresh="refresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <van-list :loading="listLoading"
                  :finished="listFinished"
                  :immediate-check="false"
                  :loading-text="$t('common.loading')"
                  :finished-text="postsList.length!==0?$t('common.noMore'):''"
                  @load="onLoad">
            <div v-for="(post, index) of postsList" :key="post.postId"
                class="py-20px border-b-0.5px border-color8B/30 light:border-colorD8">
              <Blog :post="post"
                    :showCommunity="false"
                    @click="gotoDetail(post, index)"
                    avatar-class="min-w-35px min-h-35px w-35px h-35px md:w-3rem md:h-3rem">
              </Blog>
            </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import RecommendPost from "@/components/community/RecommendPost";
import Blog from "@/components/Blog";
import {useWindowSize} from "@vant/use";
import { getCommunityActivePosts, getCommunityTrendingPosts, getCommunityNewPosts, getCommunityPromotionPosts, getCommunityAnnouncement } from '@/api/api'
import { mapGetters, mapState } from "vuex";
import { sleep } from "@/utils/helper";
import { notify } from '@/utils/notify'

export default {
  name: "CommunityPost",
  components: {RecommendPost, Blog},
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('community', ['showingCommunity', 'trendingPosts', 'newPosts', 'promotionPosts', 'announces']),
    postsList() {
      if(this.typeIndex == 0) {
        return this.trendingPosts ?? []
      }else if(this.typeIndex == 1) {
        return this.promotionPosts ?? []
      }else if (this.typeIndex == 2) {
        return this.newPosts ?? []
      }
      return []
    }
  },
  data() {
    return {
      postType: ['Trending', 'Promotion', 'new'],
      typeIndex: 0,
      listLoading: false,
      listFinished: false,
      refreshing: true,
      activeAnnounceIndex: 0,
      communityId: ''
    }
  },
  watch: {
    typeIndex(newValue, oldValue) {
      this.refresh();
    }
  },
  async activated() {
    let count = 0
    while(!this.showingCommunity || !this.showingCommunity.communityId) {
      await sleep(0.1);
      if (count++ > 50) {
        return;
      }
    }
    if (this.showingCommunity.communityId !== this.communityId){
      this.communityId = this.showingCommunity.communityId
      this.refresh()
    }
  },
  methods: {
    refresh() {
      this.refreshing=true
        getCommunityAnnouncement(this.getAccountInfo?.twitterId, this.showingCommunity.communityId).then(ann => {
          if (ann && ann.length >= 0) {
            this.$store.commit('community/saveAnnounces', ann);
          }
        }).catch(e => {

        }).finally(() => {

        })
        this.listFinished = false
        if (this.typeIndex == 0) {
          getCommunityTrendingPosts(this.getAccountInfo?.twitterId, this.showingCommunity.communityId).then(ps => {
            if (ps && ps.length >= 0) {
              this.$store.commit('community/saveTrendingPosts', ps)
              if (ps.length < 12) {
                this.listFinished = true
              }
            }
          }).catch(e => {
            notify({message: e, type: 'error'})
          }).finally(() => this.refreshing = false)
        }else if (this.typeIndex == 1) {
          getCommunityPromotionPosts(this.getAccountInfo?.twitterId, this.showingCommunity.communityId).then(ps => {
            if (ps && ps.length >= 0) {
              this.$store.commit('community/savePromotionPosts', ps)
              if (ps.length < 12) {
                this.listFinished = true
              }
            }
          }).catch(e => {
            notify({message: e, type: 'error'})
          }).finally(() => this.refreshing = false)
        }else if (this.typeIndex == 2){
          getCommunityNewPosts(this.getAccountInfo?.twitterId, this.showingCommunity.communityId).then(ps => {
            if (ps && ps.length >= 0) {
              this.$store.commit('community/saveNewPosts', ps)
              if (ps.length < 12) {
                this.listFinished = true
              }
            }
          }).catch(e => {
            notify({message: e, type: 'error'})
          }).finally(() => this.refreshing = false)
        }
    },
    onLoad() {
      if (this.listLoading || this.listFinished || this.refreshing) {
        return;
      }
      if (this.postsList.length === 0) {
        return;
      }
      this.listLoading = true;
      if (this.typeIndex == 0) {
          const pageSize = 12;
          const trendingPosts = this.trendingPosts ?? [];
          const pageIndex = Math.floor((trendingPosts.length - 1) / 12) + 1;
          getCommunityTrendingPosts(this.getAccountInfo?.twitterId, this.showingCommunity.communityId, pageSize, pageIndex).then(ps => {
            if (ps && ps.length > 0) {
              this.$store.commit('community/saveTrendingPosts', trendingPosts.concat(ps))
              if (ps.length < 12) {
                this.listFinished = true
              }
            }
          }).catch(e => {
            notify({message: e, type: 'error'})
          }).finally(() => this.listLoading = false)
        }else if (this.typeIndex == 1) {
          const promotionPosts = this.promotionPosts ?? [];
          let lastPostId;
          if (promotionPosts.length > 0) {
            lastPostId = promotionPosts[promotionPosts.length - 1].lastPostId;
          }
          getCommunityPromotionPosts(this.getAccountInfo?.twitterId, this.showingCommunity.communityId, lastPostId).then(ps => {
            if (ps && ps.length > 0) {
              this.$store.commit('community/savePromotionPosts', promotionPosts.concat(ps))
              if (ps.length < 12) {
                this.listFinished = true
              }
            }
          }).catch(e => {
            notify({message: e, type: 'error'})
          }).finally(() => this.listLoading = false)
        }else if (this.typeIndex == 2){
          const newPosts = this.newPosts ?? [];
          let lastPostId;
          if (newPosts.length > 0) {
            lastPostId = newPosts[newPosts.length - 1].lastPostId;
          }
          getCommunityNewPosts(this.getAccountInfo?.twitterId, this.showingCommunity.communityId, lastPostId).then(ps => {
            if (ps && ps.length > 0) {
              this.$store.commit('community/saveNewPosts', newPosts.concat(ps))
              if (ps.length < 12) {
                this.listFinished = true
              }
            }
          }).catch(e => {
            notify({message: e, type: 'error'})
          }).finally(() => this.listLoading = false)
        }
    },
    gotoDetail(post, index) {
      console.log(post)
      this.selectedPost = post
      this.selectedPostIndex = index
      this.$store.commit('postsModule/saveCurrentShowingDetail', post);
      this.$router.push('/post-detail/' + post.postId);
    },
  },
  async mounted () {

  },
}
</script>

<style scoped>

</style>
