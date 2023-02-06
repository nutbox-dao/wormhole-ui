<template>
    <div>
      <div class="border-b-1 border-color84/30 light:border-colorF4 sticky -top-1 z-2 bg-primaryBg light:bg-white top-level">
        <div class="pt-25px sm:px-0 container mx-auto sm:max-w-600px lg:max-w-35rem
                    overflow-x-auto overflow-y-hidden no-scroll-bar">
          <div class="flex text-16px xl:text-0.9rem font-bold ">
            <button class="w-full px-2rem h-40px xl:h-2.4rem flex items-center justify-center
                           border-b-2 md:border-b-4 whitespace-nowrap"
                    :class="tabIndex===0?'text-color62 border-color62':'text-color7D border-transparent'"
                    @click="tabIndex=0">
              {{$t('guide.registrationGuide')}}
            </button>
            <button class="w-full px-2rem h-40px xl:h-2.4rem flex items-center justify-center
                           border-b-2 md:border-b-4 whitespace-nowrap"
                    :class="tabIndex===1?'text-color62 border-color62':'text-color7D border-transparent'"
                    @click="tabIndex=1">
              {{$t('guide.userGuide')}}
            </button>
            <button class="w-full px-2rem h-40px xl:h-2.4rem flex items-center justify-center
                           border-b-2 md:border-b-4 whitespace-nowrap"
                    :class="tabIndex===2?'text-color62 border-color62':'text-color7D border-transparent'"
                    @click="tabIndex=2">
              {{$t('guide.curatorialGuide')}}
            </button>
          </div>
        </div>
      </div>
      <div class="sm:pt-25px container mx-auto sm:max-w-600px lg:max-w-35rem
                   ">
        <img v-show="tabIndex===0" src="~@/assets/guide1.jpeg" alt="">
        <img v-show="tabIndex===1" src="~@/assets/guide2.jpeg" alt="">
        <img v-show="tabIndex===2" src="~@/assets/guide3.jpeg" alt="">
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: 0
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
