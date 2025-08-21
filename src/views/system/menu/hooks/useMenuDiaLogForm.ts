// composables/useMenuForm.ts
import { addMenuApi, updateMenuByMidApi } from '@/api/menu'
import { MenuTypeEnum } from '@/enums'
import type { FormInstance } from 'element-plus'
import { useMenuStore } from '@/stores/modules/menu'
const { getNewRoutes } = useMenuStore()
export function useMenuDiaLogForm(getNewData: Function) {
  /**
   * 表单ref
   */
  const formRef = ref<FormInstance>()


  /**
   * 表单数据
   */
  const form = ref<Menu>({
    menuName: '',
    parentId: 0,
    orderNum: 0,
    path: '',
    routeName: '',
    component: '',
    menuType: MenuTypeEnum.DIR, //菜单类型（M目录 C菜单 F按钮）
    isCache: false, //是否缓存（0缓存 1不缓存）默认缓存
    hidden: false, //菜单状态（0显示 1隐藏）
    status: false, //菜单状态（0正常 1停用）
    authCode: '',
    query: '',
    icon: '',
    description:''
  })
  // 对话框状态
  const isOpenDiaLog = ref(false)
  // 对话框标题
  const title = ref('')


  /**
   * 提交表单
   */
  const submitForm = async () => {
    await formRef.value?.validate()
    const api = form.value.id ? updateMenuByMidApi : addMenuApi
    await api(form.value)

    await Promise.all([getNewData(), getNewRoutes()])
    ElMessage.success(`${form.value.id ? '修改' : '新增'}成功`)
    closeDialog()
  }

  /**
   * 关闭对话框
   */
  const closeDialog = async () => {
    isOpenDiaLog.value = false
    setTimeout(() => {
      // 重置表单,延迟300毫秒，解决数据闪烁问题
      formRef.value?.resetFields()
      form.value = {
        menuName: '',
        parentId: 0,
        orderNum: 0,
        path: '',
        routeName: '',
        component: '',
        menuType: MenuTypeEnum.DIR, //菜单类型（M目录 C菜单 F按钮）
        isCache: false, //是否缓存（0缓存 1不缓存）默认缓存
        hidden: false, //菜单状态（0显示 1隐藏）
        status: false, //菜单状态（0正常 1停用）
        authCode: '',
        query: '',
        icon: '',
        description:''
      }
    }, 300)
  }

  return { formRef, form, isOpenDiaLog, title, submitForm, closeDialog }
}
