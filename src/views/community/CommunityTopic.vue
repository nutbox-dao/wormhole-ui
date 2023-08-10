<template>
  <div class="py-10px">
    <div class="mb-10px flex justify-between items-center px-15px">
      <span class="text-16px leading-25px font-bold">Space/{{$t('community.topic')}}</span>
      <div class="flex items-center gap-8px">
        <button @click="typeIndex=0">
          <i class="w-24px h-24px block" :class="typeIndex===0?'icon-ongoing-active':'icon-ongoing'"></i>
        </button>
        <button @click="typeIndex=1">
          <i class="w-24px h-24px block" :class="typeIndex===1?'icon-ended-active':'icon-ended'"></i>
        </button>
      </div>
    </div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="refreshing && (!showingTopics || showingTopics.length === 0) && (!spaces || spaces.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!refreshing && (!showingTopics || showingTopics.length === 0) && (!spaces || spaces.length === 0)" class="py-2rem">
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
                :finished-text="showingTopics.length!==0?$t('common.noMore'):''"
                @load="onLoad">
        <div class="px-15px">
          <div v-for="topic of showingTopics" :key="topic.activityId" class="mb-15px">
            <Space v-if="topic.type === 1" class="mb-15px"
                 :show-avatar="false"
                 :space="topic"
                 @click="gotoDetail(topic)">
              <template #bottom-btn-bar><div></div></template>
            </Space>
            <TopicItem v-else :topic="topic"></TopicItem>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Space from "@/components/Space";
import TopicItem from "@/components/community/TopicItem";
import { getCommunityNotEndedSpacesAndActivities, getCommunityEndedSpacesAndActivities } from '@/api/api'
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
      topicType: ['inProgress', 'pending', 'ended'],
      typeIndex: 0,
      listLoading: false,
      listFinished: false,
      refreshing: false,
      communityId: ''
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'topics', 'pendingTopics', 'endedTopics', 'spaces']),
    ...mapGetters(['getAccountInfo']),
    showingTopics() {
      if (this.typeIndex === 0) { //not ended
          return this.topics ?? []
        }else if(this.typeIndex === 1) { // ended
          return this.endedTopics ?? []
        }
    }
  },
  watch: {
    typeIndex(newValue, oldValue) {
      if (this.showingTopics.length > 0) return;
      this.refresh()
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
    async refresh() {
      try{
        if (this.refreshing || this.listLoading) return
        this.refreshing = true;
        let state = '';
        if (this.typeIndex === 0) { // not ended
          state = 'notEnded'
        }else if(this.typeIndex === 1) { // ended
          state = 'ended'
        }
        let happenings;
        if (state === 'ended') {
          happenings = await getCommunityEndedSpacesAndActivities(this.communityId, 0)
        }else {
          happenings = await getCommunityNotEndedSpacesAndActivities(this.communityId, 0)
        }
        if(state === 'notEndec') {
          this.$store.commit('community/saveTopics', happenings);
        }else {
          this.$store.commit('community/saveEndedTopics', happenings);
        }
        if (happenings.length < 10) {
          this.finished = true;
        }
      } catch (e) {
        console.log(66, e);
      } finally {
        this.refreshing = false;
      }
    },
    async onLoad() {

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
