<template>
  <div class="verify-view lg:p-3rem px-1rem py-2rem">
    <div class="text-white">
      <div class="gradient-text gradient-text-right c-text-black text-2.4rem max-w-30rem mx-auto mb-2.3rem leading-2.9rem">
        Below is the password
        to your new wallet:
      </div>
      <p class="mb-2rem lg:text-1.6rem text-1rem leading-1.4rem">
        {{ ethAccount.ethAddress }}
      </p>
      <div class="tip-block py-1rem lg:px-6rem px-2rem max-w-49rem mx-auto rounded-full c-text-medium lg:text-1.4rem text-1.2rem lg:leading-2rem leading-1.6rem mb-2.3rem">
        {{ ethAccount.privateKey }}
      </div>
      <div class="flex justify-center max-w-41rem mx-auto">
        <div class="leading-1.5rem flex item-center mr-1rem">
          <img class="w-1.1rem h-1.1rem min-w-1.1rem my-0.2rem" src="~@/assets/icon-warning.svg" alt="">
        </div>
        <div class="max-w lg:text-1.2rem text-1rem font-bold lg:leading-1.5rem leading-1.3rem text-left">
          Please save this private key in a very secure location. We will never keep this key, so if you dont save it, nobody can find back this account.
        </div>
      </div>
      <div class="flex justify-start items-center mt-1.5rem max-w-41rem mx-auto">
        <el-checkbox v-model="checked" size="lg" class="c-checkbox" />
        <div class="c-text-black text-1.5rem leading-1.5rem underline ml-1rem cursor-pointer" @click="checked=true">
          Ok, I saved it.
        </div>
      </div>
      <router-link to="/login">
        <button class="c-text-medium gradient-btn h-3.6rem px-1.5rem mx-auto rounded-full lg:text-1.6rem text-1.2rem mt-1.25rem"
                :disabled="!checked" @click="$emit('send')">
          Bind to Twitter
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Verify",
  props: {
    ethAccount: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      checked: false
    }
  },
  mounted () {
  },
}
</script>

<style scoped lang="scss">
.tip-block {
  background-image: linear-gradient(to right, var(--gradient-primary-color1), var(--gradient-primary-color2));
}
</style>
