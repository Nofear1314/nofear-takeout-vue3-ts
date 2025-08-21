import type { App } from "vue"
import hasAuth from "./hasAuth"
import hasAnyAuth from './hasAnyAuth'
export default {
  install(app: App) {
    // 注册全局自定义指令
    app.directive('hasAuth', hasAuth)
    app.directive('hasAnyAuth', hasAnyAuth)
  }
}

