<template>
  <el-config-provider :locale="elLocal[$i18n.locale]">
    <div id="app"
         class="bg-primaryBg light:bg-primaryBgLight"
         @click="showMenu=false" :class="$route.name==='signup'?'signup-bg':''">
      <div class="py-1rem border-b-1 border-headerBorder light:border-headerBorderLight">
        <div class="container max-w-50rem w-full mx-auto flex justify-between items-center px-15px">
          <button @click="goBack">
            <img class="h-1.7rem" src="~@/assets/logo.svg" alt="">
          </button>
          <div class="flex items-center">
            <div class="hidden md:flex" v-if="!getAccountInfo">
              <router-link to="/login"
                           class="flex justify-center items-center link-btn mr-3 text-0.8rem h-28px 2xl:h-1.4rem">{{$t('signIn')}}</router-link>
              <router-link to="/signup"
                           class="flex justify-center items-center link-btn mr-3 text-0.8rem h-28px 2xl:h-1.4rem">{{$t('signUp')}}</router-link>
            </div>
            <template v-else>
              <router-link :to="`/profile/@${getAccountInfo.twitterUsername}/post`">
                <img class="h-1.6rem w-1.6rem rounded-full mr-0.8rem" :src="profileImg" @error="replaceEmptyImg" alt="">
              </router-link>
              <router-link :to="`/transaction/@${getAccountInfo.twitterUsername}`" v-slot="{isActive}">
                <img v-if="isActive" class="h-1.6rem mr-0.8rem" src="~@/assets/icon-notification-primary.svg" alt="">
                <i v-else class="h-1.6rem w-1.6rem mr-0.8rem icon-notification"></i>
              </router-link>
            </template>
            <el-popover width="10.5rem" trigger="click" popper-class="c-popper c-popper-menu" ref="langRef">
              <template #reference>
                <i class="h-1.6rem w-1.6rem mr-0.8rem icon-language"></i>
              </template>
              <template #default>
                <div class="flex flex-col items-center border-1 border-listBgBorder bg-blockBg light:(bg-white border-0 shadow-popper-tip) rounded-12px py-0.5rem">
                  <div class="py-0.6rem cursor-pointer hover:text-primaryColor" @click="onSelectLang('en')">English</div>
                  <div class="py-0.6rem cursor-pointer hover:text-primaryColor" @click="onSelectLang('zh')">简体中文</div>
                </div>
              </template>
            </el-popover>
            <div class="relative">
              <button class="bg-transparent h-2rem w-1.6rem flex items-center"
                      @click.stop="showMenu=!showMenu">
                <span class="menu-icon" :class="showMenu?'active':''"></span>
              </button>
              <div class="menu-box w-13.5rem xl:w-11rem z-99"
                   :class="showMenu?'active shadow-popper-tip':''">
                <div class="p-0.5rem border-1 border-listBgBorder
                            bg-blockBg light:(bg-white border-0 shadow-popper-tip)
                            rounded-12px w-full h-full
                            flex flex-col justify-between
                            font-400 text-15px leading-24px xl:text-0.75rem">
                  <!-- <router-link :to="'/account-info/'+accountInfo.twitterUsername" v-if="accountInfo && accountInfo.ethAddress" @click="showMenu=false"
                               class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Web3 ID</router-link> -->
                  <template v-if="!getAccountInfo">
                    <router-link to="/login" @click="showMenu=false"
                                 class="md:hidden block flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('signIn')}}</router-link>
                    <router-link to="/signup" @click="showMenu=false"
                                 class="md:hidden block flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('signUp')}}</router-link>
                  </template>
                  <router-link to="/square" @click="showMenu=false"
                               class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('square')}}</router-link>
                  <router-link to="/curations" @click="showMenu=false"
                               class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('curations')}}</router-link>
                  <router-link to="/faq" @click="showMenu=false"
                               class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('faq')}}</router-link>
                  <router-link to="/about" @click="showMenu=false"
                               class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('aboutUs')}}</router-link>
                  <div @click="gotoDC" class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('discord')}}</div>
                  <div @click="gotoTwitter" class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('twitter')}}</div>
                  <!-- <router-link to="/faucet" @click="showMenu=false"
                               class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('faucet')}}</router-link> -->
                  <div @click="onCopy('https://alpha.wormhole3.io/#/signup/' + getAccountInfo.twitterId)"
                       v-if="getAccountInfo && getAccountInfo.twitterUsername"
                       class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('ref.referre')}}</div>
                  <router-link v-if="getAccountInfo && getAccountInfo.twitterUsername" to="/signup"
                               @click="showMenu=false"
                               class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">{{$t('logout')}}</router-link>
                  <div class="flex items-center border-1 gradient-border rounded-8px mx-1/8 overflow-hidden">
                    <div class="flex-1 flex items-center justify-center h-2rem p-0.4rem cursor-pointer"
                         :class="isDark?'gradient-bg gradient-bg-color3 text-white':''"
                         @click="changeTheme">Dark</div>
                    <div class="flex-1 flex items-center justify-center h-2rem p-0.4rem cursor-pointer"
                         :class="isDark?'':'gradient-bg gradient-bg-color3 text-white'"
                         @click="changeTheme">Light</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-auto">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name"/>
          </keep-alive>
          <component :is="Component" v-if="!$route.meta.keepAlive"/>
        </router-view>
      </div>
      <el-dialog custom-class="c-img-dialog" v-model="modalVisible" :fullscreen="true" title="&nbsp;">
        <NFTAnimation/>
      </el-dialog>
    </div>
  </el-config-provider>
