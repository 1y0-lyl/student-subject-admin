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
import { commentAddService, commentGetListService } from '@/api/comments'
import 'element-plus/dist/index.css'

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
  await ElMessageBox.confirm('您确认要退选该课程吗？', '请确认', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
  await subDropSubjectService(row.course.courseId)
  ElMessage.success('退选课程成功')
  getSelectList()
}

// 查看评价
const commTitle = ref('')
const commentId = ref('')
const commentVisible = ref(false)
const commentList = ref([])
const openComment = async (row) => {
  commentVisible.value = true
  const res = await commentGetListService(row.course.courseId)
  commentList.value = res.data.data
  commTitle.value = row.course.courseName
  commentId.value = row.course.courseId
}

// 评论字数校验
const formRef = ref()
const rules = {
  content: [
    { required: true, message: '请输入评论内容', trigger: 'blur' },
    {
      min: 1,
      max: 200,
      message: '评论内容必须在1-200个字符之间',
      trigger: 'blur',
    },
  ],
}

// 发布评价
const commentContent = ref({
  courseId: '',
  userId: '',
  content: '',
})
const onSubmitComment = async (text) => {
  // 这里可以进行评论内容的提交逻辑
  commentContent.value = {
    courseId: commentId.value,
    userId: userStore.user.data.userId,
    content: text,
  }
  await formRef.value.validate()
  await commentAddService(commentContent.value)
  console.log(commentContent)

  ElMessage.success('评论提交成功!')
  // 刷新评论列表
  const res = await commentGetListService(commentId.value)
  commentList.value = res.data.data
  // 提交后清空输入框内容
  commentContent.value.content = ''
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
        <el-button type="success" size="small" @click="openComment(row)">评价</el-button>
      </template>
    </subject-list>
  </page-container>

  <!-- 课程详情弹窗 -->
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

  <!-- 评论弹框 -->
  <el-dialog
    v-model="commentVisible"
    title="课程评价"
    width="80%"
    center
    align-center
    style="height: 80%"
  >
    <h1>当前课程:{{ commTitle }}</h1>
    <div class="comment">
      <ul class="upper" v-infinite-scroll="load" style="overflow: auto">
        <li class="upper-comment" v-for="item in commentList" :key="item.reviewId">
          <!-- 上方头像部分 -->
          <div class="user">
            <el-avatar :src="item.avatar" />
          </div>
          <!-- 全部评论内容 -->
          <div class="content">
            <div class="username">{{ item.userName }}</div>
            <p class="text">{{ item.content }}</p>
            <div class="createTime">{{ item.createTime }}</div>
          </div>
        </li>
      </ul>
      <div class="lower">
        <!-- 下方用户部分 -->
        <div class="user">
          <div class="avatar">
            <el-avatar
              :src="
                userStore.user?.data?.avatar ||
                'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
              "
            />
          </div>
          <div class="username">{{ userStore.user.data.userName }}</div>
        </div>
        <!-- 我的评论内容 -->
        <el-form class="form" :rules="rules" ref="formRef" :model="commentContent">
          <el-form-item class="comm" prop="content">
            <el-input
              v-model="commentContent.content"
              class="my-comm"
              placeholder="发表你的看法"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span :class="{ active: commentContent.content.length > 200 }"
              >已写{{ commentContent.content.length }}/200字</span
            >
          </el-form-item>
          <el-form-item>
            <el-button
              class="submit"
              type="primary"
              @click="onSubmitComment(commentContent.content)"
              >提交评论</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
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
.comment {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  padding: 10px;
  margin: 5px;
  .upper {
    height: 40vh;
    display: flex;
    flex-direction: column;
    padding: 16px;
    padding-top: 0;
    .upper-comment {
      padding: 10px;
      display: flex;
      border-top: 1px solid #d9d9d9;
      .user {
        padding-right: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        top: 15px;
      }
      .createTime {
        padding-right: 5px;
        color: #999;
      }
      .username {
        color: #646464;
        position: relative;
        top: 5px;
      }
    }
  }
  .lower {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 10%;
    width: 75%;
    background-color: #fff;
    padding: 10px;
    .user {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: -10px;
      margin-right: 20px;
      position: relative;
    }
    .form {
      display: flex;
      width: 500px;
      .comm {
        position: relative;
        top: -5px;
        width: 1000px;
      }
      span {
        position: absolute;
        left: -80px;
        top: 40px;
        width: 100px;
        color: #999;
      }
      .active {
        color: red;
      }
      .submit {
        margin-left: 40px;
        position: relative;
        top: -2px;
      }
      .my-comm {
        width: 950px;
        height: 50px;
      }
    }
  }
}
</style>
