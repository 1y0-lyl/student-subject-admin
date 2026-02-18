<!-- 课程分类筛选组件 -->
<script setup>
import { subGetChannelService } from '@/api/subject'
import { ref } from 'vue'

// 接收父组件参数
defineProps({
  //回显选择框数据
  modelValue: {
    type: [Number, String],
  },
  // 选择框宽度
  width: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue'])
// 获取分类列表
const channelList = ref([])
const getChannelList = async () => {
  const res = await subGetChannelService()
  channelList.value = res.data.data.categoryList
}
getChannelList()
</script>

<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    placeholder="请选择课程分类"
    :style="{ width }"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.categoryId"
      :label="channel.name"
      :value="channel.categoryId"
    ></el-option>
  </el-select>
</template>
