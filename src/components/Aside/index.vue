<script lang="ts" setup name="Aside">
import Logo from './components/Logo/index.vue'
import { useMenuStore } from '@/stores/modules/menu'
import MenuItem from './components/MenuItem/index.vue'
const menuStore = useMenuStore()
const route = useRoute()
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path as string
})
</script>
<template>
  <!-- <div class="w-110px h-200px bg-#545c64 border border-solid border-10px border-amber"></div> -->
  <div
    class="!h-screen flex flex-col border border-r-solid border-[var(--el-menu-border-color)] transition-duration-500"
  >
    <!-- bg-#545c64 -->

    <!-- logo -->
    <Logo />
    <!-- 使用el-scrollbar组件解决滚动条问题 -->
    <el-scrollbar :always="false" style="height: 100%">
      <!-- 左边菜单栏 -->
      <!-- active-text-color="#ffd04b" -->
      <!-- TODO 当页面变矮侧边高度问题 -->
      <el-menu
        style="height: 100%"
        :default-active="activeMenu"
        unique-opened
        :collapse="menuStore.isCollapse"
        router
      >
        <MenuItem
          v-for="(route, index) in menuStore.getMenuList"
          :item="route"
        ></MenuItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<style lang="scss" scoped>
.svg-icon {
  color: currentColor;
  /* margin-right: 10px; */
}

.el-menu {
  /* 默认侧边栏右边有边框，会导致对不齐问题，这里取消 */
  border-right: 0px;
}
</style>
