import { request, type Result } from "@/utils/request"

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 * @returns 登录用户的信息
 */
export const loginApi = ({ username, password }: LoginParams): Promise<Result<AdminInfo>> => {
  return request({
    url: '/admin/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

/**
 * 登出
 * @returns
 */
export const logoutApi = (): Promise<Result> => {
  return request({
    url: '/logout',
    method: 'post',
  })
}


/**
 * 分页获取管理员列表
 * @param params 查询参数
 * @returns
 */
export const getAdminPageListApi = (params: AdminListQuery) => {
  return request<AdminPageTableData>({
    url: '/admin/admin',
    method: 'get',
    params
  })
}

/**
 * 批量删除
 * @param ids 要删除的id数组
 * @returns
 */
export const delAdminByIdsApi = (ids: number[]) => {
  return request({
    url: '/admin/admin',
    method: 'delete',
    data: ids
  })
}

/**
 * 更新管理员信息
 * @param data 管理员信息
 * @returns
 */
export const updateAdminApi = (data: Admin) => {
  return request({
    url: '/admin/admin',
    method: 'put',
    data
  })
}

/**
 * 新增管理员
 * @param data 管理员信息
 * @returns
 */
export const addAdminApi = (data: Admin) => {
  return request({
    url: '/admin/admin',
    method: 'post',
    data
  })
}

/**
 * 获取管理员信息
 */
export const getAdminInfoApi = () => {
  return request<AdminInfo>({
    url: '/admin/admin/info',
    method: 'get',
  })
}

/**
 * 修改密码
 */
export const updatePwdApi = (data: UpdatePwdParams) => {
  return request({
    url: '/admin/admin/change/pwd',
    method: 'put',
    data
  })
}

/**
 * 分配角色
 * @param data 分配角色参数
 * @returns
 */
export const assignRolesApi = (data: AssignRolesParams) => {
  return request({
    url: '/admin/admin/assign/roles',
    method: 'post',
    data
  })
}

/**
 * 重置密码
 * @param data 重置密码参数
 * @returns
 */
export const resetPwdByIdApi = (data: ResetPwdParams) => {
  return request({
    url: '/admin/admin/reset/pwd',
    method: 'put',
    data
  })
}
