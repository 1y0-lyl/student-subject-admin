<script setup>
import { ref } from 'vue'
import channelSelect from './channelSelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { subAddChannelService, subEditSubjectService } from '@/api/subject'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'

const visibleDrawer = ref(false)
const editorRef = ref()

// 准备表单数据
const formModel = ref({
  courseId: '',
  courseName: '',
  img: '',
  desc: '',
  categoryId: '',
  categoryName: '',
})

// 图片上传预览
const imgUrl = ref('')
const onSelectFile = (selectFile) => {
  imgUrl.value = URL.createObjectURL(selectFile.raw)
  formModel.value.img = selectFile.raw
}

// 表单验证规则
const formRef = ref()
const rules = {
  courseName: [
    { required: true, message: '请输入课程标题', trigger: 'blur' },
    { pattern: /^\S{1,15}$/, message: '课程标题必须是1-15位的非空字符', trigger: 'blur' },
  ],
  categoryName: [{ required: true, message: '请选择课程分类', trigger: 'change' }],
  desc: [{ min: 1, max: 500, message: '课程内容必须在1-500个字符之间', trigger: 'blur' }],
  img: [{ required: true, message: '请上传课程封面图片', trigger: 'change' }],
}

// 提交
const emit = defineEmits(['success'])
const onSubmit = async () => {
  // 这里可以进行表单验证和提交逻辑
  await formRef.value.validate()
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.courseId) {
    // 编辑课程
    console.log('编辑课程数据:', formModel.value)
    await subEditSubjectService(fd)
    ElMessage.success('编辑课程成功')
  } else {
    // 新增课程
    console.log('新增课程数据:', formModel.value)
    await subAddChannelService(fd)
    ElMessage.success('新增课程成功')
  }
  emit('success', formModel.value)
  visibleDrawer.value = false
}

// 暴露方法open
const open = (row) => {
  visibleDrawer.value = true
  if (row.categoryId) {
    formModel.value = { ...row }
    imgUrl.value = row.img
  } else {
    formModel.value = {
      courseId: '',
      courseName: '',
      img: '',
      desc: '',
      categoryId: '',
      categoryName: '',
    }
    imgUrl.value = '' // 新增课程时重置图片预览
    editorRef.value.setHTML('')
  }
}

defineExpose({
  open,
})
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.courseId ? '编辑课程' : '新增课程'"
    direction="rtl"
    size="50%"
  >
    <el-form :model="formModel" ref="formRef" label-width="100px" :rules="rules">
      <el-form-item label="课程标题" prop="courseName">
        <el-input v-model="formModel.courseName" placeholder="请输入课程标题"></el-input>
      </el-form-item>
      <el-form-item label="课程分类" prop="categoryName">
        <channel-select v-model="formModel.categoryName" width="100%"></channel-select>
      </el-form-item>

      <!-- 课程封面图片 -->
      <el-form-item label="课程封面" prop="cover_img">
        <!-- 此处需要关闭自动上传 不需要配置action参数 只需要做前端的本地预览图片即可 -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.desc"
            contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
        <el-button type="danger" @click="visibleDrawer = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
