<script setup lang="ts">
import { getMenuByMidApi } from '@/api/menu'
import { FormItemRule } from 'element-plus'
import { Arrayable } from 'element-plus/es/utils'
import { MenuTypeEnum } from '@/enums'
import { useMenuManagement } from './hooks/useMenuManagement'
import { useMenuDiaLogForm } from './hooks/useMenuDiaLogForm'
import { useTableActions } from './hooks/useTableActions'
import IconSelect from '@/components/IconSelect/index.vue'
//显式定义组件名称，否则缓存不生效
defineOptions({
  name: 'Menu'
})
// 初始化数据
const { tableData, menuTreeSelectData, loading, getMenuList, getMenuTreeData } =
  useMenuManagement()
const { formRef, form, isOpenDiaLog, title, submitForm, closeDialog } =
  useMenuDiaLogForm(() => {
    getMenuList()
    getMenuTreeData()
  })
const { handleDelete, handleBatchDelete } = useTableActions(() => {
  getMenuList()
  getMenuTreeData()
})
/**
 * 表格是否展开
 */
const isExpandAll = ref(false)

/**
 * table的key，用于重新渲染表格解决展开不生效问题
 */
const tableKey = ref(0)

/**
 * 编辑行数据
 * @param row 行数据
 */
const handleEdit = async ({ id }: Menu) => {
  title.value = '编辑菜单'
  const { data } = await getMenuByMidApi(id!)
  form.value = data
  isOpenDiaLog.value = true
}

/**
 * 查询参数
 */
const queryParams = ref<MenuTableQueryParam>({
  menuName: '', //菜单名称
  status: undefined //菜单状态
})
/**
 * 搜索
 */
const handleSearch = () => {
  getMenuList(queryParams.value)
}

/** 展开/折叠操作 */
const toggleExpandAll = () => {
  // refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  tableKey.value++ // 触发组件重新渲染
}
/**
 * 重置
 */
const handleReset = () => {
  queryParams.value = {
    menuName: '', //菜单名称
    status: undefined //菜单状态
  }
  getMenuList()
}

/**
 * 打开添加对话框
 * @param id 上级菜单id
 */
const openDialog = (id: number = 0) => {
  form.value.parentId = id
  title.value = '添加菜单'
  isOpenDiaLog.value = true
}

/**
 * 要批量删除的商品id
 */
const multipleSelectionIds = ref<number[]>([])
/**
 * 批量删除
 * @param row 一行数据
 */
const handleSelectionChange = (row: Menu[]) => {
  multipleSelectionIds.value = row.map((v) => v.id!)
}

/**
 * 图标选择器组件ref
 */
const iconSelectRef = useTemplateRef('iconSelectRef')

/**
 * 图标选择器弹框隐藏后处理函数
 */
const handlePopoverHidden = () => {
  //重置图标选择器的数据
  iconSelectRef.value?.reset()
}

const handlePopoverShow = () => {
  //打开图标选择器
  iconSelectRef.value?.focusSearch()
}
/**
 * 选择图标的自定义事件处理函数
 * @param name 选中的图标名称
 */
const handleIconSelected = (name: string) => {
  form.value.icon = name
  iconSelectRef.value?.reset() // 关闭图标选择器
}

//菜单类型映射
const menuTypeOptions = [
  { label: '目录', value: MenuTypeEnum.DIR },
  { label: '菜单', value: MenuTypeEnum.MENU },
  { label: '按钮', value: MenuTypeEnum.BUTTON }
]

/**
 * 根据上级菜单动态计算可用的菜单类型
 */
const availableMenuTypes = computed(() => {
  const parentId = form.value.parentId
  if (parentId === 0) {
    return [MenuTypeEnum.DIR, MenuTypeEnum.MENU] // 顶级菜单可选目录/菜单
  }

  // 直接从menuTreeSelectData中查找上级菜单类型
  const parentMenu = findParentMenu(parentId)
  if (parentMenu) {
    switch (parentMenu.menuType) {
      case MenuTypeEnum.DIR: // 目录的子菜单只能是菜单/目录
        return [MenuTypeEnum.MENU, MenuTypeEnum.DIR]
      case MenuTypeEnum.MENU: // 菜单的子菜单只能是按钮
        return [MenuTypeEnum.BUTTON]
      default:
        return [MenuTypeEnum.DIR, MenuTypeEnum.MENU, MenuTypeEnum.BUTTON]
    }
  }
  return [MenuTypeEnum.DIR, MenuTypeEnum.MENU, MenuTypeEnum.BUTTON] // 默认情况
})

/**
 * 根据上级查找上级菜单
 * @param parentId 上级菜单id
 */
const findParentMenu = (parentId: number) => {
  function searchInTree(tree: MenuTreeSelect[]): MenuTreeSelect | null {
    for (const item of tree) {
      if (item.id === parentId) return item
      if (item.children) {
        //如果有子节点，递归查找
        const result = searchInTree(item.children)
        if (result) return result
      }
    }
    return null
  }

  return searchInTree(menuTreeSelectData.value)
}

