<template>
  <div class="language-switcher">
    <el-dropdown @command="handleLanguageChange" placement="bottom-end">
      <el-button size="small" type="text" class="language-button">
        🌐
        <span class="language-text">{{ currentLanguageText }}</span>
        <span class="dropdown-icon">▼</span>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="zh-CN" :class="{ 'is-active': currentLocale === 'zh-CN' }">
            中文
          </el-dropdown-item>
          <el-dropdown-item command="en-US" :class="{ 'is-active': currentLocale === 'en-US' }">
            English (US)
          </el-dropdown-item>
          <el-dropdown-item command="en-UK" :class="{ 'is-active': currentLocale === 'en-UK' }">
            English (UK)
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { setLocale, getLocale } from "@/i18n";

const currentLocale = computed(() => getLocale());

const currentLanguageText = computed(() => {
  switch (currentLocale.value) {
    case "zh-CN":
      return "中文";
    case "en-US":
      return "English (US)";
    case "en-UK":
      return "English (UK)";
    default:
      return "中文";
  }
});

const handleLanguageChange = (locale: string) => {
  setLocale(locale);
};
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.language-button:hover {
  background: rgba(255, 255, 255, 1);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.language-text {
  font-size: 14px;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

:deep(.el-dropdown-menu__item.is-active) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .language-switcher {
    top: 10px;
    right: 10px;
  }

  .language-button {
    padding: 6px 10px;
  }

  .language-text {
    font-size: 12px;
  }
}
</style>
