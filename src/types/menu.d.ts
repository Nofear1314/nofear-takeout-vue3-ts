/** 路由 */
interface Route {

  /** 菜单名称 */
  name: string;
  /** 菜单路径 */
  path: string;
  /** 是否隐藏，如果为true，则不会在左侧菜单渲染 */
  hidden: boolean;
  /** 组件路径 */
  component: string | Function;
  /** 重定向地址 */
  redirect?: string;
  alwaysShow?: boolean;
  /** 菜单元数据 */
  meta: Meta;
  /** 子菜单 */
  children: Route[];
}

/** 菜单元数据 */
interface Meta {

  /** 菜单标题 */
  title: string;
  /** 菜单图标 */
  icon: string;
  /** 菜单是否缓存，设置为true，则会被 <keep-alive>缓存 */
  cache: boolean;
  /** 权限列表,表示拥有该权限才可以访问该路由 */
  permissions?: string[],
  [key: string | number | symbol]: any;
}



/**
 * 菜单
 */
interface Menu {
  /** 菜单标识符key */
  id?: number;
  /** 菜单名称，如：用户管理 */
  menuName: string;
  /** 菜单路径 */
  path: string;
  /** 是否隐藏，如果为true，则不会在左侧菜单渲染 */
  hidden: boolean;
  /** 组件路径 */
  component: string;
  /** 显示排序 */
  orderNum: number;
  /** 菜单类型 */
  menuType: MenuTypeEnum;
  /** 父级id */
  parentId: number;
  /** 权限标识 */
  authCode: string;
  /** 查询参数 */
  query: string;
  /** 菜单状态（0/false正常 ，1/true停用） */
  status: boolean;
  /** 创建时间 */
  addTime?: string;
  /** 图标 */
  icon: Meta['icon'],
  /** 是否缓存，设置为true，则会被 <keep-alive>缓存 */
  isCache: Meta['cache'],
  /** 路由名称 */
  routeName: string,
  /** 菜单描述 */
  description?: string;
  /** 子菜单 */
  children?: Menu[]
}


/**
 * 菜单树,不包括按钮权限，此处数据用于前端选择树
 */
interface MenuTreeSelect {
  /** 菜单标识符key */
  id: number,
  /** 菜单名称，如：用户管理 */
  label: string,
  /** 菜单类型（M目录 C菜单 F按钮） */
  menuType: MenuType;
  /** 图标 */
  icon: string;
  /** 子菜单菜单 */
  children?: MenuTreeSelect[]
}
/**
 * 权限列表树
 */
interface AuthSelectionTreeData {
  /** 菜单标识符key */
  id: number,
  /** 菜单名称，如：用户管理 */
  label: string,
  /** 图标 */
  icon: string;
  /** 子菜单菜单 */
  children?: AuthSelectionTreeData[]
}

/**
 * 菜单树表格查询参数类型
 */
interface MenuTableQueryParam {
  /**
   * 菜单名称
   */
  menuName?: string,
  /**
   * 菜单状态（0正常 1停用）
   */
  status?: boolean | undefined
}


/** 标签页 */
interface TagView {
  /** 标签页标题 */
  title: string;
  /** 标签页面路径,值为route.fullPath */
  path: string,
  /** 标签页名称,值为route.name */
  name: string
}
