<template>
  <div class="py-1rem px-1.5rem sm:rounded-1rem bg-inputBg flex flex-col justify-between">
    <div class="flex ">
      <img v-if="space.authorProfileImg || space.creatorProfileImg" class="w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem md:mr-1.5rem
                  sm:mr-1.4rem mr-0.8rem rounded-full gradient-border"
           :src="(space.authorProfileImg ?? space.creatorProfileImg).replace('normal', '200x200')" alt="">
      <div class="flex-1 flex flex-col items-start cursor-pointer" @click.stop="gotoUserPage()">
        <div class="flex items-center flex-wrap">
          <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem light:text-blueDark">{{ space.authorName ?? space.creatorTwitterName }}</a>
          <span class="text-0.8rem font-500 text-color8B light:text-color7D">@{{space.authorUsername ?? space.creatorTwitterUsername}}</span>
        </div>
      </div>
    </div>
    <div class="text-left font-bold text-1.2rem">{{ space.spaceTitle }}</div>
    <button class="bg-color62/30 h-2.5rem w-full rounded-full font-bold"
      @click="gotoSpace">{{ stateMap[space.spaceState] }}</button>
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

</style>