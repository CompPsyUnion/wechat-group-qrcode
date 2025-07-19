<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
import { setVerificationPassed } from "@/router";
import { useI18n } from "vue-i18n";
import axios from "axios";

const { t } = useI18n();
const router = useRouter();

// 使用i18n获取文本
const codeName = computed(() => t("verify.groupName"));
const unableToVerifyMessage = computed(() => t("verify.unableToVerifyMessage"));

const bcd = ref("2025 Computer"); //勿改动，会影响跳转

// 按钮跳转
const openExternalLink = () => {
  window.open("https://cnb.cool/ibuduan/cpu/wechat-group-qrcode", "_blank");
};

// 表单数据
const formData = ref({
  userid: "", // 身份证号
  username: "", // 姓名
});

// 表单规则，使用i18n
const rules = computed(() => ({
  userid: [
    { required: true, message: t("validation.idRequired"), trigger: "blur" },
    { min: 18, max: 18, message: t("validation.idLength"), trigger: "blur" },
  ],
  username: [{ required: true, message: t("validation.nameRequired"), trigger: "blur" }],
}));

// 表单引用
const formRef = ref();

// 加载状态
const loading = ref(false);

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 创建全屏加载
      const loadingInstance = ElLoading.service({
        lock: true,
        text: t("verify.verifying"),
        background: "rgba(255, 255, 255, 0.7)",
      });

      loading.value = true;

      try {
        // 自动进行 URL 编码
        const params = new URLSearchParams();
        params.append("userid", formData.value.userid);
        params.append("username", formData.value.username);

        const cookie = ref(
          "AMCVS_4D6368F454EC41940A4C98A6%40AdobeOrg=1; _gcl_au=1.1.145204148.1747475311; _ga=GA1.1.539725090.1747475312; AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg=-2121179033%7CMCIDTS%7C20226%7CMCMID%7C19596142359291472354115984324568118060%7CMCAAMLH-1748082574%7C3%7CMCAAMB-1748082574%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1747484974s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0; s_pers=%20v8%3D1747477774243%7C1842085774243%3B%20v8_s%3DMore%2520than%25207%2520days%7C1747479574243%3B%20c19%3Dpr%253Apure%2520portal%253Apersons%253Aview%7C1747479574244%3B%20v68%3D1747477773255%7C1747479574244%3B; s_sess=%20s_cpc%3D0%3B%20c21%3Dchin%2520poo%2520lee%3B%20e13%3Dchin%2520poo%2520lee%253A1%3B%20c13%3Drating-desc%3B%20s_ppvl%3Dpr%25253Apure%252520portal%25253Apublications%25253Aview%252C35%252C35%252C893%252C1274%252C893%252C1512%252C982%252C2%252CP%3B%20s_ppv%3Dpr%25253Apure%252520portal%25253Apublications%25253Aview%252C100%252C35%252C2559%252C1274%252C893%252C1512%252C982%252C2%252CP%3B%20e41%3D1%3B%20s_cc%3Dtrue%3B; _ga_D0L9JPJXFY=GS2.1.s1747900771$o6$g0$t1747900772$j0$l0$h0; CID=BgAAALyG+ymghw6DbQhG6KSkYZU=; PHPSESSID=q392hr54b3iabr7rajp0vs5p0k; TS013cc1fd=010f85e1d816b1696c78c64f1e299c8633d80747b48d24489bc1bb445973251e4d6b10e176d97b7e5cde5a52fc668cb838e1a21c027f81c891fd3ecbcedbe35f704df622e1"
        );

        const response = await axios
          .post("https://cors.ibuduan.com/https://entry.nottingham.edu.cn/result.php", params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              cookie: cookie.value,
              Origin: "http://entry.nottingham.edu.cn",
            },
          })
          .catch((error: Error) => {
            console.error(error);
            ElMessage.error(t("verify.requestFailed"));
          });

        // 关闭全屏加载
        const cpu = t("verify.invalidUsage");

        // 检查返回内容
        if (!response) {
          return;
        }
        const content = response.data;
        if (bcd.value != "2025 Computer") {
          console.log("版权校验失败");
          // 设置验证失败状态
          setVerificationPassed(false);
          ElMessage.error(cpu);
        }
        if (
          content &&
          typeof content === "string" &&
          content.includes("Congratulations!") &&
          content.includes("专业录取")
        ) {
          console.log("验证通过:", content);
          // 设置验证通过状态
          setVerificationPassed(true);
          ElMessage.success(t("verify.verifySuccess"));
          // 跳转到展示页面
          router.push("/show");
        } else {
          // 提示查询不到录取信息
          ElMessage.error(t("verify.verifyFailed"));
        }
      } catch (error) {
        console.error("请求失败:", error);
        ElMessage.error(t("verify.requestFailed"));
      } finally {
        // 关闭加载
        loadingInstance.close();
        loading.value = false;
      }
    }
  });
};

const copy = ref("© 2025 Computer Psycho Union, UNNC 宁诺计算机爱好者协会 All rights reserved.");
</script>

<template>
  <div class="verify-container">
    <el-card class="verify-card">
      <template #header>
        <div class="card-header">
          <el-text size="large" tag="b">{{ codeName }}</el-text>
          <el-text tag="b" type="primary">{{ t("verify.title") }}</el-text>
        </div>
      </template>

      <div class="content">
        <el-alert
          :title="t('verify.verifyIdentity')"
          :description="t('verify.description', { groupName: codeName })"
          :closable="true"
        />

        <div class="form-container">
          <!-- 宁诺老登? tooltip -->
          <div class="form-others">
            <el-text size="small" type="danger">
              {{ t("verify.warningText") }}
            </el-text>
            <el-tooltip
              v-if="unableToVerifyMessage"
              :content="unableToVerifyMessage"
              placement="top"
              effect="dark"
            >
              <el-button type="info" size="small" link style="margin-bottom: 10px">{{
                t("verify.unableToVerify")
              }}</el-button>
            </el-tooltip>
          </div>

          <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" status-icon>
            <el-form-item :label="t('verify.idNumber')" prop="userid">
              <el-input
                v-model="formData.userid"
                :placeholder="t('verify.idNumberPlaceholder')"
                maxlength="18"
                show-word-limit
              />
            </el-form-item>

            <el-form-item :label="t('verify.name')" prop="username">
              <el-input v-model="formData.username" :placeholder="t('verify.namePlaceholder')" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="loading" @click="submitForm" style="width: 100%">
                {{ t("verify.submitButton") }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <div id="copyright">
      <div class="copyright-text">
        <span>{{ copy }}</span>
      </div>
      <div class="repo-link">
        > {{ t("verify.openSourceText") }}
        <el-button type="primary" size="small" plain link @click="openExternalLink">
          CNB
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verify-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  flex-direction: column;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-container {
  margin-top: 20px;
  .form-others {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: baseline;
    /* 子元素居左 */
    text-align: left;
    align-items: flex-start;
    margin-bottom: 4px;
  }
}

#copyright {
  margin-top: 8px;
  font-size: var(--el-font-size-extra-small) !important;
  color: var(--el-text-color-secondary);
  text-align: center;
}
</style>
