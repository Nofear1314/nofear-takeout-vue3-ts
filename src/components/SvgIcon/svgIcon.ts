import * as components from '@element-plus/icons-vue'
import type { App } from 'vue'
//注册 element 图标
export default {
  install: (app: App) => {
    // 直接遍历组件值，避免索引操作
    for (const componentConfig of Object.values(components)) {
      app.component(componentConfig.name!, componentConfig)
    }
  },
};
