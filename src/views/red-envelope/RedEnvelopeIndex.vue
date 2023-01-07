<template>
  <div>
    <div class="md:border-b-1 border-dividerColor light:border-colorF4 mb-1rem">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px flex items-center md:justify-start justify-center h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem light:text-blueDark">Spring Festival</div>
      </div>
    </div>
    <div class="container mx-auto max-w-50rem md:px-1rem px-15px">
      <div class="gradient-bg gradient-bg-color3 text-left rounded-8px py-1rem px-15px sm:px-2rem text-white">
        Blessing cards activity description. Blessing cards activity description. <br>
        Blessing cards activity description. <br>
        Blessing cards activity description. <br>
      </div>
      <div class="bg-blockBg light:bg-white light:border-1 light:border-colorF4 rounded-8px mt-1rem">
        <div class="flex gap-x-10px justify-center p-1rem border-b-1 border-color8B/30 light:border-colorF4">
          <button class="px-20px rounded-full h-30px"
                  :class="tabIndex===0?'bg-btn-gradient text-white':'border-1 border-color8B/30'"
                  @click="tabIndex=0">
            Blessing cards
          </button>
          <button class="px-20px rounded-full h-30px"
                  :class="tabIndex===1?'bg-btn-gradient text-white':'border-1 border-color8B/30'"
                  @click="tabIndex=1">
            Mystery cards
          </button>
        </div>
        <div class="mb-2rem">
          <BlessingCards/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlessingCards from "@/views/red-envelope/BlessingCards";
export default {
  name: "RedEnvelopeIndex",
  components: {BlessingCards},
  data() {
    return {
      tabIndex: 0
    }
  }
}
</script>

<style scoped>

</style>
