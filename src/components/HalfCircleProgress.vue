<template>
  <div class="el-progress el-progress--dashboard w-full h-full">
    <div class="el-progress-circle w-full h-full relative">
      <div class="absolute w-full h-full left-0 top-0">
        <span v-for="i of 7" :key="i"
              class="w-full h-2px rounded-full block
                     absolute left-0 top-1/2 transform -translate-y-1/2"
              :class="`rotate-${30*i}`">
          <span class="w-4px h-full rounded-full block ml-4px"
                :style="{background: trackColor}"></span>
        </span>
      </div>
      <svg viewBox="0 0 100 100">
        <path class="el-progress-circle__track"
              :d="trackPath"
              :stroke="trackColor"
              fill="none"
              :stroke-width="relativeStrokeWidth"
              :style="trailPathStyle"></path>
        <path class="el-progress-circle__path"
              :d="trackPath"
              :stroke="color"
              fill="none"
              :opacity="percentage?1:0"
              stroke-linecap="round"
              :stroke-width="relativeStrokeWidth"
              :style="circlePathStyle"></path>
      </svg>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full scale-80
                  text-12px leading-12px c-text-black">
        <slot name="default">
          {{percentage.toFixed(2)}}%
        </slot>
      </div>
      <slot name="label"></slot>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  strokeWidth: {type: Number, default: 5},
  type: {type: String, default: 'dashboard'},
  width: {type: Number, default: 50},
  percentage:{type: Number, default: 0},
  color: {type: String, default: '#6246EA'},
  trackColor: {type: String, default: '#1A1A1A'}
})
const relativeStrokeWidth = computed(() => (props.strokeWidth / props.width * 100).toFixed(1));
const radius = computed(() => {
  if (["circle", "dashboard"].includes(props.type)) {
    return Number.parseInt(`${50 - Number.parseFloat(relativeStrokeWidth.value) / 2}`, 10);
  }
  return 0;
});
const trackPath = computed(() => {
  const r = radius.value;
  const isDashboard = props.type === "dashboard";
  return `
          M 50 50
          m 0 ${isDashboard ? "" : "-"}${r}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? "-" : ""}${r * 2}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? "" : "-"}${r * 2}
          `;
});
const rate = ref(0.5)
const perimeter = computed(() => 2 * Math.PI * radius.value);

const strokeDashoffset = computed(() => {
  const offset = -1 * perimeter.value * (1 - rate.value) / 2;
  return `${offset}px`;
});
const trailPathStyle = computed(() => ({
  strokeDasharray: `${perimeter.value * rate.value}px, ${perimeter.value}px`,
  strokeDashoffset: strokeDashoffset.value
}));
const circlePathStyle = computed(() => ({
  strokeDasharray: `${perimeter.value * rate.value * (props.percentage / 100)}px, ${perimeter.value}px`,
  strokeDashoffset: strokeDashoffset.value,
  transition: "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease, opacity ease 0.6s"
}));
</script>

<style scoped lang="scss">
</style>
