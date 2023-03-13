<template>
    <div>

    </div>
</template>

<script>
export default {
    name: 'Refresh search user view',
    setup () {
        
    },
    mounted () {
        const twitterUsername = this.$route.params.user.startsWith("@")
      ? this.$route.params.user.substring(1)
      : this.$route.params.user;
      this.$router.replace('/account-info/@' + twitterUsername)
    },
}
</script>

<style lang="scss" scoped>

</style>