<script setup name="Profile">
import { useAdminStore } from '@/stores/modules/admin'
import UserInfo from './userInfo.vue'
import ChangePwd from './changePwd.vue'
import { getAdminInfoApi } from '@/api/admin'
import AdminAvatar from './adminAvatar.vue'
const state = useAdminStore()
const { username, phoneNumber, email, roles, addTime } = toRefs(state.adminInfo)
const activeTab = ref('userInfo')

const getAdminInfo = async () => {
  const { data } = await getAdminInfoApi()
  state.setAdminInfo(data)
}

getAdminInfo()
</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8" :xs="24">
        <el-card>
          <template v-slot:header>
            <div>
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <div>
              <AdminAvatar />
            </div>
            <ul class="list-group">
              <li>
                <div><svg-icon name="user" />用户名称</div>
                <div class="pull-right">{{ username }}</div>
              </li>
              <li>
                <div><svg-icon name="phone" />手机号码</div>
                <div>{{ phoneNumber }}</div>
              </li>
              <li>
                <div><svg-icon name="email" />用户邮箱</div>
                <div>{{ email }}</div>
              </li>
              <li>
                <div><svg-icon name="peoples" />所属角色</div>
                <div class="w-180px">
                  {{ roles.map((role) => role.roleName).join('，') }}
                </div>
              </li>
              <li>
                <div><svg-icon name="date" />创建日期</div>
                <div>{{ addTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userInfo">
              <UserInfo :user="state.adminInfo" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <ChangePwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
ul.list-group {
  li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e4e7ed;
    padding: 10px;
    font-size: 12px;
    align-items: center;
    div {
      display: flex;
      align-items: center;
    }
  }
}
</style>
