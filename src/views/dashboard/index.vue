<script setup lang="ts">
import {
  getBusinessDataApi,
  getDishOverviewApi,
  getOrderOverviewApi
} from '@/api/workspace'
import { CountTo } from 'vue3-count-to'

const businessData = ref<BusinessDataVO>()
const getBusinessData = async () => {
  const { data } = await getBusinessDataApi()
  businessData.value = data
}

const orderOverview = ref<OrderOverviewVO>()
const getOrderOverview = async () => {
  const { data } = await getOrderOverviewApi()
  orderOverview.value = data
}

const dishOverview = ref<DishOverviewVO>()
const getDishOverview = async () => {
  const { data } = await getDishOverviewApi()
  dishOverview.value = data
}

Promise.all([getBusinessData(), getOrderOverview(), getDishOverview()])
</script>

<template>
  <div class="flex flex-col gap-2">
    <el-card>
      <template #header>今日数据</template>

      <div class="flex justify-between items-center gap-1">
        <el-card
          class="h-130px basis-20%"
          style="
            background: linear-gradient(
              to right bottom,
              #a3bbe5,
              #6f9ef4,
              #4f89f3
            ) !important;
          "
        >
          <p>营业额</p>
          <div class="flex box-border justify-between items-center">
            <count-to
              class="text-24px font-bold flex-1"
              :startVal="0"
              :decimals="2"
              prefix="￥"
              :endVal="+businessData?.turnover! || 0"
              :duration="2000"
            ></count-to>
            <div class="p-15px bg-#edf3fe rd-50% box-border">
              <svg-icon name="cny" color="#5a90f4" :size="38"></svg-icon>
            </div>
          </div>
        </el-card>
        <el-card class="h-130px basis-20%">
          <p class="title">有效订单</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :endVal="+businessData?.validOrderCount!"
              :duration="2000"
            ></count-to>
            <div class="p-15px bg-#edf3fe rd-50% box-border">
              <svg-icon name="order" color="#5a90f4" :size="38"></svg-icon>
            </div>
          </div>
        </el-card>
        <el-card class="h-130px basis-20%">
          <p class="title">订单完成率</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0.0"
              :decimals="2"
              suffix="%"
              :endVal="+businessData?.orderCompletionRate! || 0"
              :duration="2000"
            ></count-to>
            <div class="p-15px bg-#edf3fe rd-50% box-border">
              <svg-icon name="complete" color="#5a90f4" :size="38"></svg-icon>
            </div>
          </div>
        </el-card>
        <el-card class="h-130px basis-20%">
          <p class="title">平均客单价</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :decimals="2"
              prefix="￥"
              :endVal="+businessData?.unitPrice! || 0"
              :duration="2000"
            ></count-to>
            <div class="p-15px bg-#edf3fe rd-50% box-border">
              <svg-icon name="unit-price" color="#5a90f4" :size="38"></svg-icon>
            </div>
          </div>
        </el-card>
        <el-card class="h-130px basis-20%">
          <p class="title">新增用户</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :endVal="+businessData?.newUsers!"
              :duration="2000"
            ></count-to>
            <div class="p-15px bg-#edf3fe rd-50% box-border">
              <svg-icon name="user-add" color="#5a90f4" :size="38"></svg-icon>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <el-card>
      <template #header>订单概况</template>
      <div class="flex justify-between items-center gap-1">
        <el-card class="h-100px basis-20%">
          <p class="title">待接单</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :duration="1000"
              :end-val="+orderOverview?.waitingOrders! || 0"
            ></count-to>
            <div class="p-15px box-border">
              <svg-icon
                name="waiting-order"
                color="#5a90f4"
                :size="24"
              ></svg-icon>
            </div>
          </div>
        </el-card>
        <el-card class="h-100px basis-20%">
          <p class="title">待派送</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :duration="1000"
              :end-val="+orderOverview?.deliveredOrders! || 0"
            ></count-to>
            <div class="p-15px box-border">
              <svg-icon
                name="deliver-order"
                color="#5a90f4"
                :size="24"
              ></svg-icon>
            </div>
          </div>
        </el-card>
        <el-card class="h-100px basis-20%">
          <p class="title">已完成</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :duration="1000"
              :end-val="+orderOverview?.completeOrders! || 0"
            ></count-to>
            <div class="p-15px box-border">
              <svg-icon name="order" color="#5a90f4" :size="24"></svg-icon>
            </div>
          </div>
        </el-card>
        <el-card class="h-100px basis-20%">
          <p class="title">已取消</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :duration="1000"
              :end-val="+orderOverview?.cancelledOrders! || 0"
            ></count-to>
            <div class="p-15px box-border">
              <svg-icon
                name="cancel-order"
                color="#5a90f4"
                :size="24"
              ></svg-icon>
            </div>
          </div>
        </el-card>
        <el-card class="h-100px basis-20%">
          <p class="title">全部订单</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :duration="1000"
              :end-val="+orderOverview?.allOrders! || 0"
            ></count-to>
            <div class="p-15px box-border">
              <svg-icon name="order-all" color="#5a90f4" :size="24"></svg-icon>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <el-card class="w-50%">
      <template #header>菜品总览</template>
      <div class="flex justify-between items-center gap-1">
        <el-card class="h-100px basis-50%">
          <p class="title">已启售</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :duration="1000"
              :end-val="+dishOverview?.sold!"
            ></count-to>
            <div class="p-15px box-border">
              <svg-icon name="sell" color="#5a90f4" :size="24"></svg-icon>
            </div>
          </div>
        </el-card>
        <el-card class="h-100px basis-50%">
          <p class="title">已停售</p>
          <div class="flex justify-between items-center">
            <count-to
              class="text-24px font-bold"
              :startVal="0"
              :duration="1000"
              :end-val="+dishOverview?.discontinued!"
            ></count-to>
            <div class="p-15px box-border">
              <svg-icon name="stop-sell" color="#5a90f4" :size="24"></svg-icon>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
