import { createRouter, createWebHistory } from 'vue-router'

// 用于验证页面跳转的状态管理
let verificationPassed = false

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'verify',
      component: () => import('@/views/verify.vue'),
    },
    {
      path: '/show',
      name: 'show',
      component: () => import('@/views/showCode.vue'),
      beforeEnter: (to, from, next) => {
        // 只允许从验证页面跳转
        if (verificationPassed && from.name === 'verify') {
          next()
        } else {
          next({ name: 'verify' })
        }
      }
    }
  ],
})

// 导出验证状态管理函数
export function setVerificationPassed(value: boolean) {
  verificationPassed = value
}

export default router
