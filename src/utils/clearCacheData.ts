import { useMenuStore } from '@/stores/modules/menu'
import { useAdminStore } from '@/stores/modules/admin'

/**
 * 清除用户信息以及各种缓存数据
 */
export const clearCacheData = () => {
  const menuStore = useMenuStore()
const adminStore = useAdminStore()
  // 清除用户信息
  adminStore.clearAdminInfo()
  //  重置菜单数据和路由数据
  menuStore.reset()
  menuStore.clearDynamicRoutes()
  //  清除缓存数据
  localStorage.clear()
}
