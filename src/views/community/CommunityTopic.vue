<template>
  <div class="py-10px">
    <div class="w-full" ref="wRef"></div>
    <div class="px-15px flex justify-between items-center">
      <span class="text-16px leading-25px font-bold">Twitter Space</span>
      <el-dropdown>
        <button class="text-14px text-color62 flex items-center">
          <span class="font-bold">{{$t('community.'+spaceType[typeIndex])}}</span>
          <img class="w-12px ml-4px" src="~@/assets/icon-arrow-primary.svg" alt="">
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(type, index) of spaceType" :key="type"
                              @click="typeIndex=index">
                <span :class="typeIndex===index?'text-color62':''">
                  {{$t('community.'+type)}}
                </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="refreshing && (!spaceList || spaceList.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!refreshing && (!spaceList || spaceList.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <template v-else>
      <van-swipe :loop="false"
                 :autoplay="0"
                 :width="width<640?width*0.85:($refs.wRef?$refs.wRef.clientWidth:'')"
                 :initial-swipe="activeSpaceIndex"
                 :show-indicators="false">
        <van-swipe-item v-for="i of 3" :key="i"
                        class="swipe-item pl-15px">
          <Space :show-avatar="false">
            <template #bottom-btn-bar><div></div></template>
          </Space>
        </van-swipe-item>
      </van-swipe>
      <div class="hidden sm:flex justify-center items-center mt-10px">
        <button class="w-30px h-30px bg-color62/20 rounded-full flex justify-center items-center
                        disabled:opacity-30"
                :disabled="activeSpaceIndex===0"
                @click="activeSpaceIndex-=1">
          <img class="w-12px h-12px transform rotate-90" src="~@/assets/icon-arrow-primary.svg" alt="">
        </button>
        <div class="flex items-center gap-5px mx-20px">
          <span v-for="i of spaceList.length" :key="i"
                class="w-4px h-4px min-w-4px min-h-4px rounded-full bg-color62 block"
                :class="activeSpaceIndex+1===i?'':'opacity-10'"></span>
        </div>
        <button class="w-30px h-30px bg-color62/20 rounded-full flex justify-center items-center
                        disabled:opacity-30"
                :disabled="activeSpaceIndex===spaceList.length-1"
                @click="activeSpaceIndex+=1">
          <img class="w-12px h-12px transform -rotate-90" src="~@/assets/icon-arrow-primary.svg" alt="">
        </button>
      </div>
      <!--      <div class="w-7/10 mx-auto h-1px bg-color8B/30 light:bg-color7F my-20px sm:hidden"></div>-->
    </template>
    <div class="flex justify-between items-center px-15px mt-10px mb-5px">
      <span class="text-16px leading-25px font-bold">{{$t('community.topic')}}</span>
    </div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="refreshing && (!topicList || topicList.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!refreshing && (!topicList || topicList.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <van-pull-refresh v-else
                      class="min-h-40vh"
                      v-model="refreshing"
                      @refresh="refresh"
                      :loading-text="$t('common.loading')"
                      :pulling-text="$t('common.pullRefresh')"
                      :loosing-text="$t('common.loosingRefresh')">
      <van-list :loading="listLoading"
                :finished="listFinished"
                :immediate-check="false"
                :loading-text="$t('common.loading')"
                :finished-text="topicList.length!==0?$t('common.noMore'):''"
                @load="onLoad">
        <div class="px-15px">
          <div v-for="i of 3" :key="i" class="mb-15px">
            <TopicItem></TopicItem>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Space from "@/components/Space";
import TopicItem from "@/components/community/TopicItem";
import {useWindowSize} from "@vant/use";
export default {
  name: "CommunityPost",
  components: {Space, TopicItem},
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  data() {
    return {
      spaceType: ['inProgress', 'ended', 'toBeStart'],
      activeSpaceIndex: 0,
      spaceList: [1,2, 3, 4],
      typeIndex: 0,
      topicList: [1],
      listLoading: false,
      listFinished: false,
      refreshing: false,
    }
  },
  methods: {
    refresh() {

    },
    onLoad() {

    }
  }
}
</script>

<style scoped lang="scss">
.swipe-item {
  &:last-child {
    padding-right: 15px;
  }
}
</style>
