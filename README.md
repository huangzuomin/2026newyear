# 元旦 · 我的2026开场卡 (New Year Card 2026)

这是一个基于 Next.js 14 App Router 实现的模板化创意卡生成工具。

## 功能特点
- **模板主导**：提供三种风格迥异的 2026 开场卡模板（状态卡、交接卡、角色卡）。
- **AI 变体增强**：集成 SiliconFlow (DeepSeek) AI 能力，自动生成 3 种不同语气的创意文案。
- **实时预览**：表单驱动，所见即所得。
- **高清导出**：统一缩放因子，支持 1080x1920 超清 PNG 导出。
- **状态持久化**：支持 URL 参数恢复（包括样式和 AI 文案），分享链接即刻复现 100% 同款。
- **移动优先**：完美的 9:16 卡片比例，适配微信及各主流移动浏览器。

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```
打开 [http://localhost:3000](http://localhost:3000) 即可访问。

### 3. 构建与部署
```bash
npm run build
npm run start
```
可以轻松部署到 Vercel 或 Cloudflare Pages。

## 如何新增功能

### 新增模板
1. 在 `src/config/templates.ts` 中添加新的模板定义（ID、名称、字段）。
2. 在 `src/components/CardRenderer.tsx` 的 `renderContent` 中编写对应的视觉渲染逻辑。

### 更新母题库
- 修改 `src/config/topics.json` 中的内容。

### 新增视觉风格
- 在 `src/config/elements.ts` 的 `STYLE_MAP` 中新增配色方案和装饰规则。

## URL 参数说明
系统支持通过 Query String 传递参数，例如：
`/create/T01?topic_id=05&tone=calm&signature=Antigravity`
访问此 URL 将自动填充表单并生成预览。

## 技术栈
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Utils**: html-to-image, qrcode, lucide-react
