<template>
  <div class="flex gap-8px mr-10px">
    <el-tooltip v-if="isQuote">
      <button @click.stop>
        <img class="w-20px h-20px 2xl:w-0.7rem 2xl:h-0.7rem" src="~@/assets/icon-quote-tag.svg" alt="">
      </button>
      <template #content>
        <span class="text-white light:text-blueDark">Quote</span>
      </template>
    </el-tooltip>
    <el-tooltip v-if="isReply">
      <button @click.stop>
        <img class="w-20px h-20px 2xl:w-0.7rem 2xl:h-0.7rem" src="~@/assets/icon-reply-tag.svg" alt="">
      </button>
      <template #content>
        <span class="text-white light:text-blueDark">Reply</span>
      </template>
    </el-tooltip>
    <el-tooltip v-if="contentType==='tweet'">
      <button @click.stop>
        <img class="w-20px h-20px 2xl:w-0.7rem 2xl:h-0.7rem" src="~@/assets/icon-tweet-tag.svg" alt="">
      </button>
      <template #content>
        <span class="text-white light:text-blueDark">Tweet</span>
      </template>
    </el-tooltip>
    <el-tooltip v-if="contentType==='space'">
      <button @click.stop>
        <img class="w-20px h-20px 2xl:w-0.7rem 2xl:h-0.7rem" src="~@/assets/icon-space-tag.svg" alt="">
      </button>
      <template #content>
        <span class="text-white light:text-blueDark">Space</span>
      </template>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "ContentTags",
  props: {
    isQuote: {
      type: [Boolean , Number],
      default: false
    },
    isReply: {
      type: [Boolean , Number],
      default: false
    },
    contentType: {
      type: String,
      default: 'tweet'
    }
  }
}
</script>

<style scoped>

</style>
