# 第二节 STORY 三幕漫画生成记录

生成方式：内置 image_gen.imagegen，参考图生成与宽幅重新构图；未使用 CLI/API。

最终素材：handoff-act-01.png、handoff-act-02.png、handoff-act-03.png，均为 2172×724（3:1）。每幅左右两格、无文字，网页同步呈现中文对话。最终素材只用于课程漫画；旧 2:1 中间稿保留在默认生成目录，不在课程目录重复保存。

角色参考：archive-room.png、movie-archive.png；movie-act-03.png 为电影馆管理员、勇士、小派的系列定稿；夜班勇士采用 handoff-act-02 的短深棕发、轻胡茬、蓝披风金城堡图案及银金肩甲。

## 最终提示词 01：电影档案帮了大忙

Create a classroom-friendly, warm storybook anime illustration, exactly 3:1 very wide landscape canvas. Two equal landscape panels side by side, narrow cream divider. Use the supplied illustration as the visual reference for the same friendly brown-haired blue-cloaked castle adventurer, small yellow goggled companion wearing blue overalls, and smiling librarian with round glasses and brown hair bun. Left panel: the adventurer and companion happily find a saved movie page on a desktop computer in the castle film library, while librarian smiles. Computer screen shows a landscape thumbnail and plain solid bars, no writing. Right panel: the adventurer and companion walk out through library door after completing their task. Behind them the librarian organizes computer movie files shown as simple folder icons and landscape thumbnails. Preserve beautiful detailed watercolor-like anime rendering and warm golden stone interior. Compose horizontally so every face and complete computer screen fits. No words, no speech bubbles, no subtitles, no watermark. Use full 3:1 composition, exactly two equal panels.

参考：初版 handoff-act-01（见下方原始提示词），默认文件 exec-57d3fcfe-5b28-406e-94f9-b405159d2d51.png。
输出：exec-8b0b5d13-e49f-45a2-99bf-0b8991d446a3.png。

## 最终提示词 02：换岗了，情报怎么交接

Use case: illustration-story. Recompose this exact TWO-panel comic reference into an EXTREMELY WIDE 3:1 image, target 2172×724 or equivalent 3:1 ratio. Exactly two equal 3:2 landscape panels, thin cream central gutter. Preserve all character identities, costumes, warm hand-drawn anime storybook quality and narrative. Wider horizontal compositions, no stretching, reduce floor/ceiling. LEFT: sunset castle corridor, a shift-change bell visible above, adult short-dark-haired armored night-shift warrior asks brown-haired teen hero and yellow TWO-eyed goggled blue-overalls Xiaopai for handoff information; adult gestures open hand, hero attentive. RIGHT: hero scratches his head beside clear large desktop computer; adult looks puzzled, Xiaopai watches. Monitor has one window with three demon thumbnails red horned/green vine/blue ice plus abstract horizontal output bars, another visibly EMPTY file manager window with outlined FOLDER pictogram; no separate handoff file yet. Clearly digital data displayed but not saved as handoff record; nothing lost/destroyed, no successful handoff. All faces and the complete monitor fully visible centrally. NO text, letters, numbers, fake writing, subtitles, speech bubbles, watermark, logos, or physical notebook. Entire canvas exactly 3:1, not 2:1.
Additional identity lock: reference 2 movie-act-03 is the final canonical boy hero and yellow goggled Xiaopai; copy their exact face, hair, eyes, gloves, blue clothing, golden castle emblem and silver/gold armor. Adult night warrior from reference 1 MUST keep short dark-brown hair, subtle facial stubble, blue cloak with gold castle motif and silver/gold shoulder armor. Do not confuse adult with teen. Demons are tiny orange-red fire horned beast, green vine armored beast, blue ice winged beast.

参考：初版 handoff-act-02（exec-e4624eab-b1a8-460f-96b3-60f5b7d8e4dd.png）及 movie-act-03.png。
输出：exec-bb86b1a1-0262-4e73-880c-55254ec0221c.png。

## 最终提示词 03：把电影馆的办法用起来

