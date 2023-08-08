<template>
  <van-count-down :time="countdown">
    <template #default="timeData">
      <span v-if="timeData.days>0">
        {{ timeData.days }} <span class="">{{$t('common.day')}}</span>
        {{ timeData.hours }} <span class="">{{$t('common.hour')}}</span>
      </span>
      <span v-else-if="timeData.hours>0">
        {{ timeData.hours }} <span class="">{{$t('common.hour')}}</span>
        {{ timeData.minutes }} <span class="">{{$t('common.minute')}}</span>
      </span>
      <span v-else>
        {{ timeData.minutes }} <span class="">{{$t('common.minute')}}</span>
        {{ timeData.seconds }} <span class="">{{$t('common.second')}}</span>
      </span>
    </template>
  </van-count-down>
</template>

<script>
import {isNumeric} from "@/utils/tool";

export default {
  name: "Countdown",
  props: {
    time: {
      type: Number,
      default: 0
    }
  },
  computed: {
    countdown() {
      if(!this.time || !isNumeric(this.time)) return 0
      return this.time - new Date().getTime()
    }
  }
}
</script>

<style scoped>

</style>
