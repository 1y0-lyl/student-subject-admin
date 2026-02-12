<!-- 个人信息页面 -->
<script setup>
import pageContainer from '@/components/pageContainer.vue'
import { useUserStore } from '@/stores'
import 'element-plus/dist/index.css'

const userstore = useUserStore()
const srcList = [userstore.user?.data?.avatar]
</script>

<template>
  <page-container title="个人信息">
    <div class="profile">
      <el-image
        style="width: 200px; height: 200px"
        :src="
          userstore.user?.data?.avatar ||
          'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        "
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="srcList"
        fit="cover"
      />
      <h1>{{ userstore.user?.data?.userName }}</h1>
      <div>用户ID:{{ userstore.user?.data?.userId }}</div>
    </div>
  </page-container>
</template>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    color: #999;
  }
  h1 {
    font-size: 50px;
    color: #595858;
  }
}
</style>
