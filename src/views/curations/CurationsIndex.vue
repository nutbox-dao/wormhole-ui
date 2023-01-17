<template>
  <div class="h-full flex flex-col overflow-hidden relative" id="square-index" >
    <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem pt-20px">
      <div class="flex flex-wrap gap-y-10px xs:flex-row justify-between items-center">
        <div class="flex">
          <button v-for="(tag, index) of subTagList.slice(0, 5)" :key="index"
                  class="c-text-black text-16px leading-18px 2xl:text-0.8rem 2xl:leading-0.9rem whitespace-nowrap mr-50px"
                  :class="selectedTag===tag?'light:text-color18':'text-color59/50'"
                  @click="setSelectTag(tag)">{{tag}}</button>
        </div>
        <button class="c-text-black text-white light:text-blueDark" @click="showMoreTag=!showMoreTag">
         More >>>
        </button>
      </div>
      <el-collapse-transition>
        <div v-show="showMoreTag" class="mt-1rem">
          <div class="flex flex-wrap items-center gap-25px bg-blockBg light:bg-white rounded-12px shadow-sm p-1.5rem">
            <button v-for="(mTag, index) of moreTag" :key="index"
                    class="c-text-black text-16px leading-18px 2xl:text-0.8rem 2xl:leading-0.9rem
                         whitespace-nowrap"
                    :class="mTag===selectedTag?'text-white light:text-blueDark':'text-color59/50'"
                    @click="setSelectTag(mTag)">
              {{mTag}}
            </button>
            <button v-for="(cTag, cIndex) of customizeTagList" :key="cIndex"
                    class="c-text-black text-16px leading-18px 2xl:text-0.8rem 2xl:leading-0.9rem
                           flex items-center whitespace-nowrap"
                    :class="cTag===selectedTag?'text-white':'text-color59/50'"
                    @click="setSelectTag(cTag)">
              {{cTag}}
              <img class="w-14px h-14px ml-4px"
                   @click.stop="deleteCustomizeTag(cIndex)"
                   src="~@/assets/icon-delete-primary.svg" alt="">
            </button>
          </div>
        </div>
      </el-collapse-transition>
      <div v-if="customizeTag"
           class="flex items-center bg-blockBg light:bg-white rounded-12px px-1.5rem py-12px mb-10px shadow-sm mt-10px">
        <span class="mr-10px c-text-black">Selected Topic: </span>
        <button class="text-14px 2xl:text-0.8rem border-1 border-color62 rounded-4px px-12px py-4px
                       flex items-center whitespace-nowrap text-color62"
                @click="addCustomizeTag(selectedTag)">
          <span>{{selectedTag}}</span>
          <img class="w-14px h-14px ml-4px" src="~@/assets/icon-add-primary.svg" alt="">
        </button>
      </div>
      <div class="flex justify-end items-center my-10px">
        <button class="mr-10px">
          <img class="h-20px w-20px lg:w-1.4rem lg:h-1.4rem" src="~@/assets/icon-rank.png" alt="">
        </button>
        <el-select v-model="rankValue" placement="bottom-end"
                   class="w-100px bg-color8B/30 light:bg-color62/10 rounded-8px c-small-select"
                   size="small">
          <el-option
              v-for="item in rankOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="flex-1 overflow-auto" ref="curationPageRef" @scroll="pageScroll">
      <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="refreshing && (!curationsList || curationsList.length === 0)">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <van-pull-refresh v-else
                        class="min-h-full"
                        v-model="refreshing"
                        @refresh="onRefresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <van-list :loading="listLoading"
                  :finished="listFinished"
                  :immediate-check="false"
                  :loading-text="$t('common.loading')"
                  :finished-text="curationsList.length!==0?$t('common.noMore'):''"
                  @load="onLoad">
          <div class="sm:px-15px">
            <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem"
                 :class="curationsList && curationsList.length>0?'md:p-1rem':''">
              <div v-if="curationsList && curationsList.length === 0"
                   class="py-3rem bg-blockBg light:bg-white rounded-12px shadow-card">
                <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
                <div class="text-zinc-400 text-0.8rem leading-1.4rem p-3">
                  {{$t('curationsView.p2')}}
                </div>
              </div>
              <CurationItem v-for="(curation, index) of curationsList" :key="curation.curationId"
                            :curation="curation"
                            :content-type="curation.curationType === 1?'tweet':'space'"
                            @getCard="getCardVisible=true"
                            @click="gotoDetail(curation)"/>
            </div>
          </div>
        </van-list>

      </van-pull-refresh>
    </div>
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
    <!-- back top  -->
    <button v-show="scroll>100"
            @click="$refs.curationPageRef.scrollTo({top: 0, behavior: 'smooth'})"
            class="flex items-center justify-center bg-color62
                   h-44px w-44px min-w-44px 2xl:w-2.2rem 2xl:min-w-2.2rem 2xl:h-2.2rem
                   rounded-full mt-0.5rem c-text-bold fixed bottom-6rem right-1.5rem sm:right-2.5rem z-9999">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-arrow-top.svg" alt="">
    </button>
    <!-- create curation   -->
    <button
        class="flex items-center justify-center bg-color62 sm:hidden
               h-44px w-44px min-w-44px 2xl:w-2.2rem 2xl:min-w-2.2rem 2xl:h-2.2rem
               rounded-full mt-0.5rem c-text-bold absolute bottom-2rem right-1.5rem sm:right-2.5rem z-2"
        @click="createCuration">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-add-white.svg" alt="">
    </button>
  </div>
