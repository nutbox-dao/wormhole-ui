<template>
  <div class="h-full overflow-hidden flex flex-col">
    <div class="md:border-b-1 border-dividerColor h-4rem">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px
                  flex items-center md:justify-start justify-center h-full">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem">
          {{$t('curation.submissions')}}
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-auto py-1rem">
      <div class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg rounded-20px mb-2rem py-2rem">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                          loading-text="Loading"
                          pulling-text="Pull to refresh data"
                          loosing-text="Release to refresh">
          <van-list :loading="loading"
                    :finished="finished"
                    :immediate-check="false"
                    :loosing-text="$t('common.pullRefresh')"
                    :loading-text="$t('common.loading')"
                    :finished-text="$t('common.noMore')"
                    @load="onLoad">
            <div class="flex justify-between items-center py-1rem px-1.5rem text-left border-b-1 border-color8B/30"
                 v-for="record of (records ?? [])" :key="record.id">
              <div class="flex items-center">
                <img class="w-40px h-40px 2xl:w-2rem 2xl:h-2rem rounded-full"
                     :src="record.profileImg" alt="">
                <div class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px">
                  <div>{{record.twitterUsername}} </div>
                  <div class="text-color8B">{{parseTimestamp(record.createAt)}}</div>
                </div>
              </div>
              <div class="flex items-center">
                <span class="font-700 text-15px leading-18px 2xl:text-0.75rem 2xl:leading-1rem">{{ formatAmount(record.amount / (10 ** record.decimals)) }} {{ record.tokenSymbol }} </span>
                <img class="w-15px h-15px 2xl:w-0.75rem 2xl:h-0.75rem ml-5px"
                     src="~@/assets/icon-question-white.svg" alt="">
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <button v-if="state=='pending'" class="flex items-center justify-center gradient-btn gradient-btn-shadow
                     h-2.7rem px-1rem rounded-full c-text-black text-1.2rem
                     absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
              @click="$emit('claim')">
        {{$t('curation.comfirmReward')}}
      </button>
    </div>

    <van-popup class="c-tip-drawer 2xl:w-2/5"
               :close-on-click-overlay="false"
               v-model:show="modalVisible"
               :position="position">
      <div v-loading="connectLoading"
           class="modal-bg w-full md:max-w-560px 2xl:max-w-28rem max-h-80vh 2xl:max-h-28rem overflow-auto
                  flex flex-col rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem md:px-4rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">
          <ConfirmRewardTip class="py-2rem sm:py-0"
                            @onConnect="connectLoading=true"
                            @close="modalVisible=false"/>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ConfirmRewardTip from "@/components/ConfirmRewardTip";
import { parseTimestamp, formatAmount } from "@/utils/helper";

export default {
  name: "Submissions",
  components: {ConfirmRewardTip},
  computed: {
    ...mapState('curation', ['detailCuration', 'detailRecords'])
  },
  props: {
    records: {
      type: Array,
      default: []
    },
    state: {
      type: String,
      default: 'common'
    }
  },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      modalVisible: false,
      connectLoading: false,
      refreshing: false,
      loading: false,
      finished: false,
      list: []
    }
  },
  mounted() {
    console.log(113, this.records, this.state, this.detailCuration);
    this.onLoad()
  },
  methods: {
    parseTimestamp,
    formatAmount,
    onRefresh() {

    },
    onLoad() {
      this.loading = true
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    }
  }
}
</script>

<style scoped>

</style>
