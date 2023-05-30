<template>
  <div class="text-14px py-20px px-15px 2md:flex 2md:flex-col">
    <div>
      <div class="text-left font-bold c-text-black text-16px">{{$t('community.activity')}}</div>
      <div class="flex items-center gap-5px mt-8px">
<!--        <span class="text-14px text-color8B light:text-color7D">{{$t('community.justAdmin')}}</span>-->
<!--        <el-switch v-model="isAdmin" />-->
      </div>
    </div>
    <img v-if="!ops"
         class="w-5rem mx-auto py-3rem"
         src="~@/assets/profile-loading.gif" alt="" />
    <div class="2md:flex-1 2md:overflow-auto no-scroll-bar">
      <van-pull-refresh class="min-h-40vh"
                        v-model="refreshing"
                        @refresh="refresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <van-list :loading="listLoading"
                  :finished="listFinished"
                  :immediate-check="false"
                  :loading-text="$t('common.loading')"
                  :finished-text="ops.length!==0?$t('common.noMore'):''"
                  @load="onLoad">
          <div v-if="!refreshing && ops.length === 0"
               class="py-2rem 2md:py-0 font-bold c-text-black text-color8B light:text-color7D text-12px">
            {{$t('common.none')}}
          </div>
          <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
              v-if="refreshing && (!ops || ops.length === 0)">
            <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
          </div>
          <template v-else>
            <ActivityItem v-for="(op, i) of ops" :key="i"
                          :op="op"
                          @click="gotoDetail(op)"
                          class="mb-15px bg-tag-gradient text-white p-15px rounded-12px cursor-pointer"/>
          </template>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import ActivityItem from "@/components/community/ActivityItem.vue";
import {mapState} from "vuex";
import {getCommunityOps} from "@/api/api";
import {notify} from "@/utils/notify";
import { sleep } from "@/utils/helper";

export default {
  name: "CommunityActivity",
  components: {ActivityItem},
  computed: {
    ...mapState('community', ['showingCommunity','ops']),
  },
  data() {
    return {
      listLoading: false,
      listFinished: false,
      refreshing: false,
      communityId: ''
    }
  },
  async activated() {
    let count = 0
    while(!this.showingCommunity || !this.showingCommunity.communityId) {
      await sleep(0.1);
      if (count++ > 100) {
        return;
      }
    }
    if (this.showingCommunity.communityId !== this.communityId){
      this.communityId = this.showingCommunity.communityId
      this.refresh()
    }
  },
  methods: {
    async onLoad() {
      try{
        if (this.listLoading || this.listFinished || this.ops.length === 0) {
          return
        }
        this.listLoading = true
        const newOps = await getCommunityOps(this.communityId, this.ops[this.ops.length - 1].createTime)
        if (newOps && newOps.length > 0) {
          this.$store.commit('community/saveOps', this.ops.concat(newOps))
        }
      } catch (e) {
        console.log(44, e);
        notify({error: e, type: 'error'})
      } finally {
        this.listLoading = false
      }
    },
    async refresh() {
      console.log(12, this.refreshing, this.listLoading);
      if (this.refreshing || this.listLoading) return;
      this.refreshing = true;
      getCommunityOps(this.communityId).then(ops => {
        console.log('ops', ops);
        this.$store.commit('community/saveOps', ops)
      }).catch(e => {
        console.log(55, e);
        notify({error: e, type: 'error'})
      }).finally(() => {
        this.refreshing = false
      })
    },
    gotoDetail(op) {
      switch (op.type) {
        case 2:
          this.$store.commit('postsModule/saveCurrentShowingDetail', null);
          this.$router.push('/post-detail/' + op.id);
          break;
        case 3:
          this.$store.commit('postsModule/saveCurrentShowingDetail', null);
          this.$router.push('/post-detail/' + op.id);
          break;
        case 10:
          this.$router.push('/topic-detail/' + op.id);
          break;
        case 11:
          this.$store.commit('postsModule/saveCurrentShowingDetail', null);
          this.$router.push('/post-detail/' + op.id);
          break;
        default:
          break;
      }
    }
  },
}
</script>

<style scoped>

</style>
