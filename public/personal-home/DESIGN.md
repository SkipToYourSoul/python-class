# 伯顿个人主页内容原型

本目录保存用户初步设计的内容与真实素材。`index.html` 是内容原型，不作为站点主入口；正式个人主页位于根路由 `/`，由 `app/page.tsx` 实现。视觉与交互以用户提供的视频「个人主页设计参考.mp4」及当前明确要求为准，原型旧样式不构成约束。

## 正式页面方向

白色背景、居中竖版纸张海报、三章荧光色、底部波形刻度尺与揉纸展开转场。左上为「伯顿 Burton」「Builder」及三行介绍：「正在营业的 AI 教练」「工作日是小红书的大龄程序员」「周末是小学生的 AI 编程老师」；右上为「小红书主页」与「我的课程」入口。「Builder」保留粗手写字，颜色跟随当前海报主色，浅绿色需保证在白底上的可读性。

操作箭头统一使用 SVG，覆盖右上入口、唱片把手和课程操作，避免 iPhone 将箭头字符显示为 emoji。移动端使用动态视口高度与安全区，身份、三行介绍、海报、刻度尺、章节标签及全部操作须在一个实际可视屏幕内完整显示；按空间调整比例与间距，保留全部信息和操作。

保留点击海报非照片／课程按钮区域切下一章，以及拖动、章节按钮、键盘和触屏切换，并尊重减少动态效果设置；不自动播放，不保留底部播放控件或快捷链接。照片叠放，点开当前章画廊，提供完整大图、全部缩略图、上下张、计数与说明，支持左右键、触屏横滑、明确放大入口、双击／双点放大、双指／滚轮／按钮缩放、拖动与适应屏幕。Escape 先退放大，再关闭画廊，返回原照片和焦点。入口要求见 [首页与课程目录规范](../../docs/COURSE_ENTRY_SPEC.md)。

## 三章内容

1. **WIN · 获奖经历**：RED WORLD、小红书首届全员 Builder 黑客松金奖、「用 36 小时，造一个世界」、36h Solo Coding、24h Demo Day、50万元奖金与现场照片。
2. **TEACH · 教学经历**：小红书校招官方 Vibe Coding 课程讲师、「两节课，让想法成为作品」、2 节课、2 期内容、单期点赞 1670+、Builder 天团直播；共 4 图，课程封面为首图，其后为讲师介绍、PK 海报与新增天团合影。
3. **REFINE · 课程内容**：AI with Python、适合小学生的 12 节 AI 编程实战课；认识 Python 能做什么，借助 AI 把自己的想法做成编程作品。IITC 工信人才认证为讲师个人资质；共 6 图，以秋季班结课合影为首图，保留课程定位、证书及其余课堂／学生作品照片，不重复使用第二章课程封面。

个人主页右上和第三章海报内课程入口统一指向 `/python`；海报内按钮为「进入学习路线」。本目录的 `courses/ai-with-python/index.html` 是历史原型占位页，不能作为正式课程入口。

## 素材

- 获奖：`redworld-award-screen.jpg`、`redworld-coding-36h.jpg`、`redworld-ceremony.jpg`。
- 教学：`instructor-burton.png`、`vibe-coding-course-cover.png`、`builder-pk-poster.png`、`builder-team-live.jpg`。
- 课程：`courses/ai-with-python/course-position.png`、`iitc-certificate.jpg`、`python-class-graduation-01.jpg`、`python-student-project.jpg`、`python-class-graduation-02.jpg`、`python-class-graduation-03.jpg`。
