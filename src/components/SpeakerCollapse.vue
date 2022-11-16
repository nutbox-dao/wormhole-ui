<template>
  <el-collapse class="border-0 no-border-collapse pb-0 speaker-collapse">
    <el-collapse-item name="">
      <template #title>
        <div class="flex-1">
          <div class="text-white light:text-blueDark px-1.25rem font-bold
                              flex-1 flex justify-between items-center truncate">
            👧🏻 Speakers
          </div>
          <div class="flex flex-wrap px-1.25rem pb-1rem gap-1rem overflow-hidden header-avatar">
            <div v-for="i of list" :key="i" class="w-4rem">
              <img class="w-4rem h-4rem" src="~@/assets/icon-default-avatar.svg" alt="">
              <div class="w-4rem text-color8B mt-0.5rem leading-1rem truncate">Supermonday</div>
            </div>
          </div>
        </div>
      </template>
      <div class="text-white light:text-blueDark px-1.25rem py-0.5rem border-t-1 border-color8B/30">
        <div class="text-1.2rem c-text-black my-6px">Host</div>
        <div class="flex justify-between items-center">
          <div class="flex items-center py-5px">
            <img class="w-2.5rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
            <span>Supermonday</span>
          </div>
          <button class="border-1 border-color62 px-1rem rounded-full text-color62"
                  @click="$emit('showTip')">Tip</button>
        </div>
        <div class="text-1.2rem c-text-black my-6px">Speaker</div>
        <div class="flex justify-between items-center" v-for="i of list" :key="i">
          <div class="flex items-center py-5px">
            <img class="w-2.5rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
            <span>Supermonday</span>
          </div>
          <button class="border-1 border-color62 px-1rem rounded-full text-color62"
                  @click="$emit('showTip')">Tip</button>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: "SpeakerCollapse",
  props: {
    list: {
      type: Array,
      default: () => {
        return [1, 2, 3, 4]
      }
    }
  }
}
</script>

<style scoped>

</style>
