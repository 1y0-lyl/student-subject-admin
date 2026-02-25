<script setup>
import { commentAddService, commentGetListService } from '@/api/comments'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 查看评价
// 评价信息
const commTitle = ref('')
const commentId = ref('')
const commentVisible = ref(false)
const commentList = ref([])

// 查询评价列表
const openComment = async (row) => {
  // 清空输入框内容
  commentContent.value.content = ''
  // 解决校验状态跨页面残留
  formRef.value?.resetFields()
  // 展示评论页面
  commentVisible.value = true
  // 查询评论列表
  const res = await commentGetListService(row.course.courseId)
  // 填充数据
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
// 评价内容信息
const userStore = useUserStore()
const commentContent = ref({
  // 课程id
  courseId: '',
  // 用户id
  userId: '',
  // 评论内容
  content: '',
})
// 提交
const onSubmitComment = async (text) => {
  // 这里可以进行评论内容的提交逻辑
  commentContent.value = {
    courseId: commentId.value,
    userId: userStore.user.data.userId,
    content: text,
  }
  // 预校验
  await formRef.value.validate()
  await commentAddService(commentContent.value)
  // 提示信息
  ElMessage.success('评论提交成功!')
  // 刷新评论列表
  const res = await commentGetListService(commentId.value)
  commentList.value = res.data.data
  // 提交后清空输入框内容
  commentContent.value.content = ''
}

// 暴露方法
defineExpose({
  openComment,
})
</script>

<template>
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
