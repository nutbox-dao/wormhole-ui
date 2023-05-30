<template>
  <div class="h-full overflow-auto 2md:px-15px 2md:flex 2md:flex-col"
       ref="detailPageRef" @scroll="pageScroll">
    <div v-if="scroll>30 || width>640"
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center 2md:hidden
                bg-primaryBg light:bg-white border-b-1 border-headerBorder light:border-headerBorderLight">
      <button @click="$router.go(-1)" class="absolute left-15px">
        <i class="icon-back w-20px h-20px"></i>
      </button>
      <span class="text-20px c-text-black">{{showingCommunity.communityName}}</span>
    </div>
    <div v-else
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center 2md:hidden">
      <button @click="$router.go(-1)"
              class="absolute left-15px w-30px h-30px bg-colorF7 rounded-full
                     flex items-center justify-center p-5px">
        <img class="opacity-50" src="~@/assets/icon-back-light.svg" alt="">
      </button>
    </div>
    <div class="container mx-auto w-full sm:max-w-50rem">
      <div class="hidden 2md:flex h-70px items-center ">
        <button @click="$router.go(-1)"
                class="w-30px h-30px bg-white/20 rounded-full
                       flex items-center justify-center p-5px filter light:invert-30">
          <img src="~@/assets/icon-back.svg" alt="">
        </button>
      </div>
    </div>
    <div class="container mx-auto sm:max-w-50rem sm:pt-85px 2md:pt-0 pb-15px
                2md:flex-1 2md:overflow-hidden 2md:grid grid-cols-3 gap-15px">
      <div class="col-span-2 2md:h-full 2md:overflow-hidden 2md:flex-1 2md:overflow-hidden">
        <div class="sm:border-1 border-color8B/30 light:border-color7F rounded-12px
                    2md:flex 2md:flex-col max-h-full overflow-auto no-scroll-bar">
          <div class="relative bg-blockBg light:bg-white sm:rounded-t-16px
                      flex flex-col">
            <c-image :src="topic?.banner"
                     class="w-full h-160px min-h-160px max-h-160px object-cover rounded-t-16px"></c-image>
            <div class="flex justify-between items-center bg-color1A h-40px px-15px">
              <span class="c-text-black text-16px text-white">{{ topic?.title }}</span>
              <div class="flex items-center">
                <i class="w-18px h-18px btn-icon-tip"></i>
                <span class="px-8px font-700 text-12px text-color7D">
                  {{ formatAmount(topic?.totalReward / (10 ** showingCommunity.rewardTokenDecimals)) }}({{ formatPrice(topic?.totalReward / (10 ** showingCommunity.rewardTokenDecimals) * showingCommunity.rewardPrice) }})</span>
              </div>
            </div>
          </div>
          <div class="px-15px">
            <div class="flex justify-between items-center my-15px">
              <div v-if="status==='toBeStart'"
                   class="flex items-center px-8px py-4px rounded-full whitespace-nowrap
                  bg-colorF7F2 text-color62 text-12px ">
                <img class="w-14px h-14px mr-2px" src="~@/assets/icon-time-primary.svg" alt="">
                <span>{{$t('community.toBeStart')}}</span>
                <span class="w-1px h-10px bg-color62/50 mx-5px"></span>
                <van-count-down class="text-12px text-color62"
                                :time="countdown(new Date(topic.startTime).getTime()/1000)">
                  <template #default="timeData">
                    {{ timeData.days }} {{$t('common.day')}}
                    {{ timeData.hours }} {{$t('common.hour')}}
                    {{ timeData.minutes }} {{$t('common.minute')}}
                    {{ timeData.seconds }} {{$t('common.second')}}
                  </template>
                </van-count-down>
              </div>
              <div v-else-if="status==='inProgress'"
                   class="flex items-center px-8px py-4px rounded-full whitespace-nowrap
                  bg-color62 text-white text-12px ">
                🔥 {{$t('community.inProgress')}}
              </div>
              <div v-else-if="status==='ended'"
                   class="flex items-center px-8px py-4px rounded-full whitespace-nowrap
                  bg-colorF0 text-color66 text-12px">
                <img class="w-14px h-14px mr-2px" src="~@/assets/icon-delete.svg" alt="">
                <span>{{$t('community.ended')}}</span>
              </div>
              <div class="flex justify-between items-center">
                <div class="flex items-center ml-11px">
                  <div class="-ml-11px" v-for="p of topic.participant?.slice(0,3)" :key="p">
                    <img v-if="p"
                         class="w-28px min-w-28px h-28px rounded-full
                                border-2px border-color62 light:border-white bg-color8B/10"
                         :src="p" alt="">
                    <img v-else
                         class="w-28px min-w-28px h-28px rounded-full
                              border-2px border-color62 light:border-white bg-color8B/10"
                         src="~@/assets/icon-default-avatar.svg" alt="">
                  </div>
                  <span v-if="topic.membersCount>3"
                        class="h-28px flex items-center pl-4px font-bold text-12px text-color99">
                    {{ topic.membersCount - 3 }}+
                  </span>
                </div>
              </div>
            </div>
            <div class="text-14px leading-20px text-left pb-15px">
              {{ topic.description }}
            </div>
          </div>
          <div class="flex items-center justify-center gap-30px h-48px text-18px font-bold 2md:hidden
                border-b-0.5px border-color8B/30 light:border-color7F bg-primaryBg light:bg-white
                sticky top-70px 2md:top-0 z-9 shadow-tab">
            <button class="h-full px-10px"
                    :class="tabIndex===0?'active-tab text-color62':'text-color7D'"
                    @click="tabIndex=0">
              {{$t('community.post')}}
            </button>
            <button class="h-full px-10px"
                    :class="tabIndex===1?'active-tab text-color62':'text-color7D'"
                    @click="tabIndex=1">
              {{$t('community.award')}}
            </button>
          </div>
          <div class="px-15px">
            <template v-if="tabIndex===0">
              <div class="flex items-center justify-between mt-20px">
                <span class="c-text-black text-14px">Post ({{ topic.postCounts }})</span>
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
                       class="py-20px border-b-1 border-color8B/30 light:border-colorD8">
                    <Blog :post="post"
                          :showCommunity="false"
                          @click="gotoDetail(post, index)"
                          avatar-class="min-w-35px min-h-35px w-35px h-35px md:w-3rem md:h-3rem">
                    </Blog>
                  </div>
                </van-list>
              </van-pull-refresh>
            </template>
            <template v-if="tabIndex===1">
              <div class="text-left font-bold c-text-black text-14px flex justify-between items-center py-10px">
                <span>{{$t('community.member')}}</span>
                <span>{{$t('community.token')}}</span>
              </div>
              <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
                   v-if="rewardRefreshing && (!topic || !topic.participant|| topic.participant.length === 0)">
                <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
              </div>
              <div v-else-if="!rewardRefreshing && (!topic || !topic.participant|| topic.participant.length === 0)" class="py-2rem">
                <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
                <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
              </div>
              <van-pull-refresh v-else
                                class="min-h-40vh"
                                v-model="rewardRefreshing"
                                @refresh="rewardRefresh"
                                :loading-text="$t('common.loading')"
                                :pulling-text="$t('common.pullRefresh')"
                                :loosing-text="$t('common.loosingRefresh')">
                <van-list :loading="rewardListLoading"
                          :finished="rewardListFinished"
                          :immediate-check="false"
                          :loading-text="$t('common.loading')"
                          :finished-text="topic && topic.participant.length!==0?$t('common.noMore'):''"
                          @load="rewardOnLoad">
                  <div v-for="(r, index) of rewardsList" :key="index"
                       class="flex justify-between items-center py-10px gap-15px">
                    <div class="flex-1 flex items-center truncate">
                      <Avatar :profile-img="r.profileImg"
                              :name="r.name"
                              :username="r.username"
                              :steem-id="r.steemId"
                              :eth-address="r.ethAddress"
                              :reputation="r.reputation"
                              @gotoUserPage="$router.push({path : '/account-info/@' + r.username})">
                        <template #avatar-img>
                          <img class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                                border-1 border-color62 light:border-white bg-color8B/10"
                               @click.stop="$router.push({path : '/account-info/@' + r.username})"
                               :src="r.profileImg" alt="">
                        </template>
                      </Avatar>
                      <span>{{r.username}}</span>
                    </div>
                    <span>{{ formatAmount(r.amount / (10 ** showingCommunity.rewardTokenDecimals)) }}({{ formatPrice(r.amount / (10 ** showingCommunity.rewardTokenDecimals) * showingCommunity.rewardPrice) }})</span>
                  </div>
                </van-list>
              </van-pull-refresh>
            </template>
          </div>
        </div>
      </div>
      <div class="col-span-1 hidden 2md:block 2md:h-full 2md:overflow-hidden 2md:flex-1 2md:overflow-hidden">
        <div class="border-1 border-color8B/30 light:border-color7F rounded-12px p-15px
                    2md:flex 2md:flex-col max-h-full overflow-auto">
          <div class="text-left font-bold c-text-black text-16px">{{$t('community.award')}}</div>
          <div v-infinite-scroll="rewardOnLoad" class="2md:flex-1 2md:overflow-auto no-scroll-bar">
            <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
                 v-if="rewardRefreshing && rewardsList.length === 0">
              <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
            </div>
            <div v-else-if="!rewardRefreshing && rewardsList.length === 0" class="py-2rem">
              <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
              <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
            </div>
            <div v-for="(r, index) of rewardsList" :key="index"
                 class="flex justify-between items-center py-15px gap-15px">
              <div class="flex-1 flex items-center truncate">
                <Avatar :profile-img="r.profileImg"
                        :name="r.name"
                        :username="r.username"
                        :steem-id="r.steemId"
                        :eth-address="r.ethAddress"
                        :reputation="r.reputation"
                        @gotoUserPage="$router.push({path : '/account-info/@' + r.username})">
                  <template #avatar-img>
                    <img class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                                border-1 border-color62 light:border-white bg-color8B/10"
                         @click.stop="$router.push({path : '/account-info/@' + r.username})"
                         :src="r.profileImg" alt="">
                  </template>
                </Avatar>
                <span>{{r.username}}</span>
              </div>
              <span>{{ formatAmount(r.amount / (10 ** showingCommunity.rewardTokenDecimals)) }}({{ formatPrice(r.amount / (10 ** showingCommunity.rewardTokenDecimals) * showingCommunity.rewardPrice) }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
import {formatAddress, isNumeric, onCopy } from "@/utils/tool";
import { formatAmount, formatPrice } from '@/utils/helper'
import {useWindowSize} from "@vant/use";
import { mapState, mapGetters } from 'vuex'
import { getCommunityByTopicId, getCommunityActivities, getCommunityActivePosts, getCommunityActivityReward } from '@/api/api'
import { notify } from "@/utils/notify";
import Blog from "@/components/Blog";
import communityModule from '@/store/community'
import { getPriceFromOracle } from '@/utils/asset'
import { EVM_CHAINS, EVM_CHAINS_ID } from '@/config'
import Avatar from "@/components/Avatar.vue";

export default {
  name: "TopicDetail",
  components: {Blog, Avatar},
  setup() {
    const { width } = useWindowSize();
    return {
      width
    }
  },
  data() {
    return {
      TokenIcon,
      tabIndex: 0,
      postType: ['Trending', 'New'],
      typeIndex: 0,
      scroll: 0,
      communityId: '',
      topicId: '',
      topic: {},
      postsList: [],
      listLoading: false,
      listFinished: false,
      refreshing: false,
      rewardListLoading: false,
      rewardListFinished: false,
      rewardRefreshing: false,
      rewardsList: []
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'configs', 'topics']),
    ...mapGetters(['getAccountInfo']),
    status() {
      if(!this.topic.startTime) return ''
      const currentTime = new Date().getTime()
      if(new Date(this.topic.startTime).getTime() > currentTime) return 'toBeStart'
      if(currentTime > new Date(this.topic.startTime).getTime() &&
          currentTime < new Date(this.topic.endTime).getTime()) return 'inProgress'
      return 'ended'
    }
  },
  watch: {
    topic(newValue, oldValue) {
      console.log(3, newValue);
      if (newValue?.activityId) {
        this.refresh()
        this.rewardRefresh()
      }
    }
  },
  methods: {
    formatAmount,
    formatPrice,
    formatAddress,
    onCopy,
    pageScroll() {
      this.scroll = this.$refs.detailPageRef.scrollTop
    },
    countdown(time) {
      if(!time || !isNumeric(time)) return 0
      return time*1000 - new Date().getTime()
    },
    gotoDetail(post, index) {
      this.selectedPost = post
      this.selectedPostIndex = index
      this.$store.commit('postsModule/saveCurrentShowingDetail', post);
      this.$router.push('/post-detail/' + post.postId);
    },
    async getCommunityTopics() {
      if (this.topics.length > 0) {
        this.topic = this.topics.find(r => r.activityId === this.topicId)
      }else {
        getCommunityActivities(this.showingCommunity.communityId).then(res => {
          this.$store.commit('community/saveTopics', res);
          this.topic = res.find(r => r.activityId === this.topicId)
        }).catch(e => {
          console.log('error', e);
        })
      }
    },
    async refresh() {
      try{
        this.refreshing = true;
        const posts = await getCommunityActivePosts(this.getAccountInfo?.twitterId, this.topic.activityId);
        this.postsList = posts ?? [];
      } catch (e) {
        console.log(11, e);
      } finally {
        this.refreshing = false;
      }
    },
    async onLoad() {

    },
    async rewardRefresh() {
      try{
        this.rewardRefreshing = true
        const reward = await getCommunityActivityReward(this.topic.activityId);
        console.log(52, reward);
        this.rewardsList = reward ?? []
      } catch(e) {

      } finally {
        this.rewardRefreshing = false
      }
    },
    async rewardOnLoad () {

    }
  },
  mounted () {
    const topicId = this.$route.params.topicId;
    this.topicId = topicId
    if (!topicId) {
      return this.$router.go(-1);
    }
    if (!this.showingCommunity || !this.showingCommunity.communityId) {
      getCommunityByTopicId(this.getAccountInfo?.twitterId, topicId).then( async res => {
        if (res && res.communityId) {
          const price = await getPriceFromOracle(EVM_CHAINS_ID[res.chainId], [{token: res.rewardToken, decimals: res.rewardTokenDecimals}])
            res.rewardPrice = price[res.rewardToken]
            this.$store.commit('community/saveShowingCommunity', res)
            this.getCommunityTopics()
        }else {
          console.log(4, res);
        }
      }).catch(e => {
        notify({error: e, type: 'error'})
      })
    }else {
      this.getCommunityTopics()
    }


  },
}
</script>

<style scoped lang="scss">
.active-tab {
  position: relative;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    height: 3px;
    width: 22px;
    background: #7851FF;
    border-radius: 3px;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
