<script setup lang="ts" name="Header">
import Hamburger from './components/Hamburger/index.vue'
import Avatar from './components/Avatar/index.vue'
import Breadcrumb from './components/Breadcrumb/index.vue'
import FullScreen from './components/FullScreen/index.vue'
import Language from './components/Language/index.vue'
import ThemeSwitch from './components/ThemeSwitch/index.vue'
import Driver from './components/Driver/index.vue'
</script>

<template>
  <!-- background-color: var(--side-bar-background-color); -->
  <div class="w-100% h-100% flex justify-between items-center pr-15px overflow-hidden  border-b-solid border-[var(--el-border-color)]">
    <div class="flex justify-center h-100% items-center">
      <!-- Header左边区域 -->
      <Hamburger />
      <Breadcrumb />
    </div>
    <div class="flex gap-10px justify-center items-center">
      <!-- Header右边区域 -->
      <!-- TODO 尺寸 -->
      <Driver />
      <ThemeSwitch />
      <Language />
      <FullScreen />
      <Avatar />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
