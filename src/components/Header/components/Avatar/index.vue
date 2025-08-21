<script setup lang="ts" name="Avatar">
import { ElMessage, ElMessageBox } from 'element-plus'
import { logoutApi } from '@/api/admin'
import { clearCacheData } from '@/utils/clearCacheData'
import { useAdminStore } from '@/stores/modules/admin'
const adminStore = useAdminStore()
const router = useRouter()

const logout = () => {
  ElMessageBox.confirm('你确定要退出吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        logoutApi().finally(() => {
          // 清除用户信息以及各种缓存数据
          clearCacheData()
          router.push('/login')
          ElMessage({
            type: 'success',
            message: '退出成功'
          })
        })
      } catch (error) {
        console.error('重置数据失败:', error)
      }
    })
    .catch(() => {})
}

const changePasswordUI = () => {}
</script>
<template>
  <el-dropdown>
    <div>
      <!-- 猫咪头像 -->
      <!-- 'https://tse1-mm.cn.bing.net/th/id/OIP-C.sX41K4fUqbJwA-QvJl_XswAAAA?w=207&h=207&c=7&r=0&o=5&dpr=2.2&pid=1.7' -->
      <el-avatar id="avatar" :size="28" :src="adminStore.adminInfo?.avatar">
        <img
          src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
        />
      </el-avatar>
    </div>
    <template #dropdown>
      <el-dropdown-menu class="avatar-dropdown-menu">
        <el-dropdown-item
          class="avatar-dropdown-menu-text"
          icon="Postcard"
          @click="
            router.push({
              name: 'Profile'
            })
          "
          >{{ $translate('个人中心') }}</el-dropdown-item
        >

        <!-- <el-dropdown-item icon="Unlock" @click="changePasswordUI">{{
          $translate('修改密码')
        }}</el-dropdown-item> -->

        <el-dropdown-item icon="SwitchButton" @click="logout">
          {{ $translate('退出') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
/* 去除下拉框悬浮状态下的边框 */
.el-tooltip__trigger:first-child:focus-visible {
  outline: unset;
}

/* .avatar-dropdown-menu.el-dropdown-menu {
  background-color: #242424;
  .el-dropdown-menu__item {
    color: var(--primary-text-color);
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
  &.is-light:has(.avatar-dropdown-menu.el-dropdown-menu),
  &.is-light:has(.avatar-dropdown-menu.el-dropdown-menu)
    > .el-popper__arrow:before {
    border-color: var(--header-avatar-popper-border-color);
    background-color: var(--header-background-color);
  }
} */
</style>
