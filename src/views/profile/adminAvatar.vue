<script setup lang="ts">
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import { useAdminStore } from '@/stores/modules/admin'
import { upload } from '@/api'
import { updateAdminApi } from '@/api/admin'

const adminStore = useAdminStore()

/** 裁剪对话框是否显示 */
const isShowDialog = ref<boolean>(false)
/** 选择文件框ref */
const uploadInputRef = ref<HTMLInputElement | null>(null)
/** 头像地址 */
const avatar = ref<string>(
  adminStore.adminInfo?.avatar ||
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
)
/** 上传加载状态 */
const isUploading = ref<boolean>(false)

/** 选择要裁剪的图片 */
const selectFile = (e: Event) => {
  const { files } = e.target as HTMLInputElement
  if (!files || !files.length) return

  const file = files[0]
  const reader = new FileReader()
  reader.onload = () => {
    avatar.value = String(reader.result)
    isShowDialog.value = true
    resetInput()
  }
  reader.readAsDataURL(file)
}

/** 重置文件输入框 */
const resetInput = () => {
  // uploadInputRef.value?.reset()
}

/** 打开裁剪对话框 */
const openCropper = () => {
  isShowDialog.value = true
}

/** 关闭裁剪对话框 */
const closeDialog = () => {
  isShowDialog.value = false
  // 恢复原头像
  avatar.value = adminStore.adminInfo?.avatar || ''
}

/** 初始化裁剪器 */
const initCropper = () => {
  if (cropper) {
    cropper.reset()
  }
}

/** 上传头像到服务器 */
const uploadAvatar = async (file: File): Promise<void> => {
  try {
    const { data } = await upload(file)
    // 更新头像
    avatar.value = data
    // 更新pinia数据
    adminStore.setAdminInfo({
      avatar: data
    } as AdminInfo)
    // 调用API更新头像
    await updateAdminApi({
      avatar: data,
      id: adminStore.adminInfo!.id
    } as any)
    isShowDialog.value = false
    ElMessage.success('头像更新成功')
  } catch (err) {
    ElMessage.error('上传失败，请重试')
  } finally {
    isUploading.value = false
  }
}

/** 确认裁剪并保存头像 */
const confirmCrop = async () => {
  if (isUploading.value) return

  isUploading.value = true
  if (cropper) {
    cropper.getBlob().then(async (blob: Blob | null) => {
      if (blob) {
        // 将裁剪后的图片转换为File
        const file = new File([blob], `avatar_${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        })
        uploadAvatar(file)
      }
    })
  }
}

/** 头像加载失败处理 */
const errorHandler = () => {
  avatar.value =
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
}
</script>

<template>
  <div class="avatar-container">
    <!-- 显示当前头像，点击可打开裁剪器 -->
    <div class="current-avatar" @click="openCropper">
      <el-avatar
        :size="120"
        :src="avatar"
        class="avatar-image"
        @error="errorHandler"
      />
      <div class="edit-overlay" v-if="avatar">
        <el-icon class="edit-icon"><Edit /></el-icon>
        <span>修改头像</span>
      </div>
    </div>

    <!-- 隐藏的文件选择按钮 -->
    <div class="hidden-input-wrapper">
      <input
        ref="uploadInputRef"
        type="file"
        accept="image/jpg, image/jpeg, image/png, image/gif"
        @change="selectFile"
        class="hidden-input"
      />
      <el-button
        type="primary"
        @click="uploadInputRef?.click()"
        class="select-button"
      >
        <el-icon><Upload /></el-icon>
        <span>选择图片</span>
      </el-button>
    </div>

    <!-- 裁剪对话框 -->
    <el-dialog
      v-model="isShowDialog"
      title="裁剪头像"
      width="65%"
      :before-close="closeDialog"
      class="cropper-dialog"
    >
      <div class="dialog-content border border-solid h-500px">
        <VuePictureCropper
          :img="avatar"
          :aspect-ratio="1 / 1"
          :output-size="0.8"
          :preview="true"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="initCropper" icon="Refresh"> 重置 </el-button>
          <el-button @click="closeDialog">
            <el-icon><Close /></el-icon>取消
          </el-button>
          <el-button type="primary" @click="confirmCrop" :loading="isUploading">
            <el-icon v-if="!isUploading"><Check /></el-icon>
            <span v-if="!isUploading">确认</span>
            <span v-else>上传中...</span>
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;

  .current-avatar {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .edit-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 5px;
      text-align: center;
      opacity: 0;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;

      .edit-icon {
        font-size: 14px;
      }
    }

    &:hover .edit-overlay {
      opacity: 1;
    }
  }

  .hidden-input-wrapper {
    margin-top: 15px;
    position: relative;

    .hidden-input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .select-button {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      transition: background-color 0.4s;

      .el-icon {
        margin-right: 5px;
      }
    }
  }

  .cropper-dialog {
    .el-dialog__header {
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;

      .el-dialog__title {
        font-size: 18px;
        font-weight: 500;
        color: #303133;
      }

      .el-dialog__close {
        font-size: 18px;
        color: #909399;
        cursor: pointer;

        &:hover {
          color: #606266;
        }
      }
    }

    .dialog-content {
      padding: 20px;

      width: 100%;
      .vue-picture-cropper {
        width: 100%;
        max-height: 400px;
        overflow: hidden;
      }
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      padding: 15px 20px;
      border-top: 1px solid #ebeef5;
      gap: 10px;
    }
  }
}
</style>
