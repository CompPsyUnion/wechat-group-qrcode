# 微信群二维码展示器 / WeChat Group QR Code Display Tool

自古以来，UNNCer 苦代写、中介久矣。故研制出此群二维码展示工具，需先验证录取，后展示其码。  
说人话：防\*\*代写的群二维码展示工具。

Since ancient times, UNNCers have been troubled by ghostwriting and intermediary services. Therefore, this group QR code display tool has been developed, which requires admission verification before displaying the code.  
In plain language: A group QR code display tool to prevent \*\* ghostwriting services.

- 此工具默认视为被使用者无前端开发、网络安全等相关知识，不会使用 Chrome Devtool 等浏览器调试工具。 且无法防御转发二维码的行为。
- This tool assumes that users have no knowledge of frontend development, network security, etc., and will not use browser debugging tools like Chrome DevTools. It also cannot prevent QR code forwarding behavior.

实在没办法，本来想搞个机器人验证后拉人进群，耐不过微信机器人是违规操作，主包没那么多微信被微信团队封，所以只能出此下策。社团又没资质注册高端大气上档次的企业微信。

There's really no choice. Originally wanted to create a bot for verification and then invite people to the group, but WeChat bots are against the rules, and we don't have enough WeChat accounts to risk being banned by the WeChat team, so we have to resort to this measure. The association also doesn't have the qualifications to register for high-end enterprise WeChat.

## 新功能 / New Features

### 🌐 多语言支持 / Multi-language Support

- 支持中文、美式英语和英式英语切换 / Supports switching between Chinese, American English, and British English
- 右上角语言切换按钮 / Language switch button in the top right corner
- 所有文本都支持国际化 / All text supports internationalization
- 默认使用中文，用户可随时切换 / Defaults to Chinese, users can switch anytime

### 🎨 语言切换功能 / Language Switching Features

- 实时切换无需刷新页面 / Real-time switching without page refresh
- 用户选择的语言会被保存到本地存储 / User's language choice is saved to local storage
- 响应式设计，支持移动端 / Responsive design, mobile-friendly
- 三种语言选项：中文、English (US)、English (UK) / Three language options: Chinese, English (US), English (UK)

## 原理 / Principle

iframe 嵌套`entry.nottingham.edu.cn`，用户输入信息验证后判断是否已录取，出现录取情况后判断是否展示群二维码。  
不支持邮箱验证，主包没钱懒得写后端，而且大一小豆包们还没有学校邮箱。
