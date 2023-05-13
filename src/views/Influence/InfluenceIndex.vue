<template>
  <div class="h-full flex flex-col overflow-hidden relative">
    <div class="flex-1 overflow-auto">
      <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="refreshing && (!influenceList || influenceList.length === 0)">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <van-pull-refresh v-else
                        class="min-h-full"
                        v-model="refreshing"
                        @refresh="onRefresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <div class="h-full overflow-auto">
          <van-list :loading="listLoading"
                    :finished="listFinished"
                    :immediate-check="false"
                    :loading-text="$t('common.loading')"
                    :finished-text="influenceList.length!==0?$t('common.noMore'):''"
                    @load="onLoad">
            <div class="sm:px-15px">
              <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem py-15px">
                <div v-if="influenceList && influenceList.length === 0"
                     class="py-3rem bg-blockBg light:bg-white rounded-12px shadow-card">
                  <div class="c-text-black text-zinc-700 text-2rem mt-1rem mb-2rem">{{$t('common.none')}}</div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-15px">
                  <div v-for="i of 5" :key="i">
                    <InfluenceCardItem></InfluenceCardItem>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import InfluenceCardItem from "@/components/influence/InfluenceCardItem";
export default {
  name: "InfluenceIndex",
  components: {InfluenceCardItem},
  data() {
    return {
      refreshing: false,
      listLoading: false,
      listFinished: false,
      influenceList: [1]
    }
  },
  methods: {
    onRefresh() {

    },
    onLoad() {

    }
  }
}
</script>

<style scoped>

</style>
