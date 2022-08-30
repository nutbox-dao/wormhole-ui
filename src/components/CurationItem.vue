<template>
  <div class="">
    <div class="py-1rem px-1.5rem border-b-1 border-listBgBorder">
      <div class="flex ">
        <img v-if="profileImg" @click.stop="gotoUserPage()"
             class="w-2.5rem h-2.5rem md:w-3.6rem md:h-3.6rem md:mr-1.5rem sm:mr-1.4rem mr-0.8rem rounded-full cursor-pointer"
             @error="replaceEmptyImg"
             :src="profileImg" alt="">
        <img class="w-2.5rem h-2.5rem md:w-3.6rem md:h-3.6rem md:mr-1.5rem sm:mr-1.4rem mr-0.8rem rounded-full " src="@/assets/icon-default-avatar.svg" v-else alt="">
        <div class="flex-1 flex justify-between items-center cursor-pointer" @click.stop="gotoUserPage()">
          <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem">Ian Yin </a>
          <span class="whitespace-nowrap overflow-ellipsis overflow-x-hidden text-primaryColor text-15px xl:text-0.75rem">
            2 days left
          </span>
        </div>
      </div>
      <div class="overflow-x-hidden md:ml-5.1rem md:mr-0 sm:mx-3.9rem text-left relative sm:-mt-2">
        <div class="xl:max-w-27rem">
          <div class="font-600">Retweet a post to earn USDTs</div>
          <div class="text-color8B font-400 text-leading24px xl:text-0.75rem md:text-leading1.5rem">
            Good design requires diverse perspectives and skills coming together.
            Good design requires diverse perspectives and skills coming
          </div>
          <div class="flex justify-between items-center mt-12px">
            <div class="flex ml-10px xl:mt-0.6rem">
              <img v-for="i of 3" :key="i"
                   class="w-32px h-32px xl:w-1.6rem xl:h-1.6rem rounded-full -ml-10px border-1 border-blockBg"
                   src="~@/assets/icon-default-avatar.svg" alt="">
              <span class="w-32px h-32px min-w-32px min-h-32px xl:w-1.6rem xl:min-w-1.6rem xl:h-1.6rem xl:min-h-1.6rem
                    rounded-full -ml-10px flex justify-center items-center border-1 border-blockBg bg-primaryColor
                    font-600 text-12px">+12</span>
            </div>
            <div class="xl:absolute xl:top-1rem xl:right-0 bg-primaryColor/20 text-primaryColor px-13px py-5px
                 rounded-full c-text-black 2xl:text-0.75rem">100 ETH</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emptyAvatar from "@/assets/icon-default-avatar.svg";

export default {
  name: "CurationItem",
  computed: {
    profileImg: () => {return null}
  },
  methods: {
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    gotoUserPage() {

    }
  }
}
</script>

<style scoped>

</style>
