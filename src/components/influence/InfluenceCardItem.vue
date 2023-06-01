<template>
  <div class="relative bg-blockBg light:bg-color27 rounded-16px overflow-hidden flex flex-col sm:flex-row">
    <div class="influence-card w-full sm:w-2/3 sm:max-w-2/3 h-200px rounded-14px relative pt-30px pb-20px px-15px
                flex flex-col justify-between items-start">
      <div class="flex items-center">
        <img class="w-48px h-48px min-w-48px border-2 border-colorF7/36 rounded-full shadow-color72"
             :src="community.icon" alt="">
        <span class="text-white text-20px leading-26px c-text-black ml-10px">{{community.communityName}}</span>
      </div>
      <div class="w-full">
        <div class="flex items-end">
        <span class="text-32px leading-32px c-text-black text-white mr-4px">
          {{community.CCPower}}
        </span>
          <el-popover :width="200" >
            <template #reference>
              <button @click.stop>
                <img class="w-14px h-14px min-w-16px min-h-16px opacity-75 mb-5px"
                     src="~@/assets/icon-warning-white.svg" alt="">
              </button>
            </template>
            <div>规则描述</div>
          </el-popover>
        </div>
        <div class="flex items-center">
          <el-progress class="c-progress-gradient flex-1 w-full"
                       :text-inside="false"
                       :stroke-width="10"
                       :show-text="false"
                       :percentage="(community.memberCount - community.userIndex) * 100 / community.memberCount"/>
          <button class="bg-white/20 w-20px h-20px rounded-full flex justify-center items-center ml-10px sm:hidden"
                  @click.stop="getDetail">
            <img class="w-16px transform spin-slow"
                 :class="isFold?'rotate-0':'-rotate-180'"
                 src="~@/assets/icon-select-white.svg" alt="">
          </button>
        </div>
        <div class="text-12px text-white/80 text-left mt-10px">
          {{$t('community.influenceTip', {percent: ((community.memberCount - community.userIndex) * 100 / community.memberCount).toFixed(2)})}}
        </div>
      </div>
    </div>
    <el-collapse-transition>
      <div v-show="!isFold" class="pl-15px pr-45px pt-17px pb-30px sm:w-1/3 sm:pr-15px">
        <div class="text-14px text-white light:text-white/60 text-left mt-15px mb-4px sm:mb-15px">
          {{$t('community.twitterInfluence')}}: {{ getAccountInfo?.reputation }}
        </div>
        <el-progress class="c-progress-purple flex-1 w-full"
                     color="#7700E0"
                     :text-inside="false"
                     :stroke-width="6"
                     :show-text="false"
                     :percentage="getAccountInfo?.reputation / 100000"/>
      </div>
    </el-collapse-transition>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {useWindowSize} from "@vant/use";

export default {
  name: "InfluenceCardItem",
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  props: {
    community: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      isFold: true,
      gettingDetail: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo'])
  },
  methods: {
    async getDetail() {
      this.isFold=!this.isFold
      if (!this.community.detail || this.community.detail.length === 0) {
        try{
          this.gettingDetail = true
          let policy = this.community.CCPolicy;
          if (policy) {
            policy = JSON.parse(policy)
          }
          console.log(55, policy);
          const communityPolicy = policy.community.policys;
          for(let p of communityPolicy) {
            if (p.type === 'stake') {

            }
          }
          this.community.detail = policy
        } catch (e) {
          console.log('get detail fail: ', e);
        } finally {
          this.gettingDetail = false
        }
      }
    }
  },
  mounted () {
    this.isFold = this.width<640
  },
}
</script>

<style scoped lang="scss">
.influence-card {
  position: relative;
  background-image: linear-gradient(135deg, #AE88FE 0%, #923CFF 45%, #00B2FF 100%), url("~@/assets/influence-bg.png");
  background-repeat: no-repeat;
  background-size: cover, auto 65%;
  background-position: center, calc(100% - 15px) top;
  background-blend-mode: color;
  overflow:hidden;
  &::before {
    content: '';
    position: absolute;
    width: 50%;
    height: 150%;
    top: -30%;
    left: 50%;
    background-image: linear-gradient(rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    background-size: cover;
    transform: rotate(30deg);
  }
}
</style>
