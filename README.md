# 雅思词汇消消乐 (IELTS Dungeon)

一个基于 Next.js 和 Tailwind CSS 构建的雅思词汇学习小工具，采用类似多邻国 (Duolingo) 的连线消消乐交互模式，让背单词变得更轻松有趣。

## 🌟 核心功能

- **双模式学习**：
  - **雅思词汇模式**：英文单词与中文释义配对。
  - **雅思短语同义替换模式**：英文短语与同义英文短语配对（雅思阅读/听力核心考点）。
- **游戏化交互**：
  - 面板始终保持 6 对词汇，配对成功后自动补充新词汇。
  - 成功配对显示绿色反馈并平滑消失。
  - 错误配对显示红色反馈并伴随抖动动画。
- **语音朗读**：点击英文单词或短语时，自动调用浏览器原生 TTS (Text-to-Speech) 播放纯正美式发音。
- **阶段性进度**：内置 300 个核心词汇和 300 组同义替换短语，每 50 个为一阶段，共 6 个阶段，循序渐进。

## 🚀 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/)
- **语言**: TypeScript

## 📦 本地运行

1. 克隆项目到本地：
```bash
git clone https://github.com/Likeve/IELTS-Dungeon.git
cd IELTS-Dungeon
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可体验。

## 📁 目录结构

- `src/components/MatchingGame.tsx` - 核心游戏组件逻辑与 UI
- `src/data/ieltsWords.ts` - 300 个雅思核心词汇数据
- `src/data/ieltsPhrases.ts` - 300 组雅思短语同义替换数据
- `src/app/page.tsx` - 主页面入口

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来扩充词汇库或优化交互体验！
