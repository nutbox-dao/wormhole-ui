<template>
  <div>
    <img  v-show="$i18n.locale==='en'" src="~@/assets/guide-curation-tweet.jpeg" alt="">
    <img  v-show="$i18n.locale==='zh'" src="~@/assets/guide-curation-tweet-zh.jpeg" alt="">
    <img  v-show="$i18n.locale==='en'" src="~@/assets/guide-curation-tweet-create.jpeg" alt="">
    <img  v-show="$i18n.locale==='zh'" src="~@/assets/guide-curation-tweet-create-zh.jpeg" alt="">
  </div>
</template>

<script>
export default {
  name: "GuideCurationTweet"
}
</script>

<style scoped>

</style>
