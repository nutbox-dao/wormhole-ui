<template>
  <div class="text-14px xl:text-0.8rem sm:p-1rem">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                      class="h-full"
                      :loading-text="$t('common.loading')"
                      :pulling-text="$t('common.pullRefresh')"
                      :loosing-text="$t('common.loosingRefresh')">
      <van-list :loading="loading"
                :finished="finished"
                :immediate-check="false"
                :finished-text="showingCurations.length>0?$t('common.noMore'):''"
                :loosing-text="$t('common.pullRefresh')"
                :loading-text="$t('common.loading')"
                @load="onLoad">
        <div class="c-text-black text-1.8rem py-2rem"
             v-if="refreshing && (!showingCurations || showingCurations.length === 0)">
          <img class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
        </div>
        <div v-if="showingCurations.length===0 && !refreshing" class="py-2rem">
          <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
        </div>
        <div v-for="curation of showingCurations" :key="curation.curationId"
             class="">
          <CurationItem class="border-b-0.5px border-white/20 light:border-black/16 md:border-listBgBorder
                               py-20px px-15px sm:px-0"
                        :curation="curation"
                        @click="gotoDetail(curation)">
          </CurationItem>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import CurationItem from "@/components/CurationItem";
import { getUserCreatedCurations } from "@/api/api"
import TweetAndStartCuration from "@/components/TweetAndStartCuration";
import { sleep, sortCurations } from '@/utils/helper'

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
      curations: [],
      detailCuration: null,
      filterKey: 'latest'
    }
  },
  computed: {
    showingCurations() {
      return this.curations
    }
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
          this.curations = newCuration
        }
        if (!this.curations || this.curations.length < 12) {
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
        let endtime;
        if (this.curations && this.curations.length > 0) {
          endtime = this.curations[this.curations.length - 1].createdTime
        }
        const newCuration = await getUserCreatedCurations(twitterId, endtime);
        if (newCuration && newCuration.length > 0) {
          this.curations = this.curations.concat(newCuration)
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
      this.$router.push('/post-detail/' + curation.postId);
    },
  }
}
</script>

<style scoped lang="scss">
.c-curation-item:first-child {
  border: none;
}
</style>
