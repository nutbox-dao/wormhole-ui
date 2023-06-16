<template>
  <div class="flex">
    <div class="w-32px h-32px min-w-32px min-h-32px flex items-center justify-center mr-8px mt-15px">
      <img class="w-20px h-20px min-w-20px" src="~@/assets/info-retweet.svg" alt="">
    </div>
    <div class="flex-1 flex flex-col items-start py-15px border-b-0.5px border-color8B/30 light:border-color7F">
      <div class="w-full flex justify-between items-center gap-5px">
        <img class="w-32px h-32px min-w-32px min-h-32px rounded-full"
             :src="profile(infoData)" alt="">
        <span class="whitespace-nowrap text-12px leading-18px text-color8B light:text-color7D">
         {{ notiTime(infoData) }}
        </span>
      </div>
      <div class="w-full my-5px text-left text-14px leading-20px">
        <span class="font-bold">{{infoData.username}} </span>
        <span>{{ ' ' + $t('info.retweeted') + ' ' + $t('info.yourTweet') }}</span>
      </div>
      <div class="text-left text-color99 leading-18px multi-content">
        {{ infoData.content }}
      </div>
    </div>
  </div>
</template>

<script>
import { parseTimestamp } from '@/utils/helper';

export default {
  name: "Retweet",
  props: {
    infoData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
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
}
</script>

<style scoped>

</style>
