<script setup>
import { userLoginService, userRegisterService } from '@/api/user'
import router from '@/router'
import { useUserStore } from '@/stores'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { ref } from 'vue'

// 控制登录或注册页面的展示
const isRegister = ref(false)
// 表单ref
const form = ref('')

// 表单元素收集
const formData = ref(
  localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))
    : {
        userName: '',
        password: '',
        repassword: '',
      },
)

// 校验规则
const rules = {
  // 用户名
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名必须是2-10位的字符', trigger: 'blur' },
  ],
  // 密码
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur',
    },
  ],
  // 确认密码
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 切换登录/注册时，表单元素清空
const toggle = () => {
  // 清空表单
  formData.value = {
    userName: '',
    password: '',
    repassword: '',
  }
  // 切换页面
  isRegister.value = !isRegister.value
}

// 调用用户store
const userStore = useUserStore()
// 点击注册事件
const regist = async () => {
  // 注册前预校验
  await form.value.validate()
  // 发送请求
  await userRegisterService(formData.value)
  // 提示注册成功
  ElMessage.success('注册成功!')
  // 切换到登录页面
  isRegister.value = false
  // 重置表单数据
  formData.value = {
    userName: '',
    password: '',
    repassword: '',
  }
}

// 记住-状态
const remember = ref(true)
// 点击登录事件
const login = async () => {
  // 登录前预校验
  await form.value.validate()
  // 发送请求
  const res = await userLoginService(formData.value)
  // 存储token
  userStore.setToken(res.data.data.token)
  // 存储id
  userStore.setId(res.data.data.userId)
  // 记住-选项
  if (remember.value) {
    // 存储密码到本地
    localStorage.setItem('userData', JSON.stringify(formData.value))
  } else {
    // 如果本地有用户数据，则清除
    if (localStorage.getItem('userData')) {
      localStorage.removeItem('userData')
    }
  }
  // 提示登录成功
  ElMessage.success('登录成功!')
  // 跳转到首页
  router.push('/')
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="24" class="bg">
      <el-col :span="6" :offset="9" class="form">
        <!-- 注册 -->
        <el-form
          :rules="rules"
          :model="formData"
          ref="form"
          size="large"
          autocomplete="off"
          v-if="isRegister"
        >
          <el-form-item>
            <h1 class="title">注册</h1>
          </el-form-item>
          <el-form-item prop="userName">
            <el-input
              :prefix-icon="User"
              v-model="formData.userName"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              v-model="formData.password"
              type="password"
              show-password
              placeholder="请输入6-15位(非空)密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input
              :prefix-icon="Lock"
              type="password"
              v-model="formData.repassword"
              show-password
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="button" type="primary" @click="regist" auto-insert-space>
              注册
            </el-button>
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="toggle">
              ← 已有账户？
              <p style="color: #35b5f2">返回登录</p>
            </el-link>
          </el-form-item>
        </el-form>

        <!-- 登录 -->
        <el-form ref="form" size="large" autocomplete="off" :rules="rules" :model="formData" v-else>
          <el-form-item>
            <h1 class="title">登录</h1>
          </el-form-item>
          <el-form-item prop="userName">
            <el-input
              v-model="formData.userName"
              :prefix-icon="User"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              name="password"
              :prefix-icon="Lock"
              type="password"
              show-password
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="flex">
            <div class="flex">
              <el-checkbox v-model="remember">记住我</el-checkbox>
              <!-- <el-link type="primary" :underline="false">忘记密码？</el-link> -->
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="button" type="primary" auto-insert-space @click="login"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="toggle">
              没有账号？
              <p style="color: #35b5f2">新用户注册</p>
              &nbsp;→
            </el-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/background-pic.png') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    border-radius: 5%;
    padding: 40px;
    background-color: #fff;
    height: 400px;
    width: 1000px;
    border: #fff;
    margin-top: 9%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 25px 5px 0 0;
    }
    .button {
      border: 1px rgb(127, 142, 126) solid;
      width: 100%;
      background-image: linear-gradient(to right, #7a2753, #c44745);
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
