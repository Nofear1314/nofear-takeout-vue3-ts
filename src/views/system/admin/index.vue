<script setup lang="ts">
import {
  addAdminApi,
  assignRolesApi,
  delAdminByIdsApi,
  getAdminPageListApi,
  resetPwdByIdApi,
  updateAdminApi
} from '@/api/admin'

import { FormItemRule } from 'element-plus'
import { Arrayable } from 'element-plus/es/utils'
import UploadAvatar from '@/components/UploadImg/index.vue'
import { getRoleListPageApi } from '@/api/role'
defineOptions({
  name: 'Admin'
})
/**
 * 表格ref
 */
const tableRef = ref()
/**
 * 选择的表格数据行
 */
const selection = ref<Admin[]>([])
/**
 * 表格列配置
 */
const columns = [
  { type: 'selection', label: '选择', fixed: 'left' },
  { type: 'index', label: '序号', width: '80' },
  {
    label: '用户名',
    prop: 'username'
  },
  {
    label: '昵称',
    prop: 'nickname',
    search: {
      el: 'text',
      labelWidth: '40'
    }
  },
  { label: '邮箱', prop: 'email', width: '100' },
  { label: '头像', prop: 'avatar', type: 'img' },
  {
    label: '最后一次登录时间',
    prop: 'lastLoginTime'
  },
  {
    label: '最后一次登录IP',
    prop: 'lastLoginIp'
  },
  { label: '手机号', prop: 'phoneNumber', width: '140' },
  {
    type: 'enum',
    label: '性别',
    prop: 'gender',
    search: {
      el: 'select'
    },
    enum: [
      { label: '男', value: 0 },
      { label: '女', value: 1 },
      { label: '未知', value: 2 }
    ]
  },
  {
    type: 'enum',
    label: '状态',
    prop: 'status',
    search: {
      el: 'select'
    },
    enum: [
      { label: '正常', value: 0, type: 'success' },
      { label: '停用', value: 1, type: 'danger' }
    ]
  },
  {
    label: '创建时间',
    prop: 'addTime',
    'show-overflow-tooltip': true
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    'tooltip-formatter'(row) {
      return row.updateTime!
    },
    'show-overflow-tooltip': true
  },
  { label: '创建者', prop: 'addBy' },
  { label: '更新者', prop: 'updateBy' },
  { label: '描述', prop: 'description' },
  {
    label: '操作',
    prop: 'action',
    slot: 'action',
    fixed: 'right',
    width: '180',
    align: 'center',
    mustShow: true
  }
] as const satisfies Table.Column<Admin>[]

/**
 * 编辑
 * @param row 行数据
 */
const handleEdit = (row: Admin) => {
  dialogTitle.value = '编辑'
  form.value = row
  dialogVisible.value = true
}
/**
 * 删除
 * @param id 行id
 */
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定删除吗？', '提示')
  await delAdminByIdsApi([id])
  ElMessage.success('删除成功')
  tableRef.value?.loadData()
}
/**
 * 重置密码
 * @param id id
 */
const handleResetPassword = async (row: Admin) => {
  try {
    const { value } = await ElMessageBox.prompt(
      `请输入" ${row.nickname} "的新密码`,
      '提示',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
        inputValidator(value) {
          if (/<|>|"|'|\||\\/.test(value)) {
            return '不能包含非法字符：< > " \' \\\ |'
          }
          return true
        }
      }
    )
    await resetPwdByIdApi({ id: row.id!, password: value })
    ElMessage.success('重置密码成功,新密码是:' + value)
  } catch (err) {
    console.info(err)
  }
}
/**
 * 编辑/添加 admin弹框是否显示
 */
const dialogVisible = ref(false)
/**
 * 编辑/添加 admin弹框标题
 */
const dialogTitle = ref('')
/**
 * 编辑/添加 admin弹框表单ref
 */
const formRef = useTemplateRef('formRef')
const form = ref<Admin>({
  id: undefined,
  nickname: '',
  status: 0,
  gender: 0,
  email: '',
  phoneNumber: '',
  description: '',
  username: '',
  avatar: '',
  password: ''
})

