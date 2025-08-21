<script setup lang="ts" name="Driver">
import { watch } from 'vue'
import { onMounted } from 'vue'
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import i18n from '@/i18n'
const t = i18n.global.t

import { steps } from './steps'
let driver: Driver | null = null
// TODO 弹窗主题
const initDriver = () => {
  driver = new Driver({
    className: 'scoped-class', // className to wrap driver.js popover 弹窗的额外样式名
    animate: true, // Animate while changing highlighted element 是否在切换时使用动画
    opacity: 0.75, // Background opacity (0 means only popovers and without overlay) 覆盖阴影透明度
    padding: 10, // Distance of element from around the edges 高亮与高亮节点的间距大小
    allowClose: true, // Whether clicking on overlay should close or not 是否允许点击覆盖阴影关闭 默认允许
    overlayClickNext: false, // Should it move to next step on overlay click 是否点击覆盖阴影时下一步
    doneBtnText: t('driver.doneBtnText'), // Text on the final button 完成按钮的文字
    closeBtnText: t('driver.closeBtnText'), // Text on the close button for this step 关闭按钮的文字
    nextBtnText: t('driver.nextBtnText'), // Next button text for this step 下一步按钮的文字
    prevBtnText: t('driver.prevBtnText'), // Previous button text for this step 上一步按钮文字
    showButtons: false, // Do not show control buttons in footer 是否在底部显示按钮
    keyboardControl: true // Allow controlling through keyboard (escape to close, arrow keys to move) 是否允许键盘控制 （ESC 关闭， 方向键 控制进度）
  })
}
onMounted(() => {
  initDriver()
})

watch(
  () => i18n.global.locale,
  () => {
    initDriver()
  },
  { deep: true }
)

const handleGuide = () => {
  driver?.defineSteps(steps)
  driver?.start()
}
</script>
<template>
  <el-tooltip
    effect="dark"
    :content="$translate('点我开始')"
    placement="top-start"
  >
    <svg-icon
      name="guide"
      class="cursor-pointer"
      id="guide"
      :size="20"
      color="var(--header-text-color)"
      @click.prevent.stop="handleGuide"
    ></svg-icon>
  </el-tooltip>
</template>

<style lang="scss" scoped>
/* 去除提示框悬浮状态下的边框 */
.el-tooltip__trigger:focus-visible {
  outline: unset;
}
</style>
