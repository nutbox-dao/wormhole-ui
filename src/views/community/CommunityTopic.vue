<template>
  <div>
    <div class="pt-20px">
      <div class="mb-4px px-15px flex justify-between items-center">
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
      <div class=" ">
        <div class="flex gap-15px space-container no-scroll-bar">
          <div v-for="i of 3" :key="i"
               class="space-item w-280px min-w-280px">
            <Space :show-avatar="false">
              <template #bottom-btn-bar><div></div></template>
            </Space>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-20px px-15px">
      <div class="mb-4px flex justify-between items-center">
        <span class="text-16px leading-25px font-bold">{{$t('community.topic')}}</span>
      </div>
      <div v-for="i of 3" :key="i" class="mb-15px">
        <TopicItem></TopicItem>
      </div>
    </div>
  </div>
</template>

<script>
import Space from "@/components/Space";
import TopicItem from "@/components/community/TopicItem";
export default {
  name: "CommunityPost",
  components: {Space, TopicItem},
  data() {
    return {
      spaceType: ['inProgress', 'ended', 'toBeStart'],
      typeIndex: 0
    }
  }
}
</script>

<style scoped lang="scss">
.space-container {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}
.space-item {
  scroll-snap-align: center;
  &:first-child {
    margin-left: 15px;
  }
  &:last-child {
    margin-right: 15px;
  }
}
</style>
