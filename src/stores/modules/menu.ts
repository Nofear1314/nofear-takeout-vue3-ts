import router from '@/router'
import type {
  RouteRecordRaw,
  RouteLocationNormalizedLoaded,
  RouteComponent
} from 'vue-router'
import Layout from '@/components/Layout/index.vue'
import { getRoutersApi } from '@/api/menu'
import { useAdminStore } from './admin'

// 加载所有菜单文件
const modules = import.meta.glob('@/views/**/*.vue')

/**
 * 公共路由
 */
const publicMenu = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'dashboard/index',
    hidden: false,
    meta: { title: '首页', icon: 'dashboard', cache: false },
    children: []
  },
  {
    path: '/profile',
    component: 'profile/index',
    hidden: true,
    meta: { title: '个人中心', icon: 'user' },
    name: 'Profile',
    query: { id: '1' }
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    meta: { title: '系统管理' },
    redirect: 'noRedirect',
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: 'system/role/views/authUser',
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  }
] as Route[]
// {
//   path: '/system/role-auth',
//   component: Layout,
//   hidden: true,
//   permissions: ['system:role:edit'],
//   meta: { title: '系统管理' },
//   redirect: 'noRedirect',
//   children: [
//     {
//       path: 'user/:roleId(\\d+)',
//       component: 'system/role/views/authUser',
//       name: 'AuthUser',
//       meta: { title: '分配用户', activeMenu: '/system/role' }
//     }
//   ]
// }

