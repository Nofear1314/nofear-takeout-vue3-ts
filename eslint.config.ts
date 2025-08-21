// <reference types="@typescript-eslint/utils/ts-eslint" />


import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs, configureVueProject } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import "@typescript-eslint/utils/ts-eslint"
// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      'no-console': 'off'
    }

  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    rules: {
      // 代码风格规则
      'semi': [2, 'never'], // 不使用分号
      'no-multi-spaces': 2, // 不允许多个连续的空格
      'space-unary-ops': [2, { words: true, nonwords: false }], // 一元运算符后必须有空格
      'space-infix-ops': 2, // 中缀操作符周围必须有空格
      'space-before-blocks': [2, 'always'], // 代码块前必须有空格
      'no-mixed-spaces-and-tabs': 2, // 不允许混合使用空格和制表符
      'no-multiple-empty-lines': [2, { max: 1 }], // 连续空行不超过 1 行
      'no-trailing-spaces': 2, // 行尾不允许有空格
      'no-whitespace-before-property': 2, // 属性名和点运算符之间不能有空格
      'no-irregular-whitespace': 2, // 不允许出现不规则的空白字符
      'space-in-parens': [2, 'never'], // 圆括号内不能有空格
      'comma-dangle': [2, 'never'], // 逗号不允许有拖尾
      'array-bracket-spacing': [2, 'never'], // 数组括号内不允许有空格
      'object-curly-spacing': [2, 'never'], // 对象括号内不允许有空格
      'max-len': ['error', { code: 80 }], // 行宽最大为 80 字符
      'operator-linebreak': [2, 'before'], // 运算符换行时，运算符在行首
      'comma-style': [2, 'last'], // 逗号风格：换行时在行尾
      'no-extra-semi': 2, // 不允许出现多余的分号
      'curly': [2, 'all'], // 使用大括号包裹所有控制结构
      'key-spacing': [2, { beforeColon: true, afterColon: true }], // 属性名与冒号之间不能有空格，冒号后必须有空格
      'comma-spacing': [2, { before: false, after: true }], // 逗号后必须有空格
      'semi-spacing': [2, { before: false, after: true }], // 分号后必须有空格
      'camelcase': [1, { properties: 'always' }], // 强制使用驼峰命名法
      'new-cap': ['error', { newIsCap: true, capIsNew: false }], // 构造函数首字母必须大写
      'spaced-comment': [2, 'always'], // 注释后必须有空格
      // 'no-inline-comments': 0, // 不允许行内注释
      'eqeqeq': [2, 'always', { null: 'ignore' }], // 强制使用全等 (===) 运算符
      'no-else-return': [1, { allowElseIf: false }], // 禁止 else 语句，如果 if 语句中已返回值
      'no-loop-func': 2, // 禁止在循环中定义函数
      'vue/multi-word-component-names': 'off', // 关闭 Vue 组件名需多单词的规则
      'vue/require-prop-types': 'off', // 关闭 Vue 组件属性类型规则
      'vue/attribute-hyphenation': 'off', // 允许 Vue 模板中使用 HTML 属性简写（如 `checked` 而非 `:checked`）
      'vue/no-setup-props-destructure': ['off'], // 关闭props解构的校验
      // 'prettier/prettier': [
      //   'warn',
      //   {
      //     singleQuote: true, //单引号
      //     semi: false, //无分号
      //     printWidth: 80, //每行宽度至多80字符
      //     trailingComma: 'none', //不加对象|数组最后逗号
      //     endOfLine: 'auto', //换行符号不限制（win mac不一致）
      //     ignores: ['index'], //vue组件名称多单词组成（忽略index.vue）
      //   }
      // ],
      'prettier/prettier': 'error',
      'no-undef': 'error', // 未定义变量提示
      'no-console': 'off'
    }

  }

)
