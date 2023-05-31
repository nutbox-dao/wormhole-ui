<template>
  <div class="mt-1.8rem">
    <div class="flex justify-between items-center mb-6px">
      <div class="font-bold">{{$t('curation.tag')}}</div>
    </div>
    <div class="mb-6px text-color62 italic">
      {{ $t('curation.tagDesc') }}
    </div>
    <div class="relative border-1 bg-black/40 border-1 border-color8B/30
                          light:bg-white light:border-colorE3
                          rounded-8px min-h-44px 2xl:min-h-2rem px-15px py-12px">
      <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                            light:bg-white light:border-colorE3 hover:border-primaryColor
                            rounded-full h-30px flex items-center justify-between">
        <input class="bg-transparent h-full w-full px-15px flex-1"
               v-model="searchTagText"
               :placeholder="'# '+$t('search')"
               @input="tagInputChange"
               @keypress="onSearchTag">
        <button v-if="searchTagText.trim().length>0"
                class="bg-color8B rounded-full w-16px h-16px p-4px mr-10px"
                @click="searchTagText=''">
          <img src="~@/assets/icon-close-white.svg" alt="">
        </button>
      </div>
      <el-collapse-transition>
        <div v-show="expandTag">
          <div v-if="searchTagLoading && searchTagList.length===0 && searchTagText.trim().length>0"
               class="col-span-2 mt-12px">
            <img class="w-24px h-24px mx-auto"
                 src="~@/assets/icon-loading.svg" alt="">
          </div>
          <div class="flex flex-wrap gap-5px max-h-150px overflow-auto no-scroll-bar"
               :class="searchTagList.length>0?'mt-12px':''">
            <button v-for="tag of searchTagList" :key="tag"
                    class="h-24px text-white
                                 px-10px rounded-5px disabled:opacity-50"
                    :class="topics.indexOf(tag)>=0?'bg-color62':'bg-color8B/30 light:bg-black'"
                    @click="onSelectTag(tag)">
              #{{tag}}
            </button>
          </div>
        </div>
      </el-collapse-transition>
    </div>

  </div>

</template>

<script>
import debounce from "lodash.debounce";
import {searchTags} from "@/api/api";

export default {
  name: "SelectTags",
  props: {
    topics: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data() {
    return {
      expandTag: true,
      searchTagText: '',
      searchTagList: [],
      searchTagLoading: false
    }
  },
  methods: {
    tagInputChange: debounce(function () {
      this.onSearchTag('input')
    }, 1500),
    async onSearchTag(e) {
      if(this.searchTagText.trim().length > 0 && (e==='input' || e.keyCode === 13)) {
        this.searchTagLoading = true
        const tags = await searchTags(this.searchTagText)
        this.searchTagLoading = false
        if (tags) {
          this.searchTagList = tags
        }
      }
    },
    onSelectTag(tag) {
      this.$emit('onSelectTag', tag)
    }
  }
}
</script>

<style scoped>

</style>
