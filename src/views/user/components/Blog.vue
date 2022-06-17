<template>
  <div>
    <div class="flex">
      <img v-if="accountInfo" class="w-5rem h-5rem mr-1.5rem rounded-full gradient-border border-3px"
           :src="'https://profile-images.heywallet.com/' + accountInfo.twitterId" alt="">
      <img class="w-5rem h-5rem mr-1.5rem rounded-full gradient-border border-3px" src="@/assets/icon-default-avatar.svg" v-else alt="">
      <div class="flex-full overflow-x-hidden">
        <div class="flex sm:items-center sm:flex-row flex-col items-start">
          <div class="flex items-center">
            <a class="font-700">{{ post.name }}</a>
            <img class="w-1rem h-1rem sm:mx-0.5rem ml-0.5rem" src="~@/assets/icon-checked.svg" alt="">
          </div>
          <span class="whitespace-nowrap overflow-ellipsis overflow-x-hidden text-text8F">
            @{{ post.username }} · {{ parseTimestamp(post.postTime) }}
          </span>
        </div>
        <div class="text-left font-400 mt-1">
          {{ post.content }}
        </div>
        <div v-if="urls && urls.length > 1" class="img-box grid max-h-500px overflow-hidden rounded-16px mt-10px ">
          <div class="overflow-hidden w-full h-full">
            <img class="object-cover" :src="urls[1]" alt="">
          </div>
        </div>
        <!-- <div class="flex gap-4rem mt-15px">
          <div class="text-text8F flex items-center">
            <img class="w-18px" src="~@/assets/icon-msg.svg" alt="">
            <span class="c-text-medium ml-2px">61</span>
          </div>
          <div class="text-text8F flex items-center">
            <img class="w-18px" src="~@/assets/icon-forward.svg" alt="">
            <span class="c-text-medium ml-2px">61</span>
          </div>
          <div class="flex items-center" @click.stop="like=!like">
            <svg width="18" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :fill="like?'#F4245E':'#8F8F8F'" d="M10.0001 17.8349H9.98726C7.61951 17.7909 0.787598 11.6181 0.787598 5.77157C0.787598 2.9629 3.10218 0.49707 5.74035 0.49707C7.83951 0.49707 9.25118 1.9454 9.99918 2.99957C10.7453 1.94724 12.157 0.49707 14.2571 0.49707C16.8971 0.49707 19.2108 2.9629 19.2108 5.77249C19.2108 11.6172 12.3779 17.79 10.0102 17.8331H10.0001V17.8349Z"/>
            </svg>
            <span class="c-text-medium ml-2px" :class="like?'text-redColor':'text-text8F'">61</span>
          </div>
          <div class="text-text8F flex items-center">
            <img class="w-16px" src="~@/assets/icon-share.svg" alt="">
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { parseTimestamp } from '@/utils/helper'
import { mapState } from 'vuex'

export default {
  name: "Blog",
  props: {
    post: {
      type: Object
    },
  },
  data() {
    return {
      like: true,
      urls: []
    }
  },
  computed: {
    ...mapState(['accountInfo'])
  },
  methods: {
    parseTimestamp(time) {
      return parseTimestamp(time)
    }
  },
  mounted () {
    var reg = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g
    this.urls = this.post.content.replace(' ', '').replace('\r', '').replace('\t', '').match(reg)
    console.log(1, this.urls);
  },
}
</script>

<style scoped lang="scss">
.img-box {
  img {
    width: 100%;
    height: 100%;
  }
}
.img-2 {
  grid-template-columns: repeat(2, 1fr);
}
.img-3 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  :nth-child(1)  {
    grid-row: span 2 / span 2;
  }
  :nth-child(2),  :nth-child(3)  {
    grid-row: span 1 / span 1;
  }
}
.img-4 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}
</style>
