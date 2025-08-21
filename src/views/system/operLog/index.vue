<script setup lang="ts">
import {
  delAllOperationLogApi,
  delOperationLogByIdsApi,
  getPageListApi
} from '@/api/operationLog'
import { dayjs } from 'element-plus'

/**
 * 操作类型映射字典
 */
const operationTypeTagMap: Table.EnumMapItem[] = [
  { value: 0, label: '其它', type: 'info' },
  { value: 1, label: '新增', type: 'success' },
  { value: 2, label: '修改', type: 'warning' },
  { value: 3, label: '删除', type: 'danger' },
  { value: 4, label: '授权', type: 'success' },
  { value: 5, label: '导出', type: 'warning' },
  { value: 6, label: '导入', type: 'danger' }
]
const columns = ref<Table.Column<OperationLog>[]>([
  { type: 'selection', label: '选择' },
  { label: '日志编号', prop: 'operId' },
  { label: '操作模块', prop: 'title' },
  {
    type: 'enum',
    label: '操作类型',
    prop: 'businessType',
    enum: operationTypeTagMap
  },
  { label: '操作人员', prop: 'operateUserName' },
  { label: '操作地址', prop: 'operIp' },
  {
    type: 'enum',
    label: '操作状态',
    prop: 'status',
    enum: [
      { value: 1, label: '失败', type: 'danger' },
      { value: 0, label: '成功', type: 'success' }
    ]
  },
  {
    label: '操作时间',
    prop: 'operTime',
    'show-overflow-tooltip': true
  },
  {
    label: '消耗时间',
    prop: 'costTime',
    formatter: (row) => `${row.costTime} ms`
  },
  {
    label: '操作',
    prop: 'action',
    slot: 'action',
    fixed: 'right',
    mustShow: true
  }
])
/**
 * 表格数据
 */
const tableData = ref<OperationLog[]>([])
const pagination = ref<PageQuery>({
  pageSize: 10,
  pageNum: 1
})
const total = ref(0)

const loading = ref(false)
/**
 * 选中行数据
 */
const selectRows = ref<OperationLog[]>([])

/**
 * 操作日志详情
 */
const form = ref<OperationLog>({} as OperationLog)
const open = ref(false)

/**
 * 获取操作类型的文本
 * @param value 操作类型的值
 */
const getOperationTypeText = (value: number) => {
  const item = operationTypeTagMap.find((item) => item.value === value)
  return item ? item.label : '未知'
}

/**
 * 搜索条件
 */
const queryParams = ref<
  Partial<
    Pick<
      OperationLog,
      'operIp' | 'title' | 'businessType' | 'status' | 'operateUserName'
    > & { operTime?: [Date, Date] }
  >
>({
  operIp: undefined,
  title: undefined,
  operateUserName: undefined,
  businessType: undefined,
  status: undefined,
  operTime: undefined
})

