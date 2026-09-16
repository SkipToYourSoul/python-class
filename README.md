# 我的课程

本地课程网站，目前包含：

- 课程主页
- `AI with Python` 课程详情
- 第一课《走进 AI 世界》及《城堡守门人》互动游戏
- 第二课《敌情动态早知道》（32页）及《城堡情报官》挑战
- 前线侦察教学网页与配套 Python / JupyterLab 练习包

## 在另一台电脑继续开发

安装 Node.js 22.13 或更高版本与 Git，然后执行：

```bash
git clone https://github.com/SkipToYourSoul/python-class.git
cd python-class
npm ci
npm run dev
```

打开终端显示的本地地址。后续同步代码前先提交本地修改，再运行 `git pull --ff-only`；依赖锁文件变化后重新运行 `npm ci`。

仓库保留课程源码、图片和视频、教学样本与练习包、构建配置、依赖锁文件和当前开发规范。依赖目录、构建产物、缓存、环境变量、生成草稿、历史评审和发布压缩包由 `.gitignore` 排除。`.openai/hosting.json` 是 Vite 必需的非敏感配置，需一并保留；本地开发无需设置站点账号或密钥。

## 可选源码包

需要 ZIP 交付时，运行 `python3 scripts/package-source.py` 生成 `release/ai-with-python-source.zip`（不提交到 Git）。解压后先运行 `npm ci` 安装依赖，再运行 `npm run build` 验证构建。迁移和部署细节见 [部署与打包说明](部署与打包说明.md)。

## 本地打开

需要先安装 Node.js 22.13 或更高版本。

在 macOS 上，双击项目根目录中的 `启动课程网站.command`。浏览器会自动打开：

```text
http://localhost:3000
```

小游戏也可以直接打开：

```text
http://localhost:3000/courses/ai-with-python/lesson-01/castle-guardian
```

第二课入口：

```text
http://localhost:3000/courses/ai-with-python/lesson-02
```

教学样本：`http://localhost:3000/scout.html`。第二课练习包位于 `public/courses/ai-with-python/lesson-02/practice/lesson-02-practice.zip`，包含 Notebook、Python 脚本和保存的 HTML 样本。

也可以在终端中运行：

```bash
npm run dev
```

终端窗口需要在浏览课程期间保持打开。按 `Control + C` 可以停止网站。

## 验证

```bash
npm run build
npm run lint
```

第二课挑战逻辑可运行 `node --experimental-strip-types scripts/test-lesson02-challenge-engine.mjs` 检查。教学样本测试 `python3 scripts/test-lesson02-challenge.py` 需要 Node.js 22.18 或更高版本，以及 Python 3 和 `beautifulsoup4`。

站点没有账号、数据库或远程接口；阅读完成状态仅保存在当前浏览器中。
