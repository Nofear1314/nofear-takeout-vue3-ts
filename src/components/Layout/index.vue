<script setup lang="ts" name="Layout">
import Aside from '@/components/Aside/index.vue'
import Header from '@/components/Header/index.vue'
import { useMenuStore } from '@/stores/modules/menu'
import Main from '@/components/Main/index.vue'
import TagsView from '@/components/TagsView/index.vue'
import router from '@/router'
console.log('🚀当前拥有的路由集合 ~ router:', router.getRoutes())
const menuStore = useMenuStore()
const route = useRoute()

// 监听路由变化并更新面包屑和标签页面
watch(
  () => route.path,
  () => {
    menuStore.updateBreadcrumbs(route)
    menuStore.updateTagsViewList(route)
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧栏 -->
      <el-aside
        class="aside-transition"
        :width="menuStore.isCollapse ? '60px' : '200px'"
      >
        <Aside />
      </el-aside>

      <!-- 主体 -->
      <el-container>
        <!-- 头部 -->
        <el-header style="margin: 0; padding: 0">
          <Header />
        </el-header>

        <!-- 主体内容 -->
        <el-main style="padding: 0 10px; margin: 0">
          <!-- 标签页 -->
          <TagsView />

          <el-scrollbar style="height: calc(100% - 65px); padding-bottom: 20px">
            <Main />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.aside-transition {
  transition: all 0.5s ease-in-out;
}
</style>
