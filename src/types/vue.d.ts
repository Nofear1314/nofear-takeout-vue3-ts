import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import type { ComponentCustomProperties } from 'vue'


// 扩展 Vue 实例类型，添加 $translate 方法
declare module 'vue' {
  export interface ComponentCustomProperties {
    /**
     * @description i18n全局转换函数，如果有对应的语言则直接转换，否则不转换
     * @param text  要转换的文本
     * @returns 根据当前的语言转换后的文本
     */
    $translate: (text: string) => string,
    // 保留已有路由类型
    $route: RouteLocationNormalizedLoaded
    $router: Router

    $t: typeof import('vue-i18n')['t']
    $i18n: typeof import('vue-i18n')['I18n']
  }
}


