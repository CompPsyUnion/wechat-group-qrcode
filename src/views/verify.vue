<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { setVerificationPassed } from '@/router'

const router = useRouter()
const iframeRef = ref<HTMLIFrameElement | null>(null)
const loading = ref(true)

// 检查iframe内容中是否包含特定文本
const checkIframeContent = () => {
  try {
    const iframe = iframeRef.value
    if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return

    // 获取iframe中的文档内容
    const iframeContent = iframe.contentDocument.body.textContent || ''

    // 检查是否包含特定文本
    if (iframeContent.includes('祝贺您被宁波诺丁汉大学') && iframeContent.includes('录取')) {
      ElMessage.success('验证成功，正在跳转...')
      // 设置验证通过状态
      setVerificationPassed(true)
      // 跳转到展示页面
      router.push({ name: 'show' })
    }
  } catch (error) {
    console.error('检查iframe内容时出错:', error)
  }
}

// 监听iframe加载完成事件
const handleIframeLoad = () => {
  loading.value = false
  checkIframeContent()
}

// 监听iframe中的URL变化
let observer: MutationObserver | null = null

onMounted(() => {
  // 创建一个MutationObserver实例来监听iframe的变化
  observer = new MutationObserver((mutations) => {
    checkIframeContent()
  })

  // 当iframe加载完成后，开始观察其内容变化
  const iframe = iframeRef.value
  if (iframe) {
    iframe.addEventListener('load', () => {
      try {
        if (iframe.contentDocument) {
          observer?.observe(iframe.contentDocument, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
          })
        }
      } catch (error) {
        console.error('设置MutationObserver时出错:', error)
      }
    })
  }
})

onUnmounted(() => {
  // 清理MutationObserver
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div class="verify-container">
      <div class="iframe-container">
        <iframe
          ref="iframeRef"
          src="https://entry.nottingham.edu.cn"
          @load="handleIframeLoad"
          sandbox="allow-same-origin allow-scripts allow-forms"
          width="100%"
          height="100%"
        ></iframe>
      </div>
  </div>
</template>

<style scoped>
.verify-container {
  min-height: 100vh;
}

.verify-card {
  width: 100vw;

}

.card-header {
  font-size: 12px;
  align-self: center;
  color: #909399;
}



.iframe-container {
  min-height: 100vh;
  all: unset;
  overflow: hidden;

  iframe {
    all: unset;
    width: 100%;
    height: 100svh;
    border: 0;
  }
}

.loading-container {
  padding: 20px;
}

.instructions {
  margin-top: 20px;
}
</style>
