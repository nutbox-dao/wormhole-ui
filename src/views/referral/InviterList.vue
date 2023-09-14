<template>
  <div class="px-15px py-15px 2md:py-40px max-w-640px mx-auto h-full overflow-hidden flex flex-col">
    <el-table v-infinite-scroll="load"
              class="max-h-full overflow-hidden border-0.5px border-color8B/30 rounded-12px no-scroll-bar
                     bg-blockBg light:bg-white light:shadow-color1A"
              :data="tableData"
              :default-sort="{ prop: 'date' }"
              :v-loading="listLoading"
              style="width: 100%">
      <el-table-column prop="username" :label="$t('user')" min-width="180">
        <template #default="scope">
          <div class="flex items-center">
            <Avatar :profile-img="scope.row.profileImg || defaultAvatar"
                    :name="scope.row.name"
                    :username="scope.row.username"
                    :steem-id="scope.row.steemId"
                    :eth-address="scope.row.ethAddress"
                    :reputation="scope.row.reputation"
                    :teleported="true"
                    @gotoUserPage="$router.push({path : '/account-info/@' + scope.row.username})">
              <template #avatar-img>
                <img class="w-32px min-w-32px h-32px rounded-full mr-5px border-0.5px border-color62/20"
                     @click.stop="$router.push({path : '/account-info/@' + scope.row.username})"
                     :src="scope.row.profileImg || defaultAvatar" alt="">
              </template>
            </Avatar>
            <span>{{scope.row.username}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="registerTime"
                       :label="$t('ref.registrationTime')"
                       sortable width="160">
        <template #default="scope">{{formatDateString(scope.row.registerTime)}}</template>
      </el-table-column>
      <!-- <el-table-column prop="level"
                       :label="$t('ref.invitationLevel')" width="140">
        <template #default="scope">{{scope.row.level}}</template>
      </el-table-column> -->
      <!-- <el-table-column prop="lastLoginTime" class-name="text-right"
                       :label="$t('ref.lastLoginTime')"
                       sortable width="150">
        <template #default="scope">{{formatDateString(scope.row.lastLoginTime)}}</template>
      </el-table-column> -->
      <template #append v-if="listLoading">
        <div class="py-10px flex justify-center items-center">
          <img class="w-20px h-20px mr-8px" src="~@/assets/icon-loading.svg" alt="">
          <span class="text-color99">{{$t('loading')}}</span>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";
import defaultAvatar from "@/assets/icon-default-avatar.svg";
import {formatDateString} from "@/utils/helper";
import { getInvitorsOfUser } from '@/utils/curation'
import { mapGetters } from "vuex";

export default {
  name: "InviterList",
  components: {Avatar},
  data() {
    return {
      defaultAvatar,
      tableData: [],
      listLoading: false,
      finishLoading: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo'])
  },
  methods: {
    formatDateString,
    async load() {
      if (this.listLoading || this.finishLoading) return;
      try{
        this.listLoading = true;
        const index = Math.floor((this.tableData.length + 1) / 20);
        const invitees = await getInvitorsOfUser(this.getAccountInfo.twitterId, 20, index);
        if (invitees && invitees.length > 0) {
          this.tableData = this.tableData.concat(invitees);
        }
        if (invitees.length < 20) {
          this.finishLoading = true;
        }
      } catch (e) {
        console.log(42, e)
      } finally {
        this.listLoading = false;
        this.finishLoading = true
      }
    }
  }
}
</script>

<style scoped>

</style>
