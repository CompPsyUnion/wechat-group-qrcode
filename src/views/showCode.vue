<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回验证页面
const goBackToVerify = () => {
  router.push({ name: 'verify' })
}
</script>

<template>
  <div class="show-container">
    <el-card class="show-card">
      <template #header>
        <div class="card-header">
          <h2>验证成功</h2>
        </div>
      </template>

      <div class="content">
        <el-alert
          title="您已通过验证"
          type="success"
          description="您已成功通过宁波诺丁汉大学录取验证。"
          show-icon
          :closable="false"
        />

        <div class="actions">
          <el-button @click="goBackToVerify">
            返回验证页面
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.show-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.show-card {
  width: 100%;
  max-width: 600px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
