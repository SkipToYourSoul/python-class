# 第三课漫画素材

## 当前使用：三幕漫画

三段 STORY 各有三幕，每幕为左右双格，共 9 张宽幅插画。使用内置 image_gen 生成，统一 3:1 横构图；网页完整展示画面，并分别渲染对话、问题与操作按钮。

| 故事           | 当前素材                                                         | 完整提示词                            |
| -------------- | ---------------------------------------------------------------- | ------------------------------------- |
| 电影馆的旧档案 | `movie-act-01.png`、`movie-act-02.png`、`movie-act-03.png`       | [电影三幕](movie-comics-prompts.md)   |
| 回到勇士情报站 | `handoff-act-01.png`、`handoff-act-02.png`、`handoff-act-03.png` | [交接三幕](handoff-comics-prompts.md) |
| 城堡的夜晚     | `rescue-act-01.png`、`rescue-act-02.png`、`rescue-act-03.png`    | [档案三幕](rescue-comics-prompts.md)  |

角色参考统一：封面 `archive-room.png` 确定勇士、小派及独立的猫头鹰信使；`movie-act-03.png` 固定管理员与电影段人物；`handoff-act-02.png` 固定晚班勇士的脸型、短发、轻胡茬和蓝金服装。修改构图时保留角色身份、服装与配色。

恶魔小图统一参考第二课 `assets/defense-demons.png`：炎角兽为熔岩岩石公牛，藤甲魔为藤叶重甲兽，冰翼魔为蓝色冰晶双翼龙。电脑中的缩略图可以简化，但不改变物种和核心外形。

旧三张故事图保留为构图与风格参考，不再用于 STORY 展示。封面仍使用 `archive-room.png`。

## 初版素材与封面生成记录

生成方式：内置 image_gen，2026-09-22。项目使用的成品已复制到本目录，原始生成文件保留于 Codex generated_images。

参考图：第二课 `movie-story-sheet.png`、`kingdom-mission-comic.png`。参考用途仅为角色与风格一致性，不复制参考图文字或版式。

## 共同生成规格

Use case: illustration-story. Create an original high-quality classroom comic illustration, based on the attached reference images ONLY for character identity and hand-painted anime fantasy style, not for their panel count or text. Hero: friendly brown-haired teenage boy, royal blue scarf/cape, silver armor with golden trim, brown gloves. Companion: small blue-and-gold mechanical owl with luminous cyan eyes and white wing feathers, expressive and cute. Medieval stone castle, warm parchment palette, vivid royal blue, golden lantern light, sophisticated detailed painted backgrounds, crisp expressive faces. Output a wide landscape image approximately 2:1, EXACTLY TWO equal-size almost-square panels SIDE BY SIDE, separated by one slim ivory gutter. Fill the panels with purposeful storytelling, no empty caption areas. No text of any language, no letters/numerals, no speech bubbles, no captions, no logos, no watermark, no UI, no arrows. Documents can have pictures, lines and simple nonverbal symbols but absolutely no pseudo-letter writing. This is a NEW illustration, not an edit of the attached sheet.

## movie-archive.png

Story: MOVIE ARCHIVE. Left panel: evening film night preparation in a castle library cinema, the blue-scarf hero wants more details about the films and smiles curiously as a kind female archivist with round glasses, hair bun and blue academic robe hands him a thick closed blue-and-gold movie archive book. A film reel and popcorn bucket unobtrusively establish movie night, mechanical owl perched near the handover. Right panel: same hero now seated reading that exact open movie archive at a wooden desk; owl points to picture entries with three small movie stills (a castle adventure, a ship voyage, a forest journey) and star rating icons, hero observes closely with a magnifying glass. A reading-only moment, no pen, no writing. Clear visual progression: receiving an existing archive, then retrieving information by reading it.

## scout-handoff.png

