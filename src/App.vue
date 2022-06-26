<template>
  <div id="app" @click="showMenu=false">
    <div class="py-2.2rem">
      <div class="container mx-auto flex justify-between items-center px-0.75rem">
        <button @click="goBack">
          <img class="h-2.3rem" src="~@/assets/logo.png" alt="">
        </button>
        <div class="relative">
          <button class="bg-transparent w-2.4rem mr-0.5rem" @click.stop="showMenu=!showMenu">
            <span class="menu-icon" :class="showMenu?'active':''"></span>
          </button>
          <div class="menu-box w-13.5rem z-99"
               :class="showMenu?'active':''">
            <div class="gradient-border border-0.3rem rounded-30px w-full h-full flex flex-col justify-between c-text-black font-900 text-1.2rem">
              <router-link :to="'/account-info/'+accountInfo.twitterUsername" v-if="accountInfo && accountInfo.web25ETH" @click="showMenu=false"
                           class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Web3 ID</router-link>
              <router-link to="/faq" @click="showMenu=false"
                           class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">FAQs</router-link>
              <div class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">About Us</div>
              <div class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Discord</div>
              <router-link v-if="accountInfo && accountInfo.web25ETH" to="/" @click="showMenu=false"
                           class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Log out</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import { sleep } from '@/utils/helper'
import { mapState } from 'vuex'
import { getTwitterAccount } from '@/api/api'

export default {
  data: () => {
    return {
      pubKey: '',
      showMenu: false
    }
  },
  computed: {
    ...mapState(['accountInfo'])
  },
  methods: {
    async monitorPrices() {
      let res = await Promise.all([
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBETH'),
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=STEEMUSDT'),
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=UNIUSDT'),
      ])
      res = res.map(p => parseFloat(p.data.price))
      const prices = {
        eth: res[0],
        btc: res[1],
        bnb: res[2] * res[0],
        steem: res[3],
        uni: res[4],
        usdt: 1,
        usdc: 1,
        busd: 1
      }
      if (parseFloat(prices.eth) === 0) return;
      this.$store.commit('savePrices', prices)
    },
    goBack() {
      if (this.accountInfo && this.accountInfo.steemId) {
        this.$router.push('/profile/' + this.accountInfo.twitterUsername)
      }else {
        this.$router.push('/')
      }
    }
  },
  async mounted() {
    getTwitterAccount('terry3t1').then(res => {
      console.log(234, res);
    })
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
  font-family: MontserratRegular;
  src: url('~@/style/Montserrat-Regular.ttf');
}
@font-face
{
  font-family: MontserratMedium;
  src: url('~@/style/Montserrat-Medium.ttf');
}
@font-face
{
  font-family: MontserratBold;
  src: url('~@/style/Montserrat-Bold.ttf');
}
@font-face
{
  font-family: MontserratBlack;
  src: url('~@/style/Montserrat-Black.ttf');
}
:root {
  --primary-bg: #000;
  --primary-custom: #EEB134;
  --gradient-primary-color1: #EEB134;
  --gradient-primary-color2: #ED782F;
  --gradient-primary-color3: #FF1F00;
  --text8F: #8F8F8F;
  --textA6: #A6A6A6;
  --text53: #535353;
}
@import "style/responsive";
@import "style/common";
@import "style/el-custom";
html, body {
  background-color: black;
}
#app {
  font-family:MontserratRegular, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background-color: black;
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
  height: 4px;
  border-radius: 4px;
  background-color: #555555;
  position: relative;
  &::before {
    left: 0;
    top: -.7rem;
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background: #555555;
    content: "";
    display: inline-block;
    position: absolute;
    transition: all .2s;
  }
  &::after {
    left: 0;
    top: .7rem;
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background: #555555;
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
    }
    &::after {
      top: 0;
      transform: rotate(-45deg);
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
    height: 18.2rem;
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

</style>
