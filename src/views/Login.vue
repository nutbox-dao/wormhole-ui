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
        <button @click="login"
                class="c-text-medium gradient-btn h-3.6rem w-full rounded-full text-1.6rem mt-1.25rem flex justify-center items-center">
          <span>Login</span>
          <c-spinner class="w-2.4rem h-2.4rem ml-1rem"></c-spinner>
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
      <Verify></Verify>
    </el-dialog>
  </div>
</template>

<script>
import { getTwitterAccount, getUserBindInfo } from '@/api/api'
import { mapState, mapGetters } from 'vuex'
import { openBox } from '@/utils/tweet-nacl'
import Verify from "@/views/Verify";
import {notify} from "@/utils/notify";

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
    showNotify() {
      notify({message: 'msg'})
    },
    async login() {
      try{
        this.loging = true
        const username = this.username.startsWith('@') ? this.username.substring(1) : this.username
        const account = await getTwitterAccount(username)
        if (account.errors && account.errors.length > 0) {
          console.log('Not exsit');
        }else {
          let bindInfo = await getUserBindInfo(account.data.id)
          bindInfo = JSON.parse(bindInfo)
          this.accountInfo = bindInfo
          if (bindInfo && Object.keys(bindInfo).length > 0) {
            console.log(76, bindInfo);
            if (this.rsaKey.publicKey === bindInfo.publicKey) {
              // show private key
              const privateKey = openBox(bindInfo.encryptedKey, this.getPrivateKey(bindInfo.publicKey))
              console.log('eth: ', bindInfo.ethAddress, privateKey);
            }else {
              // login directly
            }
          }else {
            // To public account page
          }
        }
      } catch (e) {
        console.log(3333, e);
      } finally {
        this.loging = false
      }
    }
  },
}
</script>

<style scoped>

</style>
