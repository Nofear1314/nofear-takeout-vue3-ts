<template>
  <div class="icon-body">
    <!-- 自动聚焦 -->
    <el-input
      v-model="iconName"
      class="icon-search"
      clearable
      ref="iconSearchRef"
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template #suffix
        ><el-icon><Search /></el-icon
      ></template>
    </el-input>
    <div class="icon-list">
      <div class="list-container">
        <div
          v-for="(item, index) in iconList"
          class="icon-item-wrapper"
          :key="index"
          @click="selectedIcon(item)"
        >
          <div :class="['icon-item', { active: activeIcon === item }]">
            <svg-icon
              :name="item"
              class-name="icon"
              style="height: 25px; width: 16px"
            />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import icons from './requireIcons'

const props = defineProps({
  activeIcon: {
    type: String
  }
})

const iconSearchRef = useTemplateRef('iconSearchRef')

/**
 * 聚焦搜索框
 */
const focusSearch = () => {
  iconSearchRef.value.focus()
}

/**
 * 搜索的图标名称
 */
const iconName = ref('')
/**
 * 要渲染的图标列表
 */
const iconList = ref(icons)
const emit = defineEmits(['selected'])

/**
 * 根据搜索词过滤图标
 */
const filterIcons = () => {
  iconList.value = icons
  if (iconName.value) {
    iconList.value = icons.filter((item) => item.indexOf(iconName.value) !== -1)
  }
}

/**
 * 单击选中图标
 * @param name 选中的图标名称
 */
const selectedIcon = (name) => {
  //触发选中事件，并传递选中的图标名称
  emit('selected', name)
  // 关闭下拉框
  document.body.click()
}

/**
 * 重置图标选择
 */
const reset = () => {
  iconName.value = ''
  iconList.value = icons
}

defineExpose({
  reset,
  focusSearch
})
</script>

<style lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-search {
    position: relative;
    margin-bottom: 5px;
  }
  .icon-list {
    height: 200px;
    overflow: auto;
    .list-container {
      display: flex;
      flex-wrap: wrap;
      .icon-item-wrapper {
        width: calc(100% / 3);
        height: 25px;
        line-height: 25px;
        cursor: pointer;
        display: flex;
        .icon-item {
          display: flex;
          max-width: 100%;
          height: 100%;
          padding: 0 5px;
          &:hover {
            background: #ececec;
            border-radius: 5px;
          }
          .icon {
            flex-shrink: 0;
          }
          span {
            display: inline-block;
            vertical-align: -0.15em;
            fill: currentColor;
            padding-left: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .icon-item.active {
          background: #ececec;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
