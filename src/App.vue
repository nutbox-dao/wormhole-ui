<template>
  <div id="app" @click="showMenu=false" :class="$route.name==='signup'?'signup-bg':''">
    <div class="py-1.8rem border-b-1" :class="$route.name==='signup'?'border-colorD8 sm:border-headerBorder':'border-headerBorder'">
      <div class="container max-w-50rem mx-auto flex justify-between items-center">
        <button @click="goBack">
          <img class="h-2.3rem" src="~@/assets/logo.png" alt="">
        </button>
        <div class="flex items-center">
            <template v-if="!getAccountInfo">
              <router-link to="/login"
                            class="font-10 mr-3">Sign In</router-link>
              <router-link to="/signup"
                            class="font-10 mr-3">Sign Up</router-link>
            </template>
          <template v-else>
            <router-link :to="`/profile/@${getAccountInfo.twitterUsername}/post`">
              <img class="h-2rem rounded-full" :src="getAccountInfo.profileImg" alt="">
            </router-link>
            <router-link :to="`/transaction/@${getAccountInfo.twitterUsername}`" v-slot="{isActive}">
              <img v-if="isActive" class="h-2rem mx-0.8rem" src="~@/assets/icon-notification-primary.svg" alt="">
              <img v-else class="h-2rem mx-0.8rem" src="~@/assets/icon-notification.svg" alt="">
            </router-link>
          </template>
          <div class="relative">
            <button class="bg-transparent h-2rem w-1.8rem mr-0.5rem flex items-center"
                    @click.stop="showMenu=!showMenu">
              <span class="menu-icon" :class="showMenu?'active':''"></span>
            </button>
            <div class="menu-box w-13.5rem z-99"
                 :class="showMenu?'active':''">
              <div class="p-0.5rem border-1 border-listBgBorder bg-blockBg rounded-12px w-full h-full flex flex-col justify-between font-900 text-1.2rem">
                <!-- <router-link :to="'/account-info/'+accountInfo.twitterUsername" v-if="accountInfo && accountInfo.ethAddress" @click="showMenu=false"
                             class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Web3 ID</router-link> -->
                <router-link to="/square" @click="showMenu=false"
                             class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Square</router-link>
                <router-link to="/faq" @click="showMenu=false"
                             class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">FAQs</router-link>
                <router-link to="/about" @click="showMenu=false"
                             class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">About us</router-link>
                <div class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Discord</div>
                <router-link v-if="getAccountInfo && getAccountInfo.twitterUsername" to="/signup" @click="showMenu=false"
                             class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Log out</router-link>
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

</template>

<script>
import axios from 'axios'
import { sleep } from '@/utils/helper'
import { mapState, mapGetters } from 'vuex'
import { getAccountInfo, getAccountRC, vestsToSteem, getSteemBalance } from '@/utils/steem'
import { getTokenBalance } from "@/utils/asset";
import NFTAnimation from "@/components/NFTAnimation";

export default {
  components: {NFTAnimation},
  data: () => {
    return {
      pubKey: '',
      showMenu: false,
      modalVisible: true
    }
  },
  computed: {
    ...mapState(['accountInfo', 'loginUsername']),
    ...mapGetters(['getAccountInfo'])
  },
  methods: {
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
        busd: 1
      }
      if (parseFloat(prices.eth) === 0) return;
      this.$store.commit('savePrices', prices)
    },
    goBack() {
      this.$router.push('/')
      // if (this.accountInfo && this.accountInfo.steemId) {
      //   this.$router.push('/profile/' + this.accountInfo.twitterUsername)
      // }else {
      //   this.$router.push('/')
      // }
    }
  },
  async mounted() {
    vestsToSteem(1).then(res => {
      this.$store.commit('saveVestsToSteem', res)
    }).catch(e => {
      console.log('Get vest to steem fail:', e);
    })

    if (this.getAccountInfo) {
      const { steemId, ethAddress, web25ETH } = this.getAccountInfo;

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
  --primary-bg: #191919;
  --primary-custom: #EEB134;
  --gradient-primary-color1: #EEB134;
  --gradient-primary-color2: #ED782F;
  --gradient-primary-color3: #FF1F00;
  --text8F: #8F8F8F;
  --textA6: #A6A6A6;
  --text53: #535353;
  --van-popup-background-color: transparent!important;
}
@import "style/responsive";
@import "style/common";
@import "style/el-custom";
html, body {
  background-color: black;
}
#app {
  font-family:PoppinsRegular, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background-color: var(--primary-bg);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
.menu-icon {
  display: inline-block;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background-color: rgba(white, 0.6);
  position: relative;
  &::before {
    left: 0;
    top: -.6rem;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    background: rgba(white, 0.6);
    content: "";
    display: inline-block;
    position: absolute;
    transition: all .2s;
  }
  &::after {
    left: 0;
    top: .6rem;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    background: rgba(white, 0.6);
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
.menu-box {
  position: absolute;
  right: 0;
  top: 3rem;
  transition: height 300ms;
  height: 0;
  overflow: hidden;
  box-sizing: border-box;
  &.active {
    height: 20rem;
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
@media (max-width: 640px) {
  .signup-bg {
    background-image: url("~@/assets/signup-bg.png");
    background-position: top;
  }
}
</style>
