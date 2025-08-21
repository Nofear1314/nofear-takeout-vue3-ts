<script setup lang="ts">
import { batchAllocatedSelectAdminApi, getUnallocatedListApi } from '@/api/role'

const props = defineProps({
  roleId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['select-ok'])
const tableRef = ref()
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
  }
] as const satisfies Table.Column<UnallocatedAdmin>[]
const visible = ref(false)

const selectionRows = ref<UnallocatedAdmin[]>([])
const getUnallocatedList: Table.RequestApi<
  UnallocatedAdmin,
  typeof columns
> = async (query) => {
  const { data } = await getUnallocatedListApi({
    roleId: props.roleId as number,
    ...query
  })
  return data
}

/**
 * 选择授权用户操作
 */
const handleSelectAdmin = async () => {
  const roleId = props.roleId as number
  const aIds = selectionRows.value.map((item: UnallocatedAdmin) => item.id!)
  await batchAllocatedSelectAdminApi({ roleId, adminIds: aIds })
  visible.value = false
  emit('select-ok')
  ElMessage.success('选择授权成功')
}

// 显示弹框
const show = () => {
  visible.value = true
  tableRef.value?.loadData()
}
//关闭弹框
const close = () => {
  //清空所有选择
  tableRef.value!.clearSelection()
}
defineExpose({
  show
})
</script>

<template>
  <!-- 授权用户 -->
  <el-dialog
    title="选择用户"
    v-model="visible"
    width="800px"
    append-to-body
    @close="close"
    top="5vh"
    draggable
  >
    <TablePro
      size="small"
      v-model:selectionRows="selectionRows"
      :searchFormConfig="{ labelWidth: '40px' }"
      :columns
      :request-api="getUnallocatedList"
      ref="tableRef"
    >
    </TablePro>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="handleSelectAdmin"
          :disabled="!selectionRows.length"
          >确 定</el-button
        >
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
