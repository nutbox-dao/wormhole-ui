<template>
  <div class="login-view">
    <div class="container max-w-425px mx-auto" :class="isLoginPage?'px-2rem':''">
      <div :class="isLoginPage?'mt-10vh':''">
        <div :class="isLoginPage?'sm:text-center text-left':'text-center'">
          <div class="c-text-black text-2rem max-w-30rem mx-auto leading-2.6rem">
            Sign in
          </div>
          <div class="text-0.9rem text-text8F leading-1.2rem mt-0.5rem mb-1.5rem">
            Please enter your twitter username.
          </div>
        </div>
        <div>
          <input class="bg-colorDD/20 h-3.6rem w-full rounded-full text-black px-1.6rem outline-none text-1.2rem text-textA6"
                 type="text" placeholder="@Hello_web3" v-model="username">
        </div>
        <button @click="login" :disable="loging || username.length < 3"
                class="c-text-black bg-primaryColor h-3.6rem w-full rounded-full text-1rem mt-1.25rem flex justify-center items-center">
          <span>Sign in</span>
          <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="loging"></c-spinner>
        </button>
        <div class="text-0.9rem font-bold mt-1.5rem">
          Haven't signed up yet ?
        </div>
        <router-link to="/signup">
          <div class="underline c-text-black text-0.9rem leading-1.5rem mt-0.5rem">
            Create an account
          </div>
        </router-link>
      </div>
    </div>
    <el-dialog v-model="showRegistering" custom-class="c-dialog c-dialog-lg c-dialog-center">
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        Your account is in the process of registration<br>
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
import { login, FetchingStatus } from '@/utils/account'
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
      showNotSendTwitter: false,
      isLoginPage: false
    }
  },
  mounted() {
    this.isLoginPage = (this.$route.name==='login')
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
        let result = await login(username, this.ethAddress, async (status) => {
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
          this.$store.commit('savePosts', [])
          this.$router.push('/profile/' + this.username + '/post')
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
