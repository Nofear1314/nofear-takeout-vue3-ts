<script setup lang="ts">
import Upload from '@/components/UploadImg/index.vue'
import { getListCategoryPageApi } from '@/api/category'
import {
  addDishApi,
  batchDelDishByIdsApi,
  getListDishPageApi,
  updateDishApi
} from '@/api/dish'
import { FormItemRule } from 'element-plus'
import { Arrayable } from 'element-plus/es/utils'

const categoryList = ref<Category[]>([])

const getListCategory = async () => {
  const { data } = await getListCategoryPageApi()
  categoryList.value = data.list
}
await getListCategory()

// 使用计算属性创建响应式枚举数组
const categoryEnum = computed(() => {
  return categoryList.value.map((c) => {
    return {
      label: c.categoryName,
      value: c.id! // 确保值类型一致
    }
  })
})
console.log('🚀 ~ categoryEnum ~ categoryEnum:', categoryEnum.value)
//表格列配置
const columns: Table.Column<Dish>[] = [
  { type: 'selection', label: '选择' },
  { label: '序号', type: 'index', width: '80' },
  {
    label: '菜品名称',
    prop: 'dishName',
    search: {
      el: 'text'
    }
  },
  {
    label: '菜品价格',
    prop: 'price',
    'show-overflow-tooltip': true,
    formatter(row) {
      return `￥${row.price.toFixed(2)}`
    }
  },
  {
    type: 'enum',
    label: '菜品分类',
    prop: 'categoryId',
    enum: categoryEnum.value,
    search: {
      el: 'select'
    }
  },
  { label: '菜品图片', prop: 'img', type: 'img' },
  {
    label: '售卖状态',
    prop: 'status',
    type: 'enum',
    enum: [
      {
        label: '正常',
        value: 0,
        type: 'success'
      },
      {
        label: '停售',
        value: 1,
        type: 'danger'
      }
    ],
    search: {
      el: 'select'
    }
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
//表格ref
const tableRef = ref()
//表格多选中的行数据集合
const selectionRows = ref<Dish[]>([])
/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要批量删除选中的数据吗？', '提示')
    await batchDelDishByIdsApi(selectionRows.value.map((c) => c.id!))
    tableRef.value?.loadData()
    ElMessage.success('删除成功')
  } catch (err) {
    console.error(err)
  }
}
/**
 * 操作框标题
 */
const dialogTitle = ref<string>('')
/**
 * 操作框是否显示
 */
const dialogVisible = ref<boolean>(false)
/**
 * 打开添加对话框
 */
const openAddDialog = () => {
  dialogTitle.value = '添加菜品'
  dialogVisible.value = true
}
/**
 * 关闭对话框
 */
const handleClose = () => {
  formRef.value?.resetFields()
  dialogVisible.value = false
  form.value = {
    id: undefined,
    dishName: '',
    status: 0,
    description: '',
    img: '',
    price: 0,
    categoryId: ''
  }
}

/**
 * 表单ref
 */
const formRef = useTemplateRef('formRef')
/**
 * 表单数据
 */
const form = ref<Dish>({
  id: undefined,
  dishName: '',
  status: 0,
  description: '',
  price: 0.0,
  img: '',
  categoryId: ''
})
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
  dishName: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  img: [{ required: true, message: '请上传图片', trigger: 'blur' }]
})

const submitForm = async () => {
  await formRef.value?.validate()
  const api = form.value.id ? updateDishApi : addDishApi
  const formValue = form.value
  await api(form.value)
  dialogVisible.value = false
  tableRef.value?.loadData()
  ElMessage.success(`${form.value.id ? '更新' : '添加'}成功`)
}

const handleEdit = (row: Dish) => {
  dialogTitle.value = '编辑菜品'
  dialogVisible.value = true
  console.log('🚀 ~ submitForm ~ formValue:', row)

  form.value = {
    ...row
  }
}
const handleDelete = async (id: number) => {
  console.log('🚀 ~ handleDelete ~ id:', id)
  try {
    await ElMessageBox.confirm('确定要删除选中的数据吗？', '提示')
    await batchDelDishByIdsApi([id])
    tableRef.value?.loadData()
    ElMessage.success('删除成功')
  } catch (err) {
    console.error(err)
  }
}

/**
 * 获取菜品分页列表
 * @param query 查询参数
 */
const getListDishPage = async (query: any) => {
  const { data } = await getListDishPageApi(query)
  return data
}
</script>

<template>
  <el-card>
    <!-- 表格区域 -->
    <TablePro
      ref="tableRef"
      :columns
      :request-api="getListDishPage"
      v-model:selectionRows="selectionRows"
    >
      <template #toolbar>
        <!-- 批量删除按钮 -->
        <el-button
          v-hasAuth="['sys:dish:del']"
          icon="DocumentDelete"
          type="danger"
          @click="handleBatchDelete"
          :disabled="selectionRows.length === 0"
          >批量删除</el-button
        >
        <!-- 添加按钮 -->
        <el-button
          v-hasAuth="['sys:dish:add']"
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
            v-hasAuth="['sys:dish:edit']"
            type="primary"
            icon="Edit"
            circle
            @click="handleEdit(row)"
          />
        </el-tooltip>

        <!-- 删除按钮 -->
        <el-tooltip :content="$translate('删除')" placement="top">
          <el-button
            v-hasAuth="['sys:dish:del']"
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
      style="width: 600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜品名称" prop="dishName">
          <el-input
            v-model="form.dishName"
            placeholder="请输入"
            class="!w-50%"
          />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择"
            class="!w-50%"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜品图片" prop="img">
          <Upload size="150" v-model="form.img" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="0">启用</el-radio>
            <el-radio :value="1">停用</el-radio>
          </el-radio-group>
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
