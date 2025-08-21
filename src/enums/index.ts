/**
 * 登录记住密码的存入cookie的key枚举
 */
export enum LoginRememberEnum {
  USER_NAME = 'NOFEAR_username',
  PASSWORD = 'NOFEAR_password',
  REMEMBER_ME = 'NOFEAR_rememberMe'
}

/**
 * 语言偏好存入本地的key
 */
export enum LangEnum {
  LANG_KEY = 'LANG_KEY'
}

/**
 * 主题类型
 */
export enum ThemeTypeEnum {
  /** 亮色主题 */
  LIGHT = 'light',
  /** 暗色主题 */
  DARK = 'dark',
  /** 系统主题 */
  OS = 'OS'
}

/**
 * 主题存入本地的key
 */
export enum ThemeKeyEnum {
  THEME_KEY = '_THEME_'
}

/**
 * 菜单类型（M目录 C菜单 F按钮）
 */
export enum MenuTypeEnum {
  /** 目录 */
  DIR = 'M',
  /** 菜单 */
  MENU = 'C',
  /** 按钮 */
  BUTTON = 'F'
}

/**
 * 权限
 */
export enum Permission {
  /** 所有权限标识 */
  ALL_PERMISSION = '*:*:*'
}

/**
 * 1.菜品分类 2.套餐分类
 */
export enum CategoryTpeEnum {
  /**
   * 菜品分类
   */
  DISH = 1,
  /**
   * 套餐分类
   */
  COMBO = 2
}
