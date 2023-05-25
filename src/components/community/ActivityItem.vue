<template>
  <div class="text-left">
    <div class="font-bold c-text-black text-14px mb-10px">{{type}}</div>
    <div class="text-12px leading-18px break-word multi-content">
      {{ op.content }}
    </div>
    <div class="flex justify-between items-center mt-10px text-12px text-color8B light:text-color7D">
      <div class="flex items-center">
      </div>
      <span>{{ parseTimestamp(op.createTime) }}</span>
    </div>
  </div>
</template>

<script>
import { parseTimestamp } from '@/utils/helper';
export default {
  name: "ActivityItem",
  props: {
    op: {
      type: Object,
      default: {}
    },
  },
  computed: {
    type() { // 2.space; 3.announce; 10.topick; 11.promotion
      switch (this.op.type) {
        case 2:
          return this.$t('community.space');
          break;
        case 3:
          return this.$t('community.announce');
        case 10:
          return this.$t('community.topics');
        case 11:
          return this.$t('community.promotion');
        default:
          break;
      }
    }
  },
  methods: {
    parseTimestamp
  },
}
</script>

<style scoped>

</style>
