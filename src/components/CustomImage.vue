<template>
  <el-image :src="src">
    <template #placeholder>
      <el-skeleton style="width: 100%; height: 100%">
        <template #template>
          <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
        </template>
      </el-skeleton>
    </template>
    <template #error>
      <el-skeleton style="width: 100%; height: 100%">
        <template #template>
          <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
        </template>
      </el-skeleton>
    </template>
  </el-image>
</template>

<script>
export default {
  name: "CustomImage",
  props: {
    src: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
