<template>
  <div class="flex">
    <img class="w-2.2rem h-2.2rem mr-1.5rem rounded-full"
         src="@/assets/icon-default-avatar.svg" alt="">
    <div class="flex-1 text-left">
      <div class="flex items-center overflow-x-hidden">
        <span class="font-700">terry3t</span>
        <img class="w-1.1rem h-1.1rem mx-0.5rem" src="~@/assets/icon-checked.svg" alt="">
        <span class="whitespace-nowrap overflow-ellipsis overflow-x-hidden text-text8F">@terry3t1 · 14/06/22 </span>
      </div>
      <div class="text-left my-0.5rem">
        Replying to
        <a class="text-primaryColor" href="">@acsc</a>
      </div>
      <div class="text-0.9rem">ords in a very secure location and never show these to anybody ever again. </div>
      <div class="flex gap-4rem mt-15px">
        <div class="flex items-center">
          <img class="w-18px" src="~@/assets/icon-msg.svg" alt="">
          <span class="c-text-medium ml-2px">61</span>
        </div>
        <div class="flex items-center">
          <svg width="18" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M10.0001 17.8349H9.98726C7.61951 17.7909 0.787598 11.6181 0.787598 5.77157C0.787598 2.9629 3.10218 0.49707 5.74035 0.49707C7.83951 0.49707 9.25118 1.9454 9.99918 2.99957C10.7453 1.94724 12.157 0.49707 14.2571 0.49707C16.8971 0.49707 19.2108 2.9629 19.2108 5.77249C19.2108 11.6172 12.3779 17.79 10.0102 17.8331H10.0001V17.8349Z"/>
          </svg>
          <span class="c-text-medium ml-2px">61</span>
        </div>
        <div class="text-white flex items-center">
          <img class="w-16px" src="~@/assets/icon-coin.svg" alt="">
          <span class="c-text-medium ml-2px">0.00</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  data() {
    return {
      like: true
    }
  }
}
</script>

<style scoped>

</style>