</template>

<script>
import axios from 'axios'
import { sleep } from '@/utils/helper'
import { mapState, mapGetters } from 'vuex'
import { getAccountInfo, vestsToSteem, getSteemBalance } from '@/utils/steem'
import { onCopy } from "@/utils/tool";
import { getTokenBalance } from "@/utils/asset";
import NFTAnimation from "@/components/NFTAnimation";
import { login } from './utils/account';
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import i18n from "@/lang";
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  components: {NFTAnimation, ElConfigProvider},
  data: () => {
    return {
      pubKey: '',
      showMenu: false,
      elLocal: {
        'zh': zhCn
      },
      isDark: false
    }
  },
  computed: {
    ...mapState(['accountInfo', 'loginUsername', 'hasReceivedNft']),
    ...mapGetters(['getAccountInfo']),
    modalVisible() {
      return !this.hasReceivedNft
    },
    profileImg() {
      if (!this.getAccountInfo) return "";
      if (this.getAccountInfo.profileImg) {
        return this.getAccountInfo.profileImg.replace("normal", "400x400");
      } else {
        return (
          "https://profile-images.heywallet.com/" +
          this.getAccountInfo.twitterId
        );
      }
    },
  },
  methods: {
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    async monitorPrices() {
      let res = await Promise.all([
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBETH'),
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=STEEMUSDT'),
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=UNIUSDT'),
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT'),
      ])
      res = res.map(p => parseFloat(p.data.price))
      const prices = {
        eth: res[0],
        btc: res[1],
        bnb: res[2] * res[0],
        steem: res[3],
        uni: res[4],
        matic: res[5],
        usdt: 1,
        usdc: 1,
        busd: 1,
        't-usdt': 0
      }
      if (parseFloat(prices.eth) === 0) return;
      this.$store.commit('savePrices', prices)
    },
    gotoDC() {
      window.open('https://discord.gg/6QbcvSEDWF', '__blank')
    },
    gotoTwitter(){
      window.open('https://twitter.com/wormhole_3', '__blank')
    },
    goBack() {
      this.$router.push('/')
      // if (this.accountInfo && this.accountInfo.steemId) {
      //   this.$router.push('/profile/' + this.accountInfo.twitterUsername)
      // }else {
      //   this.$router.push('/')
      // }
    },
    onCopy,
    onSelectLang(lang) {
      this.$refs.langRef.hide()
      i18n.global.locale = lang
      localStorage.setItem('language', lang)
    },
    changeTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark?'dark':'light')
      document.documentElement.className=this.isDark?'dark':'light'
    }
  },
  async mounted() {
    this.isDark = !(localStorage.getItem('theme') === 'light')
    document.documentElement.className=this.isDark?'dark':'light'
    vestsToSteem(1).then(res => {
      this.$store.commit('saveVestsToSteem', res)
    }).catch(e => {
      console.log('Get vest to steem fail:', e);
    })

    if (this.getAccountInfo) {
      const { steemId, ethAddress, web25ETH, twitterUsername } = this.getAccountInfo;

      if (steemId) {
        // get steem balance
        getSteemBalance(steemId)
          .then((balance) => {
            this.$store.commit("saveSteemBalance", balance.steemBalance);
            this.$store.commit("saveSbdBalance", balance.sbdBalance);
          })
          .catch((err) => console.log("get steem balance fail:", err));
      } else {
        this.$store.commit("saveSteemBalance", 0);
      }

      //get eth balances
      if (ethAddress) {
        getTokenBalance(ethAddress);
      }

      login(twitterUsername)
    }


    while(true) {
      try{
        await this.monitorPrices()
      }catch(e) {
        console.log('get commen price fail:', e)
      }
      await sleep(15)
    }
  },
}
</script>