Use case: illustration-story. Recompose this exact TWO-panel comic reference into an EXTREMELY WIDE 3:1 image, target 2172×724 or equivalent 3:1 ratio. Exactly two equal 3:2 landscape panels, thin cream central gutter. Maintain all identities, costumes, rich warm hand-drawn anime castle artwork and story beats. Pull camera wider, use horizontal staging, no vertical stretching. LEFT: brown-haired teen armored hero and yellow TWO-eyed goggled blue-overalls Xiaopai realize they can use the movie-file method; Xiaopai raises a finger, hero bright expression. Small soft-edged MEMORY INSET above or beside them showing movie-library computer with stored folder/movie thumbnails, and familiar female librarian with brown bun, glasses, navy robe. Inset small enough to keep all main faces visible. RIGHT: hero and Xiaopai at keyboard ready to create handoff record, adult dark-short-haired armored night warrior waits optimistically. On computer: demon thumbnails with simple output bars in one window; the second NEW DOCUMENT window is blank and shows a single simple PAGE shaped outline icon with folded upper corner (NOT a folder icon). Task remains incomplete, no checkmark, no completed report, no victory. All faces and whole screen fully visible and centered, hands on keyboard visible. NO letters, text, numbers, fake writing, subtitles, speech bubbles, logos, watermark or quill/paper diary. Entire finished canvas exactly 3:1, not 2:1.
Input role: image1 is story composition draft; image2 movie-act-03 is final identity lock for the boy, yellow companion and female librarian; image3 handoff-act-02 is exact final identity for adult warrior, short dark-brown hair, light chin stubble, blue cloak gold castle motif, silver/gold shoulder plates. Maintain identity absolutely across all panels. Tiny demons on screen orange-red horned fire beast, green vine armored beast, icy-blue winged beast.

参考：初版第三幕（exec-def59a7b-e5ff-46e4-bcd0-02b1670e7f03.png）、movie-act-03.png、最终 handoff-act-02.png。
输出：exec-ec3c19a2-2b9b-4214-8bbb-5e10f9107b9d.png。

所有生成结果默认目录：/Users/liye/.codex/generated_images/01a0c820-d616-7190-8835-563aee62f63f/

## 初版 2:1 提示词记录

### 第一幕

Use case: illustration-story.
Create a NEW classroom comic asset, act 1 of a continuous story. Use the two reference images ONLY for consistent character appearance and warm hand-drawn anime storybook art, detailed castle interiors, navy blue and antique gold palette. Wide landscape 2:1 aspect ratio, exactly two equal-width panels side by side separated by a thin cream vertical gutter. Not a montage of more panels. No visible writing, text, letters, numbers, subtitles, speech bubbles, watermark, or logo anywhere.
Characters: same friendly teenage boy hero with tousled brown hair, blue cloak and silver-and-gold armor from reference 1; his companion Xiaopai is the small yellow TWO-eyed goggled character in blue denim overalls from reference 1 (the blue-and-gold mechanical owl is a DIFFERENT character and is absent here). Same female librarian from reference 2: brown hair in a bun, round glasses, navy robe.
LEFT panel: in the castle film archive room, hero and Xiaopai sit beside a clearly modern desktop computer on a wood desk. The monitor displays a movie information page with one landscape movie thumbnail and a few simple solid rectangular content placeholder bars only, absolutely no fake writing. They smile, relieved and delighted at successfully finding saved movie information; librarian beside desk nods approvingly. Reels and castle film screen in background establish film room.
RIGHT panel: the hero and Xiaopai walk away through the open film archive doorway toward castle corridor, smiling as they leave after finishing their movie task. Through the doorway behind them, the librarian is seated at her desktop computer sorting saved movie files: screen has a small clear grid of folder icons and movie thumbnail icons without writing. No physical ledger in foreground, no intelligence/demons yet.
Composition: medium-wide eye-level shots, put faces and key computer objects in center of each panel, keep top and bottom 10% as noncritical background for crop safety. Classroom-readable expressive gestures, complete coherent scenes, warm cheerful afternoon light. Match quality, linework, clothing and identities of references. This is a digitally stored film archive, computer files are the learning bridge.

### 第二幕

