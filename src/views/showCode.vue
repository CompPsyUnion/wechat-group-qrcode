<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const qrCodeUrl = ref<string>("");
const isMobile = ref(false);

// 检测是否为移动设备
const checkDevice = () => {
  const userAgent =
    navigator.userAgent ||
    navigator.vendor ||
    ((window as Window & { opera?: string }).opera ?? "");
  isMobile.value = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
};

// 动态导入二维码图片
const loadQRCode = async () => {
  try {
    const qrModule = await import("@/assets/qrcode.jpg");
    qrCodeUrl.value = qrModule.default;
  } catch (error) {
    console.error("加载二维码失败:", error);
  }
};

// 根据设备类型计算提示文本
const instructionText = computed(() => {
  return isMobile.value ? t("qrcode.mobileInstruction") : t("qrcode.desktopInstruction");
});

// 组件挂载后加载二维码并检测设备
onMounted(() => {
  loadQRCode();
  checkDevice();

  // 窗口大小变化时重新检测设备类型
  window.addEventListener("resize", checkDevice);
});
</script>

<template>
  <div class="qr-container">
    <!-- 二维码显示区域 -->
    <div class="qr-code">
      <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="二维码" class="qr-image" />
      <div v-else class="loading">
        {{ t("common.loading") }}
      </div>
    </div>
  </div>
  <p class="qr-tips">
    {{ instructionText }}
  </p>
</template>

<style scoped>
.qr-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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

.qr-tips {
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.loading {
  padding: 20px;
  color: #666;
  font-size: 16px;
}
</style>
