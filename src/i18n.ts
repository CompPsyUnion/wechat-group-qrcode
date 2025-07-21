import { createI18n } from "vue-i18n";
import zhCN from "./locales/zh-CN.jsonc";
import enUS from "./locales/en-US.jsonc";
import enUK from "./locales/en-UK.jsonc";

// 获取用户首选语言
function getDefaultLocale(): string {
  // 尝试从localStorage获取用户之前的选择
  const savedLocale = localStorage.getItem("locale");
  if (
    savedLocale &&
    (savedLocale === "zh-CN" || savedLocale === "en-US" || savedLocale === "en-UK")
  ) {
    return savedLocale;
  }

  // 默认使用中文
  return "zh-CN";
}

export const SUPPORT_LOCALES = ["zh-CN", "en-US", "en-UK"];

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: "zh-CN",
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
    "en-UK": enUK,
  },
  globalInjection: true,
});

// 切换语言的工具函数
export function setLocale(locale: string) {
  if (SUPPORT_LOCALES.includes(locale)) {
    i18n.global.locale.value = locale as "zh-CN" | "en-US" | "en-UK";
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
  }
}

// 获取当前语言
export function getLocale(): string {
  return i18n.global.locale.value;
}
