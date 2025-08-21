<script setup lang="ts" name="FullScreen">
import { useFullscreen } from 'vue-hooks-plus'

const [isFullscreen, { toggleFullscreen }] = useFullscreen()
</script>

<template>
  <svg-icon
    class=" cursor-pointer"
    :name="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
    @click="toggleFullscreen"
    :size="16"
    color="var(--header-text-color)"
  />
</template>

<style lang="scss" scoped></style>
