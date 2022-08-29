<template>
  <div class="flex justify-between">
    <div class="flex items-center" :class="step<totalStep?'flex-1':''"
         v-for="step in totalStep" :key="step">
      <div class="flex items-center rounded-full border-1 h-30px"
           :class="step===currentStep?'border-white text-white':'border-color8B/30 text-color8B/30'">
        <span class="ml-1.5px h-25px w-25px rounded-full text-blockBg flex justify-center items-center font-600 text-16px text-leading20px"
              :class="step===currentStep?'bg-white':'bg-color8B/30'">{{step}}</span>
        <span class="ml-0.5rem mr-1rem text-12px font-600">{{stepLabel[step-1]}}</span>
      </div>
      <div v-if="step < totalStep" class="flex-1 h-1px bg-color84/30 mx-1.5rem"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Steps",
  props: {
    totalStep: {
      type: Number,
      default: 2
    },
    currentStep: Number,
    stepLabel: {
      type: Array,
      default: () => {
        return ['Set Up', 'Reward']
      }
    }
  }
}
</script>
