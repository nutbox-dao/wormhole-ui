<template>
    <div class="flex cursor-pointer">
      <div class="w-32px h-32px min-w-32px min-h-32px flex items-center justify-center mr-8px mt-15px">
        <img class="w-20px h-20px min-w-20px" src="~@/assets/info-like.svg" alt="">
      </div>
      <div class="flex-1 flex flex-col items-start py-15px border-b-0.5px border-color8B/30 light:border-color7F">
        <div class="w-full flex justify-between items-center gap-5px">
          <img
               class="w-32px h-32px min-w-32px min-h-32px rounded-full"
               :src="profile(infoData)" alt="">
          <span class="whitespace-nowrap text-12px leading-18px text-color8B light:text-color7D">
           {{ notiTime(infoData) }}
          </span>
        </div>
        <div class="w-full my-5px text-left text-14px leading-20px">
          <span class="font-bold">
            {{ $t('info.register', { user: infoData.username }) }}
        </span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { parseTimestamp } from '@/utils/helper';
  
  export default {
    name: "Register",
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
        let time = noti.quoteTime || noti.likeTime || noti.retweetTime || noti.commentTime || noti.postTime || noti.opTime;
        return parseTimestamp(time)
      },
      profile(noti) {
        return noti.type === 1 ? noti.quoteProfileImg : noti.type === 2 ? noti.retweetProfileImg : noti.type === 3 ? noti.commentProfileImg : noti.type === 4 ? noti.likeProfileImg : noti.type === 6 ? noti.profileImg : noti.likeProfileImg
      },
    },
  }
  </script>
  
  <style scoped>
  
  </style>
  