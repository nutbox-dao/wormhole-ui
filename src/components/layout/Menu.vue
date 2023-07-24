<template>
  <div class="relative">
    <el-popover popper-class="c-popper" ref="menuBox" :placement="'auto-start'" trigger="click" :teleported="false"
                @show="$emit('show', true)" @hide="$emit('show', false)">
      <template #reference>
        <slot name="menu-toggle">
          <button class="bg-transparent h-2rem flex items-center">
            <img class="w-17px h-17px xl:h-1.2rem xl:w-1.2rem filter light:invert-100"
                 src="~@/assets/icon-menu-toggle.svg" alt="">
          </button>
        </slot>
      </template>
      <div class="w-150px 2xl:w-10rem">
        <div class="px-12px py-8px border-1 border-listBgBorder
                    bg-blockBg light:bg-white light:border-0 light:shadow-popper-tip
                    rounded-12px w-full h-full flex flex-col justify-between
                    font-400 text-12px  xl:text-0.75rem">
          <router-link to="/faq" @click.stop="$refs.menuBox.hide()"
                       class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
            <span>{{$t('faq')}}</span>
            <i class="w-14px min-w-14px h-14px icon-faq"></i>
          </router-link>
          <router-link to="/userguide" @click.stop="$refs.menuBox.hide()"
                       class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
            <span>{{$t('userguide')}}</span>
            <i class="w-14px min-w-14px h-14px icon-userguide"></i>
          </router-link>

          <router-link v-if="getAccountInfo && getAccountInfo.twitterUsername"
                       to="/referral" @click.stop="$refs.menuBox.hide()"
                       class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
            <span>{{$t('ref.referre')}}</span>
            <i class="w-14px min-w-14px h-14px icon-referral"></i>
          </router-link>

<!--          <div @click="$refs.menuBox.hide(),onCopy('https://alpha.wormhole3.io/square?referee=' + getAccountInfo.twitterId)"-->
<!--               v-if="getAccountInfo && getAccountInfo.twitterUsername"-->
<!--               class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">-->
<!--            <span>{{$t('ref.referre')}}</span>-->
<!--            <i class="w-14px min-w-14px h-14px icon-referral"></i>-->
<!--          </div>-->
          <router-link to="/word-cloud" @click.stop="$refs.menuBox.hide()"
                       class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
            <span>{{$t('wordcloud')}}</span>
            <i class="w-14px min-w-14px h-14px icon-word-cloud"></i>
          </router-link>
          <div class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor"
               @click="changeTheme">
            <span>{{isDark?'Light Mode':'Dark Mode'}}</span>
            <i v-if="isDark" class="w-16px min-w-16px h-16px icon-theme-light"></i>
            <i v-else class="w-14px min-w-14px h-14px icon-theme-dark"></i>
          </div>
          <button class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor"
                  @click="onSelectLang">
            <span>CN / EN</span>
            <i class="w-14px min-w-14px h-14px icon-exchange"></i>
          </button>
          <div v-if="getAccountInfo && getAccountInfo.twitterUsername"
               class="2md:hidden h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor"
               @click="signout">
            <span>{{$t('logout')}}</span>
            <i class="w-14px min-w-14px h-14px icon-logout"></i>
          </div>
          <div class="2md:hidden flex items-center gap-15px">
            <button class="h-24px w-24px bg-color8B light:bg-blueDark rounded-full
                           flex items-center justify-center"
                    @click="gotoDC">
              <img class="w-14px min-w-14px h-14px" src="~@/assets/icon-discord.svg" alt="">
            </button>
            <button class="h-24px w-24px bg-color8B light:bg-blueDark rounded-full
                           flex items-center justify-center"
                    @click="gotoTwitter">
              <img class="w-14px min-w-14px h-14px" src="~@/assets/icon-twitter-white.svg" alt="">
            </button>
          </div>
        </div>
      </div>

    </el-popover>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {onCopy} from "@/utils/tool";
import i18n from "@/lang";
import {logout} from "@/utils/account";

export default {
  name: "Menu",
  computed: {
    ...mapGetters(['getAccountInfo']),
  },
  data() {
    return {
      isDark: false,
      lang: localStorage.getItem('language'),
    }
  },
  mounted() {
    this.isDark = !(localStorage.getItem('theme') === 'light')
    document.documentElement.className=this.isDark?'dark':'light'
  },
  methods: {
    onCopy,
    onSelectLang() {
      this.lang = this.lang === 'en'? 'zh':'en'
      i18n.global.locale = this.lang
      localStorage.setItem('language', this.lang)
      this.$refs.menuBox.hide()
    },
    changeTheme() {
      this.$refs.menuBox.hide()
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark?'dark':'light')
      document.documentElement.className=this.isDark?'dark':'light'
    },
    signout() {
      this.$refs.menuBox.hide()
      logout(this.getAccountInfo.twitterId).then(res => {
      });
      if (this.$route.meta.gotoHome) {
        this.$router.replace('/')
      }
    },
    gotoDC() {
      this.$refs.menuBox.hide()
      window.open('https://discord.gg/6QbcvSEDWF', '__blank')
    },
    gotoTwitter(){
      this.$refs.menuBox.hide()
      window.open('https://twitter.com/wormhole_3', '__blank')
    },
  }
}
</script>

<style scoped>

</style>