const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, max: 10, message: '密码长度在 4 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ]
}

/**
 * 提交表单
 */
const submitForm = async () => {
  await formRef.value?.validate()
  const api = form.value.id ? updateAdminApi : addAdminApi
  await api(form.value)
  ElMessage.success(`${form.value.id ? '修改' : '添加'}成功`)
  dialogVisible.value = false
  tableRef.value?.loadData()
}
/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '确定批量删除选中的' + selection.value.length + '条数据吗？',
      '提示'
    )
    await delAdminByIdsApi(selection.value.map((role) => role.id!))
    tableRef.value?.loadData()
    ElMessage.success('删除成功')
  } catch (err) {
    console.error(err)
  }
}
/**
 * 打开操作弹框
 */
const openAddDialog = () => {
  dialogTitle.value = '添加'
  dialogVisible.value = true
}

const handleClose = () => {
  formRef.value?.resetFields()
  dialogVisible.value = false
  form.value = {
    id: undefined,
    nickname: '',
    status: 0,
    gender: 0,
    email: '',
    phoneNumber: '',
    description: '',
    username: '',
    avatar: '',
    password: ''
  }
}
/**
 * 分配角色需提交的参数
 */
const assignRoleData = ref<{ id: number | undefined; roleIds: number[] }>({
  //要分配角色的管理员id
  id: undefined,
  // 分配的角色id数组
  roleIds: []
})
const assignRolesDialogVisible = ref(false)
const assignRoleTableRef = shallowRef()
/**
 * 可以分配的角色列表
 */
const roleList = ref<Role[]>([])
/**
 * 分配角色弹框表格中选中的角色数据
 */
const selectRoles = ref<Role[]>([])
const assignRoleFormColumns = [
  { type: 'selection', label: '选择', width: '50' },
  { label: '角色编号', prop: 'id' },
  {
    label: '角色名称',
    prop: 'roleName'
  },
  { label: '权限字符串', prop: 'roleKey' },
  { label: '创建时间', prop: 'addTime' },
  {
    label: '角色描述',
    prop: 'description'
  }
] as const satisfies Table.Column<Role>[]

/**
 * 获取可以分配的角色列表
 */
const getRolesDialogData: Table.RequestApi<
  Role,
  typeof assignRoleFormColumns
> = async (query) => {
  const { data } = await getRoleListPageApi(query)
  //去掉超级管理员
  roleList.value = data.list = data.list.splice(1)
  data.total = data.total - 1

  // 数据加载完成后，检查是否需要选中角色
  if (assignRolesDialogVisible.value && assignRoleData.value.id) {
    nextTick(selectAssignedRoles)
  }
  assignRoleTableRef.value.toggleRowSelection(roleList.value[0], true)

  return data
}
/**
 * 提交分配角色表单
 */
const submitAssignRoles = async () => {
  if (assignRoleData.value.id) {
    await assignRolesApi({
      ...assignRoleData.value,
      roleIds: selectRoles.value.map((role) => role.id!)
    } as AssignRolesParams)
    ElMessage.success('分配角色成功')
    assignRolesDialogVisible.value = false
    tableRef.value?.loadData()
  }
}

/**
 * 点击分配角色按钮
 * @param row 行数据
 */
const handleAssignRoles = (row: Admin) => {
  assignRolesDialogVisible.value = true
  assignRoleData.value.id = row.id
  assignRoleData.value.roleIds =
    row.roles!.map((role) => role.id!).filter(Boolean) ?? []
}
/**
 * 分配角色对话框打开回调
 */
const handleAssignRoleDiaOpen = () => {
  // 重置选中状态
  selectRoles.value = []
  if (assignRoleTableRef.value) {
    assignRoleTableRef.value.clearSelection()
  }
  // 选中已分配角色
  selectAssignedRoles()
}
/**
 * 选中已分配角色
 */
