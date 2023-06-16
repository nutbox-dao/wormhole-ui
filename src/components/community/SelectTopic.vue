<template>
  <div v-if="loading || (activities && activities.length > 0)" class="mt-1.8rem">
    <div class="flex justify-between items-center mb-6px">
      <div class="font-bold">{{$t('community.activity')}}</div>
      ({{ $t('curation.optional') }})
    </div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="loading">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
    <div v-else-if="!loading && (!activities || activities.length === 0)" class="py-1rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B w-full text-center light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <div v-else class="relative border-1 bg-black/40 border-1 border-color8B/30
                      light:bg-white light:border-colorE3
                      rounded-8px min-h-44px 2xl:min-h-2rem px-15px py-12px">
      <el-collapse-transition>
        <div>
          <div class="grid grid-cols-2 gap-x-10px
                            max-h-150px overflow-auto no-scroll-bar">
            <div v-for="(item,index) of activities"
                 :key="item.activityId"
                 class="col-span-1 flex items-center bg-blockBg light:bg-colorF7F2
                        rounded-8px h-40px px-15px border-2px mt-10px cursor-pointer"
                 :class="item.tag===selectedTag?'border-color62':'border-transparent'"
                 @click="selectActivity(item)">
              <div class="truncate text-12px">
                <div class="font-bold mb-4px">{{item.title}}</div>
                <div>#{{ item.tag }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {mapState} from "vuex";
import { getCommunityActivities } from '@/api/api'

export default {
  name: "SelectActivity",
  props: {
    communityId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      expandActivities: true,
      searchActivityText: '',
      searchActivityLoading: false,
      activities: [],
      loading: false,
      selectedTag: ''
    }
  },
  watch: {
    communityId(newValue, oldValue) {
      this.activities = [];
      this.refresh()
    }
  },
  computed: {
  },
  methods: {
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    selectActivity(item) {
      if (this.selectedTag == item.tag) {
        this.selectedTag = '';
        this.$emit('setTag', '')
        return;
      }
      this.selectedTag = item.tag
      this.$emit('setTag', item.tag)
    },
    async refresh() {
      if (this.loading) return;
      try{
        this.loading = true
        const acs = await getCommunityActivities(this.communityId);
        const now = Date.now();
        this.activities = acs.filter(a => new Date(a.startTime).getTime() <= now && new Date(a.endTime).getTime() >= now)
      } catch (e) {
        console.log('get community activities fail', e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
