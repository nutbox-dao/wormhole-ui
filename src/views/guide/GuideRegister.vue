<template>
  <div>
    <img v-show="$i18n.locale==='en'" src="~@/assets/guide-register.jpeg" alt="">
    <img v-show="$i18n.locale==='zh'" src="~@/assets/guide-register-zh.jpeg" alt="">
  </div>
</template>

<script>
export default {
  name: "GuideRegister"
}
</script>

<style scoped>

</style>
