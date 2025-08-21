<script setup lang="ts" name="TagsView">
import { useContextMenu } from '@/hooks/useContextMenu'
import { useMenuStore } from '@/stores/modules/menu'
import { VueDraggable } from 'vue-draggable-plus'
const {
  isShowContextMenu,
  menuPosition,
  currentContextMenuTag,
  currentContextMenuTagIndex,
  currentFocusMenuItemIndex,
  openMenu,
  closeMenu
} = useContextMenu()

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const {
  handleDelTagViewAll,
  handleDelTagViewOther,
  handleDelTagViewRight,
  handleDelTagViewLeft
} = useMenuStore()

/**
 * 标签视图列表
 */
const tagsViewList = computed(() => menuStore.tagsViewList)

/**
 * 当前高亮标签索引（所在标签页）
 */
const currentTagIndex = computed(() =>
  tagsViewList.value.findIndex((item) => item.path === route.fullPath)
)

/**
 * @description 关闭标签
 * @param tag 当前被点击关闭的标签
 * @param index  当前被点击关闭的标签的索引
 */
const handleClose = (tag: TagView, index: number) => {
  // 删除当前标签
  menuStore.handleDelTagView(index)

  // 如果关闭的是当前页，有下一个页面的化则跳转到下一个页面,否则跳转到前一个
  if (tag.path === route.fullPath) {
    router.push({
      path: menuStore.tagsViewList[index]
        ? menuStore.tagsViewList[index].path
        : menuStore.tagsViewList[index - 1].path
    })
  }
}

/**
 * 刷新当前标签页
 */
const refreshSelectedTag = () => {
  // 刷新当前标签页逻辑
  router.go(0)
  //关闭右键菜单
  closeMenu()
}

/**
 * 关闭当前标签页
 */
const closeCurrentTag = () => {
  // 关闭当前标签页逻辑
  isShowContextMenu.value = false
  handleClose(currentContextMenuTag.value!, currentContextMenuTagIndex.value)
}

/**
 * 关闭其它标签页
 */
const closeOtherTags = () => {
  // 关闭其他标签页逻辑
  handleDelTagViewOther(currentContextMenuTagIndex.value)
  isShowContextMenu.value = false
  router.push({
    path: currentContextMenuTag.value!.path
  })
}

/**
 * 关闭左侧标签页
 */
const closeLeftTags = () => {
  //如果当前高亮标签页也在左侧，则关闭后路由跳转到当前右键点击的标签页
  if (currentTagIndex.value < currentContextMenuTagIndex.value) {
    router.push({
      path: currentContextMenuTag.value!.path
    })
  }
  // 关闭左侧标签页逻辑
  handleDelTagViewLeft(currentContextMenuTagIndex.value)
  isShowContextMenu.value = false
}

/**
 * 关闭右侧标签页
 */
const closeRightTags = () => {
  //如果当前高亮标签页也在右侧，则关闭后路由跳转到当前右键点击的标签页
  if (currentTagIndex.value > currentContextMenuTagIndex.value) {
    router.push({
      path: currentContextMenuTag.value!.path
    })
  }
  // 关闭右侧标签页逻辑
  handleDelTagViewRight(currentContextMenuTagIndex.value)
  isShowContextMenu.value = false
}

/**
 * 关闭所有标签页
 */
const closeAllTags = () => {
  // 关闭所有标签页逻辑
  handleDelTagViewAll()
  router.push('/dashboard')
  isShowContextMenu.value = false
}

/**
 * 右键菜单项
 */
