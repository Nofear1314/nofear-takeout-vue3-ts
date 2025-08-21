<script setup lang="ts">
import {
  batchCancelAllocatedAdminApi,
  getAllocatedAdminListApi
} from '@/api/role'
import SelectAdminDialog from './selectAdminDialog.vue'
import { useMenuStore } from '@/stores/modules/menu'
const { handleDelTagViewByPath } = useMenuStore()
const route = useRoute()
const router = useRouter()
const columns = [
  { type: 'selection', label: '选择' },
  { type: 'index', label: '序号', width: '70' },
  {
    label: '用户名',
    prop: 'username'
  },
  {
    label: '昵称',
    prop: 'nickname',
    search: {
      el: 'text'
    }
  },
  { type: 'img', label: '头像', prop: 'avatar' },
  {
    label: '手机号',
    prop: 'phoneNumber'
  },
  {
    type: 'enum',
    label: '状态',
    prop: 'status',
    enum: [
      {
        label: '启用',
        value: 0,
        type: 'success'
      },
      {
        label: '禁用',
        value: 1,
        type: 'danger'
      }
    ]
  },
  {
    label: '邮箱',
    prop: 'email'
  },
  {
    label: '创建时间',
    prop: 'addTime',
    'show-overflow-tooltip': true
  },
  {
    label: '操作',
    width: 100,
    fixed: 'right',
    slot: 'action',
    prop: 'action'
  }
] as const satisfies Table.Column<AllocatedAdmin>[]
/**
 * 分页查询角色已授权用户列表
 * @param query 查询参数
 */
const getAllocatedAdminList: Table.RequestApi<
  AllocatedAdmin,
  typeof columns
> = async (query) => {
  const { data } = await getAllocatedAdminListApi({
    ...query,
    roleId: route.params.roleId
  } as unknown as AllocatedAdminListParam)
  return data
}
const selectionRows = ref<AllocatedAdmin[]>([])
const tableRef = ref()

/**
 * 关闭
 */
const handleClose = () => {
  const currentRoute = router.currentRoute.value
  // 关闭时当前路由的标签页面
  handleDelTagViewByPath(currentRoute.fullPath)
  router.go(-1)
}

const selectRef = ref()
const openSelectAdmin = () => {
  selectRef.value?.show()
}

const cancelAuthAdmin = (id: number) => {
  ElMessageBox.confirm('确定取消授权吗？', '提示')
    .then(async () => {
      await batchCancelAllocatedAdminApi({
        roleId: route.params.roleId as unknown as number,
        adminIds: [id]
      })
      ElMessage.success('取消授权成功')
      tableRef.value?.loadData()
    })
    .catch(() => {})
}
/**
 * 批量取消授权
 */
const batchCancelAuthAdmin = async () => {
  await ElMessageBox.confirm(
    `确定批量取消选中的${selectionRows.value.length}条数据的授权吗？`,
    '提示'
  )
  await batchCancelAllocatedAdminApi({
    roleId: route.params.roleId as unknown as number,
    adminIds: selectionRows.value.map((item) => item.id!)
  })
  ElMessage.success('取消授权成功')
  tableRef.value?.loadData()
}
</script>
<template>
  <div>
    <TablePro
      v-model:selectionRows="selectionRows"
      :searchFormConfig="{ labelWidth: '40px' }"
      :columns
      :request-api="getAllocatedAdminList"
      ref="tableRef"
    >
      <template #toolbar>
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="openSelectAdmin"
          v-hasAuth="['sys:role:add']"
          >添加用户</el-button
        >
        <el-button
          type="danger"
          plain
          icon="CircleClose"
          :disabled="!selectionRows.length"
          @click="batchCancelAuthAdmin"
          v-hasAuth="['sys:role:del']"
          >批量取消授权</el-button
        >
        <el-button type="warning" plain icon="Close" @click="handleClose"
          >关闭</el-button
        >
      </template>
      <template #action="{ row }">
        <el-tooltip :content="$translate('取消授权')" placement="top">
          <el-button
            type="danger"
            circle
            @click="cancelAuthAdmin(row.id)"
            icon="CircleClose"
            v-hasAuth="['sys:role:del']"
          ></el-button>
        </el-tooltip>
      </template>
    </TablePro>
    <SelectAdminDialog
      ref="selectRef"
      :roleId="route.params.roleId as string"
      @select-ok="tableRef?.loadData()"
    />
  </div>
</template>

<style lang="scss" scoped></style>
