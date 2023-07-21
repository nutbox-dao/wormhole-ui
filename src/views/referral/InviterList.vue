<template>
  <div class="px-15px py-15px 2md:py-40px max-w-640px mx-auto h-full overflow-hidden">
    <el-table v-infinite-scroll="load"
              class="max-h-full border-0.5px border-color8B/30 rounded-12px no-scroll-bar
                     bg-blockBg light:bg-white light:shadow-color1A"
              :data="tableData"
              :default-sort="{ prop: 'date', order: 'descending' }"
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
      <el-table-column prop="joinTime"
                       :label="$t('ref.registrationTime')"
                       sortable width="150">
        <template #default="scope">{{formatDateString(scope.row.joinTime)}}</template>
      </el-table-column>
      <el-table-column prop="level"
                       :label="$t('ref.invitationLevel')" width="120">
        <template #default="scope">{{scope.row.level}}</template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" class-name="text-right"
                       :label="$t('ref.lastLoginTime')"
                       sortable width="150">
        <template #default="scope">{{formatDateString(scope.row.lastLoginTime)}}</template>
      </el-table-column>
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

export default {
  name: "InviterList",
  components: {Avatar},
  data() {
    return {
      defaultAvatar,
      tableData: [
        {
          "twitterId": "1393773610108559363",
          "name": "0xMonkey",
          "username": "One7Monkey",
          "steemId": "one7monkey",
          "ethAddress": "0x688E1B7dBbB9A3FaB6311dc75787855D9A41C3B4",
          "reputation": 67,
          "profileImg": "https://pbs.twimg.com/profile_images/1667378101536591874/NsntdM6S_normal.jpg",
          "joinTime": "2023-06-14T13:25:40.000Z",
          "ccPower": 640880,
          "level": 0,
          "lastLoginTime": "2023-06-14T13:22:57.000Z",
        },
        {
          "twitterId": "1467303063102758912",
          "name": "ppf",
          "username": "peterpefct",
          "steemId": "peterpefct",
          "ethAddress": "0x869B2908A8337b3E9Db25c09db4599573c4d7bE6",
          "reputation": 47,
          "profileImg": "https://pbs.twimg.com/profile_images/1670722634433331200/CIZakMEM_normal.jpg",
          "joinTime": "2023-06-14T13:22:57.000Z",
          "ccPower": 633089,
          "level": 1,
          "lastLoginTime": "2023-06-25T08:45:19.000Z",
        },
        {
          "twitterId": "1640903383531024384",
          "name": "铁皮乔",
          "username": "Iron_John2023",
          "steemId": "ironjohn2023",
          "ethAddress": "0x7275Bf54967052C3859A2F548359975c31e46Ffa",
          "reputation": 160,
          "profileImg": "https://pbs.twimg.com/profile_images/1668258628216782853/pN-VraeV_normal.jpg",
          "joinTime": "2023-06-25T08:45:19.000Z",
          "ccPower": 592973,
          "level": 1,
          "lastLoginTime": "2023-06-15T03:11:53.000Z",
        },
        {
          "twitterId": "1635659506440114181",
          "name": "Uncle Koala",
          "username": "ikeisthere",
          "steemId": "ikeisthere",
          "ethAddress": "0x1F0eA29902BACff8187e3B7995D0E03b67538963",
          "reputation": 123,
          "profileImg": "https://pbs.twimg.com/profile_images/1671977774024916993/xVtGBe_e_normal.jpg",
          "joinTime": "2023-06-15T03:11:53.000Z",
          "ccPower": 475447,
          "level": 0,
          "lastLoginTime": "2023-06-14T13:22:57.000Z",
        }
      ],
      listLoading: false
    }
  },
  methods: {
    formatDateString,
    load() {
    }
  }
}
</script>

<style scoped>

</style>
