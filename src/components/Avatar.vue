<template>
  <div class="h-full">
    <el-popover popper-class="c-popper"
                :show-after="500"
                :persistent="true"
                :show-arrow="false" width="240px">
      <div class="border-1 border-color8B/30 light:border-colorF4 bg-blockBg light:bg-white p-20px rounded-14px">
        <div class="flex justify-between ">
          <img class="w-48px h-48px object-cover rounded-full border-1 border-color8B/10" :src="profileImg" alt="">
          <button class="bg-color62 px-20px h-30px rounded-full text-white font-500"
                  @click.stop="$emit('gotoUserPage')">{{$t('postView.detail')}}</button>
        </div>
        <div class="mt-8px flex flex-wrap items-center">
          <span class="c-text-black mr-4px text-white light:text-blueDark text-16px">{{name}}</span>
          <span v-show="steemId || accountInfo.steemI" class="">#{{steemId || accountInfo.steemId}}</span>
        </div>
        <div class="text-12px mt-4px cursor-pointer flex items-center text-color8B light:text-color7D">
          <span>@{{username}}</span>
          <img class="w-14px ml-4px"
               @click="gotoTwitter"
               src="~@/assets/icon-twitter-blue.svg" alt="">
        </div>
        <div v-if="accountInfo.reputation > 0" class="text-12px mt-4px cursor-pointer flex items-center text-color8B light:text-color7D">
          Twitter Reputation: {{ reputation || accountInfo.reputation }}
        </div>
        <div v-if="ethAddress || accountInfo.ethAddress" class="text-12px mt-20px cursor-pointer flex items-center font-500">
          <span class="flex-1 whitespace-nowrap truncate">
            {{ethAddress || accountInfo.ethAddress}}
          </span>
          <img class="w-14px ml-4px"
               @click="copyAddress(ethAddress)"
               src="~@/assets/icon-copy-primary.svg" alt="">
        </div>
      </div>
      <template #reference>
        <slot name="avatar-img"></slot>
      </template>
    </el-popover>
  </div>
</template>

<script>
import {copyAddress} from "@/utils/tool";
import {getUserInfo} from "@/utils/account";
export default {
  name: "Avatar",
  props: {
    profileImg: {
      type: String,
      default: '/icon-default-avatar.svg'
    },
    name: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    },
    steemId: {
      type: String,
      default: ''
    },
    ethAddress: {
      type: String,
      default: ''
    },
    reputaion: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      accountInfo: {}
    }
  },
  async mounted() {
    this.accountInfo = await getUserInfo(this.username)
  },
  methods: {
    copyAddress,
    gotoTwitter() {
      window.open(
          "https://twitter.com/" + this.username,
          "__blank"
      );
    },
  }
}
</script>

<style scoped>

</style>
