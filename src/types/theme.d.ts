/** 语言类型 */
type LangType = 'zh' | 'en'

/**
 * 语言类型，键值对，key: 语言类型，value: 语言名称
 */
type LangTypeMap = Map<LangType, string>;


/**
 * 递归获取对象所有可能的键路径
 */
type Paths<T> = T extends object
  ? { [K in keyof T]: `${Exclude<K, symbol>}${Paths<T[K]> extends never ? "" : `.${Paths<T[K]>}`}` }[keyof T]
  : never;


/**
 * 主题类型
 */
type ThemeType = 'dark' | 'light' | 'OS'


