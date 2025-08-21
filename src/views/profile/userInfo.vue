<script setup lang="ts">
import { FormItemRule } from 'element-plus'
import { Arrayable } from 'element-plus/es/utils'
import { updateAdminApi } from '@/api/admin'
import { useMenuStore } from '@/stores/modules/menu'
const router = useRouter()
const menuStore = useMenuStore()
const props = defineProps({
  user: {
    type: Object
  }
})

const formRef = useTemplateRef('formRef')

const form = ref({} as AdminInfo)
const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
  nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  phoneNumber: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ]
}

/** 提交按钮 */
const submit = async () => {
  await formRef.value?.validate()
  await updateAdminApi(form.value as unknown as Admin)
  ElMessage.success('修改成功')
}

/** 关闭按钮 */
function close() {
  router.go(-1)
  menuStore.handleDelTagViewByPath(router.currentRoute.value.fullPath)
}

// 回显当前登录用户信息
watch(
  () => props.user,
  (user) => {
    if (user) {
      form.value = {
        id: user.id,
        nickname: user.nickname,
        phoneNumber: user.phoneNumber,
        email: user.email,
        gender: user.gender
      } as AdminInfo
    }
  },
  { immediate: true }
)
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model="form.nickname" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phoneNumber">
      <el-input v-model="form.phoneNumber" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="form.gender">
        <el-radio :value="0">男</el-radio>
        <el-radio :value="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
