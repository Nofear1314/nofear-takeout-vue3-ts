/**
 * 通用分页请求参数类型
 */
interface PageQuery {
  /**
   * 当前页码
   */
  pageNum?: number
  /**
   * 每页条数
   */
  pageSize?: number
}

/**
 * 通用分页响应参数类型
 */
interface PageResult<T> {
  /**
   * 总条数
   */
  total: number
  /**
   * 总页数
   */
  pages: number
  /**
   * 当前页码
   */
  // pageNum: number;
  /**
   * 每页条数
   */
  // pageSize: number;
  /**
   * 数据列表
   */
  list: T[]
}

type CreateQueryParams<T, K extends keyof T> = Partial<Pick<T, K>> & PageQuery
