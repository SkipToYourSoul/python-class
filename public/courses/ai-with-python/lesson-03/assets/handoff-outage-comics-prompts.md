# 第三课交接漫画：从上次断网中获得启发

更新日期：2026-10-09。生成方式：内置 `image_gen.imagegen`，定向编辑已有漫画，保留角色、服装与主要场景。

## 当前剧情与素材

- 第一幕：读完电影资料，勇士想起先前电影卡住、网页因断网打不开的经历，决定把守城情报也存一份。素材：`handoff-outage-act-01.png`（2172×724）。
- 第二幕：换岗伙伴来取情报，屏幕有资料，交接文件夹仍为空。复用 `handoff-act-02.png`。
- 第三幕：回忆先前断网，准备把三条情报写进文件，供断网时查阅、下一班交接。素材：`handoff-outage-act-03.png`（2170×725，约 3:1）。新文件仍为空白，写入任务尚未完成。

回忆中的加载圈与断网图标表示第 3 页发生过的短暂断网；当前情报站没有再次断网。保存的是已经查到的情报，旧资料不能代表实时位置。

## 第一幕最终提示词

参考 1（编辑目标）：`handoff-act-01.png`。参考 2（回忆内容）：`movie-watch-act-02.png`。

```text
Use case: precise-object-edit / compositing.
Asset type: lesson 03 classroom story, act 1, two-panel 3:1 comic.
Image 1 is the exact edit target. Image 2 is a supporting visual reference ONLY for an earlier remembered network outage.
Make a modest narrative update to IMAGE 1. In its LEFT panel the same brown-haired young armored hero now looks thoughtful, remembering the earlier time his movie stopped when the internet briefly went out. Add one clearly soft-edged MEMORY INSET in the upper-left/upper-middle background of the LEFT panel, using the cinema scene from the RIGHT half of IMAGE 2: the sailing-ship movie frozen with a circular loading spinner and laptop with a red crossed-out Wi-Fi symbol. The inset should occupy about 25% of the left panel and have two small soft thought dots linking it to the hero; clearly a remembered scene, not an ongoing outage in the current room. Keep the hero and yellow two-eyed goggled Xiaopai in the same foreground positions, complete faces visible, with a thoughtful expression instead of celebration. Preserve the movie-information monitor and the librarian in the current left scene, adjust background only as needed to fit the small memory.
Preserve the entire RIGHT panel exactly: hero and Xiaopai walking out of the film library toward the castle corridor, librarian sorting saved movie files behind them. No current network problem, no battle, no extra main characters. Preserve original identities, costumes, poses except the left hero expression, warm anime storybook linework, lighting, two equal landscape panels and thin cream gutter.
Keep full canvas 2172×724 or equivalent exact 3:1 aspect ratio, no cropping or stretching. No words, letters, speech text, captions, watermark, or fake writing. The only new bubble is a pictorial MEMORY inset, not a dialogue bubble.
```

默认生成文件：`/Users/liye/.codex/generated_images/01a11f66-033a-72a1-a4ce-c8046958065e/exec-bd6c3fc2-1bac-4ead-9dda-a8fda100c842.png`。成品已复制到当前目录。

## 第三幕最终提示词

参考 1（编辑目标）：`handoff-act-03.png`。参考 2（回忆内容）：`movie-watch-act-02.png`。

```text
Use case: precise-object-edit / compositing.
Asset type: lesson 03 classroom story, act 3, two-panel 3:1 comic.
IMAGE 1 is the exact edit target. IMAGE 2 supplies remembered cinema outage imagery only.
Change ONLY the contents of the existing soft-edged MEMORY INSET in the top center of the LEFT panel of IMAGE 1. Replace the librarian and saved-movie-folder scene INSIDE that inset with a miniature recollection of the RIGHT cinema panel of IMAGE 2: sailing-ship movie stopped with its circular loading spinner, laptop displaying a red crossed-out Wi-Fi symbol and an unavailable webpage, tiny worried versions of the same hero and Xiaopai if space permits. Make the memory visually clear at projection size; prioritise the loading spinner and crossed Wi-Fi. Keep exactly the existing soft inset border, size and location. This depicts the earlier brief network outage that inspires saving city-defense intelligence now, not a new present-day outage.
Keep absolutely EVERYTHING outside the inset identical to IMAGE 1: all main character faces, body positions, hair, gloves, armor, blue/gold clothing, Xiaopai raising one finger, adult next-shift warrior, all castle architecture, lamps, books, sunset, thin cream central gutter, right-hand computer, three specific creature thumbnails and output bars. Especially preserve the BLANK new-document window with a folded-corner PAGE icon on the RIGHT side of the monitor, no completed report or success badge. Hero is preparing to save existing intelligence; task is not already finished.
Exact 2172×724 or equivalent 3:1 canvas, same two equal panels. No text, letters, subtitles, watermark or new visual overlays outside the existing inset.
```

默认生成文件：`/Users/liye/.codex/generated_images/01a11f66-033a-72a1-a4ce-c8046958065e/exec-32d87591-2820-4d45-858c-89d97f0864ae.png`。成品已复制到当前目录。

## 素材检查

实际查看两张成品：第一幕勇士思考并回忆电影断网，第三幕将原有管理员回忆替换为断网回忆；加载圈、红色断网标记可见。两格布局、人物身份与衣装保持一致，第三幕右侧的情报缩略图与空白文件保留，无对白文字、水印或完成标记。
