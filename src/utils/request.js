import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://127.0.0.1:4523/m1/7795787-7542560-7084436'
const instance = axios.create({
  // 基地址
  baseURL,
  // 超时时间
  timeout: '10000',
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    //在请求头携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err),
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 处理业务成功
    if (res.data.code == 200) {
      return res
    }
    // 处理业务失败
    ElMessage.error(res.data.message || '服务器异常，请重试')
    return Promise.reject(res.data)
  },
  (err) => {
    // 401错误
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 错误的默认情况
    ElMessage.error(err.response.data.message || '服务器异常，请重试')
    return Promise.reject(err)
  },
)

export default instance
