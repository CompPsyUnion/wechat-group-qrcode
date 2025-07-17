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

    // 确保URL路径正确
    const url = 'http://cors.ibuduan.com/entry.nottingham.edu.cn/result.php'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          'Origin': 'https://entry.nottingham.edu.cn',
          'Host': 'entry.nottingham.edu.cn',
          'Pragma': 'no-cache',
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        },
        body: params,
        credentials: 'include' // 包含凭据
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