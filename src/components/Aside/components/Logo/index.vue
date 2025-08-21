<script setup lang="ts" name="Logo">
import { useMenuStore } from '@/stores/modules/menu'
const menuStore = useMenuStore()
const title = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <router-link to="/">
    <div class="h-80px w-100% flex flex-items-center justify-center">
      <!-- <img
        class="w-40px h-40px mr-1"
        src="@/assets/images/logo.png"
        alt="logo"
        style="background-color: aliceblue"
      /> -->
      <svg-icon name="guide" :size="30" class="mr-1"></svg-icon>
      <span
        v-show="!menuStore.isCollapse"
        :class="{ block: !menuStore.isCollapse }"
        class="c-[var(--primary-color] font-sans font-size-16px transition-duration-5000 transition-delay-1000"
        >{{ title }}</span
      >
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
@keyframes block {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.block {
  opacity: 0;
  transition: all 0.5s;
  animation: block 0.5s ease-in-out 0.2s forwards;
}
</style>
