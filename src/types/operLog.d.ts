/**
 * 操作日志实体类型
 */
interface OperationLog {
  /** id */
  operId: number;
  /** 模块/标题 */
  title: string;
  /** 操作人名称 */
  operateUserName: string;
  /** 业务类型（0其它 1新增 2修改 3删除 4授权） */
  businessType: number;
  /** 请求方式 */
  requestMethod: string;
  /** 操作的类名 */
  className: string;
  /** 操作的方法名 */
  methodName: string;
  /** 操作方法的参数 */
  methodParams: string;
  /** 方法返回值 */
  returnValue: string;
  /** 请求url */
  operUrl: string;
  /** 主机地点 */
  operIp: string;
  /** 操作地址 */
  operLocation: string;
  /** 操作状态（0正常 1异常） */
  status: number;
  /**  错误消息 */
  errMsg?: string;
  /** 操作时间 */
  operTime: string;
  /** 消耗时间 */
  costTime: number;
}

/**
 * 操作日志查询参数
 */
interface OperationLogQueryParam extends PageParam {
  /** 模块/标题 */
  title?: string;
  /** 操作人名称 */
  operateUserName?: string;
  /** 业务类型（0其它 1新增 2修改 3删除 4授权） */
  businessType?: number;

  /** 操作ip */
  operIp?: string;
  /** 操作状态（0正常 1异常） */
  status?: number;

  /** 操作开始时间 */
  beginTime?: Data;

  /** 操作结束时间 */
  endTime?: Data;
}
