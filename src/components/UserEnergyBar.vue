<template>
  <div class="">
    <el-tooltip popper-class="shadow-popper-tip" :show-after="1500" :offset="-5">
      <template #content>
        <div class="max-w-14rem text-white light:text-blueDark">
          {{$t('postView.p1')}}
        </div>
      </template>
      <div :class="progressClass" class="cursor-pointer">
        <HalfCircleProgress class="c-progress-green w-full h-full relative"
                            type="dashboard"
                            color="#68E796"
                            :stroke-width="3"
                            :width="50"
                            :percentage="isSelf?Number(rc) / MAX_RC * 100:rcValue">
          <template #label>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2
                  text-12px leading-16px font-bold text-color66">RC</div>
          </template>
        </HalfCircleProgress>
      </div>
    </el-tooltip>
    <el-tooltip popper-class="shadow-popper-tip" :show-after="1500">
      <template #content>
        <div class="max-w-14rem text-white light:text-blueDark">
          {{$t('postView.vpDes')}}
        </div>
      </template>
      <div :class="progressClass" class="cursor-pointer">
        <HalfCircleProgress class="c-progress-green w-full h-full"
                            type="dashboard"
                            color="#7700E0"
                            :stroke-width="3"
                            :width="50"
                            :percentage="isSelf?Number(vp) / MAX_VP * 100:vpValue">
          <template #label>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2
                  text-12px leading-16px font-bold text-color66">CP</div>
          </template>
        </HalfCircleProgress>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import {mapState} from "vuex";
import { MAX_VP, MAX_RC } from "@/config";
import HalfCircleProgress from "@/components/HalfCircleProgress.vue";

export default {
  name: "UserEnergyBar",
  components: {HalfCircleProgress},
  props: {
    progressClass: {
      type: String,
      default: 'w-50px max-w-50px h-50px'
    },
    isSelf: {
      type: Boolean,
      default: true
    },
    rcValue: {
      type: Number,
      default: 0
    },
    vpValue: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState([
      "rc",
      'vp'
    ]),
  },
  data() {
    return {
      MAX_VP,
      MAX_RC
    };
  },
}
</script>

<style scoped>

</style>
