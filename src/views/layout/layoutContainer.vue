<!-- 页面布局架子 -->
<script setup>
import router from '@/router'
import { useUserStore } from '@/stores'
import { User, SwitchButton, Setting, Star, Collection } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/dist/index.css'

// 获取用户信息
const userStore = useUserStore()
onMounted(async () => {
  await userStore.getUser(userStore.id)
})

// 退出登录
const onCommand = async (command) => {
  // 点击退出登录时，弹出确认框
  if (command === 'logout') {
    await ElMessageBox.confirm('您确认退出吗？', '请确认', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    // 清空userStore中的用户信息
    userStore.setToken('')
    userStore.setId('')
    userStore.user = {}
    // 清除localStorage中的用户信息
    // localStorage.removeItem('userData')
    ElMessage.success('退出登录成功!')
    // 返回登录页
    router.push('/login')
  } else {
    // 跳转到对应页面

    router.push(`/user/${command}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-header class="el-header">
      <div>
        欢迎回来！<strong>{{ userStore.user?.data?.userName }}</strong>
      </div>
      <el-dropdown placement="bottom-end" @command="onCommand">
        <span class="el-dropdown__box">
          <el-avatar
            :src="
              userStore.user?.data?.avatar ||
              'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
            "
          />
          <el-icon><CaretBottom /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
            <el-dropdown-item command="logout" :icon="SwitchButton" @click="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="200px" class="el-aside">
        <el-menu
          active-text-color="#40F8FF"
          background-color="#0c356a"
          :default-active="$route.path"
          text-color="#fff"
          router
        >
          <el-menu-item index="/subject/manage">
            <el-icon><Setting /></el-icon>
            <span>课程管理</span>
          </el-menu-item>
          <el-menu-item index="/subject/channel">
            <el-icon><Star /></el-icon>
            <span>课程分类</span>
          </el-menu-item>
          <el-menu-item index="/subject/select">
            <el-icon><Collection /></el-icon>
            <span>我的选课</span>
          </el-menu-item>
          <el-menu-item index="/user/profile">
            <el-icon><Collection /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main><router-view></router-view></el-main>
        <el-footer class="el-footer">课程管理系统</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-header {
    height: 60px;
    background-color: #279eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    color: white;
  }
  .el-aside {
    width: 180px;
    background-color: #0c356a;
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
  .el-dropdown__box {
    margin-top: 10px;
  }
}
</style>
