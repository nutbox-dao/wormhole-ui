<template>
  <div class="bg-text2C text-white">
    <div class="bg-color1E relative celebration-bg">
      <template v-if="showAnimation">
        <div class="confetti absolute top-0 w-full">
          <div class="confetti-piece" v-for="i of 50" :key="i"></div>
        </div>
        <div class="pyro absolute w-full z-0">
          <div class="before"></div>
          <div class="after"></div>
        </div>
      </template>
      <div class="relative z-2 py-2rem">
        <img class="absolute right-1rem top-1rem w-1rem cursor-pointer"
             @click="$emit('close')"
             src="~@/assets/icon-close-white.svg" alt="">
        <img class="w-12rem h-12rem rounded-full border-3px gradient-border mx-auto mb-2rem"
             src="~@/assets/icon-default-avatar.svg" alt="">
        <div class="c-text-bold text-1.4rem">New wormholer NFT</div>
        <div class="mt-0.5rem">from @wormhole3 official</div>
      </div>

    </div>
    <div class="bg-text2C px-2.5rem py-1.5rem relative z-2">
      <div class="mb-1rem text-1.2rem leading-2rem">An NFT that shows your social influence on Twitter</div>
      <button class="h-2.5rem px-1rem min-w-10rem border-1 border-white/20 rounded-full font-700 text-1.4rem"
              @click="showAnimation=true">Got it</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GetNft",
  data() {
    return {
      showAnimation: false
    }
  }
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
    transform: translateY(300px);
  }
}

$particles: 50;
$width: 500;
$height: 500;
$box-shadow: ();
$box-shadow2: ();
@for $i from 0 through $particles {
  $box-shadow: $box-shadow,
  random($width)-$width / 2 + px
  random($height)-$height / 1.2 + px
  hsl(random(360), 100, 50);
  $box-shadow2: $box-shadow2, 0 0 #fff
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
  width: 5px;
  height: 5px;
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


</style>
