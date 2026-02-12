<!-- 课程分类页面 -->
<script setup>
import 'element-plus/dist/index.css'
import pageContainer from '@/components/pageContainer.vue'
import { ref } from 'vue'
import channelEdit from './component/channelEdit.vue'
import { subDeleteChannelService, subGetChannelService } from '@/api/subject'
import { ElMessage, ElMessageBox } from 'element-plus'

const visDia = ref()
// 加载状态
const loading = ref(false)

const pageState = ref({
  page: 1,
  pagesize: 2,
})
// 分类列表
const channelList = ref([])
const getChannelList = async () => {
  loading.value = true
  const res = await subGetChannelService()
  channelList.value = res.data.data.categoryList
  // 向后代组件提供数据
  loading.value = false
}
getChannelList()

// 分页操作
const onCurrentChange = (page) => {
  pageState.value.page = page
  getChannelList(pageState.value)
  console.log(1)
}

// 增加分类操作
const onAddClass = () => {
  visDia.value.open({})
}

// 编辑分类操作
const onEditClass = (row, $index) => {
  visDia.value.open(row, $index)
}

// 删除分类操作
const onDelClass = async (row) => {
  await ElMessageBox.confirm('您确认删除吗？', '请确认', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
  await subDeleteChannelService(row.categoryId)
  ElMessage.success('删除分类成功')
  getChannelList()
}

const onSuccess = (data) => {
  console.log(data)
  // if (data.categoryId) {
  //   // 编辑分类成功
  //   const index = channelList.value.findIndex((item) => item.categoryId === data.categoryId)
  //   if (index !== -1) {
  //     channelList.value[index] = data
  //   }
  // } else {
  //   // 新增分类成功
  //   channelList.value.push(data)
  // }
  getChannelList()
}
</script>

<template>
  <page-container title="课程分类">
    <template #button>
      <el-button type="primary" plain @click="onAddClass">添加分类</el-button>
    </template>
    <!-- 分类表格区域 -->
    <el-table :data="channelList" style="width: 100%; height: 45vh" v-loading="loading">
      <el-table-column label="序号" type="index" width="100"></el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>
      <el-table-column prop="desc" label="分类描述"></el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row, $index }">
          <el-button type="success" @click="onEditClass(row, $index)">编辑分类</el-button>
          <el-button type="danger" @click="onDelClass(row)">删除分类</el-button>
        </template>
      </el-table-column>
      <!-- 空数据处理 -->
      <template #empty>
        <el-empty desciption="暂无数据"></el-empty>
      </template>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="pageState.page"
      v-model:page-size="pageState.pagesize"
      layout="prev, pager, next"
      :total="channelList.length"
      @current-change="onCurrentChange"
      style="margin-top: 30px; justify-content: flex-end"
    />

    <!-- 弹框 -->
    <channel-edit ref="visDia" @success="onSuccess"></channel-edit>
  </page-container>
</template>
