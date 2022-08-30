<template>
  <div class="pb-4rem w-full">
    <div class="bg-blockBg md:py-1.5rem rounded-12px md:my-2rem my-1.5rem">
      <div class="px-1.5rem border-b-1px border-white/20 sm:border-b-0 py-0.8rem text-14px flex flex-wrap gap-x-1.5rem gap-y-0.8rem ">
              <span v-for="(tag, index) of subTagList" :key="index"
                    class="leading-30px whitespace-nowrap px-0.6rem rounded-full font-500 h-30px cursor-pointer"
                    :class="subActiveTagIndex===index?'bg-primaryColor':'border-1 border-white/40 text-color84'"
                    @click="subActiveTagIndex=index">{{tag}}</span>
      </div>
      <CurationItem v-for="i of 5" :key="i" class="cursor-pointer">
        <template v-if="subActiveTagIndex===1" #status>
          <div class="ml-0.5rem 2xl:text-0.75rem c-text-black">
            <div v-if="(i%2)===0"
                 class="px-13px py-5px rounded-full border-1 border-color8B text-color8B">
              Not tweeted
            </div>
            <button v-else
                    class="px-13px py-5px rounded-full border-1 border-white"
                    @click="$router.push('/confirm-reward')">
              Confirm Reward
            </button>
          </div>
        </template>
      </CurationItem>
    </div>
  </div>
</template>

<script>
import CurationItem from "@/components/CurationItem";
export default {
  name: "Curations",
  components: {CurationItem},
  data() {
    return {
      subTagList: ['Attended', 'Created'],
      subActiveTagIndex: 0,
    }
  }
}
</script>

<style scoped>

</style>
