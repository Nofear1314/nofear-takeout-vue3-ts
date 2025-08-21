<script setup lang="ts">
import {
  getOrderNumberStatisticsByDateRangeApi,
  getSaleDishTop10ByDateRangeApi,
  getTurnoverStatisticsByDateRangeApi,
  getUserNumberStatisticsByDateRangeApi
} from '@/api/report'
import echarts from '@/echarts'
import { EChartsOption } from 'echarts'

let option: EChartsOption

const timeRangeOptions = {
  lastDay: '昨天',
  last7Days: '近7日',
  last30Days: '近30日',
  currentWeek: '本周',
  currentMonth: '本月'
}
const selectDateRange = ref('lastDay')
/**
 *根据当前选择的时间范围计算开始和结束时间
 * @param option
 */
const getDateRange = (option: string) => {
  const now = new Date() // 当前时间（如2025-07-09 10:00:00）
  let beginTime: Date
  let endTime: Date

  // 先计算"昨天"的日期（用于近7日、近30日的结束时间）
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1) // 如2025-07-08 10:00:00

  switch (option) {
    case 'lastDay': // 昨天（仅昨天一天，不含今天）
      // 开始时间：昨天 00:00:00
      beginTime = new Date(yesterday)
      beginTime.setHours(0, 0, 0, 0)
      // 结束时间：昨天 23:59:59
      endTime = new Date(yesterday)
      endTime.setHours(23, 59, 59, 0)
      break

    case 'last7Days': // 近7日（不含今天，共7天：昨天~前6天）
      // 结束时间：昨天 23:59:59
      endTime = new Date(yesterday)
      endTime.setHours(23, 59, 59, 0) // 2025-07-08 23:59:59
      // 开始时间：昨天往前推6天 00:00:00（共7天）
      beginTime = new Date(yesterday)
      beginTime.setDate(yesterday.getDate() - 6) // 2025-07-02 10:00:00
      beginTime.setHours(0, 0, 0, 0) // 2025-07-02 00:00:00
      break

    case 'last30Days': // 近30日（不含今天，共30天：昨天~前29天）
      // 结束时间：昨天 23:59:59
      endTime = new Date(yesterday)
      endTime.setHours(23, 59, 59, 0)
      // 开始时间：昨天往前推29天 00:00:00（共30天）
      beginTime = new Date(yesterday)
      beginTime.setDate(yesterday.getDate() - 29)
      beginTime.setHours(0, 0, 0, 0)
      break

    case 'currentWeek': // 本周（包含今天，从周一到当前）
      const weekDay = now.getDay() || 7 // 周日为0，转为7（表示本周第7天）
      // 开始时间：本周一 00:00:00
      beginTime = new Date(now)
      beginTime.setDate(now.getDate() - weekDay + 1)
      beginTime.setHours(0, 0, 0, 0)
      // 结束时间：今天 23:59:59
      endTime = new Date(now)
      endTime.setHours(23, 59, 59, 0)
      break

    case 'currentMonth': // 本月（包含今天，从1号到当前）
      // 开始时间：本月1号 00:00:00
      beginTime = new Date(now.getFullYear(), now.getMonth(), 1)
      beginTime.setHours(0, 0, 0, 0)
      // 结束时间：今天 23:59:59
      endTime = new Date(now)
      endTime.setHours(23, 59, 59, 0)
      break

    default:
      // 默认使用昨天的数据
      beginTime = new Date(yesterday)
      beginTime.setHours(0, 0, 0, 0)
      endTime = new Date(yesterday)
      endTime.setHours(23, 59, 59, 0)
  }

  // 格式化日期为 yyyy-MM-dd HH:mm:ss
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  }

  return {
    beginTime: formatDate(beginTime),
    endTime: formatDate(endTime)
  }
}
// 销售额容器ref对象
const turnoverChartRef = useTemplateRef('turnoverChartContainer')
let turnoverChart: echarts.ECharts | null = null

