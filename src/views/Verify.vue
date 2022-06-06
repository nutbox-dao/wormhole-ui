<template>
  <div class="verify-view p-3rem">
    <div class="text-white">
      <div class="gradient-text gradient-text-left c-text-black text-2.4rem max-w-30rem mx-auto mb-2.3rem leading-2.9rem">
        Below is the password
        to your new wallet:
      </div>
      <div class="tip-block py-1rem lg:px-6rem px-1rem max-w-49rem mx-auto rounded-full c-text-medium text-1.5rem leading-2.5rem mb-2.3rem">
        {{ privateKey }}
      </div>
      <div class="flex justify-center max-w-41rem mx-auto">
        <div class="leading-1.5rem flex item-center mr-1rem">
          <img class="w-1.1rem h-1.1rem min-w-1.1rem my-0.2rem" src="~@/assets/icon-warning.svg" alt="">
        </div>
        <div class="max-w text-1.2rem font-bold leading-1.5rem text-left">
          Save these 12 words in a very secure location and never show these to anybody ever again. If you do, you'll lose all your money.
        </div>
      </div>
      <router-link to="/login">
        <button class="c-text-black text-1.5rem leading-1.5rem mt-2.3rem underline">
          Ok, I saved it.
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Verify",
  props: {
    privateKey: {
      type: String,
      default: ''
    },
  },
}
</script>

<style scoped lang="scss">
.tip-block {
  background-image: linear-gradient(to right, var(--gradient-primary-color1), var(--gradient-primary-color2));
}
</style>
