import { request } from '@/utils/request'

/**
 * 根据时间范围获取对应的销售额数据
 * @param params { beginTime: string, endTime: string }时间范围
 * @returns
 */
export const getTurnoverStatisticsByDateRangeApi = (params: DateRange) => {
  return request<TurnoverReportVO>({
    url: '/admin/report/turnover/date/statistics',
    method: 'get',
    params
  })
}

/**
 * 根据时间范围获取对应的用户数量数据
 * @param params { beginTime: string, endTime: string }时间范围
 * @returns
 */
export const getUserNumberStatisticsByDateRangeApi = (params: DateRange) => {
  return request<UserNumberReportVO>({
    url: '/admin/report/user/number/statistics',
    method: 'get',
    params
  })
}

/**
 * 根据时间范围获取对应的订单数量数据
 * @param params { beginTime: string, endTime: string }时间范围
 * @returns
 */
export const getOrderNumberStatisticsByDateRangeApi = (params: DateRange) => {
  return request<OrderNumberReportVO>({
    url: '/admin/report/order/number/statistics',
    method: 'get',
    params
  })
}

/**
 *  根据时间范围获取对应的菜品销售Top10数据
 * @param params { beginTime: string, endTime: string }时间范围
 * @returns
 */
export const getSaleDishTop10ByDateRangeApi = (params: DateRange) => {
  return request<SaleDishTop10VO>({
    url: '/admin/report/sales/dish/top10/statistics',
    method: 'get',
    params
  })
}
