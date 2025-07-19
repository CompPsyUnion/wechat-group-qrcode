<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import LanguageSwitcher from "./components/LanguageSwitcher.vue";
</script>

<template>
  <el-config-provider>
    <div class="app-container">
      <LanguageSwitcher />
      <router-view />
    </div>
  </el-config-provider>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.app-container {
  height: 100vh;
  width: 100vw;
}
</style>
