import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页
    { path: '/login', component: () => import('@/views/login/loginPage.vue') },
    // 布局架子
    {
      path: '/',
      component: () => import('@/views/layout/layoutContainer.vue'),
      redirect: '/subject/manage',
      // 二级路由
      children: [
        // 课程管理
        { path: '/subject/manage', component: () => import('@/views/subject/subjectManage.vue') },
        // 课程分类
        { path: '/subject/channel', component: () => import('@/views/subject/subjectChannel.vue') },
        // 选课列表
        { path: '/subject/select', component: () => import('@/views/subject/subjectSelect.vue') },
        // 个人中心
        { path: '/user/profile', component: () => import('@/views/profile/userProfile.vue') },
      ],
    },
  ],
})

// 路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login'
})
export default router
