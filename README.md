# 我的课程

本地课程网站，目前包含：

- 课程主页
- `AI with Python` 课程详情
- 第一课《走进 AI 世界》
- 第三小节互动游戏《城堡守门人》（课堂共创 / 个人挑战）

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

也可以在终端中运行：

```bash
npm run dev
```

终端窗口需要在浏览课程期间保持打开。按 `Control + C` 可以停止网站。

## 验证

```bash
npm run build
```

站点没有账号、数据库或远程接口；阅读完成状态仅保存在当前浏览器中。