// 图表配置 - 获得完整的类型提示,使用自定义封装组件
// const turnoverChartOptions = ref({}) as Ref<EChartsOption>
// const getTurnoverChartOptions = async () => {
//   const dateRange = getDateRange(selectDateRange.value)
//   const { data } = await getTurnoverStatisticsByDateRangeApi({
//     beginTime: dateRange.beginTime,
//     endTime: dateRange.endTime
//   })
//   turnoverChartOptions.value = {
//     title: {
//       text: '营业额统计',
//       left: 'center'
//     },
//     tooltip: {
//       trigger: 'axis'
//     },
//     xAxis: {
//       type: 'category',
//       data: data.dataList.split(',')
//     },
//     yAxis: {
//       type: 'value'
//     },
//     series: [
//       {
//         data: data.turnoverList.split(','),
//         type: 'line'
//       }
//     ]
//   } as EChartsOption
// }


// 初始化和更新营业额图表
const initTurnoverChart = async () => {
  const dateRange = getDateRange(selectDateRange.value)

  // 如果图表已存在，先销毁
  if (turnoverChart) {
    turnoverChart.dispose()
  }

  if (!turnoverChartRef.value) return

  turnoverChart = echarts.init(turnoverChartRef.value, '')

  try {
    const { data } = await getTurnoverStatisticsByDateRangeApi({
      beginTime: dateRange.beginTime,
      endTime: dateRange.endTime
    })

    option = {
      title: {
        text: '营业额统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: data.dataList.split(',')
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data.turnoverList.split(','),
          type: 'line'
        }
      ]
    }

    turnoverChart.setOption(option)
  } catch (error) {
    console.error('获取营业额统计数据失败:', error)
  }
}

// 用户数量容器ref对象
const userNumberChartRef = useTemplateRef('userNumberChartContainer')
let userNumberChart: echarts.ECharts | null = null
/**
 * 初始化和更新用户数量图表
 */
const initUserNumberStatisticsChart = async () => {
  const dateRange = getDateRange(selectDateRange.value)

  // 如果图表已存在，先销毁
  if (userNumberChart) {
    userNumberChart.dispose()
  }

  if (!userNumberChartRef.value) return

  userNumberChart = echarts.init(userNumberChartRef.value, '')

  try {
    const { data } = await getUserNumberStatisticsByDateRangeApi({
      beginTime: dateRange.beginTime,
      endTime: dateRange.endTime
    })
    option = {
      title: {
        text: '用户统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['用户数量（个）', '新增用户（个）'],
        left: 'center',
        bottom: '10'
      },

      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dateList.split(',')
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '用户数量（个）',
          type: 'line',
          stack: 'Total',
          data: data.totalUserList.split(',')
        },
        {
          name: '新增用户（个）',
          type: 'line',
          stack: 'Total',
          data: data.newUserList.split(',')
        }
      ]
    }
    userNumberChart.setOption(option)
  } catch (error) {
    console.error('获取用户数量统计数据失败:', error)
  }
}

/**
 * 订单数量容器ref对象
 */
const orderNumberChartRef = useTemplateRef('orderNumberChartContainer')
let orderNumberChart: echarts.ECharts | null = null
/**
 * 订单总数
 */
const totalOrderCount = ref(0)
/**
 * 有效订单数量
 */
const validOrderCount = ref(0)
/**
 * 订单完成率
 */
const orderCompletionRate = ref(0)
/**
 * 初始化和更新订单数量图表
 */
const initOrderNumberStatisticsChart = async () => {
  const dateRange = getDateRange(selectDateRange.value)

  // 如果图表已存在，先销毁
  if (orderNumberChart) {
    orderNumberChart.dispose()
  }
  if (!orderNumberChartRef.value) return

  orderNumberChart = echarts.init(orderNumberChartRef.value, '')

  try {
    const { data } = await getOrderNumberStatisticsByDateRangeApi({
      beginTime: dateRange.beginTime,
      endTime: dateRange.endTime
    })
    totalOrderCount.value = data.totalOrderCount
    validOrderCount.value = data.validOrderCount
    orderCompletionRate.value = data.orderCompletionRate
    option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: '8%'
      },

      legend: {
        data: ['订单数量（个）', '已完成订单数量（个）'],
        left: 'center',
        bottom: '10'
      },

      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dateList.split(',')
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单数量（个）',
          type: 'line',
          stack: 'Total',
          data: data.orderCountList.split(',')
        },
        {
          name: '已完成订单数量（个）',
          type: 'line',
          stack: 'Total',
          data: data.validOrderCountList.split(',')
        }
      ]
    }
    orderNumberChart.setOption(option)
  } catch (error) {
    console.error('获取订单数量统计数据失败:', error)
  }
}

/**
 * 销售量top10容器ref对象
 */
