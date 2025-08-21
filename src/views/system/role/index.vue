<script setup lang="ts">
const router = useRouter()
defineOptions({
  name: 'Role'
})
import { getAuthSelectionTreeApi } from '@/api/menu'
import {
  addRoleApi,
  deleteRoleByIdsApi,
  getRoleListPageApi,
  updateRoleApi
} from '@/api/role'
import TablePro from '@/components/TablePro/index.vue'
import { dayjs, type TreeInstance } from 'element-plus'

const tableRef = ref()
/**
 * 表格列配置
 */
const columns = [
  {
    type: 'selection',
    width: '55px',
    label: '选择'
  },
  {
    type: 'index',
    label: '序号',
    width: '80px'
  },
  {
    label: '角色名称',
    prop: 'roleName',
    search: {
      el: 'text'
    }
  },
  {
    label: '角色权限编码',
    prop: 'roleKey'
  },
  {
    type: 'enum',
    label: '状态',
    prop: 'status',
    enum: [
      {
        label: '启用',
        value: 0,
        type: 'success'
      },
      {
        label: '禁用',
        value: 1,
        type: 'danger'
      }
    ],
    search: {
      el: 'select'
    }
  },
  {
    label: '排序',
    prop: 'roleSort',
    sortable: true
  },
  {
    label: '创建者',
    prop: 'addBy'
  },
  {
    label: '创建时间',
    prop: 'addTime',
    width: '100px',
    'tooltip-formatter': (row) => {
      return dayjs(row.addTime).format('YYYY-MM-DD HH:mm:ss') ?? row.addTime
    },
    'show-overflow-tooltip': true
  },
  {
    label: '描述',
    prop: 'description'
  },
  {
    label: '操作',
    prop: 'action',
    align: 'center',
    slot: 'action',
    width: '180px'
  }
] as const satisfies Table.Column<Role>[]

/**
 * 获取表格数据
 * @param params 请求参数
 */
const getTableData: Table.RequestApi<Role, typeof columns> = async (params) => {
  const { data } = await getRoleListPageApi({
    ...params
  })

  return data
}

/**
 * 表格选中行
 */
const selectionRows = ref<Role[]>([])

/**
 * 删除
 * @param id id
 */
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除吗？', '提示')
    await deleteRoleByIdsApi([id])
    tableRef.value?.loadData()
    ElMessage.success('删除成功')
  } catch (err) {
    console.error(err)
  }
}
/**
 * 分配用户
 * @param rid 角色id
 */
const handleAssignUsers = (rid: number) => {
  router.push({
    name: 'AuthUser',
    params: { roleId: rid }
  })
}

/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要批量删除选中的数据吗？', '提示')
    await deleteRoleByIdsApi(selectionRows.value.map((role) => role.id!))
    tableRef.value?.loadData()
    ElMessage.success('删除成功')
  } catch (err) {
    console.error(err)
  }
}

const form = ref<Role>({
  id: undefined,
  roleName: '',
  roleKey: '',
  status: 0,
  roleSort: 0,
  description: '',
  menuIds: []
})

const rules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }]
}
/**
 * 展开/折叠
 */
const menuExpand = ref(false)
/**
 * 全选/全不选
 */
const menuNodeAll = ref(false)
/**
 * 父子联动
 */
const menuCheckStrictly = ref(true)
/**
 * 操作弹框是否显示
 */
const dialogVisible = ref(false)
/**
 * 操作弹框标题
 */
const dialogTitle = ref('')
/**
 * 操作弹框表单实例
 */
const formRef = useTemplateRef('formRef')

/**
 * 打开操作弹框
 */
const openAddDialog = () => {
  dialogTitle.value = '添加角色'
  dialogVisible.value = true
}

/**
 * 编辑
 */
const handleEdit = (row: Role) => {
  dialogTitle.value = '编辑角色'
  dialogVisible.value = true
  form.value = { ...row }
  // 延迟 100ms 确保树组件渲染完成
  setTimeout(() => {
    if (authTreeRef.value) {
      const ids = form.value.menuIds
      for (const id of ids!) {
        authTreeRef.value.setChecked(id ?? [], true, false)
      }
    }
  }, 100)
}

/**
 * 权限树实例
 */
const authTreeRef = useTemplateRef<TreeInstance>('authTreeRef')
/**
 * 权限树数据
 */
const authSelectTreeData = ref<AuthSelectionTreeData[]>([])
/**
 * 获取权限树数据
 */
const getAuthSelectionTreeData = async () => {
  const { data } = await getAuthSelectionTreeApi()
  authSelectTreeData.value = data
}

/**
 * 树权限（展开/折叠）
 */
const handleCheckedTreeExpand = (value: boolean) => {
  // 递归函数：处理单个节点及其所有子节点
  const processNode = (node: AuthSelectionTreeData) => {
    // 设置当前节点的展开状态
    if (authTreeRef.value && authTreeRef.value.store.nodesMap[node.id]) {
      authTreeRef.value.store.nodesMap[node.id].expanded = value
    }

    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: AuthSelectionTreeData) => {
        processNode(child)
      })
    }
  }
  // 处理所有根节点
  authSelectTreeData.value.forEach((node) => {
    processNode(node)
  })
}
/**
 * 全选/全不选
 */
