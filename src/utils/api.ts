// API 工具函数
export class APIService {
  private static isDevelopment = import.meta.env.DEV

  /**
   * 发送验证请求
   * 开发环境使用代理，生产环境使用 iframe 方式
   */
  static async sendVerificationRequest(userid: string, username: string): Promise<string> {
    const params = new URLSearchParams()
    params.append('userid', userid)
    params.append('username', username)

    if (this.isDevelopment) {
      // 开发环境使用代理
      const response = await fetch('/api/result.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })
      return await response.text()
    } else {
      // 生产环境使用 iframe 方式
      return await this.sendIframeRequest('https://entry.nottingham.edu.cn/result.php', params)
    }
  }

  /**
   * 使用 iframe 发送跨域 POST 请求
   */
  private static sendIframeRequest(url: string, params: URLSearchParams): Promise<string> {
    return new Promise((resolve, reject) => {
      // 创建隐藏的 iframe
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.name = 'proxy_iframe_' + Date.now()
      document.body.appendChild(iframe)

      // 创建表单
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = url
      form.target = iframe.name

      // 添加表单字段
      params.forEach((value, key) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      })

      // 设置超时
      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error('请求超时'))
      }, 10000) // 10秒超时

      const cleanup = () => {
        clearTimeout(timeout)
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
        if (document.body.contains(form)) {
          document.body.removeChild(form)
        }
      }

      // 监听 iframe 加载完成
      iframe.onload = () => {
        try {
          // 尝试读取 iframe 内容
          const content = iframe.contentDocument?.body?.innerHTML || ''
          cleanup()
          resolve(content)
        } catch {
          // 如果无法读取内容（可能是跨域限制），假设请求成功
          cleanup()
          resolve('请求已发送，但无法读取响应内容')
        }
      }

      iframe.onerror = () => {
        cleanup()
        reject(new Error('请求失败'))
      }

      // 提交表单
      document.body.appendChild(form)
      form.submit()
    })
  }
}
