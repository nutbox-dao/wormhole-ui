<template>
  <div>
    <img  v-show="$i18n.locale==='en'" src="~@/assets/guide-curation-space.jpeg" alt="">
    <img  v-show="$i18n.locale==='zh'" src="~@/assets/guide-curation-space-zh.jpeg" alt="">
    <img  v-show="$i18n.locale==='en'" src="~@/assets/guide-curation-space-popup.jpeg" alt="">
    <img  v-show="$i18n.locale==='zh'" src="~@/assets/guide-curation-space-popup-zh.jpeg" alt="">
  </div>
</template>

<script>
export default {
  name: "GuideCurationSpace"
}
</script>

<style scoped>

</style>
