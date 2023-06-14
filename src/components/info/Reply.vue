<template>
  <div class="flex ">
    <div class="w-32px h-32px min-w-32px min-h-32px flex items-center justify-center mr-8px mt-15px">
      <img class="w-32px h-32px min-w-32px min-h-32px rounded-full"
           :src="profile(infoData)" alt="">
    </div>
    <div class="flex-1 flex flex-col items-start py-15px border-b-0.5px border-color8B/30 light:border-color7F">
      <div class="flex items-center" >
        <span class="text-14px c-text-black mr-4px">{{ infoData.twitterName }}</span>
        <span class="text-12px leading-18px text-color8B light:text-color7D">
          @{{ infoData.twitterUsername }}
        </span>
        <span class="mx-4px text-color8B light:text-color7D"> · </span>
        <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
         {{ notiTime(infoData) }}
        </span>
      </div>
      <div class="text-14px my-3px">
        <span class="text-color66 mr-6px">{{$t('curation.reply')}}</span>
        <button class="text-colorBlue">
          @{{getAccountInfo ? getAccountInfo.twitterUsername : " "}}
        </button>
      </div>
      <div class="w-full my-5px text-left text-14px leading-20px">
        {{ infoData.commentContent }}
      </div>
      <!-- <PostButtonGroup ref="postButtonRef"
                       class="mt-5px w-full"
                       :id="postData.postId"
                       :post="postData"></PostButtonGroup> -->
    </div>
  </div>
</template>

<script>
import {parseTimestamp} from "@/utils/helper";
import {mapGetters} from "vuex";
import PostButtonGroup from "@/components/PostButtonGroup.vue";
export default {
  name: "Reply",
  components: {PostButtonGroup},
  props: {
    infoData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(["getAccountInfo"]),
  },
  methods: {
    parseTimestamp,
    notiTime(noti) {
      let time = noti.quoteTime || noti.likeTime || noti.retweetTime || noti.commentTime || noti.postTime;
      return parseTimestamp(time)
    },
    profile(noti) {
      return noti.type === 1 ? noti.quoteProfileImg : noti.type === 2 ? noti.retweetProfileImg : noti.type === 3 ? noti.commentProfileImg : noti.type === 4 ? noti.likeProfileImg : noti.likeProfileImg
    },
    notiTips(noti) {
      let type = noti.type === 1 ? 'quoted' : noti.type === 2 ? 'retweeted' : noti.type === 3 ? 'replyed' : noti.type === 4 ? 'liked' : ''
      return `${noti.username} ${this.$t('info.' + type)} ${this.$t('info.yourTweet')}`
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
