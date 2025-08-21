import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 注册组件和图表
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
  BarChart,
  GridComponent,
  CanvasRenderer,
  DatasetComponent,
  LabelLayout,
  UniversalTransition,
  TransformComponent
])

export default echarts
