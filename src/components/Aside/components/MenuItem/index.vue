<script setup lang="ts" name="MenuItem">
import { PropType } from 'vue'
import MenuItem from './index.vue'

const props = defineProps({
  item: {
    type: Object as PropType<Route>,
    required: true
  },
  rootPath: {
    type: String,
    default: ''
  }
})

/**
 * 如果没有斜杠的path是相对路径，则拼接上rootPath并加上斜杠，
 * 如果有斜杠的path是绝对路径，则直接使用，
 * 如果你已经在 useMenuStore 中通过 工具函数 补全路径，那么即可不再需要 rootPath 和复杂的 fullPath 拼接逻辑，可以直接使用 item.path。
 */
const fullPath = computed(() => {
  if (props.item.path.startsWith('/')) {
    return props.item.path
  }
  return props.rootPath + '/' + props.item.path
})
</script>

<template>
  <!-- 有子菜单的菜单项 -->
  <el-sub-menu
    v-if="!item.hidden && item.children && item.children.length > 0"
    :index="fullPath"
  >
    <template #title>
      <!-- 此处嵌套i标签可解决奇怪的问题 -->
      <i class="mr-4">
        <svg-icon :name="props.item.meta.icon" />
      </i>
      <span
        class="whitespace-nowrap overflow-hidden break-words text-ellipsis"
        >{{ $translate(props.item.meta.title) }}</span
      >
    </template>
    <MenuItem
      v-for="(child, index) in props.item.children"
      :key="child.path + index"
      :item="child"
      :root-path="fullPath"
    />
  </el-sub-menu>

  <!-- 无子节点的单个菜单项菜单项 -->
  <el-menu-item v-else-if="!item.hidden" :index="fullPath">
    <!-- 此处嵌套i标签可解决奇怪的问题 -->
    <i class="mr-4">
      <svg-icon :name="props.item.meta.icon" />
    </i>
    <span class="whitespace-nowrap overflow-hidden text-ellipsis">{{
      $translate(props.item.meta.title)
    }}</span>
  </el-menu-item>
</template>

<style lang="scss" scoped></style>
