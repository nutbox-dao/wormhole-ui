<template>
  <div class="container mx-auto max-w-600px xl:max-w-30rem px-15px">
    <div class="bg-blockBg light:bg-white light:shadow-color1A rounded-20px
                px-20px sm:px-4.5rem py-24px text-left my-20px">
      <div class="c-text-black mt-1rem mb-2rem text-20px 2xl:text-1rem md:text-center w-full">
        {{$t('postView.tweetTip')}}
      </div>
      <!-- tip post -->
      <div class="text-14px leading-24px mt-1rem mb-6px text-color8B light:text-color7D">
        {{$t('postView.tip1')}}
      </div>
      <div class="bg-black/40 light:bg-colorF2 light:border-1 light:border-colorE3 rounded-1rem p-1rem">
        <div class="text-left text-14px leading-24px break-word">
          <span class="mb-4px break-word">{{$t('postView.postExample')}}</span>
          <span class="text-color62 ml-4px">#iweb3</span>
        </div>
      </div>
      <div class="text-white light:text-color7D text-12px mt-15px
                text-right flex justify-end">
        <button @click="gotoPost"
                class="text-color8B flex items-center justify-center border-1px border-color8B rounded-full
                     2xl:h-2.2rem text-12px 2xl:text-0.9rem h-28px px-1rem bottom-1rem right-1rem">
          <img
              class="w-1rem h-1rem mr-0.4rem"
              src="~@/assets/icon-twitter.svg"
              alt=""/>
          <span class="text-color8F">{{$t('postView.goTweet')}}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {TWITTER_POST_TAG} from "@/config";

export default {
  name: "CreatePost",
  methods: {
    gotoPost() {
      window.open(
          "https://twitter.com/intent/tweet?text=" +
          TWITTER_POST_TAG,
          "__blank"
      );
    },
  }
}
</script>

<style scoped>

</style>
