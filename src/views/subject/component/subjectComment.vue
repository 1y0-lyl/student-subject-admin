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
  // 展示评论页面
  commentVisible.value = true
  // 查询评论列表
  const res = await commentGetListService(row.course.courseId)
  // 填充数据
  commentList.value = res.data.data
  commTitle.value = row.course.courseName
  commentId.value = row.course.courseId
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
  // 提交评论
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
    style="
      height: 80%;
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    "
  >
    <h1>当前课程:{{ commTitle }}</h1>
    <div class="comment">
      <div class="total">全部评论({{ commentList.length }})</div>
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
        <el-form class="form" :model="commentContent">
          <div class="comm">
            <el-input
              v-model="commentContent.content"
              class="my-comm"
              placeholder="发表你的看法"
              show-word-limit
              maxlength="200"
            ></el-input>
          </div>
          <el-button
            class="submit"
            type="primary"
            @click="onSubmitComment(commentContent.content)"
            :disabled="commentContent.content.trim().length <= 0"
            >提交评论</el-button
          >
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
    .upper-comment:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
  }
  .total {
    margin-top: -10px;
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
      .my-comm {
        border-radius: 45px;
        width: 950px;
        height: 50px;
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
        margin-left: 25px;
        position: relative;
        top: -2px;
      }
    }
  }
}
</style>
