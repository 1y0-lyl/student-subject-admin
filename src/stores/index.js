import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

// pinia统一配置
export default pinia
export * from './modules/user'
