import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ThemeKeyEnum, ThemeTypeEnum } from '@/enums/index'
/**
 * 主题模块
 */
export const useThemeStore = defineStore('theme', () => {
  /**
   * 存储本地的键
   */
  const LOCAL_KEY = ThemeKeyEnum.THEME_KEY

  /**
   * 主题类型,默认亮色
   */
  const theme = ref<ThemeTypeEnum>(ThemeTypeEnum.LIGHT)

  /**
   * 触发切换主题所对应的元素
   */
  const themeSelectEle = ref<HTMLElement | null>(null)
  /**
   * 媒体查询系统主题是否为暗色，如果match.matches的值为true表示当前系统的主题为暗色
   */
  const match = matchMedia('(prefers-color-scheme:dark)')

  /**
   * 系统主题状态(light/dark)
   */
  const systemTheme = ref<Exclude<ThemeTypeEnum, ThemeTypeEnum.OS>>(match.matches ? ThemeTypeEnum.DARK : ThemeTypeEnum.LIGHT)


  /**
   * 获取本地主题时返回枚举类型，默认亮色
   * @returns 主题类型
   */
  const getLocalTheme = (): ThemeTypeEnum => {
    const localTheme = localStorage.getItem(ThemeKeyEnum.THEME_KEY) || ThemeTypeEnum.LIGHT
    // 校验枚举值合法性（枚举值可能被非法修改）
    if (Object.values(ThemeTypeEnum).includes(localTheme as ThemeTypeEnum)) {
      return localTheme as ThemeTypeEnum
    }
    return ThemeTypeEnum.LIGHT
  }

  /**
   * 初始化系统主题监听
   */
  const setupOsThemeListener = () => {
    match.addEventListener('change', handleSystemThemeChange)
  }

  /**
   * 移除系统主题监听
   */
  const teardownOsThemeListener = () => {
    match.removeEventListener('change', handleSystemThemeChange)
  }

  /**
   * 系统主题变化处理函数
   */
  const handleSystemThemeChange = () => {
    if (theme.value === ThemeTypeEnum.OS) {
      // 获取当前系统主题
      const sysTheme = match.matches ? ThemeTypeEnum.DARK : ThemeTypeEnum.LIGHT
      //将当前系统主题存入变量
      systemTheme.value = sysTheme
      //更新主题
      updateHtmlTheme(sysTheme)
    }
  }

  /**
   * 计算当前实际主题 {light/dark}（考虑 OS 模式）
   */
  const actualTheme = computed(() => {
    if (theme.value === ThemeTypeEnum.OS) {
      return systemTheme.value
    }
    return theme.value
  })

  /**
   * 将主题类型存入本地
   * @param theme 主题类型
   */
  const persistTheme = (theme: ThemeType) => {
    localStorage.setItem(LOCAL_KEY, theme)
  }

  /**
   * 统一处理 HTML 主题更新（含过渡动画）
   * @param newTheme 更新的主题类型
   */
  const updateHtmlTheme = (newTheme: ThemeType) => {
    const { x, y } = themeSelectEle.value?.getBoundingClientRect() ?? { x: 0, y: 0 }

    // 使用更合理的半径计算,计算到到四个角落的最大距离
    const maxX = Math.max(x, window.innerWidth - x)
    const maxY = Math.max(y, window.innerHeight - y)
    const targetRadius = Math.hypot(maxX, maxY)

    // 开始视图过渡
    const transition = document.startViewTransition(() => {
      document.documentElement.dataset.theme = newTheme
      document.documentElement.classList.remove('dark', 'light')
      document.documentElement.classList.add(newTheme)
    })

    // 执行动画（添加错误处理）
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0% at ${x}px ${y}px)`, `circle(${targetRadius}px at ${x}px ${y}px)`]
        },
        {
          duration: 1000,
          pseudoElement: '::view-transition-new(root)'
        }
      ).onfinish = () => {
        console.log('主题切换动画完成', actualTheme.value)

      }
    }).catch(error => {
      console.error('主题切换动画失败:', error)
    })
  }

  /**
   * 切换主题
   * @param {'dark' | 'light' | 'OS'} themeArg 传入的主题，默认跟随系统切换
   * @param {HTMLElement} ele 切换主题的按钮元素
   */
  const toggleTheme = (themeArg?: ThemeType, ele?: HTMLElement) => {
    // 处理参数默认值
    const resolvedTheme = themeArg as ThemeTypeEnum ?? (match.matches ? ThemeTypeEnum.DARK : ThemeTypeEnum.LIGHT)
    const resolvedEle = ele ?? themeSelectEle.value // 允许传入元素或使用默认存储的元素

    // 避免无效更新
    if (resolvedTheme === theme.value && resolvedEle === themeSelectEle.value) return

    // 更新主题状态
    theme.value = resolvedTheme
    themeSelectEle.value = resolvedEle

    // 处理系统主题监听
    if (resolvedTheme === ThemeTypeEnum.OS) {
      setupOsThemeListener() // 启用监听
      handleSystemThemeChange() // 立即应用当前系统主题
    } else {
      teardownOsThemeListener() // 移除监听
      updateHtmlTheme(resolvedTheme) // 直接应用传入主题
      persistTheme(resolvedTheme) // 持久化
    }
  }

  /**
   * 初始化主题（集中处理副作用）
   */
  const initTheme = () => {
    // 读取本地主题或设置默认值
    theme.value = getLocalTheme()

    // 处理初始主题应用
    if (theme.value === ThemeTypeEnum.OS) {
      setupOsThemeListener() // 监听系统主题变化
      handleSystemThemeChange() // 初始化时获取系统主题
    } else {
      updateHtmlTheme(theme.value) // 直接应用本地主题
    }
  }

  initTheme()

  return { theme, actualTheme, toggleTheme }
})
