# 第五课 · 三段侦察漫画

使用内置 imagegen 工具，以本课已有的勇士、小派、熊猫博士与恶魔素材为角色参考生成。图片不承担小字台词；逐格中文对话、问题和后续图表证据由课件呈现。

| 课件页面                            | 保存的漫画                                       | 最终生成提示词                         | 教学线索                                                      |
| ----------------------------------- | ------------------------------------------------ | -------------------------------------- | ------------------------------------------------------------- |
| 第 16 页 · 个头越大，跑得越慢？     | [height-speed-story.png](height-speed-story.png) | [提示词](height-speed-story-prompt.md) | 凭外形猜测 → 突然跑动 → 同时核对身高与速度 → 发现 D004 例外   |
| 第 20 页 · 同一只恶魔，一直这么快？ | [patrol-time-story.png](patrol-time-story.png)   | [提示词](patrol-time-story-prompt.md)  | 去路被挡 → 同一个体分时观测 → 折线核对变化 → 选择待复查的时段 |
| 第 23 页 · 哪一族通常跑得更快？     | [three-kinds-story.png](three-kinds-story.png)   | [提示词](three-kinds-story-prompt.md)  | 三路巡逻 → 一只不能代表全族 → 汇总每族记录 → 用均值比较追兵   |

每张为三格连续剧情，完整漫画与三段精简台词、思考问题同屏展示，每个气泡只保留一句台词和一个问题，支持额外放大；原猜想随翻页、刷新保留。所有数值结论由 `study-data.ts` 派生。

气泡头像直接复用已有角色图，以 SVG 视窗显示面部，不另生成图片：勇士使用 `lesson-01/assets/final-guardian-hero.png`，小派使用 `lesson-01/assets/xiaopai-guide.png`，熊猫博士使用 `lesson-04/assets/turtle-panda-helpers.png` 的右侧角色。
