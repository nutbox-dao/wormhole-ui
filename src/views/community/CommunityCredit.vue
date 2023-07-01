<template>
  <div class="py-15px">
    <InfluenceCardItem v-if="community.joined" :community="community"
                       class="cursor-pointer bg-primaryBg light:bg-color27"></InfluenceCardItem>
    <div class="text-color8B light:text-color7D text-12px mt-15px">
      <span>
        {{ $t('community.joinFirst') }}
      </span>
    </div>
  </div>
</template>

<script>
import InfluenceCardItem from "@/components/influence/InfluenceCardItem.vue";
export default {
  name: "CommunityCredit",
  components: {InfluenceCardItem},
  props: {
    community: {
      type: Object,
      default: ()=>{}
    }
  }
}
</script>

<style scoped>

</style>
