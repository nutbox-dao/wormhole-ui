<template>
  <div class="text-14px py-20px px-15px 2md:flex 2md:flex-col">
    <div>
      <div class="text-left font-bold c-text-black text-16px">{{$t('community.activity')}}</div>
      <div class="flex items-center gap-5px mt-8px">
<!--        <span class="text-14px text-color8B light:text-color7D">{{$t('community.justAdmin')}}</span>-->
<!--        <el-switch v-model="isAdmin" />-->
      </div>
    </div>
    <img v-if="!ops"
         class="w-5rem mx-auto py-3rem"
         src="~@/assets/profile-loading.gif" alt="" />
    <div class="2md:flex-1 2md:overflow-auto no-scroll-bar">
      <van-pull-refresh class="min-h-40vh"
                        v-model="refreshing"
                        @refresh="refresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <van-list :loading="listLoading"
                  :finished="listFinished"
                  :immediate-check="false"
                  :loading-text="$t('common.loading')"
                  :finished-text="ops.length!==0?$t('common.noMore'):''"
                  @load="onLoad">
          <div v-if="ops.length === 0"
               class="py-2rem 2md:py-0 font-bold c-text-black text-color8B light:text-color7D text-12px">
            {{$t('common.none')}}
          </div>
          <template v-else>
            <ActivityItem v-for="(op, i) of ops" :key="i"
                          :op="op"
                          class="mb-15px bg-tag-gradient text-white p-15px rounded-12px"/>
          </template>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import ActivityItem from "@/components/community/ActivityItem.vue";
import {mapState} from "vuex";
import {getCommunityOps} from "@/api/api";
import {notify} from "@/utils/notify";
export default {
  name: "CommunityActivity",
  components: {ActivityItem},
  computed: {
    ...mapState('community', ['showingCommunity','ops']),
  },
  data() {
    return {
      listLoading: false,
      listFinished: false,
      refreshing: true
    }
  },
  methods: {
    onLoad() {
    },
    refresh() {

    }
  }
}
</script>

<style scoped>

</style>
