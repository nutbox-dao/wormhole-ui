<template>
  <div class="">
    <div class="py-1rem px-1.5rem border-b-1 border-listBgBorder">
      <div class="flex items-center sm:items-start">
        <img v-if="profileImg" @click.stop="gotoUserPage()"
             class="w-2.5rem h-2.5rem 2xl:w-3.6rem 2xl:h-3.6rem 2xl:mr-1.5rem mr-0.8rem rounded-full cursor-pointer"
             @error="replaceEmptyImg"
             :src="profileImg" alt="">
        <img class="w-2.5rem h-2.5rem 2xl:w-3.6rem 2xl:h-3.6rem md:mr-1.5rem sm:mr-1.4rem mr-0.8rem rounded-full " src="@/assets/icon-default-avatar.svg" v-else alt="">
        <div class="flex-1 flex justify-between items-center cursor-pointer" @click.stop="gotoUserPage()">
          <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem">{{curation.twitterUsername}}</a>
<!--          <span class="text-primaryColor text-15px xl:text-0.75rem">2 days left</span>-->
          <span class="text-orangeColor text-15px xl:text-0.75rem">{{endtime}}</span>
<!--          <span class="text-greenColor text-15px xl:text-0.75rem">Completed</span>-->
        </div>
      </div>
      <div class="overflow-x-hidden 2xl:ml-5.1rem md:mr-0 sm:ml-3.9rem text-left relative sm:-mt-3">
        <div class="xl:max-w-27rem pb-12px">
          <div class="font-600" v-html="formatText(title)"></div>
<!--          <div class="text-color8B font-400 text-15px leading-24px 2xl:text-0.75rem 2xl:leading-1.2rem whitespace-pre-line">-->
<!--            {{content}}-->
<!--          </div>-->
          <div class="text-color8B font-400 text-15px leading-24px 2xl:text-0.75rem 2xl:leading-1.2rem whitespace-pre-line"
               v-html="formatText(content)"></div>
        </div>
        <div class="flex justify-between items-center">
          <div v-if="curation.curatorProfile" class="flex items-center ml-10px">
            <img v-for="i of curation.curatorProfile" :key="i"
                 class="w-32px h-32px min-w-32px min-h-32px
                        xl:w-1.6rem xl:h-1.6rem xl:min-w-1.6rem xl:min-h-1.6rem
                        rounded-full -ml-10px border-1 border-blockBg"
                 @error="replaceEmptyImg"
                 :src="i" alt="">
            <span v-show="(curation.totalCount ?? 0) - (curation.curatorProfile ? curation.curatorProfile.length : 0) > 0" class="w-32px h-32px min-w-32px min-h-32px xl:w-1.6rem xl:min-w-1.6rem xl:h-1.6rem xl:min-h-1.6rem
                    rounded-full -ml-10px flex justify-center items-center border-1 border-blockBg bg-primaryColor
                    font-600 text-12px">+{{curation.totalCount - curation.curatorProfile.length}}</span>
          </div>
          <div v-else></div>
          <div class="flex items-center h-max">
            <div class="xl:absolute xl:top-1rem xl:right-0 bg-primaryColor/20 text-primaryColor px-13px py-5px
                 rounded-full c-text-black 2xl:text-0.75rem">{{curation.amount.toString() / (10 ** curation.decimals)}} {{curation.tokenSymbol}}</div>
            <slot name="status"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { parseTimestamp } from '@/utils/helper'
import { mapGetters } from "vuex";

export default {
  name: "CurationItem",
  props: {
    curation: {
      type: Object,
      default: {}
    },
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    profileImg() {
      return this.curation.profileImg
    },
    endtime() {
      if (this.curation.curationStatus === 0){
        return parseTimestamp(this.curation.endtime * 1000)
      }else if(this.curation.curationStatus === 1) {
        return this.$t('curation.end')
      }else {
        return this.$t('curation.complete')
      }
    },
    title() {
      return this.curation.content.split('\n')[0]
    },
    content() {
      return this.curation.content.replace(this.title, '').trim()
    }
  },
  methods: {
    formatText(str) {
      const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
      str = str.replace(regStr, (char) => {
        let code = char.codePointAt(char).toString(16)
        console.log('--char--', char, code)
        if(code.length<4) code = code + '-20e3'
        // return `<span class="c-emoji">${char}</span>`;
        return `<img class="w-1.3rem h-1.3rem inline-block" src="/emoji/svg/${code}.svg" alt="${char}"/>`
      });
      return str
    },
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    gotoUserPage() {
      if (!this.curation || this.curation.twitterUsername !== this.getAccountInfo.twitterUsername){
        this.$router.push({path : '/account-info/@' + this.curation.twitterUsername})
      }
    }
  }
}
</script>

<style scoped>

</style>
