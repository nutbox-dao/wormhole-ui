<template>
  <van-pull-refresh class="min-h-40vh"
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
      <el-carousel v-if="width>640"
                   :loop="false" :autoplay="false" height="180px" indicator-position="outside">
        <el-carousel-item v-for="(post, index) of announces" :key="post.postId"
                          class="py-15px">
          <RecommendPost class="p-15px rounded-12px border-1 border-color8B/30 light:border-color7F"
                         :post="post"></RecommendPost>
        </el-carousel-item>
      </el-carousel>
      <van-swipe v-else :loop="false" :width="width*0.85" :show-indicators="false" class="px-8px">
        <van-swipe-item
            v-for="(post, index) of announces" :key="post.postId"
             class="p-7px">
          <RecommendPost class="p-15px rounded-12px border-1 border-color8B/30 light:border-color7F"
                         @click="gotoDetail(post, index)"
                         :post="post"></RecommendPost>
        </van-swipe-item>
      </van-swipe>
      <div class="w-7/10 mx-auto h-1px bg-color8B/30 light:bg-color7F my-20px sm:hidden"></div>
      <div class="px-15px">
        <div class="flex items-center justify-between">
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
                <span :class="typeIndex===index?'text-color62':''">
                  {{type}}
                </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div v-for="(post, index) of postsList" :key="post.postId"
             class="py-20px border-b-1 border-color8B/30 light:border-listBgBorder">
          <Blog :post="post"
                :showCommunity="false"
                @click="gotoDetail(post, index)"
                avatar-class="min-w-35px min-h-35px w-35px h-35px md:w-3rem md:h-3rem">
          </Blog>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
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
      refreshing: false
    }
  },
  watch: {
    typeIndex(newValue, oldValue) {
      this.refresh();
    }
  },
  methods: {
    refresh() {
        getCommunityAnnouncement(this.showingCommunity.communityId).then(ann => {
          if (ann && ann.length > 0) {
            this.$store.commit('community/saveAnnounces', ann);
          }
        }).catch(e => {

        }).finally(() => {

        })
        this.listFinished = false
        if (this.typeIndex == 0) {
          getCommunityTrendingPosts(this.showingCommunity.communityId).then(ps => {
            console.log(1 ,ps);
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
          getCommunityPromotionPosts(this.showingCommunity.communityId).then(ps => {
            console.log(2, ps);
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
          getCommunityNewPosts(this.showingCommunity.communityId).then(ps => {
            console.log(3, ps);
            if (ps && ps.length >= 0) {
              this.$store.commit('community/savePromotionPosts', ps)
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
      if (this.typeIndex == 0) {
          const pageSize = 12;
          const trendingPosts = this.trendingPosts ?? [];
          const pageIndex = parseInt((trendingPosts.length - 1) / 12);
          getCommunityTrendingPosts(this.showingCommunity.communityId, pageSize, pageIndex).then(ps => {
            console.log(1 ,ps);
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
          getCommunityPromotionPosts(this.showingCommunity.communityId, lastPostId).then(ps => {
            console.log(2, ps);
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
          getCommunityNewPosts(this.showingCommunity.communityId, lastPostId).then(ps => {
            console.log(3, ps);
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
    let count = 0
    while(!this.showingCommunity || !this.showingCommunity.communityId) {
      await sleep(0.5);
      if (count++ > 30) {
        return;
      }
    }
    this.refresh()
  },
}
</script>

<style scoped>

</style>
