<template>
  <div class="container mx-auto max-w-600px xl:max-w-30rem px-15px">
    <div class="bg-blockBg light:bg-white light:shadow-color1A rounded-20px
                px-20px sm:px-4.5rem py-2rem text-left my-20px">
      <div class="c-text-black mb-1rem text-20px 2xl:text-1rem text-center w-full">
        {{$t('postView.tweetTip')}}
      </div>
      <!-- content -->
      <div class="mb-6px font-bold mt-1rem">{{$t('curation.typeTweetContent')}}</div>
      <div class="border-1 bg-black/40 border-1 border-color8B/30 rounded-8px
                  light:bg-white light:border-colorE3 hover:border-primaryColor">
        <div class="flex flex-wrap p-8px gap-4px border-b-0.5px border-color8B/30"
             v-if="form.tag">
          <button class="bg-color62 h-20px text-white px-5px rounded-full text-12px">#{{form.tag}}</button>
          <button v-show="form.topic" class="bg-color62 h-20px text-white px-5px rounded-full text-12px">#{{form.topic}}</button>
        </div>
        <div contenteditable
             class="desc-input px-1rem min-h-6rem whitespace-pre-line leading-24px xl:leading-1.2rem"
             ref="contentRef"
             @blur="getBlur('desc')"
             @paste="onPasteEmojiContent"
             v-html="form.contentEl"></div>
        <div class="py-2 border-color8B/30 flex justify-between items-center">
          <el-popover ref="descEmojiPopover"
                      trigger="click"
                      width="300"
                      :teleported="true"
                      :persistent="false">
            <template #reference>
              <img class="w-1.8rem h-1.8rem lg:w-1.4rem lg:h-1.4rem mx-8px" src="~@/assets/icon-emoji.svg" alt="">
            </template>
            <div class="h-310px">
              <EmojiPicker :options="{
                            imgSrc:'/emoji/',
                            locals: $i18n.locale==='zh'?'zh_CN':'en',
                            hasSkinTones:false,
                            hasGroupIcons:false}"
                           @select="selectEmoji" />
            </div>
          </el-popover>
          <div class="px-0.5rem text-right text-color62">#iweb3</div>
        </div>
      </div>

      <SelectCommunity :community-id="form.communityId"
                       @setCommunityId="setCommunityId"
                       @setTag="setTag"></SelectCommunity>
      <SelectTopic :community-id="form.communityId" 
                      @setTag="setTopic"></SelectTopic>

      <!-- tip post -->
      <!-- <div class="text-14px leading-24px mt-1rem mb-6px text-color8B light:text-color7D">
        {{$t('postView.tip1')}}
      </div>
      <div class="bg-black/40 light:bg-colorF2 light:border-1 light:border-colorE3 rounded-1rem p-1rem">
        <div class="text-left text-14px leading-24px break-word">
          <span class="text-color62 ml-4px">#peanut</span>
          <span class="text-color62 ml-4px">#iweb3</span><br>
          <span class="mb-4px break-word">{{$t('postView.postExample')}}</span>
        </div>
      </div> -->
      
      <div class="text-white light:text-color7D text-12px mt-25px
                text-right flex justify-end">
        <button @click="gotoPost"
                class="text-color8B flex items-center justify-center gradient-btn rounded-full w-full
                        2xl:h-2rem text-14px 2xl:text-0.9rem h-34px px-1rem bottom-1rem right-1rem">
          <img
              class="w-1rem h-1rem mr-0.4rem"
              src="~@/assets/icon-twitter-white.svg"
              alt=""/>
          <span class="text-white">{{$t('postView.goTweet')}}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {TWITTER_POST_TAG} from "@/config";
import {formatEmojiText, onPasteEmojiContent} from "@/utils/tool";
import {stringLength} from "@/utils/helper";
import { EmojiPicker } from 'vue3-twemoji-picker-final'
import SelectCommunity from "@/components/community/SelectCommunity.vue";
import SelectTopic from "@/components/community/SelectTopic.vue"
import { notify } from "@/utils/notify";

export default {
  name: "CreatePost",
  components: {EmojiPicker, SelectCommunity, SelectTopic},
  data() {
    return {
      form: {
        communityId: '',
        tag: '',
        topic: '',
        content: '',
        contentEl: '',
        tweetLength: 0
      },
      contentRange: null,
    }
  },
  mounted() {
  },
  methods: {
    setCommunityId(id) {
      this.form.communityId = id
    },
    setTag(tag) {
      this.form.tag = tag
    },
    setTopic(tag) {
      this.form.topic = tag
    },
    getBlur() {
      const sel = window.getSelection();
      this.contentRange = sel.getRangeAt(0);
    },
    onPasteEmojiContent,
    formatEmojiText,
    selectEmoji(e) {
      const newNode = document.createElement('img')
      newNode.alt = e.i
      newNode.src = e.imgSrc
      newNode.className = 'inline-block w-18px h-18px mx-2px'
      if(!this.contentRange) return
      this.contentRange.insertNode(newNode)
      this.$refs.descEmojiPopover.hide()
    },
    formatElToTextContent(el) {
      el.innerHTML = el.innerHTML.replaceAll('<div>', '\n')
      el.innerHTML =el.innerHTML.replaceAll('</div>', '\n')
      el.innerHTML =el.innerHTML.replaceAll('<br>', '')
      let content = ''
      let tweetLength = 0;
      for(let i of el.childNodes) {
        if(i.nodeName==='#text') {
          tweetLength += stringLength(i.textContent);
          content += i.textContent
        } else if(i.nodeName === 'IMG') {
          tweetLength+=2;
          content += i.alt
        }
      }
      this.tweetLength = tweetLength
      return content
    },
    gotoPost() {
      if (this.form.tag && this.form.tag.length > 2) {
        let content = this.formatElToTextContent(this.$refs.contentRef)
        content = ` #${this.form.tag}${this.form.topic.length > 0 ? ' #' + this.form.topic : ''}\n${content}`
        content = encodeURIComponent(content)
        window.open(
            "https://twitter.com/intent/tweet?text=" +
            TWITTER_POST_TAG + content ,
            "__blank"
        );
      }else {
        notify({message: this.$t('tips.selectCommunityTag')})
      }
    },
  }
}
</script>

<style scoped>

</style>
