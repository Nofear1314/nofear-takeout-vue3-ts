import { type App } from 'vue'
import { langPathMapConfig } from '@/i18n/langMap'
import i18n from '@/i18n'

export default {
  install: (app: App) => {

    // 注入一个全局可用的 $translate() 方法
    app.config.globalProperties.$translate = translate
    //集成i18n
    app.use(i18n)
  }
}

/**
 * @description i18n全局转换函数，如果有对应的语言则直接转换，否则不转换
 * @param text 要转换的文本
 * @returns 根据当前的语言转换后的文本
 */
const translate = (text: string) => {
  // 在过滤器中获取当前实例的 i18n 实例
  const { t } = i18n.global
  //如果有对应的语言则直接转换，否则不转换
  return langPathMapConfig[text] ? t(langPathMapConfig[text]) : text
}
