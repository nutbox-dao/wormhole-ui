<template>
  <metainfo></metainfo>
  <el-config-provider :locale="elLocal[$i18n.locale]">
    <div id="app"
         ref="appRef"
         class="bg-primaryBg light:bg-white bg-img"
         :class="$route.name"
         @click="showMenu=false,showSearchList=false">
<!--      <HeaderV1 v-model="searchText"-->
<!--                :get-account-info="getAccountInfo"-->
<!--                :is-dark="isDark"-->
<!--                :profile-img="profileImg"-->
<!--                :show-search-list="showSearchList"-->
<!--                :vp="vp"-->
<!--                :rc="rc"-->
<!--                @showSearchList="showSearchList=true"-->
<!--                @gotoUser="gotoUser"-->
<!--                @setSelectTag="setSelectTag"-->
<!--                @login="login"-->
<!--                @createCuration="createCuration"-->
<!--                @onSelectLang="onSelectLang"-->
<!--                @changeTheme="changeTheme"-->
<!--                @signout="signout"-->
<!--                @gotoDC="gotoDC"-->
<!--                @gotoTwitter="gotoTwitter"></HeaderV1>-->
      <HeaderWeb @gotoCommunity="gotoCommunity" @setSelectTag="setSelectTag" @gotoUser="gotoUser" class="hidden 2md:flex"></HeaderWeb>
      <HeaderH5 v-if="$route.meta.header!=='hidden'" class="2md:hidden"></HeaderH5>
      <div class="flex-1 overflow-hidden flex">
        <SliderBar class="hidden 2md:flex h-full overflow-hidden"
                   :profile-img="profileImg"
                   @login="login"></SliderBar>
        <div class="flex-1 overflow-auto relative c-page-container">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name"/>
            </keep-alive>
            <component :is="Component" v-if="!$route.meta.keepAlive"/>
          </router-view>
        </div>
      </div>
      <BottomTabbar v-if="$route.meta.header!=='hidden'"
                    class="flex 2md:hidden"
                    @login="login"></BottomTabbar>
      <el-dialog class="c-img-dialog" v-model="modalVisible" :fullscreen="true" title="&nbsp;" :destroy-on-close="true">
        <NFTAnimation/>
      </el-dialog>

      <el-dialog :destroy-on-close="true" :model-value="showLogin"
                 :show-close="false"
                 :close-on-click-modal="true"
                 :before-close="beforeCloseLogin"
                 class="c-dialog c-dialog-center max-w-34rem bg-glass border-1 border-color84/30 rounded-1.6rem">
        <div class="relative min-h-20rem">
          <div class="w-max p-1rem ml-auto mr-0" @click="beforeCloseLogin">
            <i class="w-1.2rem h-1.2rem icon-close"></i>
          </div>
          <Login class="px-2rem pb-2rem" ref="loginRef" @close="$store.commit('saveShowLogin', false)"/>
          <div v-show="closeLoginTipVisible"
               class="absolute top-0 left-0 w-full h-full bg-primaryBg light:bg-white rounded-8px">
            <div class="w-full h-full flex flex-col justify-center px-2rem" :class="isDark?'bg-glass':'bg-white'">
              <div class="break-word c-text-black gradient-text bg-purple-white light:bg-text-color17
                          whitespace-pre-line text-1.4rem leading-2.3rem mx-auto mb-2rem">
                {{$t('signUpView.quitTip')}}
              </div>
              <div class="md:mt-2rem">
                <button class="c-text-black gradient-btn h-3.6rem w-full rounded-full
                      w-full mb-1rem text-1rem"
                        @click="closeLoginTipVisible=false">
                  {{$t('signUpView.cancel')}}
                </button>
                <button class="c-text-black bg-color84 light:bg-colorD6 light:text-white h-3.6rem w-full rounded-full
                      w-full text-1rem"
                        @click="closeLoginTipVisible=false, $store.commit('saveShowLogin', false)">
                  {{$t('signUpView.close')}}
                </button>
              </div>
            </div>
          </div>
        </div>
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
import { getTokenBalance, getLiquidationNft } from "@/utils/asset";
import NFTAnimation from "@/components/NFTAnimation";
import { logout, isTokenExpired } from './utils/account';
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import i18n from "@/lang";
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { getProfile, getCommon, getPrice, searchUsers, searchCommunityByName, searchTags, getUserVPRC, twitterLogin } from '@/api/api'
import Login from '@/views/Login.vue'
import { MAX_VP, VP_RECOVER_DAY, MAX_RC, RC_RECOVER_DAY } from './config';
import Cookie from 'vue-cookies'
import BottomTabbar from "@/components/layout/BottomTabbar";
import HeaderV1 from "@/components/layout/HeaderV1";
import HeaderH5 from "@/components/layout/HeaderH5";
import HeaderWeb from "@/components/layout/HeaderWeb";
import SliderBar from "@/components/layout/SliderBar";

