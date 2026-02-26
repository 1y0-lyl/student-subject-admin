<!-- 课程分类页面 -->
<script setup>
import 'element-plus/dist/index.css'
import pageContainer from '@/components/pageContainer.vue'
import { ref } from 'vue'
import channelEdit from './component/channelEdit.vue'
import { subDeleteChannelService, subGetChannelService } from '@/api/subject'
import { ElMessage, ElMessageBox } from 'element-plus'

// 可见状态
const visDia = ref()
// 加载状态
const loading = ref(false)
// 接口传递参数
const pageState = ref({
  page: 1,
  pagesize: 2,
})
// 分类列表
const channelList = ref([])
// 获取分类列表
const getChannelList = async (page) => {
  // 展示加载
  loading.value = true
  const res = await subGetChannelService(page)
  // 更新分类列表数据
  channelList.value = res.data.data.categoryList
  // 描述为空时的处理
  channelList.value.forEach((item) => {
    if (!item.desc) {
      item.desc = '暂无描述'
    }
  })
  // 关闭加载
  loading.value = false
}
getChannelList(pageState.value)

// 分页操作
const onCurrentChange = (page) => {
  pageState.value.page = page
  // 重新渲染
  getChannelList(pageState.value)
}

// 增加分类操作
const onAddClass = () => {
  // 传递空对象
  visDia.value.open({})
}

// 编辑分类操作
const onEditClass = (row) => {
  // 传递当前行数据
  visDia.value.open(row)
}

// 删除分类操作
const onDelClass = async (row) => {
  // 弹出提示框
  await ElMessageBox.confirm('您确认删除该分类吗？', '请确认', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
  await subDeleteChannelService(row.categoryId)
  ElMessage.success('删除分类成功')
  // 重新渲染
  getChannelList()
}

// 提交后重新渲染
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="课程分类">
    <template #button>
      <el-button type="primary" plain @click="onAddClass">添加分类</el-button>
    </template>
    <!-- 分类表格区域 -->
    <el-table :data="channelList" style="width: 100%; height: 53vh" v-loading="loading">
      <el-table-column label="序号" type="index" width="100"></el-table-column>
      <el-table-column prop="name" label="分类名称" width="250"></el-table-column>
      <el-table-column prop="desc" label="分类描述"></el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button type="success" @click="onEditClass(row)">编辑分类</el-button>
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
