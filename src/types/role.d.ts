/**
 * 角色列表请求参数
 */
interface RoleListQuery extends PageQuery {
  /** 角色名称 */
  roleName?: string,
  /** 角色状态（0正常 1停用） */
  status?: 0 | 1
}

/**
 * 角色实体
 */
interface Role {
  /** 角色ID */
  id?: number,
  /** 角色名称 */
  roleName: string,
  /** 角色权限字符串 */
  roleKey: string,
  /** 显示顺序 */
  roleSort: number,
  /** 角色状态（0正常 1停用） */
  status: 0 | 1,
  /** 创建者 */
  addBy?: string,
  /** 该角色所拥有的菜单权限id集合 */
  menuIds?: number[],
  /** 创建时间 */
  addTime?: string,
  /** 更新者 */
  updateBy?: string,
  /** 描述 */
  description: string,

}


/**
 * 角色列表响应数据
 */
interface RolePageTableData extends PageResult<Role> {

}
/**
 * 分页查询角色已授权用户列表参数类型
 */
interface AllocatedAdminListParam extends PageQuery {
  /** 角色id */
  roleId: number
  /** 手机号码  */
  phoneNumber?: string,
  /** 用户昵称 */
  nickname?: string
}
/**
 * 分页查询一个角色里未分配用户角色列表参数类型
 */
interface UnallocatedAdminListParam extends AllocatedAdminListParam { }

/**
 * 分页查询角色已授权用户列表实体
 */
type AllocatedAdmin = Pick<Admin, 'id' | 'phoneNumber' | 'nickname' | 'status' | 'addTime' | 'avatar' | 'email' | 'username'>

/**
 * 分页查询一个角色里未分配用户角色列表实体
 */
type UnallocatedAdmin = AAllocatedAdmin
