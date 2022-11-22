<template>
  <el-select v-model="selectValue" class="w-full" size="large"
             @change="$emit('onChange', selectValue)">
    <el-option
        v-for="item of Object.keys(EVM_CHAINS)"
        :disabled="false"
        :key="item"
        :label="item"
        :value="item"
    />
  </el-select>
</template>

<script>
import {EVM_CHAINS} from "@/config";
export default {
  name: "AssetsOptions",
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      EVM_CHAINS,
      selectValue: {}
    }
  },
  mounted() {
    this.selectValue = this.value
  }
}
</script>

<style scoped>

</style>