// 格式化时间
const formatTime = (date: Date | undefined) => {
  if (!date) return undefined

  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取分页数据
 */
const getPageList = async () => {
  try {
    loading.value = true
    const { operTime, ...query } = queryParams.value
    const params = {
      ...query,
      ...pagination.value,
      beginTime: formatTime(queryParams.value.operTime?.[0]),
      endTime: formatTime(queryParams.value.operTime?.[1])
    }
    const { data } = await getPageListApi(params)
    tableData.value = data.list
    total.value = data.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定批量删除选中的${selectRows.value.length}条数据吗？`,
      '提示'
    )
    await delOperationLogByIdsApi(selectRows.value.map((item) => item.operId))
    ElMessage.success('删除成功')
    getPageList()
  } catch (err) {
    console.error(err)
  }
}

/**
 * 全部删除
 */
const handleDeleteAll = async () => {
  try {
    await ElMessageBox.confirm('确定全部删除吗？', '提示')
    await delAllOperationLogApi()
    ElMessage.success('删除成功')
    getPageList()
  } catch (err) {
    console.error(err)
  }
}

/**
 * 删除
 * @param id 行id
 */
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定删除吗？', '提示')
  await delOperationLogByIdsApi([id])
  ElMessage.success('删除成功')
  getPageList()
}

/**
 * 查看详情
 * @param row 行数据
 */
const handleViewDetails = (row: OperationLog) => {
  form.value = row
  open.value = true
}

// 监听分页变化自动加载数据
watch(
  () => pagination.value,
  (newVal) => {
    console.log(newVal)
    // 如果分页参数有变化，重新获取数据
    getPageList()
  },
  { immediate: true, deep: true }
)

/**
 * 搜索
 */
const handleQuery = async () => {
  pagination.value.pageNum = 1
  await getPageList()
}
/**
 * 重置搜索条件
 */
const resetQuery = () => {
  pagination.value.pageNum = 1
  queryParams.value = {
    operIp: undefined,
    title: undefined,
    operateUserName: undefined,
    businessType: undefined,
    status: undefined,
    operTime: undefined
  }
  handleQuery()
}

const close = () => {
  form.value = {} as OperationLog
}

getPageList()
</script>

<template>
  <el-card>
    <!-- 搜索区域 -->
    <el-form
      size="small"
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      label-width="68px"
    >
      <el-form-item label="操作地址">
        <el-input
          v-model="queryParams.operIp"
          placeholder="请输入操作地址"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="系统模块" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入系统模块"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="操作人员">
        <el-input
          v-model="queryParams.operateUserName"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
          clearable
          style="width: 240px"
          v-model="queryParams.businessType"
        >
          <el-option
            v-for="item in operationTypeTagMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="操作状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="item in [
              { value: 0, text: '成功' },
              { value: 1, text: '失败' }
            ]"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间" style="width: 308px">
        <el-date-picker
          v-model="queryParams.operTime"
          :disabled-date="(data: Date) => data > new Date()"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 1, 1, 23, 59, 59)
          ]"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" :loading @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作区域 -->
    <el-row justify="space-between">
      <el-col :span="10">
        <!-- 批量删除按钮 -->
        <el-button
          size="small"
          v-hasAuth="['sys:operLog:del']"
          icon="DocumentDelete"
          type="danger"
          @click="handleBatchDelete"
          :disabled="selectRows.length === 0"
          >批量删除</el-button
        >
        <!-- 批量删除按钮 -->
        <el-button
          size="small"
          v-hasAuth="['sys:operLog:del']"
          icon="Delete"
          type="danger"
          @click="handleDeleteAll"
          >清空数据</el-button
        >
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <TablePro
      :total
      align="center"
      :loading
      :maxHeight="380"
      :stripe="true"
      v-model="pagination"
      v-model:selectionRows="selectRows"
      :data="tableData"
      :columns="columns"
      size="small"
    >
      <template #action="{ row }">
        <el-tooltip :content="$translate('详情')" placement="top">
          <el-button
            type="info"
            icon="View"
            v-hasAuth="['sys:operLog:query']"
            size="small"
            circle
            @click="handleViewDetails(row)"
          />
        </el-tooltip>
        <el-tooltip :content="$translate('删除')" placement="top">
          <el-button
            v-hasAuth="['sys:operLog:del']"
            type="danger"
            icon="Delete"
            size="small"
            circle
            @click="handleDelete(row.operId)"
          />
        </el-tooltip>
      </template>
    </TablePro>

    <!-- 操作日志详细弹框 -->
    <el-dialog
      title="操作日志详细"
      v-model="open"
      width="800px"
      append-to-body
      @close="close"
    >
      <el-form :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块："
              >{{ form?.title }} /{{
                getOperationTypeText(form.businessType)
              }}</el-form-item
            >
            <el-form-item label="登录信息："
              >{{ form?.operateUserName }} / {{ form?.operIp }} /
              {{ form?.operLocation }}</el-form-item
            >
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form?.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{
              form?.requestMethod
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{
              form?.methodName
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数："
              ><span class="w-100%">{{
                form?.methodParams
              }}</span></el-form-item
            >
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{
              form?.returnValue
            }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作状态：">
              <div v-if="form?.status === 0">正常</div>
              <div v-else-if="form?.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消耗时间："
              >{{ form.costTime }}毫秒</el-form-item
            >
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间：">{{ form.operTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{
              form.errMsg
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped></style>
