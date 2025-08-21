import router from './index'
import NProgress from 'nprogress'
import { useMenuStore } from '@/stores/modules/menu'
import { useAdminStore } from '@/stores/modules/admin'

/** 是否已加载动态路由，注意该值只用于判断是否已加载动态路由，从而实现页面刷新后动态路由不重复加载 */
let isRouteGenerated = false

/**
 * 白名单
 */
const whiteList = ['/login', '/register']

/**
 * 路径匹配器
 * @param {string} pattern
 * @param {string} path
 * @returns {Boolean}
 */
export function isPathMatch(pattern: string, path: string): boolean {
  const regexPattern = pattern.replace(/\//g, '\\/').replace(/\*\*/g, '.*').replace(/\*/g, '[^\\/]*')
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path)
}
/**
 * 是否在白名单中
 * @param path 路由
 * @returns {Boolean}
 */
const isWhiteList = (path: string): boolean => {
  return whiteList.some(pattern => isPathMatch(pattern, path))
}
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {

  NProgress.start()
  const { generateDynamicRoutes } = useMenuStore()
  // 验证token
  if (!useAdminStore().getToken()) {
    isRouteGenerated = false
    // token不存在，且不在白名单中，否则跳转到登录页
    isWhiteList(to.path) ? next() : next(`/login?redirect=${to.path}`)
    return
  } else {
    //token存在
    if (whiteList.includes(to.path)) {
      // token存在，且在白名单中，则跳转到首页
      next({
        path: '/',
      })
      return
    } else if (!isRouteGenerated) {
      // token存在，且不在白名单中，通过isRouteGenerated判断是否已经生成动态路由，解决刷新后路由丢失导致页面白屏的问题
      await generateDynamicRoutes()
      isRouteGenerated = true
      // 强制重定向到当前路由以触发组件更新
      next({ ...to, replace: true })
      return
    } else {
      next()
    }
  }
})



router.afterEach((to, from) => {
  NProgress.done()

})