const saleDishTop10ChartRef = useTemplateRef('saleDishTop10ChartContainer')
let saleDishTop10Chart: echarts.ECharts | null = null

/**
 * 初始化和更新销售量top10图表
 */
const initSaleDishTop10Chart = async () => {
  const dateRange = getDateRange(selectDateRange.value)
  // 如果图表已存在，先销毁
  if (saleDishTop10Chart) {
    saleDishTop10Chart.dispose()
  }
  if (!saleDishTop10ChartRef.value) return

  saleDishTop10Chart = echarts.init(saleDishTop10ChartRef.value, '')

  try {
    const { data } = await getSaleDishTop10ByDateRangeApi({
      beginTime: dateRange.beginTime,
      endTime: dateRange.endTime
    })
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },

      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: data.dishNameList.split(',')
      },
      series: [
        {
          name: '销售量',
          type: 'bar',
          label: {
            show: true,
            position: 'inside'
          },
          data: data.numberList.split(',')
        }
      ]
    }
    saleDishTop10Chart.setOption(option)
  } catch (error) {
    console.error('获取销售量Top10数据失败:', error)
  }
}

/**
 * 监听时间范围变化，重新请求数据
 */
const handleTimeRangeChange = async () => {
  Promise.all([
    initTurnoverChart(),
    initUserNumberStatisticsChart(),
    initOrderNumberStatisticsChart(),
    initSaleDishTop10Chart()
  ]).catch((error) => {
    console.error('初始化图表失败:', error)
  })
  // await initTurnoverChart()
  // await initUserNumberStatisticsChart()
  // await initOrderNumberStatisticsChart()
  // await initSaleDishTop10Chart()
}

onMounted(async () => {
  await Promise.all([
    initTurnoverChart(),
    initUserNumberStatisticsChart(),
    initOrderNumberStatisticsChart(),
    initSaleDishTop10Chart()
  ]).catch((error) => {
    console.error('初始化图表失败:', error)
  })

  const resizeHandler = () => {
    turnoverChart?.resize()
    userNumberChart?.resize()
    orderNumberChart?.resize()
    saleDishTop10Chart?.resize()
  }

  // 响应式处理
  window.addEventListener('resize', resizeHandler)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
    turnoverChart?.dispose()
    userNumberChart?.dispose()
    orderNumberChart?.dispose()
    saleDishTop10Chart?.dispose()
  })
})
</script>

<template>
  <div class="h-670px w-100% flex flex-col">
    <el-radio-group
      v-model="selectDateRange"
      class="mb-20px"
      @change="handleTimeRangeChange"
    >
      <el-radio-button
        v-for="(label, value) in timeRangeOptions"
        :key="value"
        :value="value"
      >
        <span class="px-15px">{{ label }}</span>
      </el-radio-button>
    </el-radio-group>
    <!-- 滑动器 -->
    <el-scrollbar class="w-100% flex-1">
      <el-row :gutter="20" class="w-100%">
        <el-col :span="12">
          <el-card>
            <div ref="turnoverChartContainer" style="height: 400px"></div>
            <!-- <MyECharts
              ref="salesChartRef"
              :options="chartOptions"
              :style="{ height: '400px', width: '100%' }"
            /> -->
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card
            ><div ref="userNumberChartContainer" style="height: 400px"></div
          ></el-card>
        </el-col>
        <el-col :span="12" class="mt-20px">
          <el-card>
            <h1 class="text-center">订单数量统计</h1>
            <div class="flex justify-center gap-20px items-center">
              <div class="flex flex-col gap-10px">
                <span class="text-14px">订单完成率</span>

                <h3>{{ orderCompletionRate }}%</h3>
              </div>
              <div>=</div>
              <div class="flex flex-col gap-10px">
                <span class="text-14px">有效订单</span>
                <span>{{ validOrderCount }}</span>
              </div>
              <span>/</span>
              <div class="flex flex-col gap-10px">
                <span class="text-14px">订单总数</span>
                <span>{{ totalOrderCount }}</span>
              </div>
            </div>
            <div ref="orderNumberChartContainer" style="height: 400px"></div>
          </el-card>
        </el-col>
        <el-col :span="12" class="mt-20px">
          <el-card>
            <h1 class="text-center mb-49px">销售量Top10</h1>
            <div ref="saleDishTop10ChartContainer" style="height: 400px"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped></style>
