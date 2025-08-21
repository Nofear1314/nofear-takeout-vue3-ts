/**
 * 菜品实体类型
 */
interface Dish {
  /**
   * 菜品id
   */
  id?: number
  /**
   * 菜品名称
   */
  dishName: string
  /**
   * 菜品描述
   */
  description: string
  /**
   * 菜品价格
   */
  price: number
  /**
   * 菜品状态（0启用 1禁用）
   */
  status: number
  /**
   * 菜品图片
   */
  img: string
  /**
   * 菜品所属分类id
   */
  categoryId: string

  /**
   * 分类名称
   */
  categoryName?: string
  /**
   * 添加时间
   */
  addTime?: string
  /**
   * 更新时间
   */
  updateTime?: string
  /**
   * 添加者
   */
  addBy?: string
  /**
   * 更新者
   */
  updateBy?: string
}

/**
 * 分类列表请求参数
 */
type DishListQuery = CreateQueryParams<Dish, 'categoryId' | 'dishName' | ''>
