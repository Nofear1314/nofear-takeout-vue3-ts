/** 登录管理员信息 */
interface AdminInfo {
  id: number;
  /** 用户名 */
  username: string;
  /** 头像 */
  avatar: string;
  /** 昵称 */
  nickname: string;
  /** 手机号 */
  phoneNumber: string;
  /** 邮箱 */
  email: string;
  /** 性别（0男 1女 2未知） */
  gender: 0 | 1 | 2;
  /** 创建日期 */
  addTime: string;
  /** 角色 */
  roles: Role[];
  /** token令牌 */
  token: string;
  /** 权限集合 */
  permissions: string[]
}


/** 登录参数 */
interface LoginParams {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
}


/**
 * 管理员列表请求参数
 */
interface AdminListQuery extends PageQuery {
  /** 管理员昵称 */
  nickname?: string,
  /** 帐号状态（0正常 1停用） */
  status?: 0 | 1,
  /** 用户性别（0男 1女 2未知） */
  gender?: 0 | 1 | 2,
}

/**
 * 管理员实体
 */
interface Admin {
  /** ID */
  id?: number,
  /** 账号 */
  username: string,
  /** 密码 */
  password: string,
  /** 昵称 */
  nickname: string,
  /** 性别（0男 1女 2未知） */
  gender: 0 | 1 | 2,
  /** 手机号码 */
  phoneNumber: string,
  /** 邮箱 */
  email: string,
  /** 头像 */
  avatar: string,
  /** 帐号状态（0正常 1停用） */
  status: 0 | 1,
  /** 最后登录时间 */
  lastLoginTime?: string,
  /** 最后登录ip */
  lastLoginIp?: string,
  /** 创建者 */
  addBy?: string,
  /** 创建时间 */
  addTime?: string,

  /** 更新者 */
  updateBy?: string,
  /** 更新时间 */
  updateTime?: string,
  /** 角色集合 */
  roles?: Role[],
  /** 描述 */
  description: string,

}

/**
 * 管理员列表响应数据
 */
interface AdminPageTableData extends PageResult<Admin> {

}

/**
 * 分配角色请求参数
 */
interface AssignRolesParams {
  /** 管理员id */
  id: number,
  /** 角色id列表 */
  roleIds: number[]
}


/**
 * 重置密码请求参数
 */
interface ResetPwdParams {

  /** 管理员id */
  id: number,
  /** 密码 */
  password: string,
}


/**
 * 修改密码请求参数
 */
interface UpdatePwdParams {
  /** 旧密码 */
  oldPassword: string,
  /** 新密码 */
  newPassword: string,
}