export const useMenuStore = defineStore(
  'menu',
  () => {
    /**
     * 面包屑列表
     */
    const breadcrumbList = ref([]) as Ref<{ title: string; path: string }[]>

    /** 标签页列表 */
    const tagsViewList = ref([]) as Ref<TagView[]>

    /** 左侧菜单是否折叠 */
    const isCollapse = ref(false)

    /** 菜单列表,路由集合 */
    const routerList = ref([]) as Ref<Route[]>

    /**
     * @description: 更新标签页列表
     * @param {RouteLocationNormalizedLoaded} route 当前路由对象
     * @return {*}
     */
    const updateTagsViewList = (route: RouteLocationNormalizedLoaded) => {
      // 判断当前路由是否在标签页列表中
      const index = tagsViewList.value.findIndex(
        (item) =>
          item.path === route.path || (item.name === route.name && item.name)
      )
      if (index !== -1) {
        // 替换路径
        tagsViewList.value[index].path = route.fullPath
        return
      }

      // 添加新的标签页
      tagsViewList.value.push({
        path: route.fullPath,
        title: (route.meta.title as string) || 'no name',
        name: route.name as string
      })
    }

    /**
     * 根据路径删除标签页
     * @param fullPath 路由的完整路径
     */
    const handleDelTagViewByPath = (fullPath: string) => {
      const index = tagsViewList.value.findIndex(
        (item) => item.path === fullPath
      )
      if (index !== -1) {
        tagsViewList.value.splice(index, 1)
      }
    }

    /**
     * @description 关闭标签/删除标签
     * @param index  当前被点击关闭的标签的索引
     */
    const handleDelTagView = (index: number) => {
      const length = tagsViewList.value.length

      // 如果只剩最后一个标签则不做任何事
      if (tagsViewList.value.length <= 1) {
        return
      }
      tagsViewList.value.splice(index, 1)
    }

    /**
     * @description 关闭所有标签（除首页）
     */
    const handleDelTagViewAll = () => {
      tagsViewList.value = [tagsViewList.value[0]]
    }

    /**
     * @description 关闭其他标签(除首页)
     * @param index 当前被点击的标签的索引
     */
    const handleDelTagViewOther = (index: number) => {
      if (index === 0) {
        return (tagsViewList.value = [tagsViewList.value[0]])
      }
      tagsViewList.value = [tagsViewList.value[0], tagsViewList.value[index]]
    }

    /**
     * @description 关闭右侧标签
     * @param index 当前被点击的标签的索引
     */
    const handleDelTagViewRight = (index: number) => {
      if (index === tagsViewList.value.length - 1) {
        return
      }
      tagsViewList.value = tagsViewList.value.slice(0, index + 1)
    }

    /**
     * @description 关闭左侧标签
     * @param index 当前被点击的标签的索引
     */
    const handleDelTagViewLeft = (index: number) => {
      if (index === 0) {
        return
      }
      tagsViewList.value = [
        tagsViewList.value[0],
        ...tagsViewList.value.slice(index)
      ]
    }

    /**
     * @ 根据当前路由更新面包屑
     * @param route 当前路由对象
     */
    const updateBreadcrumbs = (route: RouteLocationNormalizedLoaded) => {
      let list = [...route.matched]
      // 如果第二个路由是首页，则去掉首页，防止在首页页面的时候会导致面包屑多一个首页
      if (list.length && list[1]?.path === '/dashboard') {
        list.shift()
      }
      breadcrumbList.value = list.map((r) => ({
        title: (r.meta.title || r.name?.toString()) as string,
        path: r.redirect === 'noRedirect' ? '' : r.path
      }))
    }

    /** 切换折叠状态 */
    const handleChangeCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    /**
     * 重置数据
     */
    const reset = () => {
      isCollapse.value = false
      routerList.value = []
      breadcrumbList.value = []
      tagsViewList.value = []
    }

    /** 设置菜单列表 */
    const handleMenuList = (val: Route[]) => {
      routerList.value = [...publicMenu, ...val]
    }

    /**
     * 获取最新菜单列表，并生成路由（一般修改或新增菜单后调用）
     */
    const getNewRoutes = async () => {
      // 获取路由信息
      const { data: res } = await getRoutersApi()
      handleMenuList(res)
      generateDynamicRoutes()
    }

    /** 获取菜单列表 */
    const getMenuList = computed((): Route[] => {
      return routerList.value
    })

    /**
     * 递归生成需要添加的动态路由
     * @param menus 菜单列表
     * @returns
     */
    const loadRouter = (menus: Route[]): RouteRecordRaw[] => {
      const adminStore = useAdminStore()
      return menus.map((menu) => {
        if (menu.component && !modules[`/src/views/${menu.component}.vue`]) {
          console.warn(`组件路径不存在：${menu.component}`)
        }
        // 统一处理组件路径
        let component
        if (menu.component) {
          if (typeof menu.component === 'function') {
            // 如果已经是函数，直接使用
            component = menu.component
          } else if (modules[`/src/views/${menu.component}.vue`]) {
            // 如果是字符串且文件存在
            component = modules[`/src/views/${menu.component}.vue`]
          } else {
            // 提供默认组件或错误组件
            console.warn(`组件路径不存在：${menu.component}，使用默认组件`)
            component = () => import('@/views/error/404.vue')
          }
        }

        const route: RouteRecordRaw = {
          path: menu.path,
          name: menu.name,
          component: component as RouteComponent,
          redirect: menu.redirect || undefined,
          meta: menu.meta,
          children: menu.children ? loadRouter(menu.children) : [],
          props: true,
        }
        return route
      })
    }
    // 清除动态路由（退出后重置路由）
    const clearDynamicRoutes = () => {
      // 移除 Layout 本身，会连带移除所有 children
      router.removeRoute('Layout')
    }
    /**
     *
     * @description: 加载动态路由
     * @return {*}
     */
    const generateDynamicRoutes = () => {
      // 添加前先清除路由，避免重复
      clearDynamicRoutes()
      const routers = loadRouter(routerList.value)
      router.addRoute({
        path: '/',
        name: 'Layout',
        component: Layout,
        redirect: '/dashboard',
        meta: {
          title: '首页',
          icon: '',
          cache: false
        },

        children: routers
      })
      console.log('✅ 路由已添加:', router.getRoutes())
    }

    return {
      isCollapse,
      routerList,
      getMenuList,
      breadcrumbList,
      tagsViewList,
      getNewRoutes,
      handleDelTagView,
      handleDelTagViewByPath,
      updateBreadcrumbs,
      updateTagsViewList,
      reset,
      clearDynamicRoutes,
      handleChangeCollapse,
      handleMenuList,
      generateDynamicRoutes,
      handleDelTagViewAll,
      handleDelTagViewOther,
      handleDelTagViewRight,
      handleDelTagViewLeft
    }
  },
  {
    persist: {
      storage: localStorage,
      omit: ['breadcrumbList']
    }
  }
)
