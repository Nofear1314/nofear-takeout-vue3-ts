/**
 * 右键菜单项类型（item：正常菜单项，divider：分隔线，group-title：分组标题）
 */
type ContextMenuItemType = 'item' | 'divider' | 'group-title';



// 正常菜单项（type: 'item'）：允许 icon、label、handler、disabled
interface ContextMenuItemItem {
  /**
   * 菜单项类型，item: 菜单项，divider: 分隔符，group-title: 分组标题
   */
  type: 'item';

  /**
   * 菜单项的标识符key
   */
  key: string;
  /**
   * 图标名称
   */
  icon?: string;
  /**
   * 显示文本
   */
  label: string;
  /**
   * 点击处理函数
   * @returns void
   */
  handler?: () => void;
  /**
   * 禁用状态
   */
  disabled?: boolean | ComputedRef<boolean>;
}

// 分隔线（type: 'divider'）
interface ContextMenuItemDivider {
  /**
   * 菜单项类型，item: 菜单项，divider: 分隔符，group-title: 分组标题
   */
  type: 'divider';
  /**
  * 菜单项的标识符key
  */
  key: string;
}

// 分组标题（type: 'group-title'）
interface ContextMenuItemGroupTitle {
  /**
   * 菜单项类型，item: 菜单项，divider: 分隔符，group-title: 分组标题
   */
  type: 'group-title';
  /**
   * 菜单项标题
   */
  title: string;
  /**
  * 菜单项的标识符key
  */
  key: string;
}
/**
 * 右键菜单项类型
 */
type ContextMenuItem = ContextMenuItemItem | ContextMenuItemDivider | ContextMenuItemGroupTitle;
