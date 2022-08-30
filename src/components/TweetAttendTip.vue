<template>
  <div>
    <PostTip>
      <template #title>Tweet to attend</template>
      <template #content>
        <div class="bg-color0E p-1rem mt-1rem mb-2rem rounded-15px">
          <div class="flex ">
            <img class="w-1rem h-1rem md:w-2rem md:h-2rem mr-0.8rem rounded-full "
                 src="@/assets/icon-default-avatar.svg" alt="">
            <div class="flex-1 flex justify-between items-center cursor-pointer">
              <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem">Ian Yin </a>
            </div>
          </div>
          <div class="mt-10px">
            content....
          </div>
        </div>
      </template>
      <template #btn>
        <button class="text-color8B flex items-center justify-center border-1px border-color8B rounded-full h-28px 2xl:h-2.2rem text-12px 2xl:text-0.9rem px-1rem absolute bottom-1rem right-1rem">
          <img class="w-1rem h-1rem mr-0.4rem" src="~@/assets/icon-twitter.svg" alt="">
          <span class="text-color8B" @click="$emit('close')">{{$t('postView.goTweet')}}</span>
        </button>
      </template>
    </PostTip>
  </div>
</template>

<script>
import PostTip from "@/views/post/PostTip";
export default {
  name: "TweetAttendTip",
  components: {PostTip}
}
</script>

<style scoped>

</style>
