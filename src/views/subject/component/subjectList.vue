<!-- 课程列表组件 -->
<script setup>
import { ref } from 'vue'
import channelSelect from './channelSelect.vue'
import 'element-plus/dist/index.css'

const props = defineProps({
  // 课程列表
  allSubjectList: {
    type: Array,
  },
  // 获取课程列表方法
  getSubjectList: {
    type: Function,
  },
})

// 定义请求参数对象
const params = ref({
  //当前页
  page: 1,
  // 一页所能存放的条数
  pagesize: 2,
  // 分类id
  categoryld: '',
})

// 搜索操作
const isSearch = ref(false)
const onSearch = () => {
  if (params.value.categoryld !== '') {
    props.getSubjectList(params.value)
    isSearch.value = true
  }
}

// 重置操作
const handleReset = () => {
  // 只有选择了课程分类并且搜索后 点击重置才需要重新渲染
  if (params.value.categoryld !== '' && isSearch.value == true) {
    props.getSubjectList(params.value)
    isSearch.value = false
  }
  // 重置参数
  params.value.categoryld = ''
}

// 切换分页
const onCurrentChange = (page) => {
  params.value.page = page
  props.getSubjectList(params.value)
}
</script>

<template>
  <!-- 表单区域 -->
  <el-form inline width="100%">
    <el-form-item label="课程分类:">
      <channel-select v-model="params.categoryld" width="240px"></channel-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>

  <!-- 表格区域 -->
  <el-table :data="allSubjectList" style="width: 100%; height: 45vh" v-loading="loading">
    <el-table-column label="序号" type="index" width="100"></el-table-column>
    <slot name="list"></slot>
    <!-- 操作 -->
    <el-table-column label="操作" width="250">
      <template #default="{ row }">
        <slot :row="row"></slot>
      </template>
    </el-table-column>

    <!-- 空数据处理 -->
    <template #empty>
      <el-empty desciption="暂无数据"></el-empty>
    </template>
  </el-table>
  <!-- 分页区域 -->
  <el-pagination
    v-model:current-page="params.page"
    v-model:page-size="params.pagesize"
    layout="prev, pager, next"
    :total="allSubjectList.length"
    @current-change="onCurrentChange"
    style="margin-top: 30px; justify-content: flex-end"
  />
</template>
