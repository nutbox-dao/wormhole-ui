<template>
  <div class="text-14px py-20px px-15px">
    <div class="text-left font-bold c-text-black text-16px">{{$t('community.activity')}}</div>
    <div class="flex items-center gap-5px mt-8px">
      <!-- <span class="text-14px text-color8B light:text-color7D">{{$t('community.justAdmin')}}</span>
      <el-switch v-model="isAdmin" /> -->
    </div>
    <img v-if="!ops"
         class="w-5rem mx-auto py-3rem"
         src="~@/assets/profile-loading.gif" alt="" />
    <van-pull-refresh v-else
                      class="min-h-40vh"
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
             class="py-2rem font-bold c-text-black text-color8B light:text-color7D text-12px">
          {{$t('common.none')}}
        </div>
        <template v-else>
          <ActivityItem v-for="(op, i) of ops" :key="i"
                        :op="op"
                        class="mb-15px bg-blockBg light:bg-colorF7F9 p-10px rounded-12px"/>
        </template>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ActivityItem from "@/components/community/ActivityItem.vue";
import {mapState} from "vuex";
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
