<template>
  <div class="py-20px border-b-1 border-headerBorder light:border-headerBorderLight
              h-70px 2xl:h-88px flex items-center c-page-header">
    <div class="w-full px-15px flex justify-between items-center relative">
      <button>
        <img class="w-30px h-30px filter invert-100"
             src="~@/assets/icon-dashboard.svg" alt="">
      </button>
      <button>
        <img class="w-26px h-26px"
             src="~@/assets/icon-notification.svg" alt="">
      </button>
      <img class="h-1.7rem black-filter absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
           src="~@/assets/logo.svg" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped>

</style>
