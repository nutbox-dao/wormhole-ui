<template>
  <div class="h-full">
    <el-popover popper-class="c-popper"
                :disabled="clientWidth<500"
                :teleported="teleported"
                :show-after="500"
                :persistent="true"
                :show-arrow="false" width="240px">
      <div class="border-1 border-color8B/30 light:border-colorF4 bg-blockBg light:bg-white p-20px rounded-14px">
        <div class="flex justify-between ">
          <img class="w-48px h-48px object-cover rounded-full border-1 border-color8B/10"
          @error="replaceEmptyImg"
          :src="profileImg" alt="">
          <button class="bg-color62 px-20px h-30px rounded-full text-white font-500"
                  @click.stop="$emit('gotoUserPage')">{{$t('postView.detail')}}</button>
        </div>
        <div class="mt-8px flex flex-wrap items-center">
          <span class="c-text-black mr-4px text-white light:text-blueDark text-16px">{{name}}</span>
          <span v-show="steemId || accountInfo.steemId" class="">#{{steemId || accountInfo.steemId}}</span>
        </div>
        <div class="text-12px mt-4px cursor-pointer flex items-center text-color8B light:text-color7D">
          <span>@{{username}}</span>
          <img class="w-14px ml-4px"
               @click="gotoTwitter"
               src="~@/assets/icon-twitter-blue.svg" alt="">
        </div>
        <div v-if="reputation > 0 || accountInfo.reputation > 0" class="text-12px mt-4px cursor-pointer flex items-center text-color8B light:text-color7D">
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
import emptyAvatar from "@/assets/icon-default-avatar.svg";

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
    reputation: {
      type: Number,
      default: ''
    },
    teleported: {
      type:Boolean,
      default: false
    }
  },
  data() {
    return {
      clientWidth: document.body.clientWidth,
      accountInfo: {}
    }
  },
  async mounted() {
    try{
      // this.accountInfo = await getUserInfo(this.username)
    }catch(e) {

    }
  },
  methods: {
    copyAddress,
    gotoTwitter() {
      window.open(
          "https://twitter.com/" + this.username,
          "__blank"
      );
    },
    replaceEmptyImg(e) {
        e.target.src = emptyAvatar;
    },
  }
}
</script>

<style scoped>

</style>
