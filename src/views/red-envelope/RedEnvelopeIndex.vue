<template>
  <div>
    <div class="md:border-b-1 border-dividerColor light:border-colorF4 mb-1rem">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px flex items-center md:justify-start justify-center h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem light:text-blueDark">{{$t('ny.springFestival')}}</div>
      </div>
    </div>
    <div class="container mx-auto max-w-50rem md:px-1rem px-15px">
      <div class="gradient-bg gradient-bg-color3 text-left rounded-8px py-1rem px-15px sm:px-2rem text-white">
        Blessing cards activity description. Blessing cards activity description. <br>
        Blessing cards activity description. <br>
        Blessing cards activity description. <br>
      </div>
      <div class="bg-blockBg light:bg-white light:border-1 light:border-colorF4 rounded-8px mt-1rem mb-2rem">
        <div class="flex gap-x-10px justify-center p-1rem border-b-1 border-color8B/30 light:border-colorF4">
          <button class="px-20px rounded-full h-30px flex items-center justify-center"
                  :class="tabIndex===0?'bg-tag-gradient text-white':'border-1 border-color8B/30'"
                  @click="tabIndex=0">
            <img class="h-20px mr-4px" src="~@/assets/red-envelope/tab-tag.png" alt="">
            {{$t('ny.blessingCards')}}
          </button>
          <button class="px-20px rounded-full h-30px flex items-center justify-center"
                  :class="tabIndex===1?'bg-tag-gradient text-white':'border-1 border-color8B/30'"
                  @click="tabIndex=1">
            <img class="h-20px mr-4px" src="~@/assets/red-envelope/tab-tag.png" alt="">
            {{$t('ny.mysteryCards')}}
          </button>
        </div>
        <div class="">
          <BlessingCards v-show="tabIndex===0"/>
          <MysteryCards v-show="tabIndex===1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlessingCards from "@/views/red-envelope/BlessingCards";
import MysteryCards from "@/views/red-envelope/MysteryCards";
export default {
  name: "RedEnvelopeIndex",
  components: {BlessingCards, MysteryCards},
  data() {
    return {
      tabIndex: 1
    }
  }
}
</script>

<style scoped>

</style>
