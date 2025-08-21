import { createI18n } from 'vue-i18n'
import ZH from './package/zh.ts'
import EN from './package/en.ts'
import { LangEnum } from '../enums'

const messages = {
  zh: {
    ...ZH
  },
  en: {
    ...EN
  }
}

const i18n = createI18n({
  locale: window.localStorage.getItem(LangEnum.LANG_KEY) || 'zh', // 默认显示的语言(中文)
  globalInjection: true, // 全局注入 $t 等方法
  legacy: false, // 使用 Composition API
  messages
})


export default i18n