// 监听上级菜单变化，自动调整当前菜单类型
watch(
  () => form.value.parentId,
  () => {
    const availableTypes = availableMenuTypes.value
    if (!availableTypes.includes(form.value.menuType)) {
      form.value.menuType = availableTypes[0] || MenuTypeEnum.DIR // 重置为第一个可用类型
    }
  }
)

/**
 * 整体表单校验规则
 */
const rules = computed(() => ({
  ...formRules, // 原有的rules定义
  ...menuTypeRules
}))

// 菜单类型验证规则
const menuTypeRules: Partial<Record<string, Arrayable<FormItemRule>>> = {
  menuType: [
    {
      validator: (rule, value, callback) => {
        if (!availableMenuTypes.value.includes(value)) {
          callback(new Error('根据上级菜单类型，此选项不可用'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}
/**
 * 表单校验规则
 */
const formRules: Partial<Record<string, Arrayable<FormItemRule>>> = {
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
  component: [{ required: true, message: '组件路径不能为空', trigger: 'blur' }],
  parentId: [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }],
  authCode: [{ required: false }], // 空校验规则，触发重置
  routeName: [{ required: false }],
  icon: [{ required: false }],
  query: [{ required: false }] // 空校验规则，触发重置
}

getMenuTreeData()
getMenuList(queryParams.value)

import componentsPaths from '@/views/system/menu/requireComponentsPaths'
console.log('🚀 ~ componentsPaths:', componentsPaths)
</script>

<template>
  <div>
    <el-card>
      <!-- 操作区域 -->
      <el-row :gutter="10" justify="space-between" class="mb-6">
        <el-col :span="10" class="border">
          <!-- 批量删除按钮 -->
          <el-button
            icon="DocumentDelete"
            type="danger"
            v-hasAuth="['sys:menu:del']"
            @click="() => handleBatchDelete(multipleSelectionIds)"
            :disabled="multipleSelectionIds.length === 0"
            >批量删除</el-button
          >
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            icon="Plus"
            @click="() => openDialog()"
            v-hasAuth="['sys:menu:add']"
            >添加</el-button
          >
          <el-button
            :disabled="!tableData.length"
            type="info"
            plain
            icon="Sort"
            @click="toggleExpandAll"
            >展开/折叠</el-button
          >
        </el-col>
        <el-col :span="14" class="!flex !justify-end gap-10px">
          <el-form inline :model="queryParams">
            <el-form-item>
              <el-input
                style="width: 200px"
                placeholder="菜单名称"
                type="text"
                clearable
                v-model.trim="queryParams.menuName"
              />
            </el-form-item>

            <el-form-item :label-width="200" width="200">
              <el-select
                placeholder="菜单状态"
                clearable
                class="!w-100px"
                v-model="queryParams.status"
              >
                <el-option label="正常" :value="false"></el-option>
                <el-option label="停用" :value="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="Search"
                @click="handleSearch"
                class="mr-10px"
                :loading
              >
                查找
              </el-button>
              <el-button
                icon="RefreshRight"
                @click="handleReset"
                style="margin: 0"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table
        size="small"
        v-loading="loading"
        loading
        stripe
        ref="tableRef"
        :row-key="(row) => row.id"
        :default-expand-all="isExpandAll"
        :key="tableKey"
        :data="tableData"
        max-height="calc(100vh - 180px)"
        width="100%"
        @selection-change="handleSelectionChange"
      >
        <template #empty>
          <el-empty :image-size="80" />
        </template>
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="menuName" label="菜单名称" width="180" fixed />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="{ row }">
            <svg-icon :name="row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" width="60" label="排序" />
        <el-table-column prop="authCode" width="160" label="权限标识" />
        <el-table-column prop="component" width="180" label="组件路径" />
        <el-table-column prop="menuType" label="菜单类型">
          <template #default="{ row }">
            <el-tag v-if="row.menuType === 'M'" type="success">目录</el-tag>
            <el-tag v-else-if="row.menuType === 'C'" type="warning"
              >菜单</el-tag
            >
            <el-tag v-else type="danger">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row: { status } }">
            <el-tag :type="status ? 'danger' : 'success'">{{
              status ? '停用' : '正常'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="创建时间"
          width="100"
          show-overflow-tooltip
          :tooltip-formatter="({ row }) => row.addTime"
        />
        <el-table-column prop="description" label="描述" width="100" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-tooltip :content="$translate('编辑')" placement="top">
              <el-button
                v-hasAuth="['sys:menu:edit']"
                type="info"
                icon="Edit"
                circle
                @click="handleEdit(row)"
              />
            </el-tooltip>
            <el-tooltip
              :content="$translate('添加')"
              placement="top"
              v-if="row.menuType != 'F'"
            >
              <el-button
                v-hasAuth="['sys:menu:add']"
                type="primary"
                icon="Plus"
                circle
                @click="openDialog(row.id)"
              />
            </el-tooltip>
            <el-tooltip :content="$translate('删除')" placement="top">
              <el-button
                type="danger"
                v-hasAuth="['sys:menu:del']"
                icon="Delete"
                circle
                @click="handleDelete(row.id)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="title"
      center
      v-model="isOpenDiaLog"
      width="680px"
      append-to-body
      @close="closeDialog"
      draggable
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="pt-20px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <el-tree-select
                empty-text="暂无数据"
                v-model="form.parentId"
                :data="menuTreeSelectData"
                value-key="id"
                placeholder="选择上级菜单"
                check-strictly
              >
                <template #default="{ data }">
                  <svg-icon :name="data.icon"></svg-icon>
                  {{ data.label }}
                </template>
              </el-tree-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio
                  v-for="type in availableMenuTypes"
                  :key="type"
                  :value="type"
                >
                  {{
                    menuTypeOptions.find((opt) => opt.value === type)?.label ||
                    type
                  }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                placement="bottom-start"
                :width="540"
                @show="handlePopoverShow"
                trigger="click"
                @hide="handlePopoverHidden"
              >
                <template #reference>
                  <el-input
                    v-model="form.icon"
                    placeholder="点击选择图标"
                    readonly
                  >
                    <template #prefix>
                      <svg-icon
                        v-if="form.icon"
                        :name="form.icon"
                        style="height: 32px; width: 16px"
                      />
                      <el-icon v-else style="height: 32px; width: 16px"
                        ><search
                      /></el-icon>
                    </template>
                  </el-input>
                </template>
                <!-- 图标选择弹框区域 -->
                <icon-select
                  ref="iconSelectRef"
                  @selected="handleIconSelected"
                  :active-icon="form.icon"
                />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == MenuTypeEnum.MENU">
            <el-form-item prop="routeName">
              <template #label>
                <span>
                  <el-tooltip
                    content="默认不填则和路由地址相同：如地址为：`user`，则名称为`User`（注意：因为router会删除名称相同路由，为避免名字的冲突，特殊情况下请自定义，保证唯一性），该名称需要和组件名称保持一致，否则路由缓存无法生效，且组件名称需要使用defineOptions.name显式定义，否则无效"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由名称
                </span>
              </template>
              <el-input v-model="form.routeName" placeholder="请输入路由名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != MenuTypeEnum.BUTTON">
            <el-form-item prop="path">
              <template #label>
                <span>
                  <el-tooltip
                    content="访问的路由地址，如：`user`"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由地址
                </span>
              </template>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == MenuTypeEnum.MENU">
            <el-form-item prop="component">
              <template #label>
                <span>
                  <el-tooltip
                    content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  组件路径
                </span>
              </template>
              <!-- <el-input v-model="form.component" placeholder="请输入组件路径">
                <!== <template #prepend>views/</template> ==>
                <template #append>.vue</template>
              </el-input> -->
              <el-select
                v-model="form.component"
                filterable
                allow-create
                :reserve-keyword="false"
                placeholder="请输入组件路径"
              >
                <el-option
                  v-for="item in componentsPaths"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != MenuTypeEnum.DIR">
            <el-form-item prop="authCode">
              <el-input
                v-model="form.authCode"
                placeholder="请输入权限标识"
                maxlength="100"
              />
              <template #label>
                <span>
                  <el-tooltip
                    content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPerm('system:user:list')`)"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  权限字符
                </span>
              </template>
            </el-form-item>
          </el-col>
          <!-- TODO 路由参数 -->
          <!-- <el-col :span="12" v-if="form.menuType == MenuTypeEnum.MENU">
            <el-form-item prop="query">
              <el-input
                v-model="form.query"
                placeholder="请输入路由参数"
                maxlength="255"
              />
              <template #label>
                <span>
                  <el-tooltip
                    content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由参数
                </span>
              </template>
            </el-form-item>
          </el-col> -->
          <el-col :span="12" v-if="form.menuType == MenuTypeEnum.MENU">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  是否缓存
                </span>
              </template>
              <el-radio-group v-model="form.isCache">
                <el-radio :value="false">缓存</el-radio>
                <el-radio :value="true">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != MenuTypeEnum.BUTTON">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  显示状态
                </span>
              </template>
              <el-radio-group v-model="form.hidden">
                <el-radio :value="false">显示</el-radio>
                <el-radio :value="true">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  菜单状态
                </span>
              </template>
              <el-radio-group v-model="form.status">
                <el-radio :value="false">正常</el-radio>
                <el-radio :value="true">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <template #label>描述</template>
              <el-input
                type="textarea"
                v-model="form.description"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" :loading
            >确 定</el-button
          >
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.el-form--inline {
  .el-form-item {
    margin: 0;
    margin-left: 10px;
  }
}
</style>
