<template>
    <div>
        <button
         class="h-26px bg-color8B light:bg-blueDark rounded-full flex items-center justify-between"
          @click="changeLang">
          <span class="text-18px h-26px px-8px flex items-center" :class="lang === 'en' ? 'bg-color62 rounded-full' : ''">
            EN
          </span>
          <span class="text-18px h-26px px-8px flex items-center" :class="lang === 'zh' ? 'bg-color62 rounded-full' : ''">
            CH
          </span>
        </button>
    </div>
</template>

<script>
import i18n from "@/lang";

export default {
    data() {
       return {
        lang: localStorage.getItem('language'),
       }
    },
    methods: {
        changeLang() {
            this.lang = this.lang === 'en'? 'zh':'en'
            i18n.global.locale = this.lang
            localStorage.setItem('language', this.lang)
        }
    },
}
</script>

<style lang="scss" scoped>

</style>