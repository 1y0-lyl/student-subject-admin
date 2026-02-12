<!-- 课程列表页面 -->
<script setup>
import {
  subDeleteSubjectService,
  subGetSubjectService,
  subSelectSubjectService,
} from '@/api/subject'
import pageContainer from '@/components/pageContainer.vue'
import subjectList from './component/subjectList.vue'
import { ref } from 'vue'
import subjectEdit from './component/subjectEdit.vue'
import { useUserStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const subjectEditRef = ref('')

// 定义请求参数对象
const params = ref({
  page: 1, //当前页
  pagesize: 2,
  categoryld: '',
})

// 课程列表
const allSubjectList = ref([])

// 获取课程列表
const getSubjectList = async () => {
  allSubjectList.value = []
  loading.value = true
  const res = await subGetSubjectService(params.value)
  allSubjectList.value = res.data.data.courseList
  loading.value = false
}
getSubjectList()

// 新增课程操作
const onAdd = () => {
  subjectEditRef.value.open({})
}

// 编辑课程操作
const onEdit = (row) => {
  subjectEditRef.value.open(row)
}

// 删除课程操作
const onDel = async (row) => {
  await ElMessageBox.confirm('您确认要删除该课程吗？', '请确认', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
  await subDeleteSubjectService(row.courseId)
  ElMessage.success('删除课程成功')
  getSubjectList()
}

// 选课状态
const userStore = useUserStore()

// 选课操作
const onSelect = async (row) => {
  await subSelectSubjectService({
    userId: userStore.user.data.userId,
    courseId: row.courseId,
  })
  row.isSelect = true
  ElMessage.success('选课成功!')
}
</script>

<template>
  <page-container title="课程列表" v-loading="loading">
    <template #button>
      <el-button type="primary" plain @click="onAdd">新增课程</el-button>
    </template>
    <subject-list :allSubjectList="allSubjectList" :getSubjectList="getSubjectList">
      <template #list>
        <el-table-column prop="courseName" label="课程标题" width="260"></el-table-column>
        <el-table-column prop="img" label="课程图片" width="340">
          <template #default="{ row }">
            <el-image :src="row.img" style="width: 100px; height: 100px" :fit="fit" />
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="课程分类" width="300"></el-table-column>
      </template>
      <template #default="{ row }">
        <el-button type="success" size="small" :disabled="row.isSelect" @click="onSelect(row)"
          >选课</el-button
        >
        <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
        <el-button type="danger" size="small" @click="onDel(row)">删除</el-button>
      </template>
    </subject-list>
  </page-container>

  <!-- 抽屉 -->
  <subject-edit ref="subjectEditRef" @success="getSubjectList"></subject-edit>
</template>
