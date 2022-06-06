<template>
  <div class="login-view">
    <div class="container max-w-425px mx-auto lg:mt-6rem mt-20vh px-0.75rem">
      <div class="fade-in">
        <div class="gradient-text gradient-text-left c-text-black text-3.2rem max-w-30rem mx-auto mb-2.3rem leading-3.9rem">
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
    <!--    验证弹框-->
    <el-dialog v-model="verifyModalVisible" custom-class="c-dialog c-dialog-lg c-dialog-center">
      <Verify :ethAccount="accountInfo" @hide="savedKey"></Verify>
    </el-dialog>
  </div>
</template>

<script>
import { getTwitterAccount, getUserBindInfo, getRegisterOp } from '@/api/api'
import { mapState, mapGetters } from 'vuex'
import { openBox } from '@/utils/tweet-nacl'
import Verify from "@/views/Verify";
import { notify } from "@/utils/notify";
import { sleep } from '@/utils/helper'

export default {
  name: "Login",
  components: {Verify},
  data() {
    return {
      username: '',
      loging: false,
      accountInfo: null,
      verifyModalVisible: false
    }
  },
  computed: {
    ...mapState(['rsaKey']),
    ...mapGetters(['getPrivateKey'])
  },
  methods: {
    // 右上角提示信息框
    showNotify(message, duration, type) {
      notify({message, duration, type})
    },
    async savedKey() {
      this.verifyModalVisible = false
      // remove distribute key pairs

      // login to profile page
      await sleep(1)
      this.$router.push('/profile/@' + this.accountInfo.twitterUsername)
    },
    async login() {
      try{
        if (this.username.length < 3) {
          this.showNotify('Please enter twitter username')
          return;
        }
        this.loging = true
        const username = this.username.startsWith('@') ? this.username.substring(1) : this.username
        const account = await getTwitterAccount(username)
        if (account.errors && account.errors.length > 0) {
          console.log('Not exsit');
          this.showNotify('This twitter account is invalid, please check your input.', 5000, 'error')
        }else {
          let bindInfo;
          bindInfo = await getUserBindInfo(account.data.id)
          let retryTimes = 0
          if (this.rsaKey && !bindInfo) {
            let op = await getRegisterOp({twitterId: account.data.id, publicKey: this.rsaKey.publicKey})
            if (op && op.publicKey === this.rsaKey.publicKey){
              while (!bindInfo){
                if (retryTimes++ > 3) {
                  break;
                }
                await sleep(3)
                bindInfo = await getUserBindInfo(account.data.id)
              }
            }
          }
          bindInfo = JSON.parse(bindInfo)
          this.accountInfo = bindInfo
          if (bindInfo && Object.keys(bindInfo).length > 0) {
            this.$store.commit('saveAccountInfo', bindInfo)
            if (this.rsaKey.publicKey === bindInfo.publicKey) {
              // show private key
              const privateKey = openBox(bindInfo.encryptedKey, this.getPrivateKey(bindInfo.publicKey))
              if (privateKey) {
                this.verifyModalVisible = true
                this.accountInfo.privateKey = privateKey
                console.log('eth: ', bindInfo.ethAddress, '===', privateKey);
              }else {
                // login directly with eth address
                this.$router.push('/profile/' + this.username)
              }
            }else {
              // login directly with eth address
                this.$router.push('/profile/' + this.username)
            }
          }else {
            // login in without eth address
            this.$router.push('/profile/' + this.username)
          }
        }
      } catch (e) {
        console.log('Get twitter account from Twitter fail:', e);
      } finally {
        this.loging = false
      }
    }
  },
}
</script>

<style scoped>

</style>
