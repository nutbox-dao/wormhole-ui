<template>
  <div class="login-view">
    <div class="container max-w-425px mx-auto" :class="isLoginPage?'px-2rem':''">
      <div :class="isLoginPage?'mt-10vh':''">
        <div :class="isLoginPage?'sm:text-center text-left':'text-center'">
          <div class="c-text-black text-2rem max-w-30rem mx-auto leading-2.6rem">
            {{$t('signIn')}}
          </div>
        </div>
        <button @click="login" :disable="loging"
                class="c-text-black gradient-btn h-3.6rem w-full rounded-full text-1rem mt-1.25rem flex justify-center items-center">
          <span>{{$t('signIn')}}</span>
          <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="loging"></c-spinner>
        </button>

        <div class="c-text-black text-2rem max-w-30rem mx-auto leading-2.6rem">
          {{$t('signUp')}}
        </div>
        <router-link to="/signup">
          <div class="c-text-black gradient-btn h-3.6rem w-full rounded-full text-1rem mt-1.25rem flex justify-center items-center">
            {{$t('signInView.p3')}}
          </div>
        </router-link>
        or
        <button @click="refreshToken"
          class="c-text-black gradient-btn h-3.6rem w-full rounded-full text-1rem mt-1.25rem flex justify-center items-center">
          connect metamask
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FetchingStatus } from '@/utils/account'
import { mapState, mapGetters } from 'vuex'
import { notify } from "@/utils/notify";
import { sleep } from '@/utils/helper'
import { twitterLogin, twitterAuth, twitterRefreshAccessToken } from '@/api/api'
import Cookie from 'vue-cookies'
import { generateBrainKey, randomWallet } from '@/utils/ethers'

export default {
  name: "Login",
  data() {
    return {
      loging: false,
      showRegistering: false,
      showNotSendTwitter: false,
      isLoginPage: false
    }
  },
  mounted() {
    randomWallet()
    this.isLoginPage = (this.$route.name==='login')
    const code = this.$route.params.id;
    if (code) {
      Cookie.set('twitter-loginCode', code, '300s');
      window.close();
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
      try {
        this.loging = true
        const res = await twitterAuth();
        window.open(res, 'newwindow', 'height=600,width=600,top=0,left=0,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,status=no')
        let loginCode = Cookie.get('twitter-loginCode');
        let tryTimes = 0
        while((!loginCode || loginCode.length === 0) && tryTimes < 50) {
          await sleep(1);
          loginCode = Cookie.get('twitter-loginCode');
          tryTimes++;
        }
        Cookie.remove('twitter-loginCode')
        const userInfo = await twitterLogin(loginCode);
        if (userInfo.code === 0) {
          // not registry
        }else {
          this.$store.commit('saveAccountInfo', userInfo.account)
        }
      }catch(e) {

      }finally {
        this.loging = false
      }
      return;
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
          this.$store.commit('saveTransactions', [])
          this.$store.commit('saveTips', [])
          this.$store.commit('saveERC20Balances', {})
          this.$store.commit('saveStellarTreks', {})
          this.$router.push('/profile/' + this.username + '/post')
        }
      } catch (e) {
        this.showNotify('Server error', 5000, 'error')
        console.log('Get twitter account fail:', e);
      } finally {
        this.loging = false
        this.$store.commit('saveEthAddress', null)
      }
    },
    async refreshToken () {
      const acc = this.$store.getters.getAccountInfo;
      console.log(773, acc);
      const token = await twitterRefreshAccessToken(acc.twitterId);
      this.$store.commit('saveAccountInfo', {...acc, ...token})
    }
  },
}
</script>

<style scoped>

</style>
