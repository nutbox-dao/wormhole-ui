<template>
    <div>
        {{info}}
    </div>
</template>

<script>
import Cookie from 'vue-cookies'

export default {
  name: "LoginCode",
  data() {
    return {
        info: ''
    }
  },
  mounted () {
    const code = this.$route.params.code;
    console.log(325, this.$route.params);
    if (code) {
        this.info = 'Login Success'
      Cookie.set('twitter-loginCode', code, '300s');
      window.close();
    };
    this.info = 'Wrong login code'
  },
}
</script>

<style lang="scss" scoped>

</style>