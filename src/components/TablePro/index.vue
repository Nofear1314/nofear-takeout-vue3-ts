<script setup lang="ts" generic="T">
import { ElTable } from 'element-plus'

const props = defineProps({
  /**
   * 表格列配置
   */
  columns: {
    type: Array as PropType<Table.Column<T>[]>,
    required: true
  },
  /**
   * 表格数据
   */
  data: {
    type: Array as PropType<T[]>
  },
  /**
   * 数据请求函数
   * @param params - 请求参数包含分页和搜索条件
   * @returns Promise<{rows: T[], total: number}>
   */
  requestApi: {
    type: Function as PropType<Table.RequestApi<T, Table.Column[]>>
    // required: true
  },
  /**
   * 表格多选数据
   */
  selectionRows: {
    type: Array as PropType<T[]>,
    default: () => []
  },
  /**
   * 是否显示加载
   */
  loading: {
    type: Boolean,
    default: undefined
  },
  /**
   * 表格流体最大高度，超出会显示滚动条
   */
  maxHeight: {
    type: [Number, String],
    default: '470px'
  },
  /**
   * 分页参数，双向绑定
   */
  modelValue: {
    type: Object as PropType<Required<PageQuery>>,
    default: (): PageQuery => ({ pageNum: 1, pageSize: 10 })
  },
  /**
   * 总条数（必填）
   */
  total: {
    type: Number
    // required: true
  },
  /**
   * 分页配置（可扩展）
   */
  paginationOptions: {
    type: Object as PropType<Table.PaginationOptions>,
    default: (): Table.PaginationOptions => ({
      pageSizes: [10, 20, 30, 40],
      layout: 'total, sizes, prev, pager, next, jumper',
      /**
       * 分页组件对齐方式
       */
      align: 'right',
      /**
       * 是否显示分页
       */
      showPagination: true
    })
  },
  searchFormConfig: {
    type: Object as PropType<Table.SearchFormConfig>,
    default: (): Table.SearchFormConfig => ({
      size: 'small',
      labelWidth: '100px'
    })
  }
} as const)

const emits = defineEmits<{
  /**
   * 多选事件
   */
  (e: 'selection-change', rows: T[]): void
  /**
   * 双向绑定事件应传递完整的分页对象
   */
  (e: 'update:modelValue', value: PageQuery): void
  /**
   * 分页尺寸变化事件
   */
  (e: 'page-size-change', size: number): void
  /**
   * 页码变化事件
   */
  (e: 'page-num-change', num: number): void
  /**
   * 双向绑定事件,选中的行数
   */
  (e: 'update:selectionRows', value: T[]): void
  /**
   * 搜索事件
   */
  (e: 'search', query: Record<string, any>): void
  /**
   * 加载数据中
   */
  (e: 'update:loading', loading: boolean): void
  /**
   * 数据请求完成
   */
  (e: 'update:data', data: T[]): void
  /**
   * total更新
   */
  (e: 'update:total', total: number): void

  (e: 'table-ready', tableData: T[]): void
}>()
/**
 * 表格数据
 */
const internalTableData = ref<T[]>([])

const tableData = computed(() => {
  return props.data || internalTableData.value
})


/**
 * 数据总条数
 */
const internalTotal = ref<number>(0)
// 定义内部loading状态
const internalLoading = ref(false)
const showLoading = computed(() => {
  // 如果外部传入 loading 状态，则优先使用外部状态
  if (props.loading !== undefined) {
    return props.loading
  }
  // 否则使用内部状态
  return internalLoading.value
})

const dataTotal = computed(() => {
  return Number(props.total) || Number(internalTotal.value)
})
/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.requestApi) return

  // 构建请求参数(合并分页和搜索条件)
  const params: Table.RequestParams<T, Table.Column[]> = {
    pageNum: internalPageNum.value,
    pageSize: internalPageSize.value,
    ...searchForm
  }

  try {
    // 显示加载状态
    // emits('update:loading', true)
    internalLoading.value = true
    // 调用请求函数
    const response = await props.requestApi(params)

    internalTableData.value = response.list
    internalTotal.value = response.total
    // 更新数据和总条数
    emits('update:data', response.list)
    emits('update:total', response.total)
  } catch (error) {
    console.error('数据加载失败', error)
    // 处理错误
    ElMessage.error('数据加载失败')
  } finally {
    // 隐藏加载状态
    // emits('update:loading', false)
    internalLoading.value = false
  }
}

/**
 * 搜索类型到Element UI组件的映射
 */
const SEARCH_TYPE_MAPPING: Record<Table.SearchConfig['el'], string> = {
  text: 'input',
  select: 'select',
  'date-picker': 'date',
  'date-range': 'daterange'
}
/**
 * 映射搜索类型到Element UI组件
 * @param type 搜索配置中的el类型
 */
const mapSearchType = (type: Table.SearchConfig['el']) => {
  return SEARCH_TYPE_MAPPING[type] || 'input'
}

/**
 * 根据搜索框类型生成默认占位符
 */
const getDefaultPlaceholder = (label: string, type: string) => {
  const typeMap: Record<string, string> = {
    select: '请选择',
    text: '请输入',
    'date-picker': '请选择',
    'date-range': '请选择'
    // 可以添加更多类型
  }

  return `${typeMap[type] || '请输入'}${label}`
}
/**
 * 从columns中提取搜索字段
 */
const searchFields = computed(() => {
  return props.columns
    .filter(
      (col) => col.type !== 'index' && col.type !== 'selection' && col.search
    )
    .map((col) => {
      // 类型断言：确保我们只处理包含prop属性的列类型
      const column = col as Table.TagColumn<T>
      // 根据搜索框类型动态生成默认占位符
      const defaultPlaceholder = getDefaultPlaceholder(
        column.label,
        column.search!.el
      )
      return {
        ...column.search,
        prop: column.prop,
        label: column.label,
        type: mapSearchType(column.search!.el),
        placeholder: column.search!.placeholder || defaultPlaceholder,
        options: column.enum || column.search!.options || [],
        props: column.search!.props || {},
        valueFormat: column.search!.valueFormat || 'YYYY-MM-DD HH:mm:ss'
      }
    })
})
/**
 * 控制搜索区域是否显示
 */
const showSearch = ref(true)
// 初始化搜索表单数据
const searchForm = reactive(
  searchFields.value.reduce(
    (acc, field) => {
      acc[field.prop] = ''
      return acc
    },
    {} as Record<string, any>
  )
)

/**
 * 重新加载数据
 */
const refresh = () => {
  loadData()
}

const defaultTime: [Date, Date] = [
  new Date(0, 0, 0, 0, 0, 0),
  new Date(0, 0, 0, 23, 59, 59)
]

/**
 * 处理搜索
 */
const handleSearch = async () => {
  // 重置页码到第一页
  emits('update:modelValue', {
    ...props.modelValue,
    pageNum: 1
  })
  // 触发搜索事件
  emits('search', searchForm)

  // 触发数据加载
  loadData()
}
/**
 * 处理重置
 */
const handleReset = () => {
  // 重置搜索表单
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = ''
  })
  // 重置页码到第一页
  emits('update:modelValue', {
    ...props.modelValue,
    pageNum: 1
  })
  loadData()
}

/**
 * 添加show字段控制显隐
 */
const columnsWithShow = ref<(Table.Column & { show: boolean })[]>(
  props.columns.map((col) => ({
    ...col,
    // 显隐状态默认根据列配置中的 `show` 字段（无则默认显示）
    show: true
  }))
)
/**
 * 全选处理函数
 * @param val 是否全选
 */
const handleAllCheckboxChange = (val: boolean) => {
  columnsWithShow.value.forEach(
    (col) =>
      col.type !== 'index' &&
      col.type !== 'selection' &&
      !col.mustShow &&
      (col.show = val)
  )
}

/**
 * 是否全选
 */
const isAllCheckbox = computed({
  get() {
    const targetColumns = columnsWithShow.value.filter(
      (col) => col.type !== 'index' && col.type !== 'selection'
    )
    return targetColumns.length > 0 && targetColumns.every((col) => col.show)
  },
  set(value: boolean) {
    handleAllCheckboxChange(value)
  }
})

/**
 * 过滤出需要展示的列
 */
const columns = computed(() => columnsWithShow.value.filter((col) => col.show))

/**
 * 表格ref
 */
const tableRef = useTemplateRef('tableRef')

/**
 * 分页参数（支持受控(可以从外面传进来)与非受控模式）
 */
const internalPageNum = ref(props.modelValue.pageNum)
const internalPageSize = ref(props.modelValue.pageSize)

/**
 * 分页每页条数改变
 * @param size 每页条数
 */
const handlePageSizeChange = (size: number) => {
  // 更新双向绑定值,当页数变化时，页码重置为1
  emits('update:modelValue', { pageNum: 1, pageSize: size })
  // 触发自定义事件，并传入最新的每页条数
  emits('page-size-change', size)
  internalPageSize.value = size
  internalPageNum.value = 1
  loadData()
}

/**
 * 分页当前页码改变
 * @param num 当前页码
 */
const handleCurrentChange = (num: number) => {
  // 更新双向绑定值
  emits('update:modelValue', {
    pageNum: num,
    pageSize: internalPageSize.value
  })
  // 触发自定义事件，并传入最新的页码
  emits('page-num-change', num)
  internalPageNum.value = num

  loadData()
}

/**
 * 自定义索引
 */
const indexMethod = (index: number) => {
  return (internalPageNum.value - 1) * internalPageSize.value + index + 1
}

/**
 * Shift键是否按下
 */
const isShiftKeyDown = ref(false)
const shiftStartRow = ref<T | null>(null) // Shift选择起始行
const lastSelectedRow = ref<T | null>(null) // 上次选择的行

/**
 * 多选行数据
 * @param rows 选中的行数据
 */
const handleSelectionChange = (rows: T[]) => {
  /**
   * 更新双向绑定值
   */
  emits('update:selectionRows', rows)
  /**
   * 触发自定义事件
   */
  emits('selection-change', rows)
  // 记录上次选择的行
  if (rows.length > 0) {
    lastSelectedRow.value = rows[rows.length - 1]
  }
  // 处理Shift连续选择
  handleShiftSelection(rows)
}

/**
 * 处理Shift键连续选择
 */
const handleShiftSelection = (currentSelection: T[]) => {
  // 如果没有按下Shift键，记录起始行并返回
  if (!isShiftKeyDown.value || !lastSelectedRow.value) {
    // 单选模式下记录起始行
    if (currentSelection.length === 1) {
      shiftStartRow.value = currentSelection[0]
    }
    return
  }

  // 如果有起始行，处理连续选择
  if (shiftStartRow.value && tableData.value.length > 0) {
    // 获取起始行和当前选择的最后一行
    const startRow = shiftStartRow.value
    const endRow = lastSelectedRow.value

    // 获取起始行和结束行的索引
    const startIndex = tableData.value.findIndex((row) => row === startRow)
    const endIndex = tableData.value.findIndex((row) => row === endRow)

    if (startIndex === -1 || endIndex === -1) {
      return
    }

    // 计算选择范围
    const minIndex = Math.min(startIndex, endIndex)
    const maxIndex = Math.max(startIndex, endIndex)

    // 取消所有选择（除了起始行和结束行）
    const rowsToSelect = []
    for (let i = minIndex; i <= maxIndex; i++) {
      const row = tableData.value[i]
      if (row) {
        rowsToSelect.push(row)
      }
    }

    // 清空选择并重新选择范围内的行
    rowsToSelect.forEach((row) => {
      tableRef.value?.toggleRowSelection(row, true)
    })
  }
}

/**
 * 获取标签文本
 */
const getTagText = (column: Table.TagColumn<T>, row: T) => {
  // 优先使用自定义文本函数
  if (column.enumLabelFn) {
    return column.enumLabelFn(row)
  }

  // 使用标签映射
  if (column.enum) {
    const value = row[column.prop as keyof T]
    const mapping = column.enum.find((item) => item.value === value)
    if (mapping) {
      return mapping.label
    }
  }

  // 默认返回原始值
  return row[column.prop as keyof T] as unknown as string
}

type TagType = Table.TagType
/**
 * 获取标签类型
 */
const getTagType = (column: Table.TagColumn<T>, row: T): TagType => {
  // 优先使用自定义类型函数
  if (column.tagTypeFn) {
    return column.tagTypeFn(row)
  }

  // 使用标签映射
  if (column.enum) {
    const value = row[column.prop as keyof T]
    const mapping = column.enum.find((item) => item.value === value)
    if (mapping && mapping.type) {
      return mapping.type
    }
  }
  // 默认使用info类型
  return 'info'
}

// 获取 ElTable 的公共属性类型
type ElTablePublicProps = keyof InstanceType<typeof ElTable>

// 定义自定义暴露接口
interface TableExpose {
  loadData: typeof loadData
  showLoading: ComputedRef<boolean>
  tableRef: typeof tableRef
}
// 合并暴露表格实例和自定义方法
defineExpose<TableExpose>(
  new Proxy(
    {
      loadData,
      showLoading,
      tableRef
    },
    {
      get(target: TableExpose, key: string | symbol) {
        // 自定义属性直接返回
        if (key in target) {
          return (target as any)[key]
        }

        // 表格实例属性通过类型断言访问
        return tableRef.value?.[key as ElTablePublicProps]
      },
      has(target: TableExpose, key: string | symbol) {
        return key in target || key in tableRef.value!
      }
    }
  )
)

/**
 * 监听键盘事件
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Shift') {
    isShiftKeyDown.value = true
  }
}

const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Shift') {
    isShiftKeyDown.value = false
    // 释放Shift键后，保留起始行以便下次使用
  }
}
onMounted(async () => {
  await loadData()
  emits('table-ready', tableData.value as T[])
  // 监听键盘事件
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('keyup', handleKeyup)
})
// 组件卸载时移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('keyup', handleKeyup)
})
</script>

<template>
  <div>
    <!--  搜索表单区域 -->
    <div
      v-if="searchFields.length > 0 && showSearch"
      class="search-form-container"
    >
      <el-form
        ref="searchFormRef"
        :model="searchForm"
        :label-width="searchFormConfig.labelWidth"
        size="small"
      >
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="8" v-for="field in searchFields" :key="field.prop">
            <el-form-item :label="field.label" :label-width="field.labelWidth">
              <template v-if="field.type === 'input'">
                <el-input
                  clearable
                  v-model.trim="searchForm[field.prop]"
                  :placeholder="field.placeholder"
                />
              </template>
              <template v-if="field.type === 'select'">
                <el-select
                  v-model="searchForm[field.prop]"
                  :placeholder="field.placeholder"
                  clearable
                >
                  <el-option
                    v-for="option in field.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
              <template v-if="field.type === 'date'">
                <el-date-picker
                  clearable
                  v-model="searchForm[field.prop]"
                  type="date"
                  :placeholder="field.placeholder"
                  :value-format="field.valueFormat"
                />
              </template>
              <template v-if="field.type === 'daterange'">
                <el-date-picker
                  clearable
                  v-model="searchForm[field.prop]"
                  :disabled-date="(data: Date) => data > new Date()"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="defaultTime"
                  :value-format="field.valueFormat"
                />
              </template>
            </el-form-item>
          </el-col>

          <el-form-item :label-width="searchFormConfig.searchBtnLabelWidth">
            <el-button
              type="primary"
              @click="handleSearch"
              :loading="showLoading"
              icon="Search"
              >搜索</el-button
            >
            <el-button @click="handleReset" icon="Refresh">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <!-- 表格上方操作区 -->
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <div>
        <slot name="toolbar"></slot>
      </div>
      <div>
        <el-tooltip
          class="item"
          v-if="searchFields.length > 0 && showSearch"
          effect="dark"
          :content="showSearch ? '隐藏搜索' : '显示搜索'"
          placement="top"
        >
          <el-button
            circle
            icon="Search"
            @click="showSearch = !showSearch"
            size="small"
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button
            :loading="showLoading"
            size="small"
            circle
            icon="Refresh"
            @click="refresh()"
          />
        </el-tooltip>
        <el-tooltip content="显隐列" placement="top" v-if="columns.length">
          <el-dropdown
            trigger="click"
            :hide-on-click="false"
            style="padding-left: 12px"
          >
            <el-button circle icon="Menu" size="small" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-scrollbar max-height="200px">
                  <el-dropdown-item>
                    <el-checkbox v-model="isAllCheckbox" label="全选/全不选" />
                  </el-dropdown-item>
                  <el-divider style="padding: 0; margin: 0 0 15px" />

                  <template v-for="item in columnsWithShow" :key="item.label">
                    <el-dropdown-item
                      v-if="item.type !== 'selection' && item.type !== 'index'"
                    >
                      <el-checkbox
                        :label="item.label"
                        v-model="item.show"
                        :disabled="item.mustShow"
                      />
                    </el-dropdown-item>
                  </template>
                </el-scrollbar>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table
      ref="tableRef"
      v-loading="showLoading"
      v-bind="$attrs"
      :max-height="maxHeight"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <template #empty>
        <el-empty :image-size="200" />
      </template>
      <template v-for="column in columns" :key="column.label">
        <!-- 索引列或多选列 -->
        <el-table-column
          :index="indexMethod"
          v-if="column.type === 'selection' || column.type === 'index'"
          v-bind="column"
        />

        <!-- 图片url列 -->
        <el-table-column v-else-if="column.type === 'img'" v-bind="column">
          <template #default="{ row }">
            <el-tooltip effect="light">
              <template #content>
                <el-avatar :size="160" :src="row[column.prop]" />
              </template>
              <!-- <el-avatar :size="30" :src="row.avatar" /> -->
              <el-image
                style="width: 30px; height: 30px; border-radius: 50%"
                :src="row[column.prop]"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[row[column.prop]]"
                fit="cover"
                lazy
                preview-teleported
              >
                <template #error>
                  <div
                    class="image-slot"
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      width: 100%;
                      height: 100%;
                    "
                  >
                    <el-icon><PictureFilled /></el-icon>
                  </div>
                </template>
              </el-image>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 标签映射列 -->
        <el-table-column
          v-else-if="column.type === 'enum'"
          v-bind="column as Table.TagColumn<T>"
        >
          <template #default="{ row }">
            <el-tag
              :type="getTagType(column as Table.TagColumn<T>, row)"
              :effect="column.enumTagEffect || 'light'"
              :disable-transitions="true"
            >
              {{ getTagText(column as any, row) || '未知类型' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 普通列 -->
        <el-table-column v-bind="column" v-else>
          <template #default="{ row }">
            <!-- 有插槽则展示自定义插槽，否则正常展示内容 -->
            <slot v-if="column.slot" :name="column.slot" :row></slot>
            <span v-else>
              {{
                column.formatter
                  ? column.formatter(row, column, row[column.prop])
                  : row[column.prop]
              }}
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页组件区域 -->
    <el-pagination
      :current-page="internalPageNum"
      :page-size="internalPageSize"
      v-if="dataTotal > 0 && props.paginationOptions.showPagination"
      :page-sizes="props.paginationOptions.pageSizes"
      :layout="props.paginationOptions.layout"
      :background="props.paginationOptions.background || false"
      :disabled="props.paginationOptions.disabled || false"
      :total="dataTotal"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: v-bind('props.paginationOptions.align');
}
</style>
