<template>
  <div class="text-left min-h-25rem">
    <div class="c-text-black mb-2rem">{{$t('curation.'+speakerType)}}</div>
    <div class="flex items-start">
      <img class="w-5rem h-5rem" src="~@/assets/icon-default-avatar.svg" alt="">
      <div class="flex-1 ml-1rem">
        <div class="bg-black border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex items-center relative">
          <input class="bg-transparent h-full w-full px-0.5rem"
                 v-model="formData.name"
                 :disabled="loading"
                 placeholder="@username">
        </div>
        <div class="bg-black border-1 border-color8B/30 mt-8px
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex items-center relative">
          <input class="bg-transparent h-full w-full px-0.5rem"
                 v-model="formData.title"
                 :disabled="loading"
                 placeholder="Title">
        </div>
      </div>
    </div>
    <button class="gradient-btn w-full h-3.6rem rounded-full mt-3rem flex items-center justify-center"
            :disabled="loading"
            @click="$emit('confirm')">
      <span>Confirm</span>
      <c-spinner v-show="loading" class="w-1.5rem h-1.5rem ml-0.5rem"></c-spinner>
    </button>
  </div>
</template>

<script>
export default {
  name: "AddSpeakerModal",
  props: {
    speakerType: {
      type: String,
      default: 'host'
    },
    speakerData: {
      type: Object,
      default: () => {
        return {
          avatar: '',
          name: '',
          title: ''
        }
      }
    }
  },
  data() {
    return {
      formData: {
        avatar: '',
        name: '',
        title: ''
      },
      loading: true
    }
  },
  mounted() {
    this.formData = this.speakerData
  }
}
</script>

<style scoped>

</style>