</template>

<script>
import CurationItem from "@/components/CurationItem";
import CurationsTip from "@/components/CurationsTip";
import { mapGetters, mapState } from 'vuex'
import { getCurations, getCurationsByTrend, getPopularTopics, getNewCurationsByTag, getTrendingCurationsByTag } from '@/api/api'
import { showError } from '@/utils/notify'

export default {
  name: "CurationsIndex",
  components: {CurationItem, CurationsTip},
  data() {
    return {
      listLoading: false,
      listsFinished: [],
      refreshing: false,
      subTagList: ['All'],
      subActiveTagIndex: 0,
      modalVisible: false,
      position: document.body.clientWidth < 768?'bottom':'center',
      scroll: 0,
      showMoreTag: false,
      rankOptions: [{value: 0, label: 'Trending'}, {value: 1, label: 'New'}],
      rankValue: 0,
      customizeTagList: []
    }
  },
  computed: {
    ...mapGetters('curation', ['getDraft']),
    ...mapGetters(['getAccountInfo']),
    ...mapState('curation', ['ongoingList', 'trendingList', 'closeList', 'selectedTag', 'ongoingListByTag', 'trendingListByTag']),
    curationsList() {
      if (this.selectedTag === 'All') {
        if (this.rankValue === 0) {
          return this.trendingList
        }else{
          return this.ongoingList
        }
      }else {
        if (this.rankValue === 0) {
          return this.trendingListByTag[this.selectedTag] ?? []
        }else{
          return this.ongoingListByTag[this.selectedTag] ?? []
        }
      }
    },
    moreTag() {
      return this.subTagList.slice(5)
    },
    customizeTag() {
      return this.selectedTag && this.subTagList.indexOf(this.selectedTag) <0 && this.moreTag.indexOf(this.selectedTag) < 0 && this.customizeTagList.indexOf(this.selectedTag) < 0
    },
    listFinished() {
      return this.listsFinished[this.selectedTag];
    }
  },
  watch: {
    rankValue(newValue, oldValue) {
      this.onRefresh();
    },
    selectedTag(val) {
      this.onRefresh();
    }
  },
  // activated() {
  //   if(this.scroll > 0) this.$refs.curationPageRef.scrollTo({top: this.scroll})
  // },
  methods: {
    setSelectTag(tag) {
      this.$store.commit('curation/saveSelectedTag', tag)
    },
    addCustomizeTag(tag) {
      if (this.customizeTagList.indexOf(tag) > 0) return;
      this.customizeTagList.push(tag)
      localStorage.setItem('customizeTagList', JSON.stringify(this.customizeTagList))
    },
    deleteCustomizeTag(index) {
      console.log(index)
      this.customizeTagList.splice(index, 1)
    },
    pageScroll() {
      this.scroll = this.$refs.curationPageRef.scrollTop
    },
    // changeSubIndex(index) {
    //   if(this.subActiveTagIndex===index) return
    //   this.listFinished = false
    //   this.subActiveTagIndex = index
    //   this.$store.commit('curation/saveSelectedTag', this.subTagList[index])
    //   this.onRefresh()
    // },
    async onLoad() {
      if(this.refreshing || this.listLoading) return
      try{
        let curations;
        let cursor;
        const sel = this.subActiveTagIndex
        const tag = this.selectedTag;
        if (this.subActiveTagIndex === 0) {
          curations = this.trendingList
          cursor = curations[curations.length - 1].score
        }else if(this.subActiveTagIndex === 1) {
          curations = this.ongoingList
          cursor = curations[curations.length - 1].createdTime
        }else if(this.subActiveTagIndex === 2) {
          curations = this.trendingList
          cursor = curations[curations.length - 1].score
        }
        if (!curations || curations.length === 0) {
          this.listsFinished[tag] = true
          return;
        }

        let moreCurations = [];


        let mutationStr = ''
        if (sel === 0) {
          mutationStr = 'saveTrendingList'
          moreCurations = await getCurationsByTrend(0, cursor, this.getAccountInfo?.twitterId)
        }else if(sel === 1) {
          mutationStr = 'saveOngoingList'
          moreCurations = await getCurations(0, cursor, this.getAccountInfo?.twitterId)
        }else if(sel === 2) {
          mutationStr = 'saveTrendingList'
          moreCurations = await getCurationsByTrend(0, cursor, this.getAccountInfo?.twitterId)
        }
        if (moreCurations.length < 12) {
          this.listsFinished[tag] = true
        }else {
          this.listsFinished[tag] = false
        }
        curations = curations.concat(moreCurations);
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
        let tag = this.selectedTag;
        let curations = []
        let mutationStr = ''
        if (tag === 'All') {
          if (this.rankValue === 0) {
            curations = await getCurationsByTrend(0, null, this.getAccountInfo?.twitterId)
            mutationStr = 'saveTrendingList'
          }else{
            curations = await getCurations(0, null, this.getAccountInfo?.twitterId)
            mutationStr = 'saveOngoingList'
          }
          this.$store.commit('curation/'+mutationStr, curations ?? [])
        }else {
          console.log(66, tag, this.rankValue);
          if (this.rankValue === 0) {
            curations = await getTrendingCurationsByTag(this.getAccountInfo?.twitterId, 0, null, tag);
            this.trendingListByTag[tag] = curations;
            this.$store.commit('curation/saveTrendingListByTag', this.trendingListByTag);
          }else {
            curations = await getNewCurationsByTag(this.getAccountInfo?.twitterId, 0, null, tag);
            this.ongoingListByTag[tag] = curations;
            this.$store.commit('curation/saveOngoingListByTag', this.ongoingListByTag);
          }
        }
        if (!curations || curations.length < 12) {
          this.listsFinished[tag] = true
        }else {
          this.listsFinished[tag] = false
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
    },
    createCuration() {
      if (this.getAccountInfo?.twitterId) {
        this.$router.push('/create-curation')
      }else {
        this.$store.commit('saveShowLogin', true)
      }
    }
  },
  mounted () {
    console.log('mounted')
    this.customizeTagList = localStorage.getItem('customizeTagList')?
        JSON.parse(localStorage.getItem('customizeTagList')):[]
    getPopularTopics().then(topics => {
      this.subTagList = ['All'].concat(topics.map(t => t.topic))
      console.log(53, topics);
    })
    getNewCurationsByTag(this.getAccountInfo.twitterId, 0, null, 'web3').then(res => {
      console.log(66, res);
    })
    this.onRefresh();
  },
  activated() {
    this.onRefresh()
  }
}
</script>

<style scoped>

</style>
