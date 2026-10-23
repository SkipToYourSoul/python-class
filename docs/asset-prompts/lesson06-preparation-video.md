# 第六课练习一：战前准备角色短片

状态：Wan3.0样片已完成，经过逐段查看后接入第12页，替换原分层动效。已下载并保存为 `public/courses/ai-with-python/lesson-06/assets/preparation-wan3-v1.mp4`，实际832×1108、约12.028秒。保留手动播放、暂停、重播、拖动及循环，课件强制静音。两轮生成共扣2积分，平台余额15。

目标：用连续的角色表演自然表达“接过卷轴 → 展开情报 → 对照地图部署”，不是图片缩放、位移或关键帧淡入淡出的替代效果。建议约12秒；实际时长、镜头拆分以连接后的视频模型能力为准。

## 视觉与分镜

沿用 `public/courses/ai-with-python/lesson-06/assets/prep-room-v1.png` 的年轻棕发勇士、银金铠甲、蓝围巾、黄色护目镜助手和暖色城堡作战室。猫头鹰造型参考 `prep-owl-v1.png`，卷轴参考 `prep-scroll-v1.png`。画面4:5竖构图，主要动作在中间与中下区域，上方标题、下方播放器控制留安全空间。真实体积感的动画电影质感，保持角色、服装和空间连续；不改成真人演员。

| 时间   | 角色动作                                                             | 连续性重点                                         |
| ------ | -------------------------------------------------------------------- | -------------------------------------------------- |
| 0–3秒  | 猫头鹰低速飞近；勇士目光追随，抬手接稳卷轴。                         | 卷轴从爪子到掌心只有一个实体，手指真实抓握。       |
| 3–6秒  | 勇士收回前臂，另一只手扶住卷轴，解开束带并在桌上展开。               | 肩、肘、腕协调运动，羊皮纸从卷曲到平展有自然回弹。 |
| 6–9秒  | 勇士低头阅读，视线从情报移动到桌上三塔地图，将情报放在地图旁。       | 保持同一桌面位置与道具尺寸，小派凑近查看。         |
| 9–12秒 | 勇士用手指顺着地图路线查看三处塔标记，小派点头；勇士抬眼作备战思考。 | 人物持续呼吸、眨眼、微小视线变化，末尾轻缓停留。   |

先以固定中景单镜头保证动作连贯。可用隐藏剪辑将结尾柔和接回起始待接信姿态；若视频模型不能稳定生成闭环，播放器端采用短暂交叠淡化，不倒放角色动作。不要承诺完全无缝，需逐帧核验接触、展开和首尾衔接。

## 英文生成指令

> Use the provided war-room reference as the exact character and environment reference. A polished, dimensional animated-film scene in a warm medieval castle intelligence room, portrait 4:5. One continuous locked medium shot, natural character acting rather than a moving illustration. The same young brown-haired knight in silver and gold armor with a royal-blue scarf sits at the table, with his small yellow goggle-wearing assistant beside a laptop. A white-and-gold mechanical owl delivers a small rolled parchment. The knight tracks it with his eyes, raises his gloved hand, firmly receives the single scroll, then brings his forearm inward while his other hand supports the scroll. He removes the ribbon, unrolls the flexible parchment across the table using both hands, leans down to read, places it beside the existing map of three magical towers, then traces a route between three tower symbols with one finger. The assistant leans closer and nods. End with the knight calmly considering the map, subtle breathing and blinking, quiet preparation for an upcoming battle. Smooth physically coherent shoulder, elbow, wrist and finger motion, consistent hand-object contact, stable face, armor and room geometry, natural paper curl and contact shadows. Keep the main acting in the middle of the frame and room for interface overlays above and below. No camera zoom or panning, no slideshow transitions, no duplicated scrolls or hands, no floating props, no extra fingers, no morphing faces, no subtitles, no generated text, no combat. No dialogue or music needed. Make the ending calm enough to transition gently into the opening waiting pose for repeat playback.

## 制作与接入检查

