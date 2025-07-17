// API 工具函数
export class APIService {
  /**
   * 发送验证请求
   * 直接使用fetch发送请求
   */
  static async sendVerificationRequest(userid: string, username: string): Promise<string> {
    const params = new URLSearchParams()
    params.append('userid', userid)
    params.append('username', username)

    const url = '/api/result.php'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params,
        mode: 'cors' // 允许跨域请求
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.text()
    } catch (error) {
      console.error('验证请求失败:', error)
      throw new Error('验证请求失败，请稍后重试')
    }
  }

}
