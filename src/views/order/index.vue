<script setup lang="ts">
import {
  getOrderInfoByIdApi,
  getOrderListApi,
  updateOrderApi
} from '@/api/order'
import { dayjs } from 'element-plus'

/**
 * 订单状态（0:待支付 1:待接单 2:待派送 3:派送中 4:已完成 5:已取消）
 */

const columns: Table.Column<Order>[] = [
  {
    label: '订单号',
    prop: 'orderNumber',
    search: {
      el: 'text'
    },
    'show-overflow-tooltip': true
  },
  {
    type: 'enum',
    label: '订单状态',
    prop: 'status',
    search: {
      el: 'select'
    },
    enum: [
      {
        label: '待支付',
        value: 0
      },
      {
        label: '待接单',
        value: 1
      },
      {
        label: '待派送',
        value: 2
      },
      {
        label: '派送中',
        value: 3
      },
      {
        label: '已完成',
        value: 4
      },
      {
        label: '已取消',
        value: 5
      }
    ]
  },
  {
    label: '用户名',
    prop: 'username'
  },
  {
    label: '地址',
    prop: 'address'
  },
  {
    label: '手机号',
    prop: 'tel',
    search: {
      el: 'text'
    }
  },
  {
    label: '下单时间',
    prop: 'addTime',
    search: {
      el: 'date-range'
    },
    'show-overflow-tooltip': true
  },
  {
    label: '总金额',
    prop: 'price',
    formatter: (row: Order) => `￥${row.price.toFixed(2)}`
  },
  { label: '操作', prop: 'action', width: 200, slot: 'action', align: 'center' }
]

const tableRef = ref()

const orderInfo = ref<OrderInfoVO>({} as OrderInfoVO)
/**
 * 获取订单列表
 * @param query 查询参数
 */
const getOrderList = async (query: any) => {
  const { addTime, ...restQuery } = query
  console.log('🚀 ~ getOrderList ~ addTime:', addTime)
  const { data } = await getOrderListApi({
    ...restQuery,
    beginTime: addTime?.[0]
      ? dayjs(addTime?.[0]).format('YYYY-MM-DD HH:mm:ss')
      : undefined,
    endTime: addTime?.[1]
      ? dayjs(addTime?.[1]).format('YYYY-MM-DD HH:mm:ss')
      : undefined
  })
  console.log('🚀 ~ getOrderList ~ data:', data)
  return data
}

const updateOrderStatus = async (id: number, status: number) => {
  try {
    await ElMessageBox.confirm('确定要继续操作吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await updateOrderApi({
      id,
      status
    } as Order)
    tableRef.value?.loadData()
    ElMessage.success('操作成功')
  } catch (err) {
    console.error(err)
  }
}

const handleView = async (id: number) => {
  const { data } = await getOrderInfoByIdApi(id)
  orderInfo.value = data
  dialogVisible.value = true
}
/**
 * 操作框是否显示
 */
const dialogVisible = ref<boolean>(false)

const handleJieDan = async () => {
  await updateOrderStatus(orderInfo.value.id, 2)
  dialogVisible.value = false
  // 消息提示
  // ElMessage.success('接单成功')
}
</script>

<template>
  <div>
    <el-card>
      <TablePro ref="tableRef" :columns :request-api="getOrderList">
        <template #action="{ row }">
          <el-button
            type="primary"
            link
            v-if="row.status === 1"
            @click="updateOrderStatus(row.id, 2)"
          >
            接单
          </el-button>
          <el-button
            type="primary"
            link
            v-if="row.status === 2"
            @click="updateOrderStatus(row.id, 3)"
          >
            派送
          </el-button>
          <el-button
            type="primary"
            link
            v-if="row.status === 3"
            @click="updateOrderStatus(row.id, 4)"
          >
            完成
          </el-button>
          <el-button type="primary" link @click="handleView(row.id)"
            >查看</el-button
          >
        </template>
      </TablePro>
    </el-card>
    <el-dialog
      title="订单信息"
      draggable
      v-model="dialogVisible"
      style="width: 800px"
    >
      <div class="flex flex-col gap-4">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{
            orderInfo.orderNumber
          }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{
            orderInfo.username
          }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{
            orderInfo.address
          }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{
            orderInfo.tel
          }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{
            orderInfo.addTime
          }}</el-descriptions-item>
          <el-descriptions-item label="总金额"
            >￥{{ orderInfo.amounts.toFixed(2) }}</el-descriptions-item
          >
        </el-descriptions>
        <el-table :data="orderInfo.dishList" border>
          <el-table-column label="商品名称" prop="dishName" />
          <el-table-column label="商品价格" prop="price">
            <template #default="{ row }">
              ￥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="商品图片" prop="image">
            <template #default="{ row }">
              <el-image :src="row.img" fit="cover" style="width: 50px" />
            </template>
          </el-table-column>
          <el-table-column label="商品数量" prop="count" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <!-- <el-button type="primary">确定</el-button> -->
          <el-button
            type="primary"
            @click="handleJieDan"
            v-if="orderInfo.status === 1"
            >接单</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
