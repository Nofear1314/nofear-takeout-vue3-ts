import { request } from "@/utils/request"

/**
 * 分页获取角色列表
 * @param params 角色列表查询参数
 * @returns
 */
export const getRoleListPageApi = (params?: RoleListQuery) => {
  return request<RolePageTableData>({
    url: '/admin/role',
    method: 'get',
    params
  })
}

/**
 * 添加角色
 * @param data 角色信息
 * @returns
 */
export const addRoleApi = (data: Role) => {
  return request({
    url: '/admin/role',
    method: 'post',
    data
  })
}

/**
 * 编辑
 * @param data 角色信息
 * @returns
 */
export const updateRoleApi = (data: Role) => {
  return request({
    url: '/admin/role',
    method: 'put',
    data
  })
}

/**
 * 根据id批量删除角色
 * @param ids 要删除的角色id集合
 * @returns
 */
export const deleteRoleByIdsApi = (ids: number[]) => {
  return request({
    url: '/admin/role',
    method: 'delete',
    data: ids
  })
}

/**
 * 分页查询角色已授权用户列表
 * @param query 查询参数
 * @returns
 */
export const getAllocatedAdminListApi = (query: AllocatedAdminListParam) => {
  return request<PageResult<AllocatedAdmin>>({
    url: '/admin/role/auth/allocated/list',
    method: 'get',
    params: query
  })
}

/**
 * 分页查询一个角色里未分配用户角色列表
 * @param params 查询参数
 */
export const getUnallocatedListApi = (params: UnallocatedAdminListParam) => {
  return request<PageResult<UnallocatedAdmin>>({
    url: '/admin/role/auth/unallocated/list',
    method: 'get',
    params
  })
}

/**
 * 批量取消授权用户
 * @param data
 * @returns
 */
export const batchCancelAllocatedAdminApi = (data: { roleId: number, adminIds: number[] }) => {
  return request({
    url: '/admin/role/auth/cancel',
    method: 'put',
    data
  })
}

/**
 * 批量选择用户授权
 * @param data 请求参数
 * @returns
 */
export const batchAllocatedSelectAdminApi = (data: { roleId: number, adminIds: number[] }) => {
  return request({
    url: '/admin/role/auth/select',
    method: 'put',
    data
  })
}
