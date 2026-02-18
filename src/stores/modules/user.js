import { userInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'userMessage',
  () => {
    const token = ref('')
    const user = ref({})
    const id = ref('')
    // 设置token
    const setToken = (newToken) => {
      token.value = newToken
    }
    // 设置用户id
    const setId = (newId) => {
      id.value = newId
    }
    // 获取用户信息
    const getUser = async (id) => {
      const res = await userInfoService(id) // 请求获取数据
      user.value = res.data
    }
    // 退课id
    const delId = ref('')

    return {
      setToken,
      token,
      getUser,
      user,
      id,
      setId,
      delId,
    }
  },
  {
    persist: true,
  },
)
