<template>
  <div class="login-view">
    <div class="container max-w-425px mx-auto lg:mt-6rem mt-20vh px-0.75rem">
      <div class="fade-in">
        <div class="gradient-text gradient-text-right c-text-black text-3.2rem max-w-30rem mx-auto mb-2.3rem leading-3.9rem">
          Login
        </div>
        <div class="text-1.2rem font-bold leading-1.5rem mb-1.5rem">
          Please enter your twitter username.
        </div>
        <div>
          <input class="bg-white h-3.6rem w-full rounded-full text-black px-1.6rem outline-none text-1.2rem text-textA6"
                 type="text" placeholder="@Hello_web3" v-model="username">
        </div>
        <button @click="login" :disable="loging || username.length < 3"
                class="c-text-medium gradient-btn h-3.6rem w-full rounded-full text-1.6rem mt-1.25rem flex justify-center items-center">
          <span>Login</span>
          <c-spinner class="w-2.4rem h-2.4rem ml-1rem" v-show="loging"></c-spinner>
        </button>
        <div class="text-text8F text-1rem font-bold mt-1.5rem">
          Haven't signed up yet ?
        </div>
        <router-link to="'/">
          <div class="underline c-text-black text-primaryColor1 text-1.2rem leading-1.5rem mt-0.5rem">
            Create an account
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/api'
import { mapState, mapGetters } from 'vuex'
import { notify } from "@/utils/notify";

export default {
  name: "Login",
  data() {
    return {
      username: '',
      loging: false,
    }
  },
  computed: {
    ...mapState(['rsaKey', 'accountInfo']),
    ...mapGetters(['getPrivateKey'])
  },
  methods: {
    // 右上角提示信息框
    showNotify(message, duration, type) {
      notify({message, duration, type})
    },
    async login() {
      try{
        if (this.username.length < 3) {
          this.showNotify('Please enter twitter username')
          return;
        }
        this.loging = true
        const username = this.username.startsWith('@') ? this.username.substring(1) : this.username
        let account = await getUserInfo(username, this.rsaKey ? this.rsaKey.publicKey : null)
         
        if (account.errors && account.errors.length > 0) {
          console.log('Not exsit');
          this.showNotify('This twitter account is invalid, please check your input.', 5000, 'error')
        }else {
          this.$store.commit('saveAccountInfo', account)
          this.$router.push('/profile/' + this.username)
        }
      } catch (e) {
        console.log('Get twitter account fail:', e);
      } finally {
        this.loging = false
      }
    }
  },
}
</script>

<style scoped>

</style>