<style lang="scss">
@font-face
{
  font-family: PoppinsRegular;
  src: url('~@/style/Poppins-Regular.ttf');
}
@font-face
{
  font-family: PoppinsBold;
  src: url('~@/style/Poppins-Bold.ttf');
}

:root {
  --primary-bg: #0D1117;
  --primary-bg-light: #F7F7F9;
  --primary-custom: #AE88FE;
  --secondary-custom: #7C3AED;
  --gradient-primary-color1: #AE88FE;
  --gradient-primary-color2: #923CFF;
  --gradient-primary-color3: #00B2FF;
  --blockBg: #161B22;
  --color8B: #8B949E;
  --iconColor: #848391;
  --iconColorLight: #1A1E25;
  --outlineBtnBg: #1C1A50;
  --van-popup-background-color: transparent!important;
  --el-mask-color: rgba(0,0,0, 0.5) !important;
}
@import "style/icon";
@import "style/responsive";
@import "style/common";
.dark,html {
  background-color: var(--primary-bg);
}
.light,html {
  background-color: var(--primary-bg-light);
}
.light body {
  background-color: var(--primary-bg-light);
}

#app {
  font-family:PoppinsRegular, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
.light #app {
  color: #1A1E25;
}
.c-emoji {
  //font-family: "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
}
.c-input-emoji {
  //font-family: system-ui;
}
.menu-icon {
  display: inline-block;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background-color: var(--iconColor);
  position: relative;
  &::before {
    left: 0;
    top: -.5rem;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    background: var(--iconColor);
    content: "";
    display: inline-block;
    position: absolute;
    transition: all .2s;
  }
  &::after {
    left: 0;
    top: .5rem;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    background: var(--iconColor);
    content: "";
    display: inline-block;
    position: absolute;
    transition: all .2s;
  }
  &.active {
    height: 0;
    &::before{
      top: 0;
      transform: rotate(45deg);
      background-image:linear-gradient(to left, var(--gradient-primary-color1), var(--gradient-primary-color2));
    }
    &::after {
      top: 0;
      transform: rotate(-45deg);
      background-image:linear-gradient(to left, var(--gradient-primary-color1), var(--gradient-primary-color2));
    }
  }
}
.light .menu-icon {
  background: var(--iconColorLight);
  &::before {
    background: var(--iconColorLight);
  }
  &::after {
    background: var(--iconColorLight);
  }
  &.active {
    &::before{
      background-image:linear-gradient(to left, var(--gradient-primary-color1), var(--gradient-primary-color2));
    }
    &::after {
      background-image:linear-gradient(to left, var(--gradient-primary-color1), var(--gradient-primary-color2));
    }
  }
}
.menu-box {
  position: absolute;
  right: 0;
  top: 3rem;
  transition: height 300ms;
  height: 0;
  overflow: hidden;
  box-sizing: border-box;
  &.active {
    height: 260px;
  }
}
.link-btn {
  padding: 0 1rem;
  border-radius: 28px;
  font-weight: bold;
  border: 1px solid var(--primary-custom);
  color: var(--primary-custom);
  &:hover {
    background: linear-gradient(96.99deg, #AE88FE -31.47%, #923CFF 55.23%, #00B2FF 147.53%);
    border-color: transparent;
    color: white;
  }
  &.router-link-active {
    background: linear-gradient(96.99deg, #AE88FE -31.47%, #923CFF 55.23%, #00B2FF 147.53%);
    border-color: transparent;
    color: white;
  }
}
.light .link-btn {
  border: 1px solid #6246EA;
  color: #6246EA;
  &:hover {
    border-color: transparent;
    color: white;
  }
  &.router-link-active {
    border-color: transparent;
    color: white;
  }
}

.slide-in-blurred-top {
  animation: slide-in-blurred-top .6s cubic-bezier(.23,1,.32,1) both;
}
@keyframes slide-in-blurred-top{
  0%{
    filter:blur(40px);
    opacity:0;
    transform:translateY(-1000px) scaleY(2.5) scaleX(.2);
    transform-origin:50% 0
  }
  to{
    filter:blur(0);
    opacity:1;
    transform:translateY(0) scaleY(1) scaleX(1);
    transform-origin:50% 50%
  }
}
.fade-in {
  animation-name: FadeIn;
  animation-duration: 3s;
  transition-timing-function: linear;
}

@keyframes FadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.signup-bg {
  background-image: url("~@/assets/signup-bg-pc.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}
@media (min-width: 1280px) {
  .menu-box.active {
    height: 15rem;
  }
}
@media (min-width: 1440px) {
  .menu-icon {
    height: 0.14rem;
    &::before {
      height: 0.14rem;
    }
    &::after {
      height: 0.14rem;
    }
  }
}
</style>
