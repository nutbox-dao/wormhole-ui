<template>
  <div class="py-15px">
    <InfluenceCardItem :community="community"
                       class="cursor-pointer bg-primaryBg light:bg-color27"></InfluenceCardItem>
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
