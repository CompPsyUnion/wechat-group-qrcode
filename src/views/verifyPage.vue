<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { setVerificationPassed } from '@/router'
import axios from 'axios'
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
        // const response = await APIService.sendVerificationRequest(
        //   formData.value.userid,
        //   formData.value.username
        // )
        // .catch((error: Error) => {
        //   console.error(error)
        //   ElMessage.error('验证请求失败，请稍后再试')
        //   return null
        // })
        // 自动进行 URL 编码
        const params = new URLSearchParams();
        params.append('userid', formData.value.userid);
        params.append('username', formData.value.username);

        const cookie = ref('AMCVS_4D6368F454EC41940A4C98A6%40AdobeOrg=1; _gcl_au=1.1.145204148.1747475311; _ga=GA1.1.539725090.1747475312; AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg=-2121179033%7CMCIDTS%7C20226%7CMCMID%7C19596142359291472354115984324568118060%7CMCAAMLH-1748082574%7C3%7CMCAAMB-1748082574%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1747484974s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0; s_pers=%20v8%3D1747477774243%7C1842085774243%3B%20v8_s%3DMore%2520than%25207%2520days%7C1747479574243%3B%20c19%3Dpr%253Apure%2520portal%253Apersons%253Aview%7C1747479574244%3B%20v68%3D1747477773255%7C1747479574244%3B; s_sess=%20s_cpc%3D0%3B%20c21%3Dchin%2520poo%2520lee%3B%20e13%3Dchin%2520poo%2520lee%253A1%3B%20c13%3Drating-desc%3B%20s_ppvl%3Dpr%25253Apure%252520portal%25253Apublications%25253Aview%252C35%252C35%252C893%252C1274%252C893%252C1512%252C982%252C2%252CP%3B%20s_ppv%3Dpr%25253Apure%252520portal%25253Apublications%25253Aview%252C100%252C35%252C2559%252C1274%252C893%252C1512%252C982%252C2%252CP%3B%20e41%3D1%3B%20s_cc%3Dtrue%3B; _ga_D0L9JPJXFY=GS2.1.s1747900771$o6$g0$t1747900772$j0$l0$h0; CID=BgAAALyG+ymghw6DbQhG6KSkYZU=; PHPSESSID=q392hr54b3iabr7rajp0vs5p0k; TS013cc1fd=010f85e1d816b1696c78c64f1e299c8633d80747b48d24489bc1bb445973251e4d6b10e176d97b7e5cde5a52fc668cb838e1a21c027f81c891fd3ecbcedbe35f704df622e1')

        const response = await axios.post(
          'https://cors.ibuduan.com/https://entry.nottingham.edu.cn/result.php',
          params,
          {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'cookie': cookie.value,
            'Origin': 'http://entry.nottingham.edu.cn',
            },
          }
        ).catch((error: Error) => {
          console.error(error)
          ElMessage.error('验证请求失败，请稍后再试')
        })

        // 关闭全屏加载

        // 检查返回内容
        if (!response) {
          return
        }
        const content = response.data
        if (
          content && 
          typeof content === 'string' &&
          (content.includes('Congratulations!') && content.includes('专业录取'))
        ) {
          console.log('验证通过:', content)
          // 设置验证通过状态
          setVerificationPassed(true)
          ElMessage.success('验证成功，正在跳转...')
          // 跳转到展示页面
          router.push('/show')
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