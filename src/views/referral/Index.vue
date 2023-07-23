<template>
  <div class="h-full overflow-hidden flex flex-col">
    <div class="border-b-0.5px border-color8B/30 light:border-colorD6
                bg-primaryBg light:bg-transparent z-9">
      <div class="container mx-auto max-w-600px xl:max-w-30rem px-15px relative
                  flex items-center justify-center gap-30px
                  2md:h-70px 2md:pt-23px 2md:h-48px 2md:pt-0 text-14px font-bold">
        <button class="w-full h-48px flex items-center justify-center px-15px"
                :class="tabIndex===0?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=0">
          {{$t('ref.myReferral')}}
        </button>
        <button class="w-full h-48px flex items-center justify-center px-15px"
                :class="tabIndex===1?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=1">
          {{$t('ref.myFriends')}}
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
export default {
  name: "Index",
  components: {InviteLink, InviterList},
  data() {
    return {
      tabIndex: 0
    }
  }
}
</script>

<style scoped>

</style>
