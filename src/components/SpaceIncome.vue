<template>
  <div class="text-14px">
    <div class="h-max overflow-hidden rounded-16px">
      <div class="flex justify-between items-center px-15px pt-12px pb-10px">
        <span class="text-16px font-bold">{{$t('space.income')}}</span>
        <button v-if="isSettle"
                class="text-white h-24px bg-color62 px-10px rounded-full text-12px">{{$t('space.settled')}}</button>
        <button v-else
                class="text-white h-24px bg-color62 px-10px rounded-full text-12px">{{$t('space.unsettlement')}}</button>
      </div>
      <div class="px-15px pb-8px">
        <BlogReward :is-popover="false" :post="space">
          <template #default><div></div></template>
        </BlogReward>
      </div>
      <div class="grid grid-cols-2 gap-10px px-15px pb-15px">
        <div class="col-span-1 border-0.5px border-color8B/30 rounded-10px p-8px">
          <div class="flex justify-between items-center text-12px ">
            <div class="flex items-center gap-4px">
              <img class="w-12px h-12px min-w-12px"
                   src="~@/assets/icon-curator-primary.svg" alt="">
              <span>{{$t('common.curator')}}</span>
            </div>
            <div class="">12 {{$t('common.people')}}</div>
          </div>
          <div v-if="isSettle" class="mt-10px c-text-black">0.000 USDT</div>
        </div>
        <div class="col-span-1 border-0.5px border-color8B/30 rounded-10px p-8px">
          <div class="flex justify-between items-center text-12px text-color8B light:text-color7D">
            <div class="flex items-center gap-4px">
              <img class="w-12px h-12px min-w-12px"
                   src="~@/assets/icon-host-primary.svg" alt="">
              <span>{{$t('curation.host')}}</span>
            </div>
            <div class="">1 {{$t('common.people')}}</div>
          </div>
          <div v-if="isSettle" class="mt-10px c-text-black">0.000 USDT</div>
        </div>
        <div class="col-span-1 border-0.5px border-color8B/30 rounded-10px p-8px">
          <div class="flex justify-between items-center text-12px text-color8B light:text-color7D">
            <div class="flex items-center gap-4px">
              <img class="w-12px h-12px min-w-12px"
                   src="~@/assets/icon-co-host-primary.svg" alt="">
              <span>{{$t('curation.coHost')}}</span>
            </div>
            <div class="">0 {{$t('common.people')}}</div>
          </div>
          <div v-if="isSettle" class="mt-10px c-text-black">0.000 USDT</div>
        </div>
        <div class="col-span-1 border-0.5px border-color8B/30 rounded-10px p-8px">
          <div class="flex justify-between items-center text-12px text-color8B light:text-color7D">
            <div class="flex items-center gap-4px">
              <img class="w-12px h-12px min-w-12px"
                   src="~@/assets/icon-speaker-primary.svg" alt="">
              <span>{{$t('curation.speaker')}}</span>
            </div>
            <div class="">10 {{$t('common.people')}}</div>
          </div>
          <div v-if="isSettle" class="mt-10px c-text-black">0.000 USDT</div>
        </div>
      </div>
      <div v-if="!isSettle" class="px-15px py-8px bg-color62 rounded-b-12px text-14px text-white">
        Space收益将在
        <Countdown class="text-white text-14px inline-flex"
                   :time="new Date('2023-08-10 12:00:00').getTime()"/>
        后结算
      </div>
      <div class="px-15px py-8px bg-color62 text-12px text-left leading-18px text-white">
        <div class="flex items-center mb-4px">
          <img class="w-14px h-14px min-w-14px inline-flex mr-4px"
               src="~@/assets/icon-warning-white.svg" alt="">
          <span class="font-bold">{{$t('space.spaceWarning')}}</span>
        </div>
        <div>{{$t('space.spaceWarningTip1')}}</div>
        <!--      <div>{{$t('space.spaceWarningTip2')}}</div>-->
        <!--      <div>{{$t('space.spaceWarningTip3')}}</div>-->
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Countdown from "@/components/Countdown.vue";
import BlogReward from "@/components/BlogReward.vue";
export default {
  name: "SpaceIncome",
  components: {Countdown, BlogReward},
  props: {
    space: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isSettle: true
    }
  }
}
</script>

<style scoped>

</style>
