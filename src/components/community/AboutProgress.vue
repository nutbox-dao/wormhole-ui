<template>
  <div class="relative mb-60px text-14px"
       :class="(progressData && progressData.length>0) ? 'mt-50px' : 'mt-40px'">
    <el-tooltip placement="top-start">
      <template #content>
        <span class="text-white light:text-blueDark">{{min}}</span>
      </template>
      <button class="absolute left-0 top-24px text-12px">{{formatNum(min)}}</button>
    </el-tooltip>
    <el-tooltip placement="top-start">
      <template #content>
        <span class="text-white light:text-blueDark">{{max}}</span>
      </template>
      <button class="absolute right-0 top-24px text-12px">{{formatNum(max)}}</button>
    </el-tooltip>
    <span v-if="blockNum && blockPosition > 0 && blockPosition < 1"
          class="current-block absolute top-34px text-12px left-1/2 transform -translate-x-1/2"
          v-show="(progressData && progressData.length > 0) && blockNum>progressData[0].startHeight"
          :style="{left: `${(blockPosition)*100}%`}">{{blockNum}}</span>
    <div class="c-progress-container relative flex justify-between items-center rounded-full h-16px"
         :style="{background: trackColor}">
      <div class="c-progress-bar" v-for="(data, index) of (progressData ? progressData : [])" :key="index"
           :style="{ flex: 1,  background: data.background || `rgba(255, 149, 0, ${(index+1) / progressData.length})`}" >
        <span class="progress-tooltip absolute left-1/10 bottom-24px
                     bg-color62/50 text-white light:bg-colorEA light:text-color62
                     px-15px py-8px rounded-full shadow-popper-tip">
          {{data.amount}}</span>
        <el-tooltip v-if="index<progressData.length-1" placement="top-start">
          <template #content>
            <span class="text-white light:text-blueDark">{{data.stopHeight}}</span>
          </template>
          <button class="absolute right-0 transform translate-x-1/2 top-24px text-12px">
            {{formatNum(data.stopHeight)}}
          </button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { MaxBlockNum } from '@/constant'

export default {
  name: 'AboutProgress',
  props: {
    trackColor: {
      type: String,
      default: 'transparent'
    },
    progressData: {
      type: Array,
      default: []
    }
  },
  computed: {
    ...mapState('web3', ['blockNum']),
    min () {
      if (!this.progressData || this.progressData.length === 0) return 0
      return this.progressData[0].startHeight
    },
    max () {
      if (!this.progressData || this.progressData.length === 0 || this.progressData[this.progressData.length - 1].stopHeight >= 999999999999999) return this.$t('commen.max')
      return this.progressData[this.progressData.length - 1].stopHeight
    },
    blockPosition () {
      if (!this.progressData || this.progressData.length === 0) {
        return
      }
      let block = this.blockNum
      let index = 0
      for (let i = 0; i < this.progressData.length; i++) {
        const p = this.progressData[i]
        if (block > parseInt(p.startHeight) && block < parseInt(p.stopHeight)) {
          index = i
          break
        }
      }
      const totalField = this.progressData.length
      let position = index / parseFloat(totalField)
      position = position + parseFloat(block - this.progressData[index].startHeight) / parseFloat(this.progressData[index].stopHeight - this.progressData[index].startHeight) / totalField
      return position
    }
  },
  methods: {
    formatNum (num) {
      if (!this.isNumeric(num)) return 'Max'
      num = parseFloat(num).toFixed(2)
      if (num < 1e5) {
        return num
      }
      if (num < 1e6) {
        return `${(parseFloat(num) / 1e3).toFixed(2)}K`
      }
      if (num < 1e9) {
        return `${(parseFloat(num) / 1e6).toFixed(2)}M`
      }
      return `${(parseFloat(num) / 1e9).toFixed(2)}G`
    },
    isNumeric (val) {
      return val !== null && val !== '' && !isNaN(val)
    }
  }
}
</script>

<style scoped lang="scss">
.c-progress-container {
  .c-progress-bar {
    height: 100%;
    position: relative;
    border-right: 2px solid transparent;
  }
  .c-progress-bar:nth-of-type(1) {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }
  .c-progress-bar:last-child {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
    border: none;
  }
}
.progress-tooltip::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 99%;
  width: 16px;
  height: 6px;
  background: rgba(98, 70, 234, 0.5);
  clip-path: polygon(0 0, 100% 0, 50% 100%, 0 0);
}
.light .progress-tooltip::before {
  background: #EAE5FF;
}
.current-block::before {
  display: block;
  content: '';
  width: 10px;
  height: 6px;
  background-color: #6246EA;
  clip-path: polygon(0 100%, 50% 0, 100% 100%);
  margin: .3rem auto;
}
</style>
