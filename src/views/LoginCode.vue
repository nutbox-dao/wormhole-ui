<template>
    <div>
        {{info}}
    </div>
</template>

<script>
import Cookie from 'vue-cookies'
import { twitterLogin, twitterAuth } from '@/api/api'

export default {
  name: "LoginCode",
  data() {
    return {
        info: ''
    }
  },
  async mounted () {
    const code = this.$route.query.code;
    window.close();
    
    if (code) {
        // this.info = 'Login Success'
        // const userInfo = await twitterLogin(code)
        // console.log(35, userInfo)
        // if (userInfo.code === 0) {
        //   // not registry
        //   // store auth info
        //   console.log('not register')
        //   Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
        //   return;
        // }else if (userInfo.code === 3) { // log in
        //   this.$store.commit('saveAccountInfo', userInfo.account)
        //   this.$router.replace('/')
        //   return;
        // }
    }else {
        // login fail
        // Cookie.set('twitter-loginCode', 'fail', '300s');
    };
    this.info = 'Login Success, please close this window'
  },
  beforeDestroy () {
    if (this.info.length === 0) {
      // Cookie.set('twitter-loginCode', 'fail', '300s');
    }
  },
}
</script>

<style lang="scss" scoped>

</style>