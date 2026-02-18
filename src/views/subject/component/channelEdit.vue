<!-- 课程分类编辑/添加 弹窗组件 -->
<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { subAddChannelService, subEditChannelService } from '@/api/subject'
const dialogFormVisible = ref(false)

// 表单数据
const formModel = ref({
  categoryId: '',
  name: '',
  desc: '',
})

// 表单规则
const formRef = ref()
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' },
  ],
  desc: [
    {
      min: 1,
      max: 20,
      message: '分类描述必须在1-20个字符之间',
      trigger: 'blur',
    },
  ],
}

// 提交
// 自定义success事件
const emit = defineEmits(['success'])
const onSubmit = async () => {
  // 提交前预校验
  await formRef.value.validate()
  // 根据传递参数判断操作类型
  if (formModel.value.categoryId) {
    // 编辑分类
    await subEditChannelService(formModel.value)
    ElMessage.success('编辑分类成功')
  } else {
    // 新增分类
    await subAddChannelService(formModel.value)
    ElMessage.success('新增分类成功')
  }
  // 传递参数
  emit('success', formModel.value)
  // 关闭弹框
  dialogFormVisible.value = false
}

// 向外暴露open方法
const open = async (row) => {
  // 展示弹框
  dialogFormVisible.value = true
  // 回显数据
  formModel.value = { ...row }
}

defineExpose({
  open,
})
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="formModel.categoryId ? '编辑分类' : '新增分类'"
    width="500"
    align-center="true"
  >
    <el-form :model="formModel" label-width="100px" size="large" :rules="rules" ref="formRef">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类描述" prop="desc">
        <el-input v-model="formModel.desc" placeholder="请输入分类描述"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
