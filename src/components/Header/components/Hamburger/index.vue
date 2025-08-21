<script setup lang="ts" name="Hamburger">
import { useMenuStore } from '@/stores/modules/menu'

const menuStore = useMenuStore()
</script>

<template>
  <div
    @click="menuStore.handleChangeCollapse"
    class="w-50px flex justify-center flex-items-center h-100% cursor-pointer hover:bg-[var(--header-hamburger-hover-background-color)]"
  >
    <!-- hover:bg-gray-200 -->
    <svg-icon
      color="var(--header-text-color)"
      name="hamburger"
      :size="18"
      :class="!menuStore.isCollapse ? 'rotate-180' : ''"
      class="transition-duration-500 hamburger-icon"
    ></svg-icon>
  </div>
</template>

<style lang="scss" scoped>
.hamburger-icon{
  transition: all 0.5s ease-in-out;
}
</style>
