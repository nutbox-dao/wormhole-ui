<template>
  <div class="h-full overflow-hidden flex flex-col">
    <div class="border-b-0.5px border-color8B/30 light:border-colorD6
                bg-primaryBg light:bg-transparent z-9">
      <div class="container mx-auto max-w-600px xl:max-w-30rem px-15px relative
                  flex items-center justify-center gap-30px h-70px pt-23px 2md:h-48px 2md:pt-0 text-14px font-bold">
        <button @click="$router.go(-1)"
                class="absolute left-15px 2md:hidden">
          <i class="icon-back w-20px h-20px"></i>
        </button>
        <button class="w-full h-48px flex items-center justify-center px-15px"
                :class="tabIndex===0?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=0">
          {{$t('ref.myReferral')}}
        </button>
        <button class="w-full h-48px flex items-center justify-center px-15px"
                :class="tabIndex===1?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=1">
          {{$t('ref.myFriends')}}({{ inviteesCount }})
        </button>
      </div>
    </div>
    <div class="flex-1 overflow-auto no-scroll-bar lg:px-15px">
      <InviteLink v-show="tabIndex===0"></InviteLink>
      <InviterList v-show="tabIndex===1"></InviterList>
    </div>
  </div>
</template>

<script>
import InviteLink from "@/views/referral/InviteLink";
import InviterList from "@/views/referral/InviterList";
import { getInvitorsCountOfUser } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  name: "Index",
  components: {InviteLink, InviterList},
  data() {
    return {
      tabIndex: 0,
      inviteesCount: 0
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo'])
  },
  mounted () {
    if (this.getAccountInfo?.twitterId) {
      getInvitorsCountOfUser(this.getAccountInfo.twitterId).then(count => {
        this.inviteesCount = count
      }).catch()
    }else {
      this.$router.replace('/')
    }
  },
}
</script>

<style scoped>

</style>
