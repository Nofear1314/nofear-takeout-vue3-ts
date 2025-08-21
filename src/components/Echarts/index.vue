<template>
  <div
    ref="chartRef"
    :class="className"
    :style="computedStyle"
    class="echarts-container"
  />
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  computed,
  CSSProperties
} from 'vue'
// import * as echarts from 'echarts'
import echarts from '@/echarts'
import type { EChartsOption, ECElementEvent } from 'echarts'
type EasingType =
  | 'linear'
  | 'quadraticIn'
  | 'quadraticOut'
  | 'quadraticInOut'
  | 'cubicIn'
  | 'cubicOut'
  | 'cubicInOut'
  | 'quarticIn'
  | 'quarticOut'
  | 'quarticInOut'
  | 'quinticIn'
  | 'quinticOut'
  | 'quinticInOut'
  | 'sinusoidalIn'
  | 'sinusoidalOut'
  | 'sinusoidalInOut'
  | 'exponentialIn'
  | 'exponentialOut'
  | 'exponentialInOut'
  | 'circularIn'
  | 'circularOut'
  | 'circularInOut'
  | 'elasticIn'
  | 'elasticOut'
  | 'elasticInOut'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'bounceIn'
  | 'bounceOut'
  | 'bounceInOut'
// 自定义防抖函数
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(null, args)
      timeoutId = null
    }, delay)
  }
}
// 定义组件属性类型
interface Props {
  // 图表配置项
  options: EChartsOption
  // 图表容器样式
  style?: CSSProperties
  // 额外类名
  className?: string
  // 图表主题
  theme?: string | object
  // 是否自动响应窗口大小变化
  autoResize?: boolean
  // 防抖延迟时间(ms)
  resizeDelay?: number
  // 空数据时的占位内容
  emptyContent?: string
  // resize 动画持续时间（毫秒，0 表示无动画）
  resizeAnimationDuration?: number
  // resize 动画缓动效果（如 'cubicOut'）
  resizeAnimationEasing?: EasingType
}

// 定义事件名称类型
type EventNames =
  | 'click'
  | 'dblclick'
  | 'mouseover'
  | 'mouseout'
  | 'legend-select-changed'

// 定义组件事件类型
type Emits = {
  (e: 'chart-ready', instance: echarts.ECharts): void
  (e: 'update', instance: echarts.ECharts): void
  (e: EventNames, params: ECElementEvent, instance: echarts.ECharts): void
}

// 组件属性定义
const props = withDefaults(defineProps<Props>(), {
  style: () => ({
    width: '100%',
    height: '400px'
  }),
  className: '',
  theme: 'default',
  autoResize: true,
  resizeDelay: 100,
  emptyContent: '暂无数据',
  resizeAnimationDuration: 300, // 默认 300ms 动画
  resizeAnimationEasing: 'cubicOut' // 默认缓动效果
})

// 组件事件定义
const emit = defineEmits<Emits>()

// 图表实例相关
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
// 计算样式 - 合并默认样式和用户样式
const computedStyle = computed<CSSProperties>(() => ({
  ...{ position: 'relative' },
  ...props.style
}))

// 初始化图表
const initChart = (): void => {
  if (!chartRef.value) return

  // 销毁已存在的实例
  if (chartInstance) {
    echarts.dispose(chartInstance)
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value, props.theme)

  // 注册事件监听
  registerEvents()

  // 设置初始配置
  setChartOptions(props.options)

  // 触发就绪事件
  emit('chart-ready', chartInstance)
}

// 设置图表配置
const setChartOptions = (options: EChartsOption): void => {
  if (!chartInstance) return

  // 处理空数据情况
  const isEmpty = checkEmptyData(options)
  if (isEmpty) {
    chartInstance.clear()
    if (chartRef.value) {
      chartRef.value.innerHTML = `<div class="empty-state">${props.emptyContent}</div>`
    }
    return
  }

  // 清空可能的空状态内容
  if (chartRef.value?.querySelector('.empty-state')) {
    chartRef.value.innerHTML = ''
  }

  // 设置配置项
  chartInstance.setOption(options, true)
  emit('update', chartInstance)
}

// 检查数据是否为空
const checkEmptyData = (options: EChartsOption): boolean => {
  if (!options.series) return false

  // 处理数组形式的series
  if (Array.isArray(options.series)) {
    return options.series.every((series) => {
      if (!series.data) return true
      if (Array.isArray(series.data) && series.data.length === 0) return true
      return false
    })
  }

  // 处理单对象形式的series
  if (typeof options.series === 'object') {
    const series = options.series as any
    if (!series.data) return true
    if (Array.isArray(series.data) && series.data.length === 0) return true
  }

  return false
}

// 注册图表事件
const registerEvents = (): void => {
  if (!chartInstance) return

  // 需要监听的事件列表
  const events = [
    'click',
    'dblclick',
    'mouseover',
    'mouseout',
    'legend-select-changed'
  ]

  //  WithThisType(...args: unknown[] | [params: echarts.ECElementEvent]): boolean | void
  events.forEach((event) => {
    chartInstance!.on(event, (params) => {
      emit(event as EventNames, params as ECElementEvent, chartInstance!)
    })
  })
}

// 图表 resize 处理
const handleResize = (): void => {
  if (chartInstance) {
    chartInstance.resize({
      animation: {
        duration: props.resizeAnimationDuration, // 动画持续时间
        easing: props.resizeAnimationEasing // 动画缓动效果
      }
    })
  }
}

// 防抖处理的 resize 方法
const debouncedResize = debounce(handleResize, props.resizeDelay)

// 监听配置项变化
watch(
  () => props.options,
  (newOptions) => {
    nextTick(() => {
      setChartOptions(newOptions)
    })
  },
  { deep: true }
)

// 监听容器尺寸变化
watch(
  () => [props.style?.width, props.style?.height],
  () => {
    nextTick(debouncedResize)
  }
)

// 生命周期 - 挂载
onMounted(() => {
  nextTick(initChart)

  // 窗口大小变化监听
  if (props.autoResize) {
    window.addEventListener('resize', debouncedResize)
  }
})

// 生命周期 - 卸载
onUnmounted(() => {
  if (chartInstance) {
    echarts.dispose(chartInstance)
    chartInstance = null
  }

  if (props.autoResize) {
    window.removeEventListener('resize', debouncedResize)
  }
})

// 暴露公共方法类型定义
interface Exposed {
  update: (options?: EChartsOption) => void
  resize: () => void
  getInstance: () => echarts.ECharts | null
}

// 暴露公共方法
defineExpose<Exposed>({
  /**
   * 手动更新图表
   * @param {EChartsOption} options - 新的图表配置项
   */
  update: (options) => {
    setChartOptions(options || props.options)
  },

  /**
   * 手动调整图表大小
   */
  resize: handleResize,

  /**
   * 获取图表实例
   * @returns {ECharts | null} ECharts实例
   */
  getInstance: () => chartInstance
})
</script>

<style scoped>
.echarts-container {
  overflow: hidden;
}

.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
</style>
