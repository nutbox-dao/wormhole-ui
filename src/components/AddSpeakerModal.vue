<template>
  <div class="text-left min-h-25rem">
    <div class="c-text-black mb-2rem">{{$t('curation.'+speakerType)}}</div>
    <div class="flex items-start">
      <img v-if="formData.avatar" class="w-5rem h-5rem rounded-2.5rem" :src="formData.avatar" alt="">
      <img v-else class="w-5rem h-5rem" src="~@/assets/icon-default-avatar.svg" alt="">
      <div class="flex-1 ml-1rem">
        <div class="bg-black border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex items-center relative">
          <input class="bg-transparent h-full w-full px-0.5rem"
                 v-model="formData.username"
                 @input="checkedUser = false;formData.avatar = null;formData.name = ''"
                 placeholder="@username">
          <button class="text-color62 c-text-black mx-10px whitespace-nowrap"
            @click="checkUser">{{$t('curation.verify')}}</button>
        </div>
        <div class="bg-black border-1 border-color8B/30 mt-8px
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex items-center relative">
          <input class="bg-transparent h-full w-full px-0.5rem"
                 v-model="formData.name"
                 placeholder="Title">
        </div>
      </div>
    </div>
    <button class="gradient-btn w-full h-3.6rem rounded-full mt-3rem"
            @click="$emit('confirm')">Confirm</button>
  </div>
</template>

<script>
import { getUserInfoByUserId } from '@/utils/twitter'
import { notify } from '@/utils/notify'

export default {
  name: "AddSpeakerModal",
  props: {
    speakerType: {
      type: String,
      default: 'host'
    },
  },
  data() {
    return {
      formData: {
        avatar: '',
        name: '',
        username: ''
      },
      isChecking: false,
      checkedUser: false
    }
  },
  methods: {
    async checkUser() {
      if (!this.formData.username) {
        return;
      }
      const usernameRex = '^@?[0-9a-zA-Z\_]+$'
      const match = this.formData.username.match(usernameRex)
      if (match) {
        try{
          this.isChecking = true
          const user = await getUserInfoByUserId(this.formData.username);
          console.log(253, user)
          if (user.data) {
            this.formData = {
              avatar: user.data.profile_image_url.replace('normal', '200x200'),
              name: user.data.name,
              username: user.data.username
            }
            this.checkedUser = true;
          }else {
            notify({message: this.$t('tips.userNotExist'), duration: 3000, type: 'info'})
          }
        } catch (e) {
          if (e === 'log out') {
            this.$route.replace('/square')
          }
        } finally {
          this.isChecking = false
        }
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
