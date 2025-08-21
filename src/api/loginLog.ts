import { request } from "@/utils/request";

/**
 * 分页查询登录日志
 * @param params 查询参数
 * @returns
 */
export const getLoginLogPageApi = (params?: LoginLogQueryParam) => {
  return request<PageResult<LoginLog>>({
    url: '/admin/login/log',
    method: 'get',
    params
  })
}

/**
 * 批量删除登录日志
 * @param ids 删除的id数组
 * @returns
 */
export const deleteLoginLogApi = (ids: number[]) => {
  return request({
    url: '/admin/login/log',
    method: 'delete',
    data: ids
  })
}

/**
 * 清空登录日志
 */
export const clearLoginLogApi = () => {
  return request({
    url: '/admin/login/log/clear',
    method: 'delete'
  })
}
