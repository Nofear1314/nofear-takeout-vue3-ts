<script setup lang="ts">
import {
  clearLoginLogApi,
  deleteLoginLogApi,
  getLoginLogPageApi
} from '@/api/loginLog'

const columns: Table.Column<LoginLog>[] = [
  { type: 'selection', label: '选择' },
  { type: 'index', label: '序号', width: '80' },
  {
    label: '用户名称',
    prop: 'userName'
  },

  {
    label: '登录IP',
    prop: 'ipAddr'
  },
  {
    label: '登录地点',
    prop: 'loginLocation'
  },
  {
    label: '浏览器',
    prop: 'browser'
  },
  {
    label: '操作系统',
    prop: 'os',
    'show-overflow-tooltip': true
  },
  {
    type: 'enum',
    label: '登录状态',
    prop: 'status',
    enum: [
      { value: 1, label: '失败', type: 'danger' },
      { value: 0, label: '成功', type: 'success' }
    ]
  },
  {
    label: '描述',
    prop: 'msg',
    'show-overflow-tooltip': true
  },
  {
    label: '登录时间',
    prop: 'loginTime',
    'show-overflow-tooltip': true
  }
]
const tableData = ref<LoginLog[]>([])
const loading = ref(false)
const pagination = ref({
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)
const queryParams = ref({
  ipAddr: undefined,
  status: undefined,
  userName: undefined,
  loginTime: undefined
})
const selectionRows = ref<LoginLog[]>([])
/**
 * 获取表格数据
 */
const getTableDataList = async () => {
  try {
    loading.value = true
    const { loginTime, ...query } = queryParams.value
    const params = {
      ...pagination.value,
      ...query,
      beginTime: queryParams.value.loginTime?.[0],
      endTime: queryParams.value.loginTime?.[1]
    }
    const { data } = await getLoginLogPageApi(params)
    tableData.value = data.list
    total.value = data.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
// 监听分页变化自动加载数据
watch(() => pagination.value, getTableDataList, { immediate: true, deep: true })

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定批量删除吗？', '提示')
    await deleteLoginLogApi(selectionRows.value.map((item) => item.id))
    ElMessage.success('删除成功')
    getTableDataList()
  } catch (err) {
    console.error(err)
  }
}
const handleDeleteAll = async () => {
  try {
    await ElMessageBox.confirm('确定全部删除吗？', '提示')
    await clearLoginLogApi()
    ElMessage.success('删除成功')
    getTableDataList()
  } catch (err) {
    console.error(err)
  }
}
const handleQuery = async () => {
  pagination.value.pageNum = 1
  await getTableDataList()
}
const resetQuery = () => {
  queryParams.value = {
    ipAddr: undefined,
    status: undefined,
    userName: undefined,
    loginTime: undefined
  }
  handleQuery()
}
getTableDataList()
</script>

<template>
  <div>
    <!-- 搜索区域 -->
    <el-form
      size="small"
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      label-width="68px"
    >
      <el-form-item label="登录地址">
        <el-input
          v-model="queryParams.ipAddr"
          placeholder="请输入登录地址"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px"
        />
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
          v-model="queryParams.loginTime"
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
          v-hasAuth="['sys:loginLog:del']"
          icon="DocumentDelete"
          type="danger"
          @click="handleBatchDelete"
          :disabled="selectionRows.length === 0"
          >批量删除</el-button
        >
        <!-- 批量删除按钮 -->
        <el-button
          size="small"
          v-hasAuth="['sys:loginLog:del']"
          icon="Delete"
          type="danger"
          @click="handleDeleteAll"
          >清空数据</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <TablePro
      :columns
      :loading
      maxHeight="420"
      :data="tableData"
      v-model="pagination"
      :total
      v-model:selectionRows="selectionRows"
    ></TablePro>
  </div>
</template>

<style lang="scss" scoped></style>