export default {
  components: {NFTAnimation, ElConfigProvider, Login, BottomTabbar, HeaderV1, HeaderH5, HeaderWeb, SliderBar},
  data: () => {
    return {
      pubKey: '',
      showMenu: false,
      elLocal: {
        'zh': zhCn
      },
      isDark: false,
      closeLoginTipVisible: false,
      lang: localStorage.getItem('language'),
      searchText: '',
      searchList: [],
      showSearchList: false,
      seachTagList: [],
      searchComList: [],
      MAX_VP,
      MAX_RC
    }
  },
  computed: {
    ...mapState(['accountInfo', 'loginUsername', 'hasReceivedNft', 'showLogin', 'getCardVisible', 'referee', 'vpInfo', 'vp', 'rc', 'rcInfo']),
    ...mapState('postsModule', ['selectedTag']),
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
    setSelectTag(tag) {
      this.$router.push('/')
      this.$store.commit('postsModule/saveSelectedTag', tag)
    },
    beforeCloseLogin(done) {
      if(this.$refs.loginRef.authStep === 'login') this.$store.commit('saveShowLogin', false)
      else this.closeLoginTipVisible = true
    },
    login() {
      this.$store.commit('saveShowLogin', true)
    },
    async monitorPrices() {
      const [res, res2] = await Promise.all([getCommon(), getPrice()])
      let {prices, vestsToSteem} = res;
      this.$store.commit('saveVestsToSteem', vestsToSteem)
      prices = {
        ...prices,
        wmatic: prices.matic,
        wglmr: prices.glmr,
        wbnb: prices.bnb,
        dai: 1,
        usdt: 1,
        usdc: 1,
        busd: 1,
        't-usdt': 0,
        'test-u': 0,
        nuls: prices.NULS ?? prices.nuls,
        wnuls: prices.NULS ?? prices.nuls
      }

      if (res2 && res2.length > 0) {
        for (let p in res2) {
          const price = res2[p]
          if (price.address === '0x705931A83C9b22fB29985f28Aee3337Aa10EFE11') {
            prices['pnut'] = price.price
          }
        }
      }
      if (parseFloat(prices.eth) === 0) return;
      this.$store.commit('savePrices', prices)
    },
    gotoDC() {
      this.showMenu=false
      window.open('https://discord.gg/6QbcvSEDWF', '__blank')
    },
    gotoTwitter(){
      this.showMenu = false
      window.open('https://twitter.com/wormhole_3', '__blank')
    },
    gotoUser(user) {
      console.log(1, user);
      this.$router.push('/search-user/@' + user.twitterUsername)
    },
    gotoCommunity(community) {
      this.$router.push('/community-detail/' + community.communityId)
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
    onSelectLang() {
      // this.$refs.langRef.hide()
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
    createCuration() {
      this.$router.push('/create-curation')
      if (this.getAccountInfo && this.getAccountInfo.twitterId) {
        this.$router.push('/create-curation')
      }else {
        this.$store.commit('saveShowLogin', true)
      }
    },
    async onSearch(e) {
      if(this.searchText.trim().length > 0 && e.keyCode === 13) {
        const [users, communities, tags] = await Promise.all([searchUsers(this.searchText), searchCommunityByName(this.searchText), searchTags(this.searchText)])
          this.showSearchList = true
          this.searchList = []
          this.seachTagList = []
          this.searchComList = []
        if (users && users.length > 0) {
          this.searchList = users
        }
        if (tags && tags.length > 0) {
          this.seachTagList = tags
        }
        if (communities && communities.length > 0) {
          this.searchComList = communities
        }
      }
    }
  },
  async mounted() {
    await this.$router.isReady();
    const referee = this.$route.query.referee;
    if (referee) {
      this.$store.commit('saveReferee', referee);
    }
    let state = null
    let params = this.$route.fullPath
    for (let p of params.split('?')) {
      const [key, value] = p.split('=')
      if (key === 'state') {
        state = value
        break;
      }
    }
    let isIOS = navigator.userAgent.toUpperCase().indexOf('IPHONE') >= 0
    let isAndroid = navigator.userAgent.toUpperCase().indexOf('ANDROID') >= 0
    if (state && (isIOS || isAndroid)) {
      try {
        let userInfo = await twitterLogin(state)
        if (userInfo && userInfo.code === 1) {
          await sleep(10);
          userInfo = await twitterLogin(state)
        }
        if (userInfo.code === 0) {
          // not registry
          // store auth info
          console.log('not register')
          Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
          this.$store.commit('saveShowLogin', true);
        }else if (userInfo.code === 3) { // log in
          this.$store.commit('saveAccountInfo', userInfo.account)
        }
      }catch(e) {
        console.log('login fail:', e);
      }
    }

    this.isDark = !(localStorage.getItem('theme') === 'light')
    document.documentElement.className=this.isDark?'dark':'light'

    // to do
    // vestsToSteem(1).then(res => {
    //   this.$store.commit('saveVestsToSteem', res)
    // }).catch(e => {
    //   console.log('Get vest to steem fail:', e);
    // })

    if (this.getAccountInfo) {
      const { steemId, ethAddress, web25ETH, twitterUsername, twitterId } = this.getAccountInfo;

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
        getTokenBalance(ethAddress).catch();
      }

      getProfile(twitterId).then(res => {
        if (res && res.code === 3) {
          let account = res.account;
          this.$store.commit('saveAccountInfo', account)
          return;
        }
        logout();
      }).catch(e => {
        if (e === 401) {
          logout();
        }
        console.log('get profile fail:', e);
      })
    }

    // update curating power
    let c = 0;
    setInterval(async () => {
      if(this.getAccountInfo && this.getAccountInfo.twitterId) {
        if (c % 30 === 0 || !this.vpInfo.lastUpdateTime) {
          c = 0;
          const res = await getUserVPRC(this.getAccountInfo.twitterId);
          if (res && res.lastUpdateTime !== this.vpInfo.lastUpdateTime) {
            this.$store.commit('saveVpInfo', res)
          }
          if (res && res.lastUpdateRCTime !== this.rcInfo.lastUpdateRCTime) {
            this.$store.commit('saveRcInfo', res)
          }
        }
        // update vp
        let vp = parseFloat(this.vpInfo.votingPower + (Date.now() - this.vpInfo.lastUpdateTime) * MAX_VP / (86400000 * VP_RECOVER_DAY))
        this.$store.commit('saveVp', vp > MAX_VP ? MAX_VP : vp.toFixed(2));

        // update rc
        let rc = parseFloat(this.rcInfo.rc + (Date.now() - this.rcInfo.lastUpdateRCTime) * MAX_RC / (86400000 * RC_RECOVER_DAY));
        this.$store.commit('saveRc', rc > MAX_RC ? MAX_RC : rc.toFixed(2));
        c++;
      }else {
        c = 0;
      }
    }, 2000);

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
  font-family: RobotoRegular;
  src: url('~@/style/Roboto-Regular.ttf');
}
@font-face
{
  font-family: RobotoBold;
  src: url('~@/style/Roboto-Bold.ttf');
}

:root {
  --primary-bg: #0D1117;
  --primary-bg-light: #F7F7F9;
  --primary-custom: #AE88FE;
  --secondary-custom: #7851FF;
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
  font-family:RobotoRegular, Avenir, Helvetica, Arial, sans-serif;
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
  //&.bg-img {
  //  background-image: url("~@/assets/layout-bg.png");
  //  background-size: cover;
  //  background-position: center;
  //}
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
  transition: max-height 300ms;
  min-height: 0;
  max-height: 0;
  overflow: hidden;
  box-sizing: border-box;
  &.active {
    max-height: 1300px;
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
.search-bar {
  box-sizing: border-box;
  &::after {
    content: "";
    background: #848391;
    width: 1px;
    height: 8px;
    position: absolute;
    bottom: 0;
    right: 0;
    transform: rotate(135deg);
  }
}
.light .search-bar::after {
  background-color: #D8D8D8;
}
.search-bar > input {
  width: 28px;
  height: 28px;
  outline: none;
  transition: width 0.5s;
  border: 1px solid #848391;
}
.light .search-bar >input {
  border: 1px solid #D8D8D8;
}
.search-bar > input::placeholder {
  color: #D8D8D8;
  opacity: 0;
  transition: opacity 150ms ease-out;
  font-size: 12px;
}

.search-bar > input:focus::placeholder {
  opacity: 1;
}
.search-bar > input:focus,
.search-bar > input:not(:placeholder-shown) {
  width: 160px;
}
.word-cloud {
  background-image: linear-gradient(180deg, #7600E2 0%, #FCFCFF 57%)!important;
  .c-page-header {
    border-color: rgba(132, 131, 145, 0.3)!important;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    .black-filter {
      filter: brightness(0);
    }
  }
  .c-page-container {
    padding-top: 88px;
  }
}
.light .word-cloud{
  background-image: linear-gradient(180deg, #7600E2 0%, #FCFCFF 57%)!important;
}
.second-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
@media (max-width: 500px) {
  .search-bar > input:focus,
  .search-bar > input:not(:placeholder-shown) {
    width: 120px;
    max-width: 120px;
  }
}
</style>
