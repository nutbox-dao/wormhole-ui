<template>
  <div class="md:max-w-30rem mx-auto relative">
    <img src="~@/assets/nft.png" alt="">
    <div class="absolute w-4/5 h-25/40 top-21/100 left-0">
      <div class="flex items-center justify-center mt-2rem md:mt-1.5rem nft-text">
        <img class="w-20px md:w-1.2rem" src="~@/assets/icon-twitter-nft.svg" alt="">
        <span class="c-text-bold text-16px md:text-0.9rem">@{{username}}</span>
      </div>
    </div>
    <div class="absolute w-4/5 h-25/40 top-21/100 left-0 flex items-center justify-center">
      <div class="number c-text-black text-4rem xl:text-78px" :data-text="prefixInteger(reputation, 6)">{{prefixInteger(reputation, 6)}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GetNft",
  props: {
    username: {
      type: String,
      default: ''
    },
    reputation: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showAnimation: true,
      id: '007213'
    }
  },
  methods: {
    prefixInteger(num, length) {
      return num.toString().padStart(length, '0')
    }
  },
}
</script>

<style scoped lang="scss">
.nft-text {
  color: #CBBEE7;
}
.number {
  width: fit-content;
  padding-right: 10px;
  font-style: italic;
  letter-spacing: 0.5px;
  background: linear-gradient(97.37deg, #D4B8F9 -4.1%, #BE6CFF 52.46%, #71A1FF 106.51%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  text-fill-color: transparent;
  color: #fff;
  position: relative;
  &::after {
    content: attr(data-text);
    left: 0;
    position: absolute;
    text-shadow: 0px -1px white;
    top: 0;
    z-index: -1;
  }
}
</style>
