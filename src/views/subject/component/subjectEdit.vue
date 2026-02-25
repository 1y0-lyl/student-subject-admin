<script setup>
import { ref } from 'vue'
import channelSelect from './channelSelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { subAddChannelService, subEditSubjectService } from '@/api/subject'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { Plus } from '@element-plus/icons-vue'

//  抽屉的展示
const visibleDrawer = ref(false)
// 关联富文本编辑器
const editorRef = ref()

// 准备表单数据
const formModel = ref({
  // 课程id
  courseId: '',
  // 课程名
  courseName: '',
  // 图片
  img: '',
  // 课程描述
  desc: '',
  // 分类id
  categoryId: '',
  // 分类名
  categoryName: '',
})

// 图片上传预览
const imgUrl = ref('')
const onSelectFile = (selectFile) => {
  // 将选择的文件对象转换为可预览的 URL 地址，用于图片预览展示
  imgUrl.value = URL.createObjectURL(selectFile.raw)
  // 用于后续提交到服务器
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
  desc: [{ required: true, message: '请输入课程内容', trigger: 'blur' }],
  img: [{ required: true, message: '请上传课程封面图片', trigger: 'change' }],
}

function getPlainText(html) {
  // 创建一个元素
  const div = document.createElement('div')
  div.innerHTML = html
  // 返回纯文本内容 用于统计长度
  return div.textContent
}

// 失焦触发表单单项校验
const handleEditorBlur = () => {
  // 填入内容后再删除需要手动清空 不然会有br占位符阻碍规则校验
  if (getPlainText(formModel.value.desc).length == 0) {
    formModel.value.desc = ''
  }
  // 由于是富文本编辑器 所以需要手动校验
  formRef.value?.validateField('desc')
}

// 提交
const emit = defineEmits(['success'])
const onSubmit = async () => {
  // 表单提交预校验
  await formRef.value.validate()
  // 创建一个新的FormData对象
  const fd = new FormData()
  // 遍历表单数据对象formModel中的所有字段
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.courseId) {
    // 编辑课程
    await subEditSubjectService(fd)
    ElMessage.success('编辑课程成功')
  } else {
    // 新增课程
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
    // 重置表单数据
    formModel.value = {
      courseId: '',
      courseName: '',
      img: '',
      desc: '',
      categoryId: '',
      categoryName: '',
    }
    // 新增课程时重置图片预览
    imgUrl.value = ''
    // 富文本编辑器内容清空
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
      <el-form-item label="课程封面" prop="img">
        <el-upload
          v-model="formModel.img"
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- 富文本编辑器 -->
      <el-form-item label="课程内容" prop="desc">
        <div class="editor">
          <quill-editor
            placeholder="请输入课程内容..."
            @blur="handleEditorBlur"
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.desc"
            contentType="html"
          >
          </quill-editor>
        </div>
        <span style="color: #999">已写 {{ getPlainText(formModel.desc).length }} 字</span>
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
