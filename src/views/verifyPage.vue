<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { setVerificationPassed } from '@/router'
import { APIService } from '@/utils/api'

const router = useRouter()

// 二维码名称
const codeName = ref('CPU招新群')

// 表单数据
const formData = ref({
  userid: '', // 身份证号
  username: '' // 姓名
})

// 表单规则
const rules = {
  userid: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { min: 18, max: 18, message: '身份证号必须为18位', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ]
}

// 表单引用
const formRef = ref()

// 加载状态
const loading = ref(false)

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 创建全屏加载
      const loadingInstance = ElLoading.service({
        lock: true,
        text: '正在验证...',
        background: 'rgba(255, 255, 255, 0.7)'
      })

      loading.value = true

      try {
        // 使用统一的 API 服务发送请求
        const response = await APIService.sendVerificationRequest(
          formData.value.userid,
          formData.value.username
        )
        .catch((error: Error) => {
          console.error(error)
          ElMessage.error('验证请求失败，请稍后再试')
          return null
        })

        // 检查返回内容
        if (!response) {
          return
        }

        const content = response

        if (
          typeof content === 'string' &&
          content.includes('Congratulations!') &&
          content.includes('录取')
        ) {
          // 设置验证通过状态
          setVerificationPassed(true)

          ElMessage.success('验证成功，正在跳转...')

          // 跳转到展示页面
          router.push({ name: 'show' })
        } else {
          // 提示查询不到录取信息
          ElMessage.error('查询不到您的录取信息')
        }
      } catch (error) {
        console.error('请求失败:', error)
        ElMessage.error('验证请求失败，请稍后再试')
      } finally {
        // 关闭加载
        loadingInstance.close()
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="verify-container">
    <el-card class="verify-card">
      <template #header>
        <div class="card-header">
          <h3>二维码获取验证</h3>
        </div>
      </template>

      <div class="content">
        <el-alert
          title="请验证身份"
          :description="'系统将根据您的身份证号和姓名前往entry.nottingham.edu.cn查询录取状态，不会在后台保留您的个人信息。验证通过后将展示' + codeName + '的二维码。'"
          :closable="true"
        />

        <div class="form-container">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            status-icon
          >
            <el-form-item label="身份证号" prop="userid">
              <el-input
                v-model="formData.userid"
                placeholder="请输入18位身份证号"
                maxlength="18"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="姓名" prop="username">
              <el-input
                v-model="formData.username"
                placeholder="请输入您的姓名"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="submitForm"
                style="width: 100%"
              >
                验证录取状态
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.verify-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.verify-card {
  width: 100%;
  max-width: 500px;
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
}

.form-container {
  margin-top: 20px;
}
</style>
