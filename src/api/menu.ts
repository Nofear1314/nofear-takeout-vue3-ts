import { request, type Result } from "@/utils/request"


/**
 * 获取该登录用户的路由信息
 * @returns 路由信息
 */
export const getRoutersApi = () => {
  return request<Route[]>({
    url: '/admin/menu/routers',
    method: 'get',
  })
}

/**
 * 获取菜单树列表，不包括按钮权限，此处数据用于前端选择树
 * @returns 菜单树列表
 */
export const getMenuTreeSelectDataApi = () => {
  return request<MenuTreeSelect[]>({
    url: '/admin/menu/tree/select/list',
    method: 'get',
  })
}

/**
 * 添加菜单
 * @param data 菜单信息
 * @returns
 */
export const addMenuApi = (data: Menu) => {
  return request({
    url: '/admin/menu',
    method: 'post',
    data
  })
}

/**
 * 根据id更新菜单信息
 * @param data 菜单信息
 * @returns
 */
export const updateMenuByMidApi = (data: Menu) => {
  return request({
    url: '/admin/menu',
    method: 'put',
    data
  })
}

/**
 * 获取菜单树列表，包括按钮权限等信息（树状结构）
 * @returns 菜单树列表
 */
export const getMenuTreeListApi = (params?: MenuTableQueryParam) => {
  return request<Menu[]>({
    url: '/admin/menu/list',
    method: 'get',
    params
  })
}



/**
 * 根据id数组批量删除菜单信息
 * @param id 菜单id数组
 * @returns
 */
export const delMenuByIdsApi = (ids: number[]) => {
  return request({
    url: '/admin/menu/',
    method: 'delete',
    data: ids
  })
}


/**
 * 根据菜单id获取菜单信息
 * @param id 菜单id
 * @returns 菜单信息
 */
export const getMenuByMidApi = (id: number) => {
  return request<Menu>({
    url: `/admin/menu/${id}`,
    method: 'get',
  })
}

/**
 * 获取权限列表树（此处用于 编辑/增加 角色时选择权限所展示的树型选择框，包含所有权限（菜单，目录，按钮））
 */
export const getAuthSelectionTreeApi = () => {
  return request<MenuTreeSelect[]>({
    url: '/admin/menu/auth/select/tree',
    method: 'get',
  })
}
