
import LangPack from './package/en'

// 递归生成对象的所有路径（简化版，返回字符串字面量联合类型）
//TODO 研究类型
// type Paths<T> = T extends object
//   ? T extends Array<infer U>
//   ? U extends object
//   ? `${number}.${Paths<U>}`
//   : `${number}` // 数组元素为非对象时，路径为索引（如 "0"）
//   : {
//     [K in keyof T & (string | number) as K extends symbol ? never : K]: // 排除 symbol 键
//     `${K}${Paths<T[K]> extends never ? "" : `.${Paths<T[K]>}`}`
//   }[keyof T & (string | number)] // 取所有键的路径联合
//   : never; // 非对象类型无路径

// // 根据路径获取值类型（修复版，严格约束路径有效性）
// type ValueAtPath<T, P extends string> =
//   P extends `${infer K}.${infer R}`
//   ? K extends keyof T
//   ? T[K] extends object | Array<any> // 确保子路径存在
//   ? ValueAtPath<T[K], R>
//   : never // 非对象/数组类型无法继续解析路径
//   : never
//   : P extends keyof T
//   ? T[P]
//   : never;
// type HomeValue = ValueAtPath<typeof LangPack, "menus.home">;
// =======
// // 递归生成对象的所有路径（简化版）
// type Paths<T> = T extends object
//   ? T extends Array<infer U>
//     ? U extends object
//       ? `${number}.${Paths<U>}`
//       : `${number}`
//     : { [K in keyof T & (string | number)]: `${K}${Paths<T[K]> extends never ? "" : `.${Paths<T[K]>}`}` }[keyof T & (string | number)]
//   : never;

// // 验证路径是否存在于对象中
// type IsValidPath<T, P extends string> = P extends `${infer K}.${infer R}`
//   ? K extends keyof T
//     ? IsValidPath<T[K], R>
//     : false
//   : P extends keyof T
//   ? true
//   : false;

//   type Values<T, P extends Paths<T>> = P extends `${infer K}.${infer R}`
//   ? K extends keyof T
//     ? Values<T[K], R>
//     : never
//   : P extends keyof T
//   ? T[P]
//   : never;


export const langTypeMap: LangTypeMap = new Map([
  ['zh', '中文'],
  ['en', 'English'],
])

/**
 * 语言路径映射对象
 */
export const langPathMapConfig: Record<string, Paths<typeof LangPack>> = {
  home: 'menus.home', //首页
  首页: 'menus.home', //首页
  商品管理: 'menus.GoodsManager', //商品管理
  商品列表: 'menus.goods',
  商品类目: 'menus.GoodsCategory',
  商品参数: 'menus.GoodsParameter',
  用户管理: 'menus.UserManage',
  用户列表: 'menus.users',
  权限管理: 'menus.AuthorityManagement',
  角色列表: 'menus.roles',
  权限列表: 'menus.rights',
  订单管理: 'menus.OrderManagement',
  订单列表: 'menus.orders',
  个人资料: 'header.avatar.data',
  修改密码: 'header.avatar.password',
  退出: 'header.avatar.exit',
  角色管理: 'menus.roleManage',
  菜单管理: 'menus.menuManage',
  系统管理: 'menus.sysManage'
}
