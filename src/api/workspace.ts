import { request } from '@/utils/request'

/**
 * 获取工作台概览数据
 * @returns
 */
export const getBusinessDataApi = () => {
  return request<BusinessDataVO>({
    url: '/admin/workspace/overview/business',
    method: 'get'
  })
}


/**
 * 获取订单信息数据概述
 * @returns
 */
export const getOrderOverviewApi = () => {
  return request<OrderOverviewVO>({
    url: '/admin/workspace/overview/order',
    method: 'get'
  })
}


/**
 * 获取菜品信息数据概述
 * @returns
 */
export const getDishOverviewApi = () => {
  return request<DishOverviewVO>({
    url: '/admin/workspace/overview/dishes',
    method: 'get'
  })
}
