<template>
  <div class="pb-4rem w-full">
    <div class="bg-blockBg light:bg-white md:py-1.5rem rounded-12px sm:my-2rem">
      <div v-if="accountInfo && accountInfo.isRegistry === 1"
           class="px-1.5rem border-b-1px border-white/20 sm:border-b-0 py-0.8rem text-14px flex">
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <van-list class="px-1.5rem"
                  :loading="loading"
                  :finished="finished"
                  :immediate-check="false"
                  :finished-text="showingCurations.length>0?$t('common.noMore'):''"
                  :loosing-text="$t('common.pullRefresh')"
                  :loading-text="$t('common.loading')"
                  @load="onLoad">

          <div v-if="showingCurations.length===0 && !refreshing"
               class="py-3rem bg-blockBg light:bg-white rounded-12px">
            <div class="c-text-black text-color7D text-2rem mb-2rem">{{$t('common.none')}}</div>
          </div>
          <CurationItem v-for="curation of showingCurations"
                        :key="curation.curationId"
                        :curation="curation" class="cursor-pointer"
                        :show-btn-group="false"
                        @click="gotoDetail(curation)">
          </CurationItem>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import CurationItem from "@/components/CurationItem";
import { getUserCreatedCurations } from "@/api/api"
import TweetAndStartCuration from "@/components/TweetAndStartCuration";
import { sleep } from '@/utils/helper'

export default {
  name: "UseerCurations",
  components: {CurationItem, TweetAndStartCuration},
  props: {
    accountInfo: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      subActiveTagIndex: 0,
      refreshing: true,
      loading: false,
      finished: false,
      pageSize: 10,
      list: [],
      position: document.body.clientWidth < 768?'bottom':'center',
      showingCurations: [],
      detailCuration: null,
      filterKey: 'latest'
    }
  },
  computed: {
  },
  async mounted() {
    let count = 0
    while(count < 100) {
      if (this.accountInfo?.twitterId) {
        break
      }else {
        await sleep(0.5);
        count++;
      }
    }
    this.onRefresh()
  },
  methods: {
    async onRefresh() {
      if (!this.accountInfo) return;
      this.finished = true;
      this.refreshing = true;
      try{
        const twitterId = this.accountInfo.twitterId;
        const newCuration = await getUserCreatedCurations(twitterId);
        if (newCuration && newCuration.length > 0) {
          this.showingCurations = newCuration
        }
        if (!this.showingCurations || this.showingCurations.length < 12) {
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
      if (!this.accountInfo) return;
      this.finished = false;
      this.loading = true;
      try{
        let curations = [];
        let m;
        const twitterId = this.accountInfo?.twitterId;
        let createdTime;
        if (curations && curations.length > 0) {
          createdTime = this.showingCurations[this.showingCurations.length - 1].createdTime
        }
        const newCuration = await getUserCreatedCurations(twitterId, createdTime);
        if (newCuration && newCuration.length > 0) {
          this.showingCurations = this.showingCurations.concat(newCuration)
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
  }
}
</script>

<style scoped>

</style>
