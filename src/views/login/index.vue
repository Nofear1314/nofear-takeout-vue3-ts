<script setup lang="ts" name="Login">
// import { ref } from 'vue'
import Cookies from 'js-cookie'
import { ElMessage, type FormInstance } from 'element-plus'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { loginApi } from '@/api/admin'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/modules/admin'
import { LoginRememberEnum } from '@/enums/index'
import { getRoutersApi } from '@/api/menu'
import { useMenuStore } from '@/stores/modules/menu'

const adminStore = useAdminStore()
const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()

console.log('当前退出后的路由信息：', router.getRoutes())

/**
 * 获取标题
 */
const title = import.meta.env.VITE_APP_TITLE

/**
 * 表单对象
 */
const loginRef = ref<FormInstance | null>(null)

/**
 * 表单对象数据
 */
const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false,
  code: ''
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
}

const codeUrl = ref('')

const loading = ref(false)

// 验证码开关
const captchaEnabled = ref(false)
// 注册开关
const register = ref(false)

/**
 * 登录
 */
const handleLogin = async () => {
  //  表单验证
  await loginRef.value?.validate()

  //设置登录loading，防止点击多次
  loading.value = true
  // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
  handleRememberCookie()
  try {
    const { data } = await loginApi(loginForm.value)
    // 设置用户信息,存入pinia中
    adminStore.setAdminInfo(data)

    // 获取路由信息
    const { data: res } = await getRoutersApi()
    // 设置路由信息，存入pinia中
    menuStore.handleMenuList(res)

    // 使用 replace 而不是 push，不会新增历史记录,如果有重定向路由，则跳转到重定向路由，否则跳转到首页
    router.replace({
      path: ((route.query && route.query.redirect) as string) || '/'
    })
    ElMessage.success('登录成功')
  } catch (error) {
    console.log('🚀 ~ handleLogin，登录失败 ~ error:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 处理记住密码
 */
const handleRememberCookie = () => {
  if (loginForm.value.rememberMe) {
    Cookies.set(LoginRememberEnum.USER_NAME, loginForm.value.username, {
      expires: 30
    })
    Cookies.set(LoginRememberEnum.PASSWORD, encrypt(loginForm.value.password), {
      expires: 30
    })
    Cookies.set(
      LoginRememberEnum.REMEMBER_ME,
      JSON.stringify(loginForm.value.rememberMe),
      {
        expires: 30
      }
    )
  } else {
    // 否则移除
    Cookies.remove(LoginRememberEnum.USER_NAME)
    Cookies.remove(LoginRememberEnum.PASSWORD)
    Cookies.remove(LoginRememberEnum.REMEMBER_ME)
  }
}

/**
 * 获取Cookie
 */
function getCookie() {
  const username = Cookies.get(LoginRememberEnum.USER_NAME)
  const password = Cookies.get(LoginRememberEnum.PASSWORD)
  const rememberMe = Cookies.get(LoginRememberEnum.REMEMBER_ME)
  loginForm.value = {
    ...loginForm.value,
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
}
getCookie()
</script>
<template>
  <!-- TODO 主题 -->
  <div class="login">
    <!-- 登录表单 -->
    <el-form
      ref="formRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      @submit.prevent.stop="handleLogin"
    >
      <h3 class="title">{{ title }}</h3>

      <!-- 用户名框 -->
      <el-form-item prop="username">
        <el-input
          v-model.trim="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <el-icon :size="16"><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码框 -->
      <el-form-item prop="password">
        <el-input
          v-model.trim="loginForm.password"
          type="password"
          show-password
          size="large"
          auto-complete="off"
          placeholder="密码"
        >
          <template #prefix>
            <el-icon :size="16"><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
        >
          <template #prefix>
            <svg-icon
              name="validCode"
              :size="16"
              class="el-input__icon input-icon"
            />
          </template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" class="login-code-img" />
        </div>
      </el-form-item>

      <!-- 记住密码 -->
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0px 0px 25px 0px"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          native-type="submit"
          type="primary"
          style="width: 100%"
        >
          <span>{{ loading ? '登 录 中...' : '登 录' }}</span>
        </el-button>
        <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'"
            >立即注册</router-link
          >
        </div>
      </el-form-item>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2025 xxx All Rights Reserved.</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../../assets/images/login-background.jpg');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
