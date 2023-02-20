<template>
  <div class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg light:bg-white rounded-20px
              px-20px sm:px-4.5rem py-24px mb-2rem text-left mt-2rem">
    <div class="c-text-black mt-1rem mb-2rem text-20px 2xl:text-1rem md:text-center w-full">
      {{$t('postView.tweetTip')}}
    </div>
    <!-- tip post -->
    <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem light:text-color46">
      {{$t('postView.tip1')}}
    </div>
    <div class="bg-black/40 light:bg-colorF2 light:border-1 light:border-colorE3 rounded-1rem h-min-8rem p-1rem relative">
      <div class="text-left break-all 2xl:text-0.8rem text-14px">
        <span class="text-color8F">{content} </span>
        <span class="text-color62">#iweb3</span>
      </div>
      <button
          @click="gotoPost" class="text-color8B flex items-center justify-center border-1px border-color8B rounded-full
                2xl:h-2.2rem text-12px 2xl:text-0.9rem h-28px px-1rem absolute bottom-1rem right-1rem">
        <img
            class="w-1rem h-1rem mr-0.4rem"
            src="~@/assets/icon-twitter.svg"
            alt=""/>
        <span class="text-color8F">{{$t('postView.goTweet')}}</span>
      </button>
    </div>
    <div class="text-white light:text-color7D text-12px 2xl:text-0.8rem 2x:leading-1rem mt-0.5rem italic text-left">
      {{$t('postView.tips')}}:<br />{{$t('postView.p2')}}
    </div>
    <!-- tip tip -->
    <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem">
      {{$t('postView.tip2')}}
    </div>
    <div class="bg-black/40 light:bg-colorF2 light:border-1 light:border-colorE3 rounded-1rem h-min-8rem p-1rem relative">
      <div class="text-left break-all 2xl:text-0.8rem text-14px">
        <span class="text-color62 light:text-color62">@wormhole_3 !tip </span>
        <span class="text-color8F">{0.5 STEEM} to {@vitalik}</span>
      </div>
      <button
          @click="gotoTip"
          class="text-color8B flex items-center justify-center border-1px border-color8B rounded-full
                2xl:h-2.2rem text-12px 2xl:text-0.9rem h-28px px-1rem absolute bottom-1rem right-1rem">
        <img
            class="w-1rem h-1rem mr-0.4rem"
            src="~@/assets/icon-twitter.svg"
            alt=""/>
        <span class="text-color8F">{{$t('postView.goTweet')}}</span>
      </button>
    </div>
    <div class="text-white light:text-color7D text-12px 2xl:text-0.8rem 2x:leading-1rem mt-0.5rem italic text-left">
      {{$t('postView.tips')}}: <br />
      {{$t('postView.p9')}}
    </div>
    <!-- tip send -->
    <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem light:text-color46">
      {{$t('postView.tip3')}}
    </div>
    <div class="bg-black/40 light:bg-colorF2 light:border-1 light:border-colorE3 rounded-1rem h-min-8rem p-1rem relative">
      <div class="text-left break-all 2xl:text-0.8rem text-14px">
        <span class="text-color62 light:text-color62">@wormhole_3 !send </span>
        <span class="text-color8F">{0.5 STEEM} to {wormhole3}</span>
      </div>
      <button
          @click="gotoSend" class="text-color8B flex items-center justify-center border-1px border-color8B rounded-full
                2xl:h-2.2rem text-12px 2xl:text-0.9rem h-28px px-1rem absolute bottom-1rem right-1rem">
        <img
            class="w-1rem h-1rem mr-0.4rem"
            src="~@/assets/icon-twitter.svg"
            alt=""/>
        <span class="text-color8F">{{$t('postView.goTweet')}}</span>
      </button>
    </div>
    <div class="text-white light:text-color7D text-12px 2xl:text-0.8rem 2x:leading-1rem mt-0.5rem italic text-left">
      {{$t('postView.tips')}}:<br />
      {{$t('postView.p3')}}
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
