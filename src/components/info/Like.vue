<template>
  <div class="flex">
    <div class="w-32px h-32px min-w-32px min-h-32px flex items-center justify-center mr-8px mt-15px">
      <img class="w-20px h-20px min-w-20px" src="~@/assets/info-like.svg" alt="">
    </div>
    <div class="flex-1 flex flex-col items-start py-15px border-b-1 border-color8B/30 light:border-color7F">
      <div class="w-full flex items-center gap-5px">
        <img 
             class="w-32px h-32px min-w-32px min-h-32px rounded-full"
             :src="profile(infoData)" alt="">
      </div>
      <div class="w-full my-5px text-left text-14px leading-20px">
        <span class="font-bold">{{infoData.username}} </span><span>{{ ' ' }}</span>
        <span> {{$t('info.liked')}} {{ $t('info.yourTweet') }}</span>
      </div>
      <div class="text-left text-color99 leading-18px multi-content">
       {{ infoData.content }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Like",
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
