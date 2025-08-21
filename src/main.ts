import './assets/styles/index.scss'

import { createApp } from 'vue'
import store from './stores'

import '@/utils/request'

import 'virtual:uno.css'


import App from './App.vue'

import router from './router'
import '@/router/permission'

// 集成国际化
import i18n from '@/plugins/i18n'

//注册指令
import directives from '@/directives'

// 导入 http 实例，并传入 router,这样做是为了消除控制台的警告
import http from '@/utils/request'
http.setRouter(router)
//element-plus样式
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'


//图标
import elementIcons from '@/components/SvgIcon/svgIcon'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'

import TablePro from '@/components/TablePro/index.vue'


const app = createApp(App)

//注册svg组件
app.component('SvgIcon', SvgIcon)
//注册表格组件
app.component('TablePro', TablePro)

app.use(router)
app.use(store)

app.use(i18n)
app.use(elementIcons)
app.use(directives)

app.mount('#app')