Use case: illustration-story.
Create a NEW classroom comic asset, act 2 of a continuous story. Use attached references for consistent teenage brown-haired hero, Xiaopai, and warm hand-drawn anime castle storybook art. Wide landscape 2:1, exactly two equal-width panels side by side separated by a thin cream vertical gutter. No writing, text, letters, numbers, subtitles, speech bubbles, watermark or logos.
Characters: youthful brown tousled-haired hero with blue cloak and silver-gold armor; small yellow TWO-eyed silver-goggled companion Xiaopai with blue denim overalls. Introduce one night-shift warrior, clearly an adult man, short dark-brown hair, similar silver armor and navy blue scarf/cloak; distinguish mature face and shorter darker hair from teenage hero. Do NOT replace Xiaopai with the mechanical owl.
LEFT panel: golden sunset castle corridor with a hanging shift-change bell above and behind characters. The adult night-shift warrior has just hurried over to the hero and Xiaopai, holding open a hand as he asks for their intelligence. Hero pauses to listen. Warm sunset through arch windows communicates end of day.
RIGHT panel: at a castle intelligence desk, show a readable modern desktop monitor in three-quarter view, hero scratching the back of his head sheepishly, adult warrior beside him with questioning expression and open hand, Xiaopai attentively looking at monitor. Two software windows on monitor: one shows three simple colorful demon thumbnails (red horned beast, green vine-armored beast, pale-blue ice-winged beast) with a few plain solid horizontal output bars below them; a separate file-manager window is EMPTY with large outlined folder pictogram and blank pale area. These are icons/shapes, no fake text. This contrast clearly conveys information is currently displayed but no separate handoff file has been saved. Keep monitor moderately large and the two states easy to distinguish.
Must NOT imply data already lost or destroyed: no shattered screen, erased information, fire, crumpled paper or successful transfer. No physical notebook substitutes. Center faces and monitor in panels; reserve top/bottom 10% for background crop safety. Suspense is a small practical problem, not horror.
Projection framing constraint: the whole image will appear in a very wide classroom image region, so ALL faces and the whole important monitor display must fall within the central 60% of the total image height (20%-80% vertically). Pull camera back slightly to preserve all story evidence in this central strip, with only architecture and desk edge in upper and lower bands.

### 第三幕

Use case: illustration-story.
Create a NEW classroom comic asset, act 3 of a continuous story. Follow attached references for the teenage hero, yellow Xiaopai, and rich warm hand-drawn anime castle storybook appearance. Wide landscape 2:1, exactly two equal-width main panels separated by thin cream gutter. No writing, letters, numbers, text, subtitles, speech bubbles, watermark or logos.
Characters: teenage boy hero with tousled brown hair, blue cloak, silver-and-gold armor; Xiaopai small yellow TWO-eyed silver-goggled partner in blue denim overalls. Adult night-shift warrior with short dark brown hair and silver armor plus dark blue scarf.
LEFT main panel: beside castle intelligence desk, hero and Xiaopai have a shared moment of realization; hero's eyes brighten and Xiaopai lifts one small finger with an idea. Above and behind them a small soft-edged MEMORY INSET, not a speech bubble, depicts the earlier film archive computer with saved movie folder icon and movie thumbnail, and a tiny glimpse of the round-glasses female librarian with brown bun and navy robe. Visually link the successful stored movie file to their new idea using gaze, not text or arrows. The memory inset occupies no more than a quarter of the left panel.
RIGHT main panel: hero and Xiaopai are back at the modern computer in castle intelligence room, ready to create a handoff record. Hero's hand hovers above keyboard, Xiaopai gestures at a BLANK new-document window with a simple empty file icon; another small source area still has the three demon thumbnails (red horned, green vine, blue ice) and plain output bars. The adult night-shift warrior waits beside them, optimistic. Task is still to be done; no green success badge, completed report, handed-over document or victory gesture.
Digital file-writing only, do NOT use quill/pen or paper diary as substitute. Keep faces and key monitor view centered, make gestures visible, leave top/bottom 10% for crop safety, detailed castle wood and stone background with warm sunset lamp light. End on purposeful anticipation and a concrete blank file to fill.
Projection framing constraint: the whole image will appear in a very wide classroom image region, so keep ALL faces and the whole important monitor display within the central 60% of total height (20%-80% vertically). Pull camera back slightly to preserve all story evidence, with architecture and desk edge in upper/lower bands.

## 未生成成功的第一次宽幅重构请求

第一幕初次宽幅重构被图像服务输出检查拒绝（other）；以简洁的课堂插画描述重新生成后成功，最终素材已检查。失败请求原文如下：

Use case: illustration-story. Recompose this exact TWO-panel comic reference into an EXTREMELY WIDE 3:1 image, target 2172×724 or equivalent 3:1 ratio. Exactly two equal 3:2 landscape panels, thin cream central gutter. Keep all character identities, hand-painted anime detail, costumes, and story beats identical. Pull camera wider, spread characters horizontally, reduce vertical foreground/background, no vertical stretching. LEFT: castle film library; brown-haired teen armored hero and small yellow TWO-eyed goggled blue-overalls Xiaopai delighted beside modern monitor displaying a movie thumbnail and abstract solid UI content bars; brown-bun round-glasses female librarian in navy robe smiles. RIGHT: hero and Xiaopai walking out through film library door toward castle corridor, with librarian still visible behind them sorting a grid of movie files/folder icons on computer. All faces and entire significant monitor displays fully visible, generous edge safety. NO text, letters, numbers, fake writing, subtitles, speech bubbles, watermark or logos. Do not add demons or paper ledger. Save this as the finished wider version; entire canvas must be exactly 3:1, not 2:1.

