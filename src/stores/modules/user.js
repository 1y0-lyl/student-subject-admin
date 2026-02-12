import { userInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'userMessage',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const user = ref({})
    const id = ref('')
    const setId = (newId) => {
      id.value = newId
    }
    const getUser = async (id) => {
      const res = await userInfoService(id) // 请求获取数据
      user.value = res.data
    }
    return {
      setToken,
      token,
      getUser,
      user,
      id,
      setId,
    }
  },
  {
    persist: true,
  },
)
