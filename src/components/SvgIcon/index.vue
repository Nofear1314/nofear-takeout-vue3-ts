<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String]
  },
  color: {
    type: String
  },
  className: {
    type: String,
    default: ''
  }
})
const sizeWithUnit = computed(() => {
  const s = props.size
  if (typeof s === 'number') {
    return `${s}px`
  } else if (typeof s === 'string') {
    // 检查是否已经包含单位
    if (/^\d+(?:\.\d+)?(px|em|rem|vh|vw|%|ch|ex|ic|lh|rlh|fr)$/i.test(s)) {
      return s
    }
    return `${s}px` // 默认加 px
  }
  return undefined
})
const symbolId = computed(() => `#icon-${props.name}`)
const className = computed(() =>
  props.className ? `svg-icon icon-${props.name}` : 'svg-icon'
)
</script>

<template>
  <svg
    :aria-hidden="false"
    :class="className"
    :style="{ width: sizeWithUnit, height: sizeWithUnit }"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<style scoped>
.svg-icon {
  fill: currentColor;
  vertical-align: middle;
  overflow: hidden;
  outline:none;
  width: 1em;
  height: 1em;
}
</style>
