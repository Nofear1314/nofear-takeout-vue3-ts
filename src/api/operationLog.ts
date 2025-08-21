import { request } from "@/utils/request"

/**
 * 分页查询操作日志
 * @param params 请求参数
 * @returns
 */
export const getPageListApi = (params?: OperationLogQueryParam) => {
  return request<PageResult<OperationLog>>({
    url: "/admin/oper/log",
    method: "get",
    params
  })
}

/**
 * 批量删除操作日志
 * @param ids 删除id数组
 * @returns
 */
export const delOperationLogByIdsApi = (ids: number[]) => {
  return request({
    url: "/admin/oper/log",
    method: "delete",
    data: ids
  })
}

/**
 * 清空操作日志数据
 */
export const delAllOperationLogApi = () => {
  return request({
    url: "/admin/oper/log/clean",
    method: "delete"
  })
}
