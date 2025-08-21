<script setup lang="ts" name="Main">
const router = useRouter()
import ws from '@/ws'
ws.connect()
ws.on('order', (data) => {
  ElNotification({
    title: '有用户下单了，请及时处理',
    message: `订单号：${data}`
  })
})

/**
 * 获取需要缓存的页面路由名称
 */
const getCacheRouteName = computed(() => {
  const cacheRoutes = router
    .getRoutes()
    .filter((item) => !item.meta.cache)
    .map((item) => item.name as string)
    .filter(Boolean)
  return cacheRoutes
})




</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <Suspense>
        <!-- 根据 meta.cache
      缓存路由,这里component标签上一定要加key属性,否则多个路由组件缓存时会无效
      不加key会让vue无法渲染正确的组件导致报错，还有就是需要显式定义组件名称，
      以及路由名称和组件名称需要一致，否则缓存不生效 -->
        <keep-alive :include="getCacheRouteName">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
        <!-- <component :is="Component" :key="$route.fullPath" /> -->
      </Suspense>
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
