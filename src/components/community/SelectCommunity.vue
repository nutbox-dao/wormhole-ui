<template>
  <div class="mt-1.8rem">
    <div class="flex justify-between items-center mb-6px">
      <div class="font-bold">{{$t('community.community')}}</div>
      ({{ $t('curation.required') }})
    </div>
    <div class="relative border-1 bg-black/40 border-1 border-color8B/30
                      light:bg-white light:border-colorE3
                      rounded-8px min-h-44px 2xl:min-h-2rem px-15px py-12px">
      <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                            light:bg-white light:border-colorE3 hover:border-primaryColor
                            rounded-full h-30px flex items-center justify-between">
        <input class="bg-transparent h-full w-full px-15px flex-1"
               v-model="searchCommunityText"
               :placeholder="'# '+$t('search')"
               @input="communityInputChange"
               @keypress="onSearchCommunity">
        <button v-if="searchCommunityText.trim().length>0"
                class="bg-color8B rounded-full w-16px h-16px p-4px mr-10px"
                @click="searchCommunityText=''">
          <img src="~@/assets/icon-close-white.svg" alt="">
        </button>
      </div>
      <el-collapse-transition>
        <div>
          <div class="grid grid-cols-2 gap-x-10px
                            max-h-150px overflow-auto no-scroll-bar">
            <div v-if="searchCommunityLoading && searchCommunityList.length===0 && searchCommunityText.trim().length>0"
                 class="col-span-2 mt-12px">
              <img class="w-24px h-24px mx-auto"
                   src="~@/assets/icon-loading.svg" alt="">
            </div>
            <div v-for="(item,index) of searchCommunityList.slice(0, 4)"
                 :key="item.communityId"
                 class="col-span-1 flex items-center bg-blockBg light:bg-colorF7F2
                        rounded-8px h-40px px-15px border-2px mt-10px cursor-pointer"
                 :class="item.communityId===selectedCommunityId?'border-color62':'border-transparent'"
                 @click="selectCommunity(item)">
              <img class="w-24px h-24px rounded-full mr-10px"
                   :src="item.icon" alt=""
                   @error="replaceEmptyImg">
              <div class="truncate text-12px">
                <div class="font-bold mb-4px">{{item.communityName}}</div>
                <div>#{{ item.displayTag }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {mapState} from "vuex";

export default {
  name: "SelectCommunity",
  props: {
    communityId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      expandCommunity: true,
      searchCommunityText: '',
      searchCommunityLoading: false,
      selectedCommunityId: ''
    }
  },
  computed: {
    ...mapState('community', ['communities']),
    searchCommunityList() {
      if (!this.communities || this.communities.length === 0) return []
      if (this.searchCommunityText && this.searchCommunityText.length > 0) {
        return this.communities.filter(com => com.communityName.toLowerCase().indexOf(this.searchCommunityText.toLowerCase()) !== -1 || com.displayTag.toLowerCase().indexOf(this.searchCommunityText.toLowerCase()) !== -1)
      }else {
        return this.communities
      }
    },
  },
  watch: {
    communityId(newValue, oldValue) {
      this.selectedCommunityId = newValue
    }
  },
  methods: {
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    communityInputChange: debounce(function () {
      this.onSearchCommunity('input')
    }, 1500),
    async onSearchCommunity(e) {
      // this.$emit('setCommunityId', '')
      // this.$emit('setTag', '')
      // if(this.searchCommunityText.trim().length > 0 && (e==='input' || e.keyCode === 13)) {
      //   this.form.communityId=''
      //   this.searchCommunityLoading = true
      //   const communities = await searchCommunityByName(this.searchCommunityText)
      //   this.searchCommunityLoading = false
      //   if (communities) {
      //     this.searchCommunityList = communities
      //   }
      // }
    },
    selectCommunity(item) {
      this.$emit('setCommunityId', item.communityId)
      this.$emit('setTag', item.displayTag)
      // this.searchCommunityText=item.displayTag
      this.selectedCommunityId = item.communityId
    }
  },
  mounted () {
    this.selectedCommunityId = this.communityId;
  },
}
</script>

<style scoped>

</style>
