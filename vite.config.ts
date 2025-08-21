import { fileURLToPath, URL } from 'node:url'

import { defineConfig ,loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'



// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: [
          'vue',
          'vue-router',
          'pinia'
        ],
        // 存放类型的文件地址
        dts: 'src/auto-imports.d.ts', // 这里是生成的global函数文件
        // dts: path.resolve('/src', "types", "auto-imports.d.ts"),
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: path.resolve('/src', "types", "components.d.ts"),
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]', // 注意这里的icon- 前缀我在svgIcon.vue中写死了的，如果调整了记得同步改一下
        // 有特殊需求可不进行该配置
        svgoOptions: {
          // 删除一些填充的属性
          plugins: [
            {
              name: 'removeAttrs',
              params: { attrs: ['class', 'data-name', 'fill', 'stroke'] }
            },
            // 删除样式标签
            'removeStyleElement'
          ]
        }
      }),
      UnoCSS(),
       lazyImport({
      resolvers: [
        VxeResolver({
          libraryName: 'vxe-table'
        }),
        VxeResolver({
          libraryName: 'vxe-pc-ui'
        })
      ]
    })
    ],
    resolve: {
      alias: {
        //设置别名
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@c': fileURLToPath(new URL('./src/components', import.meta.url)),
        //设置路径
        '~': fileURLToPath(new URL('./', import.meta.url)),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // 设置代理
    server: {
      // host: '0.0.0.0',
      port: 100,
      open: true,
      cors: true,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: 'http://localhost:9527',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ''),
        },
      },
    }
  }
})
