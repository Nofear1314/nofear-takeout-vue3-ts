<script setup lang="ts">
import { UploadProps } from 'element-plus'
import { useAdminStore } from '@/stores/modules/admin'

const props = defineProps({
  url: {
    type: String,
    default: import.meta.env.VITE_APP_BASE_API + '/admin/file/upload'
  },
  headers: {
    type: Object as PropType<Record<string, any>>,
    default: () => {
      const { getToken } = useAdminStore()
      return {
        Authorization: getToken()
      }
    }
  },
  //尺寸
  size: {
    type: String,
    default: '80'
  },
  accept: {
    type: String,
    default: 'image/*,png,jpg,jpeg,gif,svg,webp'
  },
  modelValue: {
    type: String,
    default: ''
  }
})
const wrapperSize = computed(() => {
  const sizeValue = props.size || '80' // 确保有值
  return typeof sizeValue === 'string' && sizeValue.endsWith('px')
    ? sizeValue
    : sizeValue + 'px'
})

const emit = defineEmits(['update:modelValue'])
/**
 * 上传文件成功回调
 * @param response 上传成功返回的数据
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  console.log('🚀 ~ response:', response.data)
  if (response.code === 200) {
    emit('update:modelValue', response.data)
    return ElMessage.success('上传成功')
  }
  return ElMessage.error('上传失败')
}

const img = ref('')
/**
 * 选择文件时的回调
 * @param file 文件对象
 */
const handleAvatarChange: UploadProps['onChange'] = (file) => {
  if (file.raw) {
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log("🚀 ~ e:", e)
      img.value = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }
}
</script>

<template>
  <el-upload
    :accept
    class="avatar-uploader"
    :action="url"
    :show-file-list="false"
    :headers
    :on-success="handleAvatarSuccess"
    :on-change="handleAvatarChange"
  >
    <img v-if="modelValue" :src="modelValue" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    <template #tip>
      <div class="el-upload__tip">
        <p>图片大小不超过2MB</p>
        <p>支持JPG、PNG、GIF、SVG、WEBP格式</p>
      </div>
    </template>
  </el-upload>
</template>

<style lang="scss">
.avatar-uploader {
  .avatar {
    width: v-bind('wrapperSize');
    height: v-bind('wrapperSize');
    display: block;
    object-fit: cover;
    margin-bottom: 0;
  }
  .el-upload {
    outline: 2px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .el-upload:hover {
    outline-color: var(--el-color-primary);
  }
  .el-upload__tip {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 1.5;
    p {
      margin: 0;
    }
  }
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: v-bind('wrapperSize');
  height: v-bind('wrapperSize');
  text-align: center;
}
</style>
