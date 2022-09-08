<template>
  <div class="pb-4rem w-full">
    <div class="bg-blockBg md:py-1.5rem rounded-12px md:my-2rem my-1.5rem">
      <div class="px-1.5rem border-b-1px border-white/20 sm:border-b-0 py-0.8rem text-14px flex flex-wrap gap-x-1.5rem gap-y-0.8rem ">
              <span v-for="(tag, index) of subTagList" :key="index"
                    class="leading-30px whitespace-nowrap px-0.6rem rounded-full font-500 h-30px cursor-pointer"
                    :class="subActiveTagIndex===index?'bg-primaryColor':'border-1 border-white/40 text-color84'"
                    @click="changeSubIndex(index)">{{tag}}</span>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <van-list :loading="loading"
                  :finished="finished"
                  :immediate-check="false"
                  :finished-text="$t('common.noMore')"
                  :loosing-text="$t('common.pullRefresh')"
                  :loading-text="$t('common.loading')"
                  @load="onLoad">

          <div v-if="showingCurations.length===0 && !refreshing" class="py-3rem bg-blockBg rounded-12px">
            <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
          </div>
          <CurationItem v-for="curation of showingCurations" :key="curation.curationId"
             :curation="curation" class="cursor-pointer"
             @click="gotoDetail(curation)">
            <template v-if="subActiveTagIndex===1" #status>
              <div class="ml-0.5rem 2xl:text-0.75rem c-text-black">
                <!-- notTweeted: 'Not Tweeted',
                comfirmReward: 'Confirm Reward',
                partiallyConfirmed: 'Partially Confirmed',
                allConfirmed: 'All Confirmed' -->
                <button v-if="curation.createStatus===0"
                     @click="showTweetTip"
                     class="px-13px py-5px rounded-full border-1 border-color8B text-color8B">
                  {{$t('curation.notTweeted')}}
                </button>
                <button v-else-if="curation.curationStatus===0"
                        disabled
                        class="px-13px py-5px rounded-full border-1 border-white">
                  {{$t('curation.ongoing')}}
                </button>
                <button v-else-if="curation.curationStatus === 1"
                        class="px-13px py-5px rounded-full border-1 border-white"
                        @click.stop="gotoReward(curation)">
                  {{$t('curation.comfirmReward')}}
                </button>
                <button v-else-if="curation.curationStatus===2"
                        disabled
                        class="px-13px py-5px rounded-full border-1 border-white">
                  {{$t('curation.allConfirmed')}}
                </button>
              </div>
            </template>
          </CurationItem>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import CurationItem from "@/components/CurationItem";
import { getMyJoinedCurations, getMyCreatedCurations } from "@/api/api"
import { mapState, mapGetters } from 'vuex'

export default {
  name: "Curations",
  components: {CurationItem},
  data() {
    return {
      subTagList: ['Attended', 'Created'],
      subActiveTagIndex: 0,
      refreshing: true,
      loading: false,
      finished: false,
      pageSize: 10,
      list: []
    }
  },
  computed: {
    ...mapState(['joinedCurations', 'createdCurations']),
    ...mapGetters(['getAccountInfo']),
    showingCurations() {
      if(this.subActiveTagIndex === 0) {
        return this.joinedCurations ?? [];
      }else {
        return this.createdCurations ?? []
      }
    }
  },
  mounted() {
    this.onRefresh()
  },
  methods: {
    changeSubIndex(index) {
      this.finished = true;
      this.subActiveTagIndex = index
      this.onRefresh()
    },
    async onRefresh() {
      this.finished = true;
      this.refreshing = true;
      try{
        let curations;
        let m;
        const twitterId = this.getAccountInfo.twitterId;
        if (this.subActiveTagIndex === 0) {
          curations = this.joinedCurations;
          m = getMyJoinedCurations;
        }else {
          curations = this.createdCuration;
          m = getMyCreatedCurations;
        }
        const newCuration = await m(twitterId);
        if (newCuration && newCuration.length > 0) {
          curations = newCuration
        }
        if (this.subActiveTagIndex === 0) {
          this.$store.commit('saveJoinedCurations', curations)
        }else {
          this.$store.commit('saveCreatedCurations', curations)
        }
        if (curations.length < 12) {
          this.finished = true
        }else {
          this.finished = false
        }
      } catch(e) {
        console.log('Refersh my curations fail:', e);
      } finally {
        this.refreshing = false;
      }
    },
    async onLoad() {
      console.log('on load');
      this.finished = false;
      this.loading = true;
      try{
        let curations = [];
        let m;
        const twitterId = this.getAccountInfo.twitterId;
        let createdTime;
        if (this.subActiveTagIndex === 0) {
          curations = this.joinedCurations;
          m = getMyJoinedCurations;
        }else {
          curations = this.createdCuration;
          m = getMyCreatedCurations;
        }
        if (curations && curations.length > 0) {
          createdTime = curations[curations.length - 1].createdTime
        }
        const newCuration = await m(twitterId, createdTime);
        if (newCuration && newCuration.length > 0) {
          curations = curations.concat(newCuration)
        }
        if (this.subActiveTagIndex === 0) {
          this.$store.commit('saveJoinedCurations', curations)
        }else {
          this.$store.commit('saveCreatedCurations', curations)
        }
        if (!newCuration || newCuration.length < 12) {
          this.finished = true
        }else {
          this.finished = false
        }
      } catch(e) {
        console.log('Load more my curations fail:', e);
      } finally {
        this.loading = false;
      }
    },
    gotoDetail(curation) {
      this.$store.commit('curation/saveDetailCuration', curation);
      this.$router.push('/curation-detail/' + curation.curationId);
    },
    gotoReward(curation) {
      this.$store.commit('curation/saveDetailCuration', curation);
      this.$router.push('/confirm-reward')
    }
  }
}
</script>

<style scoped>

</style>
