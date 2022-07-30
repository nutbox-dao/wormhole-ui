<template>
  <div class="relative h-full">
    <div class="confetti absolute top-0 w-full h-full">
      <div class="confetti-piece" v-for="i of 50" :key="i"></div>
    </div>
    <div class="pyro absolute w-full z-0">
      <div class="before"></div>
      <div class="after"></div>
    </div>
    <div class="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center z-2">
      <div class="w-8rem h-10rem bg-blockBg rounded-1rem nft-card mb-8rem">NFT</div>
      <button class="gradient-btn c-text-bold h-2.5rem w-8rem rounded-full get-btn"
              @click="getNft">GET</button>
    </div>
  </div>
</template>

<script>
import { readNft } from '@/api/api'

export default {
  name: "NFTAnimation",
  methods: {
      getNft(){
        // read NFT
        console.log(111, this.$store.getters.getAccountInfo.twitterId);
        readNft(this.$store.getters.getAccountInfo.twitterId)
        this.$store.commit('saveHasReceivedNft', true)
      
    }
  },
}
</script>

<style scoped lang="scss">
$yellow: #ffd300;
$blue: #17d3ff;
$pink: #ff4e91;

$duration: 1000;

@function randomNum($min, $max) {
  $rand: random();
  $randomNum: $min + floor($rand * (($max - $min) + 1));

  @return $randomNum;
}

.icon {
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 32px;
  position: relative;
}

.confetti {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 16px;
  background: $yellow;
  top: 0;
  opacity: 0;

  @for $i from 1 through 50 {
    &:nth-child(#{$i}) {
      left: $i * 7%;
      transform: rotate(#{randomNum(-80, 80)}deg);
      animation: makeItRain $duration * 1ms infinite ease-out;
      animation-delay: #{randomNum(0, $duration * 0.5)}ms;
      animation-duration: #{randomNum($duration * 0.7, $duration * 1.2)}ms;
    }
  }

  &:nth-child(odd) {
    background: $blue;
  }

  &:nth-child(even) {
    z-index: 1;
  }

  &:nth-child(4n) {
    width: 5px;
    height: 12px;
    animation-duration: $duration * 2ms;
  }

  &:nth-child(3n) {
    width: 3px;
    height: 10px;
    animation-duration: $duration * 2.5ms;
    animation-delay: $duration * 1ms;
  }

  &:nth-child(4n-7) {
    background: $pink;
  }
}

@keyframes makeItRain {
  from {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  to {
    transform: translateY(50vh);
  }
}

$particles: 120;
$width: 800;
$height: 800;
$box-shadow: ();
$box-shadow2: ();
@for $i from 0 through $particles {
  $box-shadow: $box-shadow,
  random($width)-$width / 2 + px
  random($height)-$height / 1.2 + px
  hsl(random(360), 100, 50);
  $box-shadow2: $box-shadow2, 0 0 #fff;
}

@mixin animation-delay ($settings) {
  -moz-animation-delay: $settings;
  -webkit-animation-delay: $settings;
  -o-animation-delay: $settings;
  -ms-animation-delay: $settings;
  animation-delay: $settings;
}

@mixin animation-duration ($settings) {
  -moz-animation-duration: $settings;
  -webkit-animation-duration: $settings;
  -o-animation-duration: $settings;
  -ms-animation-duration: $settings;
  animation-duration: $settings;
}

@mixin animation ($settings) {
  -moz-animation: $settings;
  -webkit-animation: $settings;
  -o-animation: $settings;
  -ms-animation: $settings;
  animation: $settings;
}

.pyro > .before, .pyro > .after {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  @include animation((1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards));
}

.pyro > .after {
  @include animation-delay((1.25s, 1.25s, 1.25s));
  @include animation-duration((1.25s, 1.25s, 6.25s));
}

@keyframes bang{
  to {
    box-shadow:$box-shadow;
  }
}

@keyframes gravity {
  to {
    transform: translateY(200px);
    opacity: 0;
  }
}

@keyframes position{
  0%, 19.9% {
    margin-top: 10%;
    margin-left: 40%;
  }
  20%, 39.9% {
    margin-top: 40%;
    margin-left: 30%;
  }
  40%, 59.9% {
    margin-top: 20%;
    margin-left: 70%
  }
  60%, 79.9% {
    margin-top: 30%;
    margin-left: 20%;
  }
  80%, 99.9% {
    margin-top: 30%;
    margin-left: 80%;
  }
}

.nft-card {
  animation: rotation 0.8s 3 linear, enlarge 1.5s 2s ease-in forwards;
  box-shadow: 0 25px 35px -25px var(--primary-custom);
}
.get-btn {
  opacity: 0;
  animation: show-btn 1s 3s linear forwards;
}
@keyframes rotation {
  100%{ transform:rotatey(360deg); }
}
@keyframes enlarge {
  100% {
    transform: scale(2);
  }
}
.pyro {
  opacity: 0;
  animation: show-celebration 1.5s 3.5s linear forwards;
}
.confetti {
  opacity: 0;
  animation: show-celebration 1s 2s linear forwards;
}
@keyframes show-celebration {
  100%{
    opacity: 1;
  }
}
@keyframes show-btn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

</style>
