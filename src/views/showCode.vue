<script setup lang="ts">
import { ref, onMounted } from 'vue'

const qrCodeUrl = ref<string>('')

// 动态导入二维码图片
const loadQRCode = async () => {
  try {
    const qrModule = await import('@/assets/qrcode.jpg')
    qrCodeUrl.value = qrModule.default
  } catch (error) {
    console.error('加载二维码失败:', error)
  }
}

// 组件挂载后加载二维码
onMounted(() => {
  loadQRCode()
})
</script>

<template>
  <div class="qr-container">
    <!-- 二维码显示区域 -->
    <div class="qr-code">
      <img 
        v-if="qrCodeUrl" 
        :src="qrCodeUrl" 
        alt="二维码" 
        class="qr-image" 
      />
      <div v-else class="loading">
        加载中...
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
}

.qr-code {
  text-align: center;
}

.qr-image {
  max-width: 300px;
  max-height: 300px;
  width: auto;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading {
  padding: 20px;
  color: #666;
  font-size: 16px;
}
</style>
