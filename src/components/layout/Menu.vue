<template>
  <div class="relative">
    <button class="bg-transparent h-2rem w-1.6rem flex items-center"
            @click.stop="showMenu=!showMenu">
      <img class="w-17px h-17px xl:h-1.2rem xl:w-1.2rem black-filter "
           src="~@/assets/icon-menu-toggle.svg" alt="">
    </button>
    <div class="menu-box w-150px 2xl:w-10rem z-9999" ref="menuBox"
         :class="showMenu?'active shadow-popper-tip':''">
      <div class="px-12px py-8px border-1 border-listBgBorder
                            bg-blockBg light:bg-white light:border-0 light:shadow-popper-tip
                            rounded-12px w-full h-full
                            flex flex-col justify-between
                            font-400 text-12px  xl:text-0.75rem">
        <!--                  <router-link :to="'/account-info/'+accountInfo.twitterUsername" v-if="accountInfo && accountInfo.ethAddress" @click.stop="showMenu=false"-->
        <!--                               class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Web3 ID</router-link>-->
        <router-link to="/faq" @click.stop="showMenu=false"
                     class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
          <span>{{$t('faq')}}</span>
          <i class="w-14px min-w-14px h-14px icon-faq"></i>
        </router-link>
        <router-link to="/userguide" @click.stop="showMenu=false"
                     class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
          <span>{{$t('userguide')}}</span>
          <i class="w-14px min-w-14px h-14px icon-userguide"></i>
        </router-link>

        <div @click="showMenu=false,onCopy('https://alpha.wormhole3.io/square?referee=' + getAccountInfo.twitterId)"
             v-if="getAccountInfo && getAccountInfo.twitterUsername"
             class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
          <span>{{$t('ref.referre')}}</span>
          <i class="w-14px min-w-14px h-14px icon-referral"></i>
        </div>
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
             class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor"
             @click="signout">
          <span>{{$t('logout')}}</span>
          <i class="w-14px min-w-14px h-14px icon-logout"></i>
        </div>
        <div class="flex items-center">
          <button class="h-24px w-24px mr-20px" @click="gotoDC">
            <img class="w-14px min-w-14px h-14px" src="~@/assets/icon-discord.svg" alt="">
          </button>
          <button class="h-24px w-24px" @click="gotoTwitter">
            <img class="w-14px min-w-14px h-14px" src="~@/assets/icon-twitter.svg" alt="">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useClickAway} from "@vant/use";
import {ref} from "vue";
import {mapGetters} from "vuex";
import {onCopy} from "@/utils/tool";
import i18n from "@/lang";
import {logout} from "@/utils/account";

export default {
  name: "Menu",
  setup() {
    const menuBox = ref();
    const showMenu = ref(false);
    useClickAway(menuBox, () => {
      showMenu.value = false
    });
    return {
      showMenu,
      menuBox
    };
  },
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
      this.showMenu = false
    },
    changeTheme() {
      this.showMenu = false
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark?'dark':'light')
      document.documentElement.className=this.isDark?'dark':'light'
    },
    signout() {
      logout(this.getAccountInfo.twitterId).then(res => {
      });
      this.showMenu = false
      if (this.$route.meta.gotoHome) {
        this.$router.replace('/')
      }
    },
    gotoDC() {
      this.showMenu=false
      window.open('https://discord.gg/6QbcvSEDWF', '__blank')
    },
    gotoTwitter(){
      this.showMenu = false
      window.open('https://twitter.com/wormhole_3', '__blank')
    },
  }
}
</script>

<style scoped>

</style>