const handleCheckedTreeNodeAll = (value: boolean) => {
  // 两种方法都可以

  // 1. 直接设置所有节点的选中状态（但是有类型问题）
  // authTreeRef.value?.setCheckedNodes(
  //   value ? (authSelectTreeData.value as Node[]) : []
  // )

  // 2. 递归设置所有节点的选中状态（无类型问题）
  if (!authTreeRef.value) return
  if (value) {
    // 全选：获取所有节点的 id（需递归遍历所有层级）
    const allIds = getTreeAllIds(authSelectTreeData.value)
    authTreeRef.value.setCheckedKeys(allIds, true) // 第二个参数为是否级联选中子节点
  } else {
    // 全不选：清空选中状态
    authTreeRef.value.setCheckedKeys([])
  }
}

/**
 * 递归获取树中所有节点的 id
 */
const getTreeAllIds = (nodes: AuthSelectionTreeData[]): (string | number)[] => {
  return nodes.flatMap((node) => [
    node.id,
    ...(node.children ? getTreeAllIds(node.children) : [])
  ])
}

/**
 * 提交操作表单
 */
const submitForm = async () => {
  // 表单校验
  await formRef.value?.validate()
  // 获取选中的节点
  const checksIds = authTreeRef.value?.getCheckedKeys()
  // 获取半选中的节点
  const checksIdsHalf = authTreeRef.value?.getHalfCheckedKeys()
  form.value.menuIds = [...checksIds!, ...checksIdsHalf!] as number[]

  try {
    const api = form.value.id ? updateRoleApi : addRoleApi
    await api(form.value)
    tableRef.value?.loadData()
    ElMessage.success(form.value.id ? '编辑成功' : '添加成功')
    dialogVisible.value = false
  } catch (err) {
    console.error(err)
  }
}

/**
 * 关闭操作弹框
 */
const handleClose = () => {
  dialogVisible.value = false
  authTreeRef.value?.setCheckedKeys([])
  menuExpand.value = false
  menuNodeAll.value = false

  handleCheckedTreeExpand(false)

  formRef.value?.resetFields()
  form.value = {
    id: undefined,
    roleName: '',
    roleKey: '',
    status: 0,
    roleSort: 0,
    description: '',
    menuIds: []
  }
}

getAuthSelectionTreeData()
</script>

<template>
  <div class=" ">
    <!-- 表格区域 -->
    <TablePro
      size="small"
      :stripe="true"
      :search-form-config="{
        labelWidth: '70'
      }"
      ref="tableRef"
      :columns
      :request-api="getTableData"
      v-model:selection-rows="selectionRows"
    >
      <template #toolbar>
        <!-- 批量删除按钮 -->
        <el-button
          v-hasAuth="['sys:role:del']"
          icon="DocumentDelete"
          type="danger"
          size="small"
          @click="handleBatchDelete"
          :disabled="selectionRows.length === 0"
          >批量删除</el-button
        >
        <!-- 添加按钮 -->
        <el-button
          v-hasAuth="['sys:role:add']"
          type="primary"
          icon="Plus"
          size="small"
          @click="() => openAddDialog()"
          >添加</el-button
        >
      </template>
      <template #action="{ row }">
        <div v-if="row.id !== 1">
          <!-- 编辑按钮 -->
          <el-tooltip :content="$translate('编辑')" placement="top">
            <el-button
              v-hasAuth="['sys:role:edit']"
              type="primary"
              icon="Edit"
              circle
              @click="handleEdit(row)"
            />
          </el-tooltip>

          <!-- 删除按钮 -->
          <el-tooltip :content="$translate('删除')" placement="top">
            <el-button
              v-hasAuth="['sys:role:del']"
              type="danger"
              icon="Delete"
              circle
              @click="handleDelete(row.id)"
            />
          </el-tooltip>

          <el-tooltip :content="$translate('分配用户')" placement="top">
            <el-button
              v-hasAuth="['sys:role:assignUser']"
              type="info"
              icon="User"
              circle
              @click="handleAssignUsers(row.id)"
            />
          </el-tooltip>
        </div>
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <template #label>
            <span>
              <el-tooltip
                content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                placement="top"
              >
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
              权限字符
            </span>
          </template>
          <el-input v-model="form.roleKey" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="0">正常</el-radio>
            <el-radio :value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色排序" prop="roleSort">
          <el-input v-model="form.roleSort"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox
            v-model="menuExpand"
            @change="handleCheckedTreeExpand($event as boolean)"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event as boolean)"
            >全选/全不选</el-checkbox
          >
          <el-checkbox v-model="menuCheckStrictly">父子联动</el-checkbox>
          <el-tree
            class="auth-tree"
            show-checkbox
            :data="authSelectTreeData"
            :check-strictly="!menuCheckStrictly"
            ref="authTreeRef"
            node-key="id"
            empty-text="暂无数据，请稍后重试"
          >
            <template #default="{ data }">
              <svg-icon :name="data.icon" class="mr-1"></svg-icon>
              {{ data.label }}
            </template>
          </el-tree>
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
  </div>
</template>

<style scoped lang="scss">
.auth-tree {
  margin-top: 5px;
  border: 1px solid var(--el-border-color-light, #e5e6e7);
  background: var(--el-bg-color, #ffffff) none;
  border-radius: 4px;
  width: 100%;
  height: 200px;
  overflow-y: auto;
  padding: 5px 10px;
  box-sizing: border-box;
}
</style>