Story: SCOUT HANDOFF, daytime into evening intelligence shift. Left panel: at an open stone castle window, our mechanical owl flies in carrying a rolled parchment report sealed red, handing it to the alert blue-scarf hero. Through the window in the distant valley are tiny silhouettes of an orange horned beast near canyon, a green vine demon near trees, and a blue winged demon near snowy peaks, non-scary fantasy threat. The focus is fresh information arriving. Right panel: at the archive desk, the hero carefully records the delivered report into an open blue-and-gold bound journal with a feather pen, while a friendly older night-shift guard in coordinated blue castle armor leans in and receives the completed journal at the far desk edge. One coherent moment of writing and handing over: hero points to the recorded illustrated entries and offers the journal, feather pen rests in his free hand; night guard's hand accepts it. Owl beside them. In the book are three small monster sketches and place pictograms with ruled blank lines, absolutely no lettering. The real story is preserving a delivered report for the next shift, not magically learning future locations.

## archive-rescue.png

Story: ARCHIVE RESCUE DURING A COMMUNICATION OUTAGE. Left panel: outside the castle at blue dusk, a thin line of magical beacon lights connects a distant watchtower with the castle; a playful ominous winged demon in distant silhouette disrupts the middle beacon with a dark mist cloud. The gold-blue mechanical owl carrying a sealed parchment is halted in midflight in front of the swirling dark mist, worried but unharmed, wings braking, castle safe in background. No battle wounds. Right panel: inside the warm lantern-lit castle archive room, blue-scarf hero calmly opens an EXISTING well-used blue-and-gold bound bestiary journal, owl now beside him points into the open page. The journal has three compact monster portraits: orange horned beast, green vine demon, blue winged demon; opposite their drawings are matching simple protective tool pictures: bright portable spotlight, lit fire torch, and glowing red-orange heater device. On the desk and adjacent equipment rack the same three defense tools are visible and ready: a BRIGHT SPOTLIGHT, a TORCH, and a RED-ORANGE HEAT EMITTER. The hero and a friendly guard consult recorded known weaknesses and prepare tools. They are not getting new information or fresh locations from the old book. No map with new markers, no magic scanning, no live feed. Show the value of existing stored knowledge when communication is interrupted.

## archive-room.png

封面另参考第一课 `xiaopai-guide.png`，小派与机械猫头鹰为两个不同角色。

Use case: illustration-story. Create a new premium classroom course cover illustration in the exact hand-painted anime fantasy style of references 1 and 2. References 1 and 2 establish the brown-haired teenage hero with royal-blue scarf and silver-gold armor, the gold-blue mechanical owl with cyan glowing eyes, and the cozy stone castle. Reference 3 establishes Xiaopai mascot: cheerful small yellow capsule-shaped creature with TWO brown eyes inside silver goggles, few wispy black hairs, blue overalls, black gloves and boots. Render Xiaopai in the same hand-painted anime style as the hero, not 3D, and DO NOT include the wooden sign from reference 3. Scene: the hero, Xiaopai and mechanical owl lean together over a large open explorer's diary on a richly textured wooden desk in a high castle archive room. The hero points to a beautiful watercolor kingdom sketch inside the diary; Xiaopai holds a magnifying glass and smiles; the owl rests on a small stack of closed journals. Spacious arched window reveals the familiar green kingdom valley, river, bridge and distant snowy mountains in golden morning light. Bookshelves, neatly stored parchment scrolls, a soft brass lamp, an inkpot and feather pen. Clear large engaging faces, diary foreground, richly painted but uncluttered surroundings. Wide landscape 16:9 composition, single unified scene (NO panels). Artwork fills the image, no empty title strip. No text, no letters, no numbers, no speech bubbles, no captions, no logos, no watermarks. Diary pages have pictorial map, monster sketches and blank ruled lines only, not pseudo-writing. Warm inviting mood of exploration, knowledge and teamwork. NO extra characters.

## 教学语义

- 电影档案是已经保存的资料，读取不会改变原文件。
- 敌情交接表达将已收到的信息保存，供下一班读取。
- 通信受阻时，旧档案提供已知弱点，不代表实时位置或新情报。
- 漫画仅作故事类比，代码、文件名和教学文字由页面呈现。
