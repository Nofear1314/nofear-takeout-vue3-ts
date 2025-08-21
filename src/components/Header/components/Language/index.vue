<script setup lang="ts">
import { langTypeMap } from '@/i18n/langMap'
import i18n from '@/i18n'
import { LangEnum } from '@/enums'
const handleCommand = (val: LangType) => {
  //语言切换
  i18n.global.locale.value = val
  //存储语言类型到本地
  window.localStorage.setItem(LangEnum.LANG_KEY, val)
}

//当前语言
const currentLang = computed(() => {
  return i18n.global.locale.value
})
</script>

<template>
  <el-dropdown @command="handleCommand" class="cursor-pointer">
    <div>
      <svg-icon
        name="lang"
        id="lang"
        :size="20"
        color="var(--header-text-color)"
      ></svg-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu class="lang-dropdown-menu">
        <el-dropdown-item
          v-for="[key, val] in langTypeMap.entries()"
          :key="key"
          :command="key"
          :disabled="currentLang === key"
          >{{ val }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
/* 去除下拉框悬浮状态下的边框 */
.el-tooltip__trigger:first-child:focus-visible {
  outline: unset;
}

/* .lang-dropdown-menu.el-dropdown-menu {
  background-color: #242424;
  .el-dropdown-menu__item {
    color: var(--primary-text-color);
    &.is-disabled {
      color: blue;
    }
    &:not(.is-disabled):hover,
    &:not(.is-disabled):focus {
      background-color: var(--header-avatar-popper-hover-background-color);
      color: var(--primary-text-color);
    }
  }
} */

/**整体弹出框的边框 */
/* .el-popper[data-popper-placement^='bottom'] {
  border-radius: 5px;
  &.is-light:has(.lang-dropdown-menu.el-dropdown-menu),
  &.is-light:has(.lang-dropdown-menu.el-dropdown-menu)
    > .el-popper__arrow:before {
    border-color: var(--header-avatar-popper-border-color);
    background-color: var(--header-background-color);
  }
} */
</style>
