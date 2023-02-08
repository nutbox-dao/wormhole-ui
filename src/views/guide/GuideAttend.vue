<template>
  <div>
    <img  v-show="$i18n.locale==='en'" src="~@/assets/guide-attend.jpeg" alt="">
    <img  v-show="$i18n.locale==='zh'" src="~@/assets/guide-attend-zh.jpeg" alt="">
  </div>
</template>

<script>
export default {
  name: "GuideAttend"
}
</script>

<style scoped>

</style>
