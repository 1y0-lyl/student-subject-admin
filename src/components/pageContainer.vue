<!-- 课程分类&&课程列表 页面架子组件 -->
<script setup>
defineProps({
  title: {
    required: true,
    type: String,
  },
})
</script>

<template>
  <el-card style="max-width: 100%; min-height: 100%">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="button">
          <slot name="button"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
