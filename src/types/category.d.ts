/**
 * 分类实体类型
 */
interface Category {
  /**
   *  ID
   */
  id?: number
  /**
   *  名称
   */
  categoryName: string
  /**
   * 1.菜品分类 2.套餐分类
   */
  type: number
  /**
   * 排序
   */
  sort: number
  /**
   * 分类状态（0启用 1禁用）
   */
  status: number
  /**
   * 创建时间
   */
  addTime?: string
  /**
   * 创建者
   */
  addBy?: string
  /**
   * 更新时间
   */
  updateTime?: string
  /**
   * 更新者
   */
  updateBy?: string
  /**
   *  描述
   */
  description?: string
}

/**
 * 分类列表请求参数
 */
type CategoryListQuery = CreateQueryParams<
  Category,
  'categoryName' | 'type' | 'status'
>
