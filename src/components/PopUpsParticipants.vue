<template>
  <div class="h-full overflow-hidden relative pt-1rem max-h-80vh min-h-60vh">
    <div class="c-text-black text-20px 2xl:text-1rem leading-30px 2xl:leading-1.5rem pb-1rem text-center">
      {{$t('curation.participants')}}
    </div>
    <button class="absolute right-20px top-18px"
            @click="$emit('close')">
      <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
    </button>
    <div class="absolute w-full h-full overflow-hidden pb-2rem">
      <van-pull-refresh v-model="refreshing"
                        class="h-full overflow-auto"
                        @refresh="onRefresh"
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
          <div class="flex-1 overflow-auto pt-3rem" v-if="list.length>0">
            <div class="flex justify-between items-center py-1rem px-1.5rem text-left border-b-1 border-color8B/30"
                 v-for="record of (list ?? [])" :key="record.id">
              <div class="flex items-center">
                <img class="w-40px min-w-40px h-40px 2xl:w-2rem 2xl:min-w-2rem 2xl:h-2rem
                        rounded-full border-1 gradient-border "
                     :src="record.profileImg" alt="" @error="replaceEmptyImg">
                <div class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px">
                  <div>{{record.twitterUsername}} </div>
                  <div class="text-color8B">{{parseTimestamp(record.createAt)}}</div>
                </div>
              </div>
              <div class="flex items-center">
                <ChainTokenIconVue height="20px" width="20px"
                                   :token="{symbol: record?.tokenSymbol, address: record?.token}"
                                   :chainName="''">
                  <template #amount>
                <span class="px-8px h-17px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold">
                  {{ formatAmount(record.amount / (10 ** record.decimals)) }} {{ record.tokenSymbol }}
                </span>
                  </template>
                </ChainTokenIconVue>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { parseTimestamp, formatAmount } from "@/utils/helper";
import ChainTokenIconVue from "@/components/ChainTokenIcon";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {getCurationRecord} from "@/api/api";

export default {
  name: "PopUpsParticipants",
  components: {ChainTokenIconVue},
  props: {
    records: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      list: []
    }
  },
  mounted() {
    this.list = this.records
    this.onLoad()
  },
  methods: {
    parseTimestamp,
    formatAmount,
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    onRefresh() {
      this.finished = false
      this.onLoad()
    },
    onLoad() {
      if(this.loading || this.finished) return
      this.refreshing = false
      this.loading = true
    }
  }
}
</script>

<style scoped>

</style>
