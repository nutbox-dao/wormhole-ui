<template>
  <div class="h-full overflow-auto" id="square-index">
    <van-list :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              :loading-text="$t('common.loading')"
              :finished-text="curationsList.length!==0?$t('common.noMore'):''"
              @load="onLoad">
      <!-- <div class="px-1rem pt-25px sm:px-0 container mx-auto max-w-53rem md:max-w-48rem">
        <div class="flex sm:items-center sm:justify-between">
          <div class="w-min relative ">
            <div class="w-full h-7px gradient-line absolute bottom-3px rounded-full"></div>
            <span class="text-2rem leading-2.5rem md:text-2.4rem md:leading-3rem c-text-black relative whitespace-nowrap light:text-black">{{$t('square')}}</span>
          </div>
          <button v-if="getAccountInfo && getAccountInfo.isRegistry === 1" class="flex items-center justify-center gradient-btn gradient-btn-shadow h-2.7rem px-1rem rounded-full c-text-black text-1.2rem
                    absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
                  @click="createCurations">
            {{$t('curationsView.createBtn')}}
          </button>
          <button v-else class="flex items-center justify-center gradient-btn gradient-btn-shadow h-2.7rem px-1rem rounded-full c-text-black text-1.2rem
                    absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
                  @click="$router.push('/signup')">
            {{$t('common.active')}}
          </button>
        </div>
        <div class="text-color8B light:text-color7D mt-10px text-left leading-20px">{{$t('curationsView.p1')}}</div>
      </div> -->
      <div class="sm:mt-1rem sm:px-1rem">
        <div class="container mx-auto max-w-53rem md:max-w-48rem sm:bg-blockBg light:sm:bg-white rounded-12px"
             :class="curationsList && curationsList.length>0?'md:p-1rem':''">
          <div class="px-1.5rem border-b-1px border-white/20 sm:border-b-0 py-0.8rem text-14px flex flex-wrap gap-x-1.5rem gap-y-0.8rem ">
              <span v-for="(tag, index) of subTagList" :key="index"
                    v-show="index!==1"
                    class="leading-30px whitespace-nowrap px-0.6rem rounded-full font-500 h-30px cursor-pointer"
                    :class="subActiveTagIndex===index?'gradient-bg text-white':'border-1 border-white/40 light:border-colorE3 text-color84 light:text-color7D light:bg-colorF2'"
                    @click="changeSubIndex(index)">{{tag}}</span>
          </div>
          <div class="c-text-black text-1.8rem mb-3rem min-h-1rem" v-if="refreshing && (!curationsList || curationsList.length === 0)">
            <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
          </div>
          <div v-else-if="curationsList && curationsList.length === 0" class="py-3rem bg-blockBg light:bg-white rounded-12px">
            <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
            <div class="text-zinc-400 text-0.8rem leading-1.4rem p-3">
              {{$t('curationsView.p2')}}
            </div>
          </div>
          <van-pull-refresh v-else
                            v-model="refreshing"
                            @refresh="onRefresh"
                            :loading-text="$t('common.loading')"
                            :pulling-text="$t('common.pullRefresh')"
                            :loosing-text="$t('common.loosingRefresh')">
            <CurationItem v-for="(curation, index) of curationsList" :key="curation.curationId"
                          class="cursor-pointer"
                          :curation="curation"
                          :content-type="curation.curationType === 1?'tweet':'space'"
                          @click="gotoDetail(curation)"/>
          </van-pull-refresh>
        </div>
      </div>
    </van-list>
    <!-- <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="modalVisible"
               :position="position">
      <div class="modal-bg w-full md:max-w-560px 2xl:max-w-28rem max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem md:px-4rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">
          <CurationsTip class="py-2rem sm:py-0"
                        @confirm="onCreate"
                        @close="modalVisible=false"/>
        </div>
      </div>
    </van-popup> -->
  </div>
</template>

<script>
import CurationItem from "@/components/CurationItem";
import CurationsTip from "@/components/CurationsTip";
import { mapGetters, mapState } from 'vuex'
import { getCurations } from '@/api/api'
import { showError } from '@/utils/notify'

export default {
  name: "CurationsIndex",
  components: {CurationItem, CurationsTip},
  data() {
    return {
      listLoading: false,
      listFinished: false,
      refreshing: false,
      subTagList: ['Ongoing', 'Ended', 'Completed'],
      subActiveTagIndex: 0,
      modalVisible: false,
      position: document.body.clientWidth < 768?'bottom':'center',
    }
  },
  computed: {
    ...mapGetters('curation', ['getDraft']),
    ...mapGetters(['getAccountInfo']),
    ...mapState('curation', ['ongoingList', 'endList', 'closeList']),
    curationsList() {
      if (this.subActiveTagIndex === 0) {
        return this.ongoingList
      }else if(this.subActiveTagIndex === 1) {
        return this.endList
      }else if(this.subActiveTagIndex === 2) {
        return this.closeList
      }
    }
  },
  methods: {
    changeSubIndex(index) {
      this.listFinished = false
      this.subActiveTagIndex = index
      this.onRefresh()
    },
    async onLoad() {
      if(this.refreshing || this.listLoading) return
      try{
        let curations;
        if (this.subActiveTagIndex === 0) {
          curations = this.ongoingList
        }else if(this.subActiveTagIndex === 1) {
          curations = this.endList
        }else if(this.subActiveTagIndex === 2) {
          curations = this.closeList
        }
        if (!curations || curations.length === 0) {
          this.listFinished = true
          return;
        }
        const time = curations[curations.length - 1].createdTime
        const moreCurations = await getCurations(this.subActiveTagIndex, time, this.getAccountInfo?.twitterId)
        if (moreCurations.length < 12) {
          this.listFinished = true
        }else {
          this.listFinished = false
        }
        curations = curations.concat(moreCurations);
        let mutationStr = ''
        if (this.subActiveTagIndex === 0) {
          mutationStr = 'saveOngoingList'
        }else if(this.subActiveTagIndex === 1) {
          mutationStr = 'saveEndList'
        }else if(this.subActiveTagIndex === 2) {
          mutationStr = 'saveCloseList'
        }
        this.$store.commit('curation/'+mutationStr, curations)
      } catch(e) {
        console.log('Get more curations fail:', e);
        showError(501)
      } finally {
        this.listLoading = false
      }
    },
    async onRefresh() {
      this.refreshing = true
      try{
        let curations = await getCurations(this.subActiveTagIndex, null, this.getAccountInfo?.twitterId)
        curations = curations.curations;
        console.log(64, curations);
        let mutationStr = ''
        if (this.subActiveTagIndex === 0) {
          mutationStr = 'saveOngoingList'
        }else if(this.subActiveTagIndex === 1) {
          mutationStr = 'saveEndList'
        }else if(this.subActiveTagIndex === 2) {
          mutationStr = 'saveCloseList'
        }
        this.$store.commit('curation/'+mutationStr, curations ?? [])
        if (!curations || curations.length < 12) {
          this.listFinished = true
        }else {
          this.listFinished = false
        }
      } catch(e) {
        console.log('Refresh curations fail:', e);
        showError(501)
      } finally {
        this.refreshing = false
      }
    },
    gotoDetail(curation) {
      this.$store.commit('curation/saveDetailCuration', curation);
      this.$router.push('/curation-detail/' + curation.curationId);
    }
  },
  mounted () {
    this.onRefresh();
  },
}
</script>

<style scoped>

</style>
