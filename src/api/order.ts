import { request } from '@/utils/request'

/**
 * 分页查询订单列表
 * @param params 订单列表查询参数
 * @returns
 */
export const getOrderListApi = (params: OrderListQuery) => {
  return request({
    url: '/admin/order',
    method: 'get',
    params
  })
}

/**
 * 更新订单信息
 * @param data 订单信息
 * @returns
 */
export const updateOrderApi = (data: Order) => {
  return request({
    url: '/admin/order',
    method: 'put',
    data
  })
}

/**
 * 根据订单id查询订单信息
 * @param id 订单id
 * @returns
 */
export const getOrderInfoByIdApi = (id: number) => {
  return request<OrderInfoVO>({
    url: `/admin/order/${id}`,
    method: 'get'
  })
}
