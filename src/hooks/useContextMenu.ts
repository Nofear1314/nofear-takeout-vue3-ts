export const useContextMenu = () => {


  /**
   * 是否显示自定义的标签操作菜单
   */
  const isShowContextMenu = ref(false)

  /**
   * 操作菜单的ref
   */
  const menuRef = useTemplateRef<HTMLUListElement>('contextMenuRef');

  /**
   * 菜单该出现的位置
   */
  const menuPosition = ref<{ left: number; top: number }>({ left: 0, top: 0 })

  /**
   * 当前被右键点击的标签
   */
  const currentContextMenuTag = ref<TagView>()

  /**
   * 当前被右键点击的标签索引
   */
  const currentContextMenuTagIndex = ref(-1)

  /**
 * 当前聚焦的右键菜单项索引
 */
  const currentFocusMenuItemIndex = ref(-1)



  /**
 * 右键显示自定义的标签操作菜单
 * @param e 鼠标事件
 * @param item 当前被点击的标签
 * @param index 当前被点击的标签的索引
 */
  const openMenu = async (e: MouseEvent, item: TagView, index: number) => {
    e.preventDefault();
    closeMenu()

    // 显示菜单
    isShowContextMenu.value = true;

    // 设置当前被点击的标签
    currentContextMenuTag.value = item;
    currentContextMenuTagIndex.value = index;

    // 使用nextTick确保DOM已更新
    nextTick(() => {
      if (!menuRef.value) return;

      // 动态获取菜单的实际宽度和高度
      const { width, height } = menuRef.value.getBoundingClientRect();

      // 获取窗口尺寸
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 获取鼠标坐标（相对于视口）
      const clientX = e.clientX;
      const clientY = e.clientY;

      // 动态计算边界值，防止菜单超出视口
      // 从鼠标位置向右的可用空间
      const availableRightSpace = windowWidth - clientX;
      // 从鼠标位置向下的可用空间
      const availableBottomSpace = windowHeight - clientY;

      //优化前
      // const left = Math.min(clientX, windowWidth - menuRect.width)
      // const top = Math.min(clientY, windowHeight - menuRect.height)


      //优化后

      // 如果右侧空间不足，则将菜单显示在鼠标左侧
      const left = availableRightSpace >= width + 10
        ? clientX + 10 // 右侧空间充足，显示在鼠标右侧
        : Math.max(0, clientX - width - 10); // 右侧空间不足，显示在鼠标左侧（确保不超出左边界）

      // 如果底部空间不足，则将菜单显示在鼠标上方
      const top = availableBottomSpace >= height + 10
        ? clientY + 10 // 底部空间充足，显示在鼠标下方
        : Math.max(0, clientY - height - 10); // 底部空间不足，显示在鼠标上方（确保不超出上边界）

      menuPosition.value = { left, top };
    });
  };


  /**
   * 关闭自定义的标签操作菜单,并且清除当前被点击的标签
   */
  const closeMenu = () => {
    isShowContextMenu.value = false;
    currentContextMenuTag.value = undefined;
    currentContextMenuTagIndex.value = -1;
    currentFocusMenuItemIndex.value = -1;
  };


  /**
   * 关闭自定义的标签操作菜单
   * @param e 鼠标事件
   */
  const closeMenuHandler = (e: MouseEvent) => {
    const menu = menuRef.value;
    if (isShowContextMenu.value && menu && !menu.contains(e.target as HTMLElement)) {
      closeMenu();
    }
  };

  // 生命周期管理
  onMounted(() => {
    document.addEventListener('click', closeMenuHandler);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', closeMenuHandler);
  });

  return {
    menuRef,
    isShowContextMenu,
    menuPosition,
    currentContextMenuTag,
    currentContextMenuTagIndex,
    currentFocusMenuItemIndex,
    openMenu,
    closeMenu
  };
};