const menuItems = ref<ContextMenuItem[]>([
  {
    type: 'item',
    key: 'close-current',
    icon: 'close',
    label: '关闭当前',
    handler: closeCurrentTag,
    disabled: computed(
      () => currentContextMenuTag?.value?.path === '/dashboard'
    )
  },
  // { key: 'affix', icon: 'affix', label: '固定', handler: () => {}},
  {
    type: 'item',
    key: 'refresh',
    icon: 'refresh',
    label: '重新加载',
    handler: refreshSelectedTag,
    disabled: computed(() => route.path !== currentContextMenuTag?.value?.path)
  },
  // { type: 'group-title', key: 'group2', title: '标签管理' },
  {
    type: 'item',
    key: 'close-left',
    icon: 'close-left',
    label: '关闭左侧标签页',
    handler: closeLeftTags,
    disabled: computed(() => currentContextMenuTagIndex.value === 0)
  },
  {
    type: 'item',
    key: 'close-right',
    icon: 'close-right',
    label: '关闭右侧标签页',
    handler: closeRightTags,
    disabled: computed(
      () => currentContextMenuTagIndex.value === tagsViewList.value.length - 1
    )
  },
  {
    type: 'item',
    key: 'close-other',
    icon: 'close-other',
    label: '关闭其他标签页',
    handler: closeOtherTags,
    disabled: computed(() => tagsViewList.value.length === 1)
  },
  { type: 'divider', key: 'divider1' },
  {
    type: 'item',
    key: 'close-all',
    icon: 'close-all',
    label: '关闭所有标签页',
    handler: closeAllTags,
    disabled: computed(() => tagsViewList.value.length === 1)
  }
])

/**
 * 计算有效菜单项（仅 type 为 'item' 的项以及未被禁用）
 */
const getValidContextMenuItems = computed(() => {
  console.log('计算有效菜单项')
  return menuItems.value.filter(
    (item) => item.type === 'item' && !item.disabled
  )
})
/**
 * 辅助函数：判断菜单项是否有效
 * @param index 在菜单项数组中的索引（未过滤，包含非正常的）
 */
const isValidContextMenuItem = (index: number) => {
  const item = menuItems.value[index]
  return item?.type === 'item' && !(item.disabled as boolean)
}

/**
 * 监听键盘事件
 * @param e 键盘事件
 */
const handleKeydown = (e: KeyboardEvent) => {
  // 仅对特定按键阻止默认行为
  if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
    e.preventDefault()
  }

  if (!isShowContextMenu.value) return

  //当前有效菜单以及数量
  const itemCount = getValidContextMenuItems.value.length
  if (itemCount === 0) return // 无有效菜单项时直接返回
  switch (e.key) {
    case 'Escape':
      //按下Esc键关闭菜单
      closeMenu()
      break
    case 'ArrowDown':
      //按下下箭头，聚焦下一个菜单项
      //先获取下一个该聚焦的索引
      currentFocusMenuItemIndex.value =
        (currentFocusMenuItemIndex.value + 1) % menuItems.value.length

      //验证是否为有效菜单项的索引，如果不是则继续循环
      while (!isValidContextMenuItem(currentFocusMenuItemIndex.value)) {
        currentFocusMenuItemIndex.value =
          (currentFocusMenuItemIndex.value + 1) % menuItems.value.length
      }
      break
    case 'ArrowUp':
      //按下上箭头，聚焦上一个菜单项
      // 如果是第一次打开菜单则特殊处理，直接聚焦到最后一个有效的菜单项
      if (currentFocusMenuItemIndex.value === -1) {
        currentFocusMenuItemIndex.value = menuItems.value.lastIndexOf(
          getValidContextMenuItems.value[itemCount - 1]
        )
        return
      }

      // 正常先计算上一个索引（处理负数情况）
      let newIndex =
        (currentFocusMenuItemIndex.value - 1 + menuItems.value.length) %
        menuItems.value.length

      // 验证是否为有效菜单项的索引，如果不是则继续循环
      while (!isValidContextMenuItem(newIndex)) {
        newIndex =
          (newIndex - 1 + menuItems.value.length) % menuItems.value.length
      }
      // 找到正常的菜单索引后更新数据
      currentFocusMenuItemIndex.value = newIndex
      break
    case 'Enter':
      // 回车-执行对应聚焦的菜单项对应的函数

      // 获取当前聚焦的菜单项
      const currentItem = menuItems.value[currentFocusMenuItemIndex.value]
      // 确保当前项是有效菜单项（type为item且未禁用）
      if (
        currentItem?.type === 'item' &&
        !currentItem.disabled &&
        typeof currentItem.handler === 'function'
      ) {
        // 执行当前菜单项的handler函数
        currentItem.handler()
      }
      // menuItems.value[currentFocusMenuItemIndex.value]?.handler?.()
      closeMenu()
      break
  }
}

