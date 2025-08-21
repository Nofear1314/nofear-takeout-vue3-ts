/**
 * 登录日志对象
 */
interface LoginLog {
  /** id */
  id: number;
  /** 用户名 */
  userName: string;
  /** ip地址 */
  ipAddr: string;
  /** 登录地点 */
  loginLocation: string;
  /** 浏览器类型 */
  browser: string;
  /** 操作系统 */
  os: string;
  /** 登录状态（0成功 1失败） */
  status: number;
  /** 提示消息 */
  msg: string;
  /** 访问时间 */
  loginTime: string;
}

/**
 * 登录日志查询参数
 */
interface LoginLogQueryParam extends PageParam {
   /** 用户名 */
  userName?: string;

  /** ip地址 */
  ipAddr?: string;
  /** 登录状态（0成功 1失败） */
  status?: number;

  /** 开始时间 */
  beginTime?: Data;

  /** 结束时间 */
  endTime?: Data;
}

