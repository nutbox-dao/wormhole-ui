<template>
  <div class="py-1rem px-1.5rem sm:rounded-1rem space-box flex flex-col justify-between">
    <div class="flex ">
      <img v-if="space.authorProfileImg || space.creatorProfileImg"
           class="w-30px h-30px xl:w-1.5rem xl:h-1.5rem rounded-full"
           :src="(space.authorProfileImg ?? space.creatorProfileImg).replace('normal', '200x200')" alt="">
      <div class="flex-1 flex flex-col items-start cursor-pointer" @click.stop="gotoUserPage()">
        <div class="flex items-center flex-wrap">
          <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem text-white">
            {{ space.authorName ?? space.creatorTwitterName }}</a>
          <span class="text-0.8rem font-500 text-white">
            @{{space.authorUsername ?? space.creatorTwitterUsername}}</span>
        </div>
      </div>
    </div>
    <div class="text-left font-bold text-16px 2xl:text-1.2rem text-white">{{ space.spaceTitle }}</div>
    <button class="bg-white h-30px 2xl:1.5rem w-full rounded-full font-bold flex justify-center items-center"
      @click="gotoSpace">
      <img class="w-10x mr-5px" src="~@/assets/icon-listen.svg" alt="">
      <span class="font-bold">{{ stateMap[space.spaceState] }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "Space",
  props: {
    space: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      stateMap: {
        1: 'Schedualed',
        2: 'Listening',
        3: 'Ended',
        4: 'Canceled'
      }
    }
  },
  methods: {
    gotoUserPage() {
    },
    gotoSpace () {
      window.open('https://twitter.com/i/spaces/' + this.space.spaceId)
    }
  }
}
</script>

<style scoped>
.space-box {
  background: linear-gradient(135.53deg, #917AFD 2.61%, #6246EA 96.58%);
}
</style>
