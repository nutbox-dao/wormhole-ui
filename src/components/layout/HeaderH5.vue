<template>
  <div class="py-20px border-b-0.5px border-headerBorder light:border-colorD6
              h-70px 2xl:h-88px flex items-center c-page-header">
    <div class="w-full px-15px flex justify-between items-center relative">
      <div class="h-20px overflow-hidden">
        <div class="flex items-center gap-10px">
          <el-tooltip popper-class="shadow-popper-tip" :show-after="1500">
            <template #content>
              <div class="max-w-14rem text-white light:text-blueDark">
                {{$t('postView.p1')}}
              </div>
            </template>
            <div class="w-40px max-w-40px h-40px cursor-pointer">
              <HalfCircleProgress class="c-progress-green w-full h-full relative"
                                  type="dashboard"
                                  color="#68E796"
                                  :stroke-width="3"
                                  :width="50"
                                  :percentage="Number(rc) / MAX_RC * 100">
                <template #default>RC</template>
              </HalfCircleProgress>
            </div>
          </el-tooltip>
          <el-tooltip popper-class="shadow-popper-tip" :show-after="1500">
            <template #content>
              <div class="max-w-14rem text-white light:text-blueDark">
                {{$t('postView.vpDes')}}
              </div>
            </template>
            <div class="w-40px max-w-40px h-40px cursor-pointer">
              <HalfCircleProgress class="c-progress-green w-full h-full"
                                  type="dashboard"
                                  color="#7700E0"
                                  :stroke-width="3"
                                  :width="50"
                                  :percentage="Number(vp) / MAX_VP * 100">
                <template #default>VP</template>
              </HalfCircleProgress>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div>
        <button class="relative" @click="searchModalVisible=true">
          <span class="w-24px h-24px border-2 border-colorBD rounded-full block"></span>
          <span class="w-2px h-6px rounded-full bg-colorBD absolute bottom-0 right-0 transform -rotate-40"></span>
        </button>
        <router-link to="/info" class="ml-10px">
          <button>
            <img class="w-26px h-26px filter light:brightness-50"
                 src="~@/assets/icon-notification.svg" alt="">
          </button>
        </router-link>
      </div>
      <img class="h-1.7rem black-filter absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
           src="~@/assets/logo.svg" alt="">
    </div>
    <el-dialog v-model="searchModalVisible"
               :append-to-body="true"
               :fullscreen="true"
               :destroy-on-close="true"
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog-fullscreen">
      <SearchView @close="searchModalVisible=false"></SearchView>
    </el-dialog>
  </div>
</template>

<script>
import SearchView from "@/views/SearchView";
import {mapState} from "vuex";
import { MAX_VP, MAX_RC } from "@/config";
import HalfCircleProgress from "@/components/HalfCircleProgress.vue";

export default {
  name: "Header",
  components: {SearchView, HalfCircleProgress},
  computed: {
    ...mapState([
      "rc",
      'vp'
    ]),
  },
  data() {
    return {
      searchModalVisible: false,
      MAX_RC,
      MAX_VP
    }
  }
}
</script>

<style scoped>

</style>
