<template>
  <div class="rounded-16px overflow-hidden relative pt-50px pb-15px px-15px
              border-1 border-color8B/30 light:border-colorF2 bg-blockBg light:bg-white">
    <div class="w-full h-100px min-h-100px max-h-100px object-cover absolute top-0 left-0">
      <img class="w-full h-full object-cover"
           :src="community.banner" alt="">
      <div class="absolute top-0 left-0 h-full w-full bg-img-overlay"></div>
    </div>

    <div class="relative">
      <div class="flex items-stretch">
        <img class="w-72px h-72px min-w-72px min-h-72px border-2 border-colorF7 rounded-36px"
             :src="community.icon" alt="">
        <div class="flex-1 flex flex-col justify-between ml-15px truncate">
          <div class="flex justify-between items-start truncate">
            <div class="text-left truncate">
              <div class="c-text-black text-24px text-white mb-8px truncate mr-10px">{{community.communityName}}</div>
              <div class="flex items-center text-white text-12px">
                <img class="w-14px h-14px min-w-14px rounded-full mr-4px"
                     :src="tokenIcon" alt="">
                <span>{{ chainName }}</span>
                <div class="w-1px h-12px bg-white mx-8px"></div>
                <div>{{$t('community.peopleJoined', {num: community.memberCount})}}</div>
              </div>
            </div>
            <!-- 小按钮版 -->
            <button :disabled="community.joined"
               class="h-34px rounded-full bg-white flex justify-center items-center px-15px shadow-color1A"
               @click.stop="join">
              <img v-if="!community.joined" class="w-14px h-14px mr-4px" src="~@/assets/icon-add-black.svg" alt="">
              <span v-if="community.joined" class="text-14px font-500 text-color46">{{$t('community.joined')}}</span>
              <span v-else class="text-14px font-500 text-color46">{{$t('community.join')}}</span>
            </button>
          </div>
          <div class="flex flex-wrap gap-5px mt-8px">
            <span v-for="(tag, tIndex) of community.tags ? community.tags.split(',') : []" :key="tIndex"
                  class="border-1 border-color62 rounded-full bg-colorF1 text-color62 text-12px h-18px
                         px-8px flex justify-center items-center">{{tag}}</span>
          </div>
        </div>
      </div>
      <div class="text-left text-14px leading-20px mt-10px multi-content min-h-60px light:text-color33">
        {{community.description}}
      </div>
<!--      大按钮版-->
<!--      <button class="h-40px rounded-full gradient-bg gradient-bg-color3 w-full mt-10px">-->
<!--        <span class="text-14px font-500 text-white">{{$t('community.join')}}</span>-->
<!--      </button>-->
    </div>
  </div>
</template>

<script>
import { EVM_CHAINS } from "@/chain-config";
import { joinCommunity } from "@/utils/community";
import { mapGetters } from "vuex";
import { notify, showError } from "@/utils/notify";

export default {
  name: "CommunityItem",
  props: {
    community: {
      type: Object,
      default: {}
    },
  },
  computed: {
    ...mapGetters(['getAccountInfo'])
  },
  data() {
    return {
      tokenIcon: '',
      chainName: '',
      isJoining: false
    }
  },
  methods: {
    checkLogin() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      return true;
    },
    async join() {
      if (!this.checkLogin()) return;
      try{
        this.isJoining = true;
        await joinCommunity(this.community.communityId);
        this.community.memberCount += 1;
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        notify({message: e, type: 'error'})
      } finally {
        this.isJoining = false
      }
    }
  },
  mounted () {
    for (let chainName of Object.keys(EVM_CHAINS)) {
      const chain = EVM_CHAINS[chainName]
        if (chain.id === this.community.chainId) {
          this.tokenIcon = chain.main.icon;
          this.chainName = chain.chainName;
        }
    }
  },
}
</script>

<style scoped>

</style>
