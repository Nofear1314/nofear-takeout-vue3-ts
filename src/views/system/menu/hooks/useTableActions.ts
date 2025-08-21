// composables/useTableActions.ts
import { delMenuByIdsApi } from '@/api/menu'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useMenuStore } from '@/stores/modules/menu'

const { getNewRoutes } = useMenuStore()

export function useTableActions(getNewData: Function) {

  /**
   * 删除菜单
   * @param id 菜单id
   */
  const handleDelete = async (id: number) => {
    try {
      await ElMessageBox.confirm('确定删除吗？', '提示')
      await delMenuByIdsApi([id])
      ElMessage.success('删除成功')
      //获取最新菜单列表和路由信息
      await Promise.all([getNewData(), getNewRoutes()])
    } catch (err) {
      console.error("删除菜单失败:", err);
    }
  }

  /**
   * 批量删除菜单
   * @param ids 菜单id数组
   */
  const handleBatchDelete = async (ids: number[]) => {
    try {
      await ElMessageBox.confirm('确定批量删除吗？', '提示')
      await delMenuByIdsApi(ids)
      ElMessage.success('删除成功')
      //获取最新菜单列表和路由信息
      await Promise.all([getNewData(), getNewRoutes()])
    } catch (err) {
      console.error("删除菜单失败:", err);

    }
  }

  return { handleDelete, handleBatchDelete }
}
