<template>
  <div class="christmas-page">
    <div class="relative h-full w-full">
      <img class="bg-light" src="~@/assets/christmas/light.png" alt="">
      <div class="tree-box">
        <img class="tree-img w-full h-full" src="~@/assets/christmas/web-tree.gif" alt="">
        <div class="star-img-box">
          <img class="star-img" src="~@/assets/christmas/star.png" alt="">
          <div class="star-light"></div>
        </div>
        <div class="ball-box absolute top-0 left-0 right-0 bottom-0">
          <div class="relative w-full h-full">
            <img class="ball" src="~@/assets/christmas/ball1.gif" alt="">
            <img class="ball" src="~@/assets/christmas/ball2.gif" alt="">
            <img class="ball" src="~@/assets/christmas/ball3.gif" alt="">
            <img class="ball" src="~@/assets/christmas/ball4.gif" alt="">
            <img class="ball" src="~@/assets/christmas/ball5.gif" alt="">
            <img class="ball" src="~@/assets/christmas/ball6.gif" alt="">
            <img class="ball" src="~@/assets/christmas/ball7.gif" alt="">
            <img class="ball" src="~@/assets/christmas/ball8.gif" alt="">
            <img class="ball" src="~@/assets/christmas/ball9.gif" alt="">
            <img class="ball" src="~@/assets/christmas/ball10.gif" alt="">
          </div>
        </div>
      </div>
      <div class="snowflake" v-for="i of 50" :key="i"></div>
    </div>
<!--    <audio src="//katiebaca.com/codepen/merry-christmas-mr-lawrence.mp3" autoplay loop></audio>-->
  </div>
</template>

<script>
export default {
  name: "ChristmasEvent",
  methods: {

  }
}
</script>

<style scoped lang="scss">
.christmas-page {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #c63322;
  .bg-light {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .tree-box {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .star-img-box {
    position: absolute;
    top: 8.5%;
    left: 48.7%;
    transform: translateX(-48.7%);
    width: 9%;
    filter: drop-shadow(0 0 20px #ffb800);
  }
  .ball {
    position: absolute;
    width: 4.8%;

    &:nth-child(1) {
      top:61%;
      left: 58.2%;
    }
    &:nth-child(2) {
      top:64.6%;
      left: 53.6%;
    }
    &:nth-child(3) {
      top:66.2%;
      left: 48.7%;
    }
    &:nth-child(4) {
      top:67.3%;
      left: 43.5%;
    }
    &:nth-child(5) {
      top:68.7%;
      left: 38.4%;
    }
    &:nth-child(6) {
      top:53.2%;
      left: 39.4%;
    }
    &:nth-child(7) {
      top:53.5%;
      left: 44.7%;
    }
    &:nth-child(8) {
      top:52.3%;
      left: 50.1%;
    }
    &:nth-child(9) {
      top:49.3%;
      left: 54.5%;
    }
    &:nth-child(10) {
      top:42.3%;
      left: 43.9%;
    }
  }
}
.snowflake {
  --size: 1vw;
  width: var(--size);
  height: var(--size);
  background: white;
  border-radius: 50%;
  position: absolute;
  top: -5vh;
}

@keyframes snowfall {
  0% {
    transform: translate3d(var(--left-ini), 0, 0);
  }
  100% {
    transform: translate3d(var(--left-end), 110vh, 0);
  }
}

@for $i from 1 through 40 {
  .snowflake:nth-child(#{$i}) {
    --size: #{random(5) * 0.2}vw;
    --left-ini: #{random(20) - 10}vw;
    --left-end: #{random(20) - 10}vw;
    left: #{random(100)}vw;
    animation: snowfall #{5 + random(10)}s linear infinite;
    animation-delay: -#{random(10)}s;
  }
}

@for $i from 40 through 50 {
  .snowflake:nth-child(#{$i}) {
    --size: #{random(10) * 0.2}vw;
    --left-ini: #{random(20) - 10}vw;
    --left-end: #{random(20) - 10}vw;
    left: #{random(100)}vw;
    animation: snowfall #{5 + random(10)}s linear infinite;
    animation-delay: -#{random(10)}s;
  }
}
.snowflake {
  box-shadow: 0 0 4px 2px #FFFFFF;
  //filter: drop-shadow(0 0 10px white);
}
.snowflake:nth-child(3n) {
  filter: blur(2px);
}

</style>