- 连接视频生成账号后先检查支持的模型、时长、输入格式与额度；有实际消费金额或额度要求时按工具规则处理。
- 使用已确认的角色参考生成，检查接卷轴、双手展开、视线移动和指地图四处动作；质量不足不直接替换现有画面。
- 合格视频优先保存为本地可用媒体文件并接入同一左侧区域，保持右侧完整代码。
- 循环由教师开启；保留播放、暂停、进度拖动、重播，离页停止、刷新暂停、减少动态效果。
- 在1280×720、1366×768、1920×1080实测，控制条不遮挡手部和地图。

## Redvision画布样片参数

- 项目：`https://cowork.xiaohongshu.com/s/bodun666/projects/project_1792576187386_aae6f3`（课程视频制作）。
- 上传的参考图：`prep-room-v1.png`、`prep-owl-v1.png`，均已获得具体文件与目的地授权；两个图片节点连接到同一个视频生成节点。
- 模式：全能参考。当前模型：Wan3.0。12秒、720p、3:4、1个候选。提示词要求无配乐、对白或旁白。
- 图片1提供勇士、小派、作战室、地图的一致性；图片2只提供猫头鹰造型，忽略透明背景。
- 节点：`node_588f559e-8c4e-45f0-ac1f-82ef3c79b64a`。
- 提交时间：2026-10-21 18:10:54（北京时间）。
- 运行轮次：`run_1792577454813_a433ce`；内部任务：`job_1792577454814_ec1a2f`。
- 画布显示单次1积分，提交后余额16积分；不使用“创意”入口的60积分设置。
- 提交后详情显示供应商状态`running`，预计8–10分钟。
- 已保存状态截图：`design-reviews/lesson06-2026-10-21/redvision-canvas-generating.png`。

### 生成结果与续作

- Seedance2.0首轮失败。供应商错误码：`OutputVideoSensitiveContentDetected.PolicyViolation`，原文说明输出视频可能涉及版权限制；未指出具体角色或画面。保留失败记录，不将笼统页面提示误认作暴力或其他原因。
- 用户明确要求换成Wan3.0后，保持两张参考和动作提示词，重新提交1个候选。
- Wan3.0提交时间：2026-10-21 18:17:35（北京时间）。轮次：`run_1792577855301_e73ea4`；任务：`job_1792577855302_6a1ecf`。
- 第二轮仍显示1积分，提交后余额15积分；预计1–5分钟。截图：`design-reviews/lesson06-2026-10-21/redvision-wan3-generating.png`。
- 等待阶段曾显示99%，状态截图：`design-reviews/lesson06-2026-10-21/redvision-wan3-current.png`。
- 最终生成成功，平台记录生成耗时09:35。已查看约2、4、6、8、11秒画面，猫头鹰交付、双手展开、低头阅读、指地图的动作与视线连贯，无明显多手或道具瞬移，适合作为练习背景。结尾与起点姿态不同，循环会切回等待接信，不是无缝闭环。
- 平台实际请求包含原生音频；课件始终使用 `muted`，不播放生成音轨。仅从页面指定的下载按钮取回视频，课件不依赖签名URL或平台登录。

### 本次实际提交的中文提示词

图片1用于勇士、小派、作战室与桌面地图的角色和环境一致性；图片2仅用于机械猫头鹰造型，忽略图片2的透明背景。12秒，3:4竖幅，固定中景单镜头，精致立体动画电影质感。必须是人物自然连续表演，不能只是静态图片位移或镜头推拉。

0—3秒：猫头鹰抓着一卷小羊皮纸从左侧飞近，勇士目光追随，抬起戴手套的手接稳卷轴，猫头鹰松爪飞到旁边。

3—6秒：勇士自然收回前臂，用另一只手扶住卷轴，解开束带，双手将情报在桌上缓缓展开；纸张有真实卷曲、回弹与接触阴影。

6—9秒：勇士低头仔细阅读，把情报放在三塔地图旁，小派凑近查看。

9—12秒：勇士用一根手指顺着地图路线依次查看三个塔标记，再抬眼思考，小派点头。末尾安静停留，方便循环衔接。

肩、肘、腕和手指协调运动，卷轴始终只有一个，手与纸张接触稳定；角色自然呼吸、眨眼，视线随动作变化。保持脸部、铠甲、服装、道具和空间一致。无字幕、文字、额外手指、额外手臂、道具漂浮、物体瞬移、脸部变形、转场或战斗。无配乐、对白或旁白。
