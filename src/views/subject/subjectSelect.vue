<!-- 我的选课列表 -->
<script setup>
import pageContainer from '@/components/pageContainer.vue'
import subjectList from './component/subjectList.vue'
import { ref } from 'vue'
import {
  subDropSubjectService,
  subGetSelectInfoService,
  subGetSubjectDetailService,
} from '@/api/subject'
import { useUserStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/dist/index.css'
import subjectComment from './component/subjectComment.vue'

const loading = ref(false)
const selectList = ref([])

// 获取选课列表
const userStore = useUserStore()
const params = ref({
  userId: userStore.user.data.userId,
  page: 1,
  pagesize: 2,
})
const getSelectList = async () => {
  loading.value = true
  const res = await subGetSelectInfoService(params.value)
  selectList.value = res.data.data.enrollmentList
  loading.value = false
}
getSelectList()

// 查看课程详情
const detail = ref({})
const detailVisible = ref(false)
const openDetail = async (row) => {
  const res = await subGetSubjectDetailService(row.course.courseId)
  detail.value = res.data.data
  detailVisible.value = true
}

// 退选操作
const deleteSelect = async (row) => {
  // 提示框
  await ElMessageBox.confirm('您确认要退选该课程吗？', '请确认', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
  // 退课接口
  await subDropSubjectService(row.course.courseId)
  ElMessage.success('退选课程成功')
  // 重新渲染
  getSelectList()
}

// 打开评论页面
const commentRef = ref('')
const openCo = (row) => {
  commentRef.value.openComment(row)
}
</script>

<template>
  <page-container title="我的已选课程" v-loading="loading">
    <subject-list :allSubjectList="selectList" :getSubjectList="getSelectList" v-loading="loading">
      <template #list>
        <el-table-column prop="course.courseName" label="课程标题" width="200"></el-table-column>
        <el-table-column prop="course.img" label="课程图片" width="240">
          <template #default="{ row }">
            <el-image :src="row.course.img" style="width: 100px; height: 60px"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="course.cateName" label="课程分类" width="200"></el-table-column>
        <el-table-column prop="enrollTime" label="选课时间" width="265"></el-table-column>
      </template>
      <template #default="{ row }">
        <el-button type="danger" size="small" @click="deleteSelect(row)">退选</el-button>
        <el-button type="primary" size="small" @click="openDetail(row)">详情</el-button>
        <el-button type="success" size="small" @click="openCo(row)">评价</el-button>
      </template>
    </subject-list>
  </page-container>

  <!-- 课程详情弹框 -->
  <el-dialog v-model="detailVisible" title="课程详情" width="500" center align-center>
    <h1>课程:{{ detail.courseName }}</h1>
    <div class="courseId">课程ID:{{ detail.courseId }}</div>
    <div class="cate">课程分类:{{ detail.categoryName }}</div>
    <el-image :src="detail.img" style="width: 100%; height: 300px; margin: 20px 0" :fit="fit" />
    <div class="desc">
      <p>{{ detail.desc }}</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>

  <subject-comment ref="commentRef"></subject-comment>
</template>

<style lang="scss" scoped>
.courseId {
  margin-top: -20px;
  color: #999;
}
.cate {
  color: #999;
}
.desc {
  margin-top: -20px;
}
</style>
