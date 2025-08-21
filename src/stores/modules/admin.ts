import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore(
  'admin',
  () => {
    const adminInfo = ref<AdminInfo | null>()

    /**
     * @description: 登录成功后，将用户信息保存到 store 中
     * @param {LoginResult} val 用户信息
     * @return {*}
     */
    const setAdminInfo = (val: AdminInfo) => {
      adminInfo.value = { ...adminInfo.value, ...val }
    }



    /**
     * @description: 清除用户信息
     * @return {*}
     */
    const clearAdminInfo = () => {
      adminInfo.value = null
    }

    /**
     * @description: 设置 token
     * @param {string} val token
     * @return {*}
     */
    const setToken = (val: string) => {
      adminInfo.value!.token = val
    }

    /**
     * @description: 获取 token
     * @return {string}
     */
    const getToken = () => {
      return adminInfo.value?.token
    }

    /**
     * @description: 获取权限集合
     */
    const getPermissions = computed(() => {
      return adminInfo.value?.permissions || []
    })

    return { adminInfo, getPermissions, setAdminInfo, clearAdminInfo, setToken, getToken }
  },
  {
    persist: true,

  }
)
