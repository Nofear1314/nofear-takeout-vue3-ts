interface BusinessDataVO {
  /**
   * 新增用户数
   */
  newUsers: number
  /**
   * 订单完成率
   */
  orderCompletionRate: number
  /**
   * 有效营业额
   */
  turnover: number
  /**
   * 平均客单价
   */
  unitPrice: number
  /**
   * 有效订单数量
   */
  validOrderCount: number
}

interface OrderOverviewVO {
  /**
   * 全部订单
   */
  allOrders: number
  /**
   * 待接单
   */
  waitingOrders: number
  /**
   * 待派送订单
   */
  deliveredOrders: number
  /**
   * 已完成订单
   */
  completeOrders: number
  /**
   * 已取消订单
   */
  cancelledOrders: number
}

interface DishOverviewVO {
  /**
   * 已停售菜品数量
   */
  discontinued: number
  /**
   * 已起售菜品数量
   */
  sold: number
}
