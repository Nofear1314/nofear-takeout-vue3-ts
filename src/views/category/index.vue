<script setup lang="ts">
import {
  addCategoryApi,
  batchDelCategoryByIdsApi,
  getListCategoryPageApi,
  updateCategoryApi
} from '@/api/category'
import { CategoryTpeEnum } from '@/enums'
const columns: Table.Column<Category>[] = [
  { type: 'selection', label: '选择' },
  { label: '序号', type: 'index', width: '80' },
  {
    label: '分类名称',
    prop: 'categoryName',
    search: {
      el: 'text'
    }
  },
  {
    type: 'enum',
    label: '类型',
    prop: 'type',
    search: {
      el: 'select'
    },
    enum: [
      { label: '菜品', value: 1, type: 'danger' },
      { label: '套餐', value: 2, type: 'success' }
    ]
  },
  { label: '排序', prop: 'sort', sortable: true },
  {
    search: {
      el: 'select'
    },
    type: 'enum',
    label: '状态',
    prop: 'status',
    enum: [
      { label: '启用', value: 0, type: 'success' },
      { label: '禁用', value: 1, type: 'danger' }
    ]
  },
  { label: '创建时间', prop: 'addTime', 'show-overflow-tooltip': true },
  { label: '最近更新时间', prop: 'updateTime', 'show-overflow-tooltip': true },
  { label: '创建者', prop: 'addBy' },
  { label: '最近更新者', prop: 'updateBy' },
  { label: '描述', prop: 'description' },
  {
    label: '操作',
    prop: 'action',
    slot: 'action',
    width: 160,
    align: 'center',
    fixed: 'right'
  }
]
const tableRef = ref()
const selectionRows = ref<Category[]>([])
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要批量删除选中的数据吗？', '提示')
    await batchDelCategoryByIdsApi(selectionRows.value.map((c) => c.id!))
    tableRef.value?.loadData()
    ElMessage.success('删除成功')
  } catch (err) {
    console.error(err)
  }
}

const dialogTitle = ref<string>('')
const dialogVisible = ref<boolean>(false)
const openAddDialog = () => {
  dialogTitle.value = '添加分类'
  dialogVisible.value = true
}
const handleClose = () => {
  formRef.value?.resetFields()
  dialogVisible.value = false
  form.value = {
    id: undefined,
    type: CategoryTpeEnum.DISH,
    categoryName: '',
    status: 0,
    sort: 0,
    description: ''
  }
}

const formRef = useTemplateRef('formRef')
const form = ref<Category>({
  id: undefined,
  type: CategoryTpeEnum.DISH,
  categoryName: '',
  status: 0,
  sort: 0,
  description: ''
})
const rules = ref({
  categoryName: [
    { required: true, message: '请输入菜品名称', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

const submitForm = async () => {
  await formRef.value?.validate()
  const api = form.value.id ? updateCategoryApi : addCategoryApi
  await api(form.value)
  dialogVisible.value = false
  tableRef.value?.loadData()
  ElMessage.success(`${form.value.id ? '更新' : '添加'}成功`)
}

const handleEdit = (row: Category) => {
  dialogTitle.value = '编辑分类'
  dialogVisible.value = true
  form.value = { ...row }
}
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除选中的数据吗？', '提示')
    await batchDelCategoryByIdsApi([id])
    tableRef.value?.loadData()
    ElMessage.success('删除成功')
  } catch (err) {
    console.error(err)
  }
}

const getListCategoryPage = async (query: any) => {
  const { data } = await getListCategoryPageApi(query)
  return data
}
</script>

<template>
  <el-card>
    <!-- 表格区域 -->
    <TablePro
      ref="tableRef"
      :columns
      :request-api="getListCategoryPage"
      v-model:selectionRows="selectionRows"
    >
      <template #toolbar>
        <!-- 批量删除按钮 -->
        <el-button
          v-hasAuth="['sys:category:del']"
          icon="DocumentDelete"
          type="danger"
          @click="handleBatchDelete"
          :disabled="selectionRows.length === 0"
          >批量删除</el-button
        >
        <!-- 添加按钮 -->
        <el-button
          v-hasAuth="['sys:category:add']"
          type="primary"
          icon="Plus"
          @click="openAddDialog"
          >添加</el-button
        >
      </template>
      <template #action="{ row }">
        <!-- 编辑按钮 -->
        <el-tooltip :content="$translate('编辑')" placement="top">
          <el-button
            v-hasAuth="['sys:category:edit']"
            type="primary"
            icon="Edit"
            circle
            @click="handleEdit(row)"
          />
        </el-tooltip>

        <!-- 删除按钮 -->
        <el-tooltip :content="$translate('删除')" placement="top">
          <el-button
            v-hasAuth="['sys:category:del']"
            type="danger"
            icon="Delete"
            circle
            @click="handleDelete(row.id)"
          />
        </el-tooltip>
      </template>
    </TablePro>

    <!-- 弹框区域 -->
    <el-dialog
      :title="dialogTitle"
      draggable
      v-model="dialogVisible"
      @close="handleClose"
      style="width: 500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :value="1">菜品分类</el-radio>
            <el-radio :value="2">套餐分类</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="0">启用</el-radio>
            <el-radio :value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入"
            v-model="form.description"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped></style>
