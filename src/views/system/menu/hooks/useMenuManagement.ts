// composables/useMenuManagement.ts
import { getMenuTreeListApi, getMenuTreeSelectDataApi } from '@/api/menu'
import { MenuTypeEnum } from '@/enums'

export function useMenuManagement() {
  /**
   * 表格数据
   */
  const tableData = ref<Menu[]>([])
  /**
   * 树形选择数据
   */
  const menuTreeSelectData = ref<MenuTreeSelect[]>([])

  /**
   * 是否加载中
   */
  const loading = ref(false)

  /**
   * 获取表格数据
   * @param params 查询参数
   */
  const getMenuList = async (params?: MenuTableQueryParam) => {
    try {
      loading.value = true
      const { data } = await getMenuTreeListApi(params)
      tableData.value = data
    } finally {
      loading.value = false
    }
  }


  /**
   * 获取树形选择数据
   */
  const getMenuTreeData = async () => {
    const { data } = await getMenuTreeSelectDataApi()
    menuTreeSelectData.value = [{
      id: 0,
      label: '顶级菜单',
      menuType: MenuTypeEnum.DIR,
      icon:'',
      children: data
    }]
  }

  return { tableData,loading, menuTreeSelectData, getMenuList, getMenuTreeData }
}
