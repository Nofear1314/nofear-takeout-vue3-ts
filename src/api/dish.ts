import { request } from '@/utils/request'

/**
 * 分页获取列表
 * @param params 列表查询参数
 * @returns
 */
export const getListDishPageApi = (params?: DishListQuery) => {
  return request<PageResult<Dish>>({
    url: '/admin/dish',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param data 新增参数
 * @returns
 */
export const addDishApi = (data: Dish) => {
  return request({
    url: '/admin/dish',
    method: 'post',
    data
  })
}

/**
 * 编辑
 * @param data 编辑参数
 * @returns
 */
export const updateDishApi = (data: Dish) => {
  return request({
    url: '/admin/dish',
    method: 'put',
    data
  })
}

/**
 *  删除
 * @param ids id集合
 * @returns
 */
export const batchDelDishByIdsApi = (ids: number[]) => {
  return request({
    url: '/admin/dish',
    method: 'delete',
    data: ids
  })
}

