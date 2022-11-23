<template>
  <div class="">
    <div class="py-1rem px-1.5rem border-b-1 border-listBgBorder">
      <div class="flex items-center sm:items-start">
        <img v-if="profileImg" @click.stop="gotoUserPage()"
             class="w-2.5rem h-2.5rem 2xl:w-3.6rem 2xl:h-3.6rem 2xl:mr-1.5rem mr-0.8rem rounded-full cursor-pointer"
             @error="replaceEmptyImg"
             :src="profileImg" alt="">
        <img class="w-2.5rem h-2.5rem 2xl:w-3.6rem 2xl:h-3.6rem md:mr-1.5rem sm:mr-1.4rem mr-0.8rem rounded-full " src="@/assets/icon-default-avatar.svg" v-else alt="">
        <div class="flex-1 flex justify-between items-center">
          <div class="flex items-center">
            <div class="flex flex-col justify-between items-start cursor-pointer" @click.stop="gotoUserPage()">
              <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem">{{curation.creatorTwitterUsername}}</a>
              <span class="text-orangeColor light:text-color62 text-12px xl:text-0.75rem">{{endtime}}</span>
            </div>
            <div class="border-1 border-color7D text-color7D px-10px rounded-full ml-1rem">{{contentTag}}</div>
            <div class="border-1 border-color7D text-color7D px-10px rounded-full ml-1rem">{{contentType}}</div>
          </div>
          <div class="font-bold text-color62">
            {{curation.amount.toString() / (10 ** curation.decimals)}} {{curation.tokenSymbol}}
          </div>
        </div>
      </div>
      <div v-if="contentType==='tweet'">
        <div class="overflow-hidden relative rounded-15px my-10px sm:border-1 sm:border-listBgBorder/10"
             :class="enableFold && !isFold?'max-h-200px':''">
          <div ref="blogRef">
            <Blog :post="curation"
                  class="bg-blockBg light:bg-white rounded-15px blog-item
                     sm:bg-transparent sm:border-b-1 sm:border-listBgBorder mb-1rem md:mb-0">
              <template #bottom-btn-bar><div></div></template>
            </Blog>
          </div>
          <button v-if="enableFold"
                  @click.stop="isFold=!isFold"
                  class="absolute bg-color62/70 text-white bottom-0 left-0 w-full h-30px flex
                 items-center justify-center text-center">
            <span v-if="!isFold">view more ></span>
            <img v-else class="w-1.2rem transform rotate-180"
                 src="~@/assets/icon-arrow.svg" alt="">
          </button>
        </div>
      </div>
      <div v-if="contentType==='space'"
           class="h-15rem overflow-hidden relative py-10px">
        <Space :space="curation" class="rounded-15px h-full"/>
      </div>
      <div class="flex gap-4rem mt-15px">
        <div v-if="contentTag==='replay'" class="text-white flex items-center">
          <i class="w-18px h-18px icon-msg"></i>
        </div>
        <div v-if="contentTag==='quote'" class="text-white flex items-center">
          <i class="w-18px h-18px icon-forward"></i>
        </div>
        <div v-if="(curation.tasks & 4) === 4" class="flex items-center"
          :disabled="isLiking"
          @click="like">
          <i class="w-18px h-18px icon-like"></i>
        </div>
        <div v-if="(curation.tasks & 8) === 8" class="flex items-center"
          :disabled="isFollowing"
          @click="follow">
          <i class="w-18px h-18px icon-follow"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { parseTimestamp } from '@/utils/helper'
import { mapGetters } from "vuex";
import {formatEmojiText} from "@/utils/tool";
import Blog from "@/components/Blog";
import Space from "@/components/Space";
import {testData} from "@/views/square/test-data";

export default {
  name: "CurationItem",
  components: {Blog, Space},
  props: {
    curation: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      testData,
      enableFold: true,
      isFold: false,
      isLiking: false,
      isFollowing: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    profileImg() {
      return this.curation.creatorProfileImg
    },
    contentType() {
      return this.curation.curationType === 1 ? 'tweet' : 'space'
    },
    contentTag() {
      return (this.curation.tasks & 1 === 1) ? 'quote' : 'replay'
    },  
    endtime() {
      if (this.curation.curationStatus === 0){
        return parseTimestamp(this.curation.endtime * 1000)
      }else if(this.curation.curationStatus === 1) {
        return this.$t('curation.end')
      }else {
        return ''
        return this.$t('curation.complete')
      }
    },
    title() {
      const t = this.curation.content.split('\n')[0]
      if (t.length > 30) {
        return t.slice(0, 30)
      }else {
        return t
      }
    },
    content() {
      return this.curation.content
    }
  },
  methods: {
    formatEmojiText,
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    gotoUserPage() {
      if (!this.curation || this.curation.twitterUsername !== this.getAccountInfo.twitterUsername){
        this.$router.push({path : '/account-info/@' + this.curation.twitterUsername})
      }
    },
    async like() {
      try{
        this.isLiking = true
      } catch (e) {
        
      } finally {
        this.isLiking = false
      }
    },
    async follow() {
      try{
        this.isFollowing = true
      } catch (e) {
        
      } finally {
        this.isFollowing = false
      }
    }
  },
  mounted() {
    this.enableFold = this.$refs.blogRef?.clientHeight > 200
  }
}
</script>

<style scoped>

</style>
