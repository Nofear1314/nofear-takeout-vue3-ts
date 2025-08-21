/**
 * 订单实体类型
 */
interface Order {
  /**
   * id
   */
  id: number
  /**
   * 用户名
   */
  username: string
  /**
   * 实收金额
   */
  price: number
  /**
   * 订单号
   */
  orderNumber: string
  /**
   * 手机号
   */
  tel: string
  /**
   * 地址
   */
  address: string
  /**
   * 下单时间
   */
  addTime: string
  /**
   * 订单状态
   */
  status: number
}

/**
 * 订单列表请求参数
 */
type OrderListQuery = CreateQueryParams<
  Order,
  'orderNumber' | 'tel' | 'status'
> & {
  beginTime: string
  endTime: string
}

interface OrderInfoVO {
  id: number
  /**
   * 订单号
   */
  orderNumber: string

  /**
   * 实收金额
   */
  amounts: number
  /**
   * 订单状态（0:待支付 1:待接单 2:待派送 3:派送中 4:已完成 5:已取消）
   */
  status: number
  /**
   * 用户名
   */
  username: string
  /**
   * 手机号
   */
  tel: string
  /**
   * 地址
   */
  address: string

  /**
   * 下单时间
   */
  addTime: string
  /**
   * 支付时间
   */
  payTime: string

  /**
   * 订单菜品
   */
  dishList: OrderDishVO[]
}
/**
 * 订单菜品
 */
interface OrderDishVO {
  id: number
  /**
   * 菜品名称
   */
  dishName: string
  /**
   * 菜品数量
   */
  count: number
  /**
   * 菜品价格
   */
  price: number
  /**
   * 图片
   */
  img: string
}
