<template>
    <div>
      {{ info  }}
      <div class="c-text-black text-1.8rem mb-3rem min-h-1rem">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
    </div>
</template>

<script>
import Cookie from 'vue-cookies'
import { twitterLogin } from '@/api/api'

export default {
  name: "LoginCode",
  data() {
    return {
        info: ''
    }
  },
  async mounted () {
    const state = this.$route.query.state;
    
    if (state) {
        this.info = ''
        let userInfo = await twitterLogin(state)
        if (userInfo.code === 0) {
          // not registry
          // store auth info
          console.log('not register')
          this.info = 'Authorization succeeded, please register first.'
          Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '1800s')
          this.$store.commit('saveShowLogin', true);
          return;
        }else if (userInfo.code === 3) { // log in
          if (!userInfo.account.ethAddress)  {
            console.log('bond eth')
             this.info = 'Authorization succeeded, please register first.'
            Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '1800s')
            this.$store.commit('saveShowLogin', true);
            return
          }
          this.info = 'Login Success'
          this.$store.commit('saveAccountInfo', userInfo.account)
          this.$router.replace('/')
          return;
        }
    }else {
        // login fail
        // Cookie.set('twitter-loginCode', 'fail', '300s');
        window.close();
    };
    this.info = 'Login Success, please close this window'
  }
}
</script>

<style lang="scss" scoped>

</style>