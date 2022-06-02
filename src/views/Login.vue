<template>
  <div class="login-view">
    <div class="container max-w-425px mx-auto lg:mt-6rem mt-20vh px-0.75rem">
      <div class="fade-in">
        <div class="gradient-text gradient-text-left c-text-black text-3.2rem max-w-30rem mx-auto mb-2.3rem leading-3.9rem">
          Login
        </div>
        <div class="text-1.2rem font-bold leading-1.5rem mb-1.5rem">
          Please enter your twitter handle.
        </div>
        <div>
          <input class="bg-white h-3.6rem w-full rounded-full text-black px-1.6rem outline-none text-1.2rem text-textA6"
                 type="text" placeholder="@Hello_web3" v-model="username">
        </div>
        <button @click="login" class="c-text-medium gradient-btn h-3.6rem w-full rounded-full text-1.6rem mt-1.25rem">
          Login
        </button>
        <div class="text-text8F text-1rem font-bold mt-1.5rem">
          Haven't signed up yet ?
        </div>
        <div class="underline c-text-black text-primaryColor1 text-1.2rem leading-1.5rem mt-0.5rem">
          Create an account
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTwitterAccount } from '@/api/api'

export default {
  name: "Login",
  data() {
    return {
      username: ''
    }
  },
  methods: {
    async login() {
      console.log(64,this.username);
    }
  },
}
</script>

<style scoped>

</style>
