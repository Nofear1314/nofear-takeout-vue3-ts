/// <reference types="vite/client" />

declare module 'jsencrypt/bin/jsencrypt.min.js'

interface ViteTypeOptions {
  // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
  // 这样就不允许有未知的键值了。
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_ENV: string
  readonly VITE_APP_WS_URL: string
  readonly VITE_APP_AUTHORIZATION_KEY: 'Authorization'
}

interface Process {
  NODE_ENV: string
  readonly env: ImportMetaEnv
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>

  export default component
}
