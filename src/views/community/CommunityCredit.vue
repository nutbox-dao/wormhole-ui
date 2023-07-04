<template>
  <div class="py-15px">
    <InfluenceCardItem v-if="community.joined" :community="communityCCscore"
                       class="cursor-pointer bg-primaryBg light:bg-color27"></InfluenceCardItem>
    <div v-else class="text-color8B light:text-color7D text-12px mt-15px">
      <span>
        {{ $t('community.joinFirst') }}
      </span>
    </div>
  </div>
</template>

<script>
import InfluenceCardItem from "@/components/influence/InfluenceCardItem.vue";
import { mapGetters, mapState } from "vuex";
import { getJoinCommunityState } from '@/utils/community'

export default {
  name: "CommunityCredit",
  components: {InfluenceCardItem},
  props: {
    community: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      refreshing: false,
    }
  },
  computed: {
    ...mapState('community', ['communityCC']),
    ...mapGetters(['getAccountInfo']),
    communityCCscore() {
      if (this.communityCC) {
        const cc = this.communityCC.find(c => c.communityId == this.community.communityId)
        return {...this.community, ...cc}
      }
      return this.community
    }
  },
  async mounted () {
    if (this.communityCCscore?.userIndex > -1){
      return;
    }
    try{
        const res  = await getJoinCommunityState(this.getAccountInfo.twitterId)
        this.$store.commit('community/saveCommunityCC', res)
      } catch (e) {
        console.log(3, e)
      } finally {
        this.refreshing = false
      }
  },
}
</script>

<style scoped>

</style>