## 检查结果

三张完整图均已实际查看：画面各两格，电影收尾→换岗交接困难→回忆保存方法并准备建立文件。第二幕信息仍显示且交接文件夹为空，第三幕为待填写的空白页图标；没有将显示、保存或成功交接混为一谈。角色外貌、衣装与前后幕保持一致。无文字、字幕、水印。电脑屏幕、人物脸与关键手势在完整3:1画幅可见；页面宜使用contain呈现，避免裁切教学证据。

## 系列恶魔身份定向修正（最终输出）

用户进一步要求所有漫画角色统一。以 lesson-02/assets/defense-demons.png 为三只恶魔的定稿参考，仅修正第二、三幕显示器中的三张缩略图。实际查看最终图片：炎角兽改为熔岩岩石公牛，藤甲魔为绿色藤叶重甲类猿兽，冰翼魔为蓝色冰晶双翼龙。人类角色、小派、两格场景与构图保持一致；第二幕空文件夹、第三幕空白新文件图标保留。尺寸仍为2172×724。

### 第二幕定向编辑最终提示词

Please make one small illustration consistency correction to image 1. In its right-side computer screen, replace the three small colored creature portraits with miniature illustrations of the same three fantasy creatures shown in reference image 2: the four-legged black-and-orange lava bull, the sturdy leafy green forest creature, and the pale blue crystalline winged dragon. Fit them neatly into the same three existing small portrait boxes. Preserve the original whole scene and all people, their faces and outfits, the castle background, both comic panels, monitor and other screen contents exactly. In particular preserve the empty folder icon in the right computer window. Keep the image exactly 3:1 wide, 2172×724, no text, no watermark. These are friendly classroom fantasy illustrations; no violence or injury.

最终输出：exec-c7d908b6-ecbe-402d-bb9f-747378f7a8e6.png，已覆盖本轮 handoff-act-02.png。

### 第三幕定向编辑最终提示词

Please make one small illustration consistency correction to image 1. In its right-side computer screen, replace the three small colored creature portraits with miniature illustrations of the same three fantasy creatures shown in reference image 2: the four-legged black-and-orange lava bull, the sturdy leafy green forest creature, and the pale blue crystalline winged dragon. Fit them neatly into the same three existing small portrait boxes. Preserve the original whole scene and all people, their faces and outfits, the memory inset with movie librarian, the castle background, both comic panels, monitor and other screen contents exactly. In particular preserve the blank PAGE file icon with folded top-right corner in the right computer window, NOT a folder icon. Keep the image exactly 3:1 wide, 2172×724, no text, no watermark. These are friendly classroom fantasy illustrations; no violence or injury.

最终输出：exec-7c355f36-fba0-477e-ab08-583f5d90e432.png，已覆盖本轮 handoff-act-03.png。

### 第二幕首次定向请求（服务输出检查拒绝，无输出）

Use case: precise-object-edit / identity-preserve. Edit IMAGE 1 only: change ONLY the three tiny creature thumbnail images inside the computer monitor in the RIGHT comic panel, to faithfully match the three canonical creatures in IMAGE 2. Image 1 is the exact edit target; Image 2 is identity reference only. Keep EVERYTHING ELSE in image 1 exactly unchanged: whole left panel, three main characters, facial expressions, hair, clothing, armor, castle interior, lighting, camera, framing, monitor, window outlines, output bars, and especially empty target window. Keep 2172×724 resolution, exact 3:1 aspect ratio, narrow cream gutter, two panels. Thumbnail 1: orange-glowing LAVA ROCK BULL walking on FOUR LEGS with huge curved fiery horns, cracked black basalt skin, glowing orange fissures, bovine face and hooves; emphatically NOT a red humanoid demon. Thumbnail 2: stocky GREEN LEAF AND VINE ARMORED APE-like forest beast with cream fur face, bulky limbs and curling vines, exactly the reference species, not a green humanoid devil. Thumbnail 3: BLUE ICE CRYSTAL WINGED DRAGON with pale face, crystalline armor and two large blue crystalline wings, as reference. Scale these creatures to fit the EXISTING three thumbnails; keep their positions, sizes, backgrounds, and all surrounding UI unchanged. No checkerboard in thumbnails, simple colored thumbnail backdrop. No text or new symbols. This is a very small targeted screen-content correction; DO NOT redraw or redesign any other area.
For this image keep the right-hand empty folder window and outlined FOLDER icon unchanged.
