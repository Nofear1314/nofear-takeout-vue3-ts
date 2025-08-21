<script setup lang="ts" name="Breadcrumb">
import { useMenuStore } from '@/stores/modules/menu'
const menuStore = useMenuStore()
</script>

<template>
  <!-- 头部面包屑区域 -->
  <el-breadcrumb
    separator="/"
    id="breadcrumb"
    class="el-breadcrumb breadcrumb-arrow"
  >
    <TransitionGroup name="breadcrumb-basic">
      <el-breadcrumb-item
        v-for="item in menuStore.breadcrumbList"
        :key="item.path || item.title"
        :to="item.path"
      >
        {{ $translate(item.title) }}
      </el-breadcrumb-item>
    </TransitionGroup>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
/* 面包屑切换动画 */
.breadcrumb-basic-enter-active {
  transition: all 0.25s;
}

.breadcrumb-basic-enter-from,
.breadcrumb-basic-leave-active {
  opacity: 0;
  transform: translateX(20px) skewX(-20deg);
}
/* ::v-deep(.el-breadcrumb__item) {
  .el-breadcrumb__inner {
    color: var(--header-breadcrumb-text-color);
    &.is-link {
      color: var(--header-breadcrumb-link-text-color);
      &:hover {
        color: var(--header-breadcrumb-link-hover-text-color);
      }
    }
  }
  &:last-child .el-breadcrumb__inner,
  &:last-child .el-breadcrumb__inner a,
  &:last-child .el-breadcrumb__inner a:hover,
  &:last-child .el-breadcrumb__inner:hover {
    color: var(--header-breadcrumb-text-color);
  }
} */
$height: 24px;

@mixin breadcrumb__inner(
  $padding: 0 4px 0 16px,
  $bgColor: var(--el-fill-color-light)
) {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  height: $height;
  padding: $padding;
  text-decoration: none;
  background-color: $bgColor;
}

.breadcrumb {
  //箭头样式
  &-arrow {
    :deep(.el-breadcrumb__item) {
      position: relative;
      margin-right: 12px;

      .el-breadcrumb__inner {
        @include breadcrumb__inner();

        &::before,
        &::after {
          position: absolute;
          top: 0;
          z-index: -1;
          content: '';
          border: calc($height/2) solid transparent;
        }

        &::before {
          left: -1px;
          border-left-color: var(--el-bg-color);
        }

        &::after {
          right: -23px;
          border-left-color: var(--el-fill-color-light);
        }

        &:hover {
          background: var(--el-fill-color);

          &::after {
            border-left-color: var(--el-fill-color);
          }
        }
      }
    }

    :deep(.el-breadcrumb__separator) {
      display: none;
    }
  }

  //平行四边形样式
  &-parallelogram {
    :deep(.el-breadcrumb__item) {
      position: relative;
      margin-right: 8px;

      .el-breadcrumb__inner {
        @include breadcrumb__inner(4px 10px, transparent);

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
          width: 100%;
          height: 100%;
          content: '';
          background-color: var(--el-fill-color-light);
          transform: skew(-20deg);
        }
      }
    }

    :deep(.el-breadcrumb__separator) {
      display: none;
    }
  }
}
</style>
