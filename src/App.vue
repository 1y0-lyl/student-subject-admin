<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <!-- 组件默认语言变更 -->
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped></style>
