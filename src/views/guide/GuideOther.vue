<template>
  <div>
    <img  v-show="$i18n.locale==='en'" src="~@/assets/guide-curation-tip.jpeg" alt="">
    <img  v-show="$i18n.locale==='zh'" src="~@/assets/guide-curation-tip-zh.jpeg" alt="">
    <img  v-show="$i18n.locale==='en'" src="~@/assets/guide-tweet-chain.jpeg" alt="">
    <img  v-show="$i18n.locale==='zh'" src="~@/assets/guide-tweet-chain-zh.jpeg" alt="">
  </div>
</template>

<script>
export default {
  name: "GuideOther"
}
</script>

<style scoped>

</style>
