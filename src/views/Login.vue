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
    <el-dialog v-model="showRegistering" custom-class="c-dialog c-dialog-lg c-dialog-center">
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        Your account is being registered <br>
        Please wait for a moment<br>
        <div class="mx-auto">
          <img src="~@/assets/loading.gif" alt="" class="w-25 mx-auto mt-2rem">
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="showNotSendTwitter" custom-class="c-dialog c-dialog-lg c-dialog-center">
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        You havn't send twitter yet
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, FetchingStatus } from '@/utils/account'
import { mapState, mapGetters } from 'vuex'
import { notify } from "@/utils/notify";
import { sleep } from '@/utils/helper'

export default {
  name: "Login",
  data() {
    return {
      username: '',
      loging: false,
      showRegistering: false,
      showNotSendTwitter: false
    }
  },
  computed: {
    ...mapState(['ethAddress', 'accountInfo']),
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
        let result = await getUserInfo(username, this.ethAddress, async (status) => {
          if (status === FetchingStatus.MATCH_TICKETS) {
          } else if(status === FetchingStatus.REGISTERING) {
            this.showRegistering = true
          } else if(status === FetchingStatus.NOT_SEND_TWITTER) {
            this.showNotSendTwitter = true
          }
        })
         
        if (!result) {
          console.log('Not exsit');
          this.showNotify('This twitter account is not binded.', 5000, 'error')
          await sleep(5)
          this.showNotSendTwitter = false
          this.showRegistering = false
        }else {
          this.$router.push('/profile/' + this.username)
        }
      } catch (e) {
        this.showNotify('Server error', 5000, 'error')
        console.log('Get twitter account fail:', e);
      } finally {
        this.loging = false
        this.$store.commit('saveEthAddress', null)
      }
    }
  },
}
</script>

<style scoped>

</style>
