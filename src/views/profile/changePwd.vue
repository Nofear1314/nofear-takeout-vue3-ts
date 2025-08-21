<template>
  <el-form ref="formRef" :model="data" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="data.oldPassword"
        placeholder="请输入旧密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="data.newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="data.confirmPassword"
        placeholder="请确认新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { updatePwdApi } from '@/api/admin'
import { useMenuStore } from '@/stores/modules/menu'
import { FormItemRule } from 'element-plus'
import { Arrayable } from 'element-plus/es/utils'
const router = useRouter()
const menuStore = useMenuStore()
const formRef = useTemplateRef('formRef')
const data = reactive<
  Partial<UpdatePwdParams> & {
    confirmPassword?: string
  }
>({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
})

const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^[^<>"'|\\]+$/,
      message: '不能包含非法字符：< > " \' \\\ |',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      required: true,
      validator: (rule, value, callback) => {
        if (data.newPassword !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

/** 提交按钮 */
async function submit() {
  await formRef.value?.validate()
  await updatePwdApi(data as UpdatePwdParams)
  ElMessage.success('修改成功,请重新登录')
  formRef.value?.resetFields()
}

/** 关闭按钮 */
function close() {
  router.go(-1)
  menuStore.handleDelTagViewByPath(router.currentRoute.value.fullPath)
}
</script>
