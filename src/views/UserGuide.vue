<template>
    <div>
      <div class="border-b-1 border-color84/30 light:border-colorF4 sticky -top-1 z-2 bg-primaryBg light:bg-white top-level">
        <div class="pt-25px sm:px-0 container mx-auto sm:max-w-600px lg:max-w-35rem
                    overflow-x-auto overflow-y-hidden no-scroll-bar pl-40px">
          <div class="absolute left-0 bg-primaryBg light:bg-white z-2">
            <button @click="$router.go(-1)"
                    class=" h-40px w-40px flex items-center justify-center rounded-full">
              <i class="icon-back w-20px h-20px"></i>
            </button>
          </div>
          <div class="flex text-16px xl:text-0.9rem font-bold">
            <button class="w-full px-2rem h-40px xl:h-2.4rem flex items-center justify-center
                            whitespace-nowrap"
                    :class="tabIndex===0?'c-active-tab text-color62':'text-color7D'"
                    @click="tabIndex=0">
              {{$t('guide.registrationGuide')}}
            </button>
            <button class="w-full px-2rem h-40px xl:h-2.4rem flex items-center justify-center
                            whitespace-nowrap"
                    :class="tabIndex===1?'c-active-tab text-color62':'text-color7D'"
                    @click="tabIndex=1">
              {{$t('guide.attendGuide')}}
            </button>
            <button class="w-full px-2rem h-40px xl:h-2.4rem flex items-center justify-center
                            whitespace-nowrap"
                    :class="tabIndex===2?'c-active-tab text-color62':'text-color7D'"
                    @click="tabIndex=2">
              {{$t('guide.curationTweetGuide')}}
            </button>
            <button class="w-full px-2rem h-40px xl:h-2.4rem flex items-center justify-center
                            whitespace-nowrap"
                    :class="tabIndex===3?'c-active-tab text-color62':'text-color7D'"
                    @click="tabIndex=3">
              {{$t('guide.curationSpaceGuide')}}
            </button>
            <button class="w-full px-2rem h-40px xl:h-2.4rem flex items-center justify-center
                            whitespace-nowrap"
                    :class="tabIndex===4?'c-active-tab text-color62':'text-color7D'"
                    @click="tabIndex=4">
              {{$t('guide.otherGuide')}}
            </button>
          </div>
        </div>
      </div>
      <div class="sm:pt-25px container mx-auto sm:max-w-600px lg:max-w-35rem
                   ">
        <keep-alive>
          <component :is="tabContent"></component>
        </keep-alive>
      </div>
    </div>
</template>

<script>
import GuideRegister from "@/views/guide/GuideRegister";
import GuideAttend from "@/views/guide/GuideAttend";
import GuideCurationTweet from "@/views/guide/GuideCurationTweet";
import GuideCurationSpace from "@/views/guide/GuideCurationSpace";
import GuideOther from "@/views/guide/GuideOther";
import {markRaw} from "vue";
export default {
  components: {GuideRegister, GuideAttend, GuideCurationTweet, GuideCurationSpace, GuideOther},
  data() {
    return {
      tabIndex: 0,
      tabContent: markRaw(GuideRegister)
    }
  },
  watch: {
    tabIndex(val){
      if(val===0) this.tabContent = markRaw(GuideRegister)
      if(val===1) this.tabContent = markRaw(GuideAttend)
      if(val===2) this.tabContent = markRaw(GuideCurationTweet)
      if(val===3) this.tabContent = markRaw(GuideCurationSpace)
      if(val===4) this.tabContent = markRaw(GuideOther)
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