// 监听键盘事件
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="w-100% shadow-md py-10px">
    <!-- 使用el-scrollbar解决横向滚动问题 -->
    <el-scrollbar>
      <div class="w-100% h-40px flex items-center">
        <VueDraggable
          ref="el"
          v-model="menuStore.tagsViewList"
          class="flex w-100% h-100% overflow-x-auto box-border"
        >
          <!-- 标签页区域 -->
          <el-tag
            class="ml-10px cursor-pointer box-border"
            :closable="item.path !== '/dashboard'"
            :effect="$route.path === item.path ? 'dark' : 'plain'"
            @contextmenu.prevent="openMenu($event, item, index)"
            @close="handleClose(item, index)"
            v-for="(item, index) in tagsViewList"
            @click="$router.push(item.path)"
          >
            <span
              :class="{ isActive: $route.path === item.path }"
              class="flex items-center justify-center min-w-20px"
              >{{ $translate(item.title) }}</span
            >
          </el-tag>
        </VueDraggable>
      </div>
    </el-scrollbar>

    <!-- 挂载到body上面，防止定位出错 -->
    <teleport to="body">
      <!-- 右键菜单区域 -->
      <transition name="fade-slide">
        <ul
          @keydown="handleKeydown"
          ref="contextMenuRef"
          key="menuKey"
          :style="{
            left: `${menuPosition.left}px`,
            top: `${menuPosition.top}px`
          }"
          v-show="isShowContextMenu"
          class="pos-absolute w-150px bg-[var(--tag-view-context-menu-background-color)] z-999999 top-0 border-rd-12px border-solid border-[var(--el-border-color)] flex flex-col context-menu-wrapper p-6px transition-all duration-200 ease-in-ou"
        >
          <template v-for="(item, index) in menuItems" :key="item.key || index">
            <!-- 正常菜单项 -->
            <li
              v-if="item.type === 'item'"
              class="menu-item"
              :class="{
                disable: item.disabled,
                active: currentFocusMenuItemIndex === index
                // active: currentFocusMenuItemIndex === findItemIndex(index)
              }"
              :tabindex="0"
              @click="item.handler"
            >
              <!-- 菜单项内容 -->
              <svg-icon :name="item.icon!"></svg-icon> {{ item.label }}
            </li>

            <!-- 分割线 -->
            <li v-else-if="item.type === 'divider'" class="menu-divider"></li>

            <!-- 分组的组标题 -->
            <li
              v-else-if="item.type === 'group-title'"
              class="menu-group-title"
            >
              {{ item.title }}
            </li>
          </template>
        </ul>
      </transition>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.isActive {
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    content: '';
    background: #fff;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
ul.context-menu-wrapper {
  will-change: transform; /* 提前告知浏览器动画即将发生 */
  transform: translateZ(0); /* 强制启用 GPU 渲染 */
  li {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    height: 40px;
    display: flex;
    align-items: center;
    line-height: 100%;
    gap: 3px;
    justify-content: start;
    padding-left: 15px;
    border-radius: 10px;
    font-size: 14px;
    transition: all 0.5s;
    &:hover {
      background-color: var(--primary-hover-background-color);
      transform: translateX(3px);
    }
    /* 禁用状态 */
    &.disable {
      /* color: #c0c4cc; */
      opacity: 0.4;
      cursor: not-allowed !important;
      pointer-events: none;
      position: relative;
    }
    /* 高亮状态 */
    &.active {
      background-color: var(--primary-hover-background-color);
      transform: translateX(4px); // 微动画效果
      color: var(--el-color-primary);
      font-weight: 500;
    }
    /*分割线样式 */
    &.menu-divider {
      height: 1px;
      background: var(--el-border-color-light);
      margin: 8px 0;
    }
    /* 组标题样式 */
    &.menu-group-title {
      padding: 4px 16px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: not-allowed;
    }
  }
}

/* 定义动画效果 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* .fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
} */
</style>
