import { request } from '@/utils/request'

/**
 * 分页获取列表
 * @param params 列表查询参数
 * @returns
 */
export const getListCategoryPageApi = (params?: CategoryListQuery) => {
  return request<PageResult<Category>>({
    url: '/admin/category',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param data 新增分类参数
 * @returns
 */
export const addCategoryApi = (data: Category) => {
  return request({
    url: '/admin/category',
    method: 'post',
    data
  })
}

/**
 * 编辑
 * @param data 编辑分类参数
 * @returns
 */
export const updateCategoryApi = (data: Category) => {
  return request({
    url: '/admin/category',
    method: 'put',
    data
  })
}

/**
 *  删除
 * @param ids id集合
 * @returns
 */
export const batchDelCategoryByIdsApi = (ids: number[]) => {
  return request({
    url: '/admin/category',
    method: 'delete',
    data: ids
  })
}

