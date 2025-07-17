<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { setVerificationPassed } from '@/router'
import axios from 'axios'

const router = useRouter()

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
        // 创建表单数据
        const params = new URLSearchParams()
        params.append('userid', formData.value.userid)
        params.append('username', formData.value.username)

        // 发送请求
        const response = await axios.post(
          'https://entry.nottingham.edu.cn/result.php',
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
        .catch((error) => {
          console.error(error)
          ElMessage.error('验证请求失败，请稍后再试')
        })

        // 检查返回内容
        const content = response.data

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
          <h2>宁波诺丁汉大学录取验证</h2>
        </div>
      </template>

      <div class="content">
        <el-alert
          title="请输入您的身份证号和姓名进行录取验证"
          type="info"
          description="系统将验证您的录取状态，如果您已被录取，将自动跳转到验证成功页面。"
          show-icon
          :closable="false"
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