const selectAssignedRoles = () => {
  roleList.value.forEach((item) => {
    if (assignRoleData.value.roleIds.includes(item.id!)) {
      assignRoleTableRef.value.toggleRowSelection(item, true)
      // 同时更新选中状态变量
      if (!selectRoles.value.some((role) => role.id === item.id)) {
        selectRoles.value.push(item)
      }
    }
  })
}

/**
 * 分配角色对话框关闭
 */
const handleAssignRoleDiaClose = () => {
  assignRoleData.value = {
    id: undefined,
    roleIds: []
  }
  assignRoleTableRef.value.clearSelection()
  selectRoles.value = []
}
/**
 * 查询数据
 * @param params 查询参数
 */
const fetchTableData: Table.RequestApi<Admin, typeof columns> = async (
  params
) => {
  const { data } = await getAdminPageListApi({
    ...params
  })
  return data
}
</script>

<template>
  <div>
    <!-- 表格区域 -->
    <TablePro
      size="small"
      :request-api="fetchTableData"
      :searchFormConfig="{ searchBtnLabelWidth: '30' }"
      :columns
      ref="tableRef"
      v-model:selection-rows="selection"
    >
      <template #toolbar>
        <!-- 批量删除按钮 -->
        <el-button
          icon="DocumentDelete"
          type="danger"
          size="small"
          v-hasAuth="['sys:admin:del']"
          @click="handleBatchDelete"
          :disabled="selection.length === 0"
          >批量删除</el-button
        >
        <!-- 添加按钮 -->
        <el-button
          v-hasAuth="['sys:admin:add']"
          type="primary"
          icon="Plus"
          size="small"
          @click="() => openAddDialog()"
          >添加</el-button
        >
      </template>
      <template #action="{ row }">
        <div v-if="row.id !== 1">
          <!-- 编辑按钮 -->
          <el-tooltip :content="$translate('编辑')" placement="top">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              circle
              v-hasAuth="['sys:admin:edit']"
              @click="handleEdit(row)"
            />
          </el-tooltip>

          <!-- 删除按钮 -->
          <el-tooltip :content="$translate('删除')" placement="top">
            <el-button
              v-hasAuth="['sys:admin:del']"
              size="small"
              type="danger"
              icon="Delete"
              circle
              @click="handleDelete(row.id)"
            />
          </el-tooltip>

          <!-- 重置密码按钮 -->
          <el-tooltip :content="$translate('重置密码')" placement="top">
            <el-button
              type="success"
              circle
              size="small"
              v-hasAuth="['sys:admin:resetPwd']"
              @click="handleResetPassword(row)"
              icon="Key"
            />
            >
          </el-tooltip>

          <!-- 分配角色按钮 -->
          <el-tooltip :content="$translate('分配角色')" placement="top">
            <el-button
              type="success"
              circle
              size="small"
              @click="handleAssignRoles(row)"
              v-hasAuth="['sys:admin:assign']"
              icon="Operation"
            />

            >
          </el-tooltip>
        </div>
      </template>
    </TablePro>

    <!-- 弹框表单区域 -->
    <el-dialog
      @close="handleClose"
      draggable
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="form" label-width="80" :rules ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.id">
          <el-input type="password" v-model="form.password" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber" v-if="!form.id">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item label="头像">
          <UploadAvatar v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio :value="0">男</el-radio>
            <el-radio :value="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="0">正常</el-radio>
            <el-radio :value="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="2" v-model="form.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色弹框 -->
    <el-dialog
      v-model="assignRolesDialogVisible"
      title="分配角色"
      @close="handleAssignRoleDiaClose"
      width="800px"
      @open="handleAssignRoleDiaOpen"
      append-to-body
      top="5vh"
      draggable
    >
      <TablePro
        @table-ready="selectAssignedRoles"
        v-model:selectionRows="selectRoles"
        ref="assignRoleTableRef"
        :columns="assignRoleFormColumns"
        :request-api="getRolesDialogData"
      ></TablePro>
      <template #footer>
        <el-button @click="assignRolesDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssignRoles">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
