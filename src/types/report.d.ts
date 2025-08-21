interface DateRange {
  beginTime: string
  endTime: string
}

interface TurnoverReportVO {
  /**
   * 日期列表，数据之间用英文逗号分隔
   */
  dataList: string
  /**
   * 营业额列表，数据之间用英文逗号分隔
   */
  turnoverList: string
}

interface UserNumberReportVO {
  /**
   * 日期列表，数据之间用英文逗号分隔
   */
  dateList: string
  /**
   * 新增用户列表，数据之间用英文逗号分隔
   */
  newUserList: string
  /**
   * 总用户量列表，数据之间用英文逗号分隔
   */
  totalUserList: string
}

interface OrderNumberReportVO {
  /**
   * 日期列表，数据之间用英文逗号分隔
   */
  dateList: string
  /**
   * 每日订单数，数据之间用英文逗号分隔
   */
  orderCountList: string
  /**
   * 每日有效订单数，数据之间用英文逗号分隔
   */
  validOrderCountList: string
  /**
   * 订单总数
   */
  totalOrderCount: number
  /**
   * 有效订单数量
   */
  validOrderCount: number
  /**
   * 订单完成率
   */
  orderCompletionRate: number
}

interface SaleDishTop10VO {
  /**
   * 菜品名称列表，逗号分隔
   */
  dishNameList: string
  /**
   * 销售数量列表，逗号分隔
   */
  numberList: string
}
