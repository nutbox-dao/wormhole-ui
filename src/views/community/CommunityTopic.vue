<template>
  <div class="py-10px">
    <div class="w-full" ref="wRef"></div>
    <div class="">
      <div class="px-15px flex justify-between items-center mt-5px">
        <span class="text-16px leading-25px font-bold">Twitter Space</span>
      </div>
      <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="refreshing && (!spaces || spaces.length === 0)">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <div v-else-if="!refreshing && (!spaces || spaces.length === 0)" class="py-2rem">
        <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
        <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
      </div>
      <template v-else>
        <van-swipe :loop="false"
                   :autoplay="0"
                   :width="width<640?width*0.85:($refs.wRef?$refs.wRef.clientWidth:'')"
                   :initial-swipe="activeSpaceIndex"
                   :show-indicators="false">
          <van-swipe-item v-for="(space, i) of spaces" :key="i"
                          class="swipe-item pl-15px">
            <Space :show-avatar="false" :space="space" @click="gotoDetail(space)">
              <template #bottom-btn-bar><div></div></template>
            </Space>
          </van-swipe-item>
        </van-swipe>
        <div class="hidden sm:flex justify-center items-center mt-10px">
          <button class="w-30px h-30px bg-color62/20 rounded-full flex justify-center items-center
                        disabled:opacity-30"
                  :disabled="activeSpaceIndex===0"
                  @click="activeSpaceIndex-=1">
            <img class="w-12px h-12px transform rotate-90" src="~@/assets/icon-arrow-primary.svg" alt="">
          </button>
          <div class="flex items-center gap-5px mx-20px">
                  <span v-for="i of spaces.length" :key="i"
                        class="w-4px h-4px min-w-4px min-h-4px rounded-full bg-color62 block"
                        :class="activeSpaceIndex+1===i?'':'opacity-10'"></span>
          </div>
          <button class="w-30px h-30px bg-color62/20 rounded-full flex justify-center items-center
                        disabled:opacity-30"
                  :disabled="activeSpaceIndex===spaces.length-1"
                  @click="activeSpaceIndex+=1">
            <img class="w-12px h-12px transform -rotate-90" src="~@/assets/icon-arrow-primary.svg" alt="">
          </button>
        </div>
      </template>
    </div>
    <div class="mb-4px flex justify-between items-center mt-20px px-15px">
      <span class="text-16px leading-25px font-bold">{{$t('community.topic')}}</span>
      <el-dropdown>
        <button class="text-14px text-color62 flex items-center">
          <span class="font-bold">{{$t('community.'+topicType[typeIndex])}}</span>
          <img class="w-12px ml-4px" src="~@/assets/icon-arrow-primary.svg" alt="">
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(type, index) of topicType" :key="type"
                              @click="typeChange(index)">
                <span :class="typeIndex===index?'text-color62':''">
                  {{$t('community.'+type)}}
                </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="refreshing && (!topics || topics.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!refreshing && (!topics || topics.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <van-pull-refresh v-else
                      class="min-h-40vh"
                      v-model="refreshing"
                      @refresh="refresh"
                      :infinite-scroll-immediate="false"
                      :loading-text="$t('common.loading')"
                      :pulling-text="$t('common.pullRefresh')"
                      :loosing-text="$t('common.loosingRefresh')">
      <van-list :loading="listLoading"
                :finished="listFinished"
                :immediate-check="false"
                :loading-text="$t('common.loading')"
                :finished-text="topics.length!==0?$t('common.noMore'):''"
                @load="onLoad">
        <div class="px-15px">
          <div v-for="topic of topics" :key="topic.activityId" class="mb-15px">
            <TopicItem :topic="topic"></TopicItem>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Space from "@/components/Space";
import TopicItem from "@/components/community/TopicItem";
import { getCommunitySpaces, getCommunityActivities } from '@/api/api'
import { mapState, mapGetters } from "vuex";
import {useWindowSize} from "@vant/use";
import {sleep} from "@/utils/helper";
export default {
  name: "CommunityPost",
  components: {TopicItem},
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  data() {
    return {
      topicType: ['inProgress', 'ended', 'pending'],
      activeSpaceIndex: 0,
      typeIndex: 0,
      listLoading: false,
      listFinished: false,
      refreshing: false,
      communityId: ''
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'topics', 'spaces']),
    ...mapGetters(['getAccountInfo'])
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
    async refresh() {
      try{
        if (this.refreshing || this.listLoading) {
          return;
        }
        this.refreshing = true;
        const [topics, spaces] = await Promise.all([getCommunityActivities(this.communityId), getCommunitySpaces(this.getAccountInfo?.twitterId, this.communityId)]);
        this.$store.commit('community/saveTopics', topics);
        this.$store.commit('community/saveSpaces', spaces)
      } catch (e) {
        console.log(66, e);
      } finally {
        this.refreshing = false;
      }
    },
    onLoad() {

    },
    gotoDetail(space) {
      this.$store.commit('postsModule/saveCurrentShowingDetail', null);
      this.$router.push('/post-detail/' + space.postId);
    },
    typeChange(index) {
      if(index===this.typeIndex) return
      this.typeIndex = index
    }
  }
}
</script>
<style scoped lang="scss">

.swipe-item {
  &:last-child {
    padding-right: 15px;
  }
}

</style>
