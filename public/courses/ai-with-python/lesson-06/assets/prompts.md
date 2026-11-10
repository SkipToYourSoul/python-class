# 第六课漫画素材

战前准备五张新漫画的完整提示词与用途见 [preparation-prompts.md](preparation-prompts.md)。

第二节分析与部署漫画的完整提示词见 [analysis-prompts.md](analysis-prompts.md)。

使用内置 image_gen 工具生成。参考图只用于保持勇士、小派、熊猫博士与机械猫头鹰的一致形象及 3D 动画电影画风。图片不承载必须精确阅读的数值、中文台词或数据结论，正式文字与图表由 HTML 和同源数据提供。

| 素材       | 本地文件                     | 用途                                         |
| ---------- | ---------------------------- | -------------------------------------------- |
| 决战开场   | [opening.jpg](opening.jpg)   | 带回图鉴、攻击被护盾挡住、发现三塔供能       |
| 获取与归档 | [records.png](records.png)   | 猫头鹰送回卡片、小派整理、勇士携带档案       |
| 统计与线索 | [analysis.png](analysis.png) | 比较整体后继续观察变化，漫画图形仅作情节道具 |
| 最新情报   | [latest.png](latest.png)     | 猫头鹰送新观测、勇士停下核对、修订计划       |
| 阶段庆祝   | [victory.png](victory.png)   | 阶段总结与团队庆祝                           |

## 第 11 页归档漫画

使用内置 image_gen，以 [第 10 页漫画](save-story-v2.jpg) 为角色和画风参考。第 11 页并排展示 [归档漫画](save-code-comic.jpg) 的上、下两格，切换代码步骤时高亮对应图注。

undefined

## 开场提示词

Use case: illustration-story. Create a polished 16:9 horizontal three-panel sequential comic for a Chinese children's Python course, ages 10-13. References are character and rendering style references only. Preserve the brown-haired boy warrior with blue scarf, silver gold armor, and the small yellow goggle-wearing helper in blue uniform, plus the blue-white mechanical owl. High quality colorful 3D animation film art, navy/cobalt/gold colors, expressive faces, friendly adventure, no gore. Panel 1 at left: the boy and yellow helper emerge from a castle side gate, triumphantly carrying a creature field-guide book, silhouettes of defeated fire/vine/ice guards safely far behind. Panel 2 at center: in the dark castle courtyard the boy's glowing sword bounces harmlessly off a giant violet translucent dome enclosing a mysterious cloaked shadow demon king; surprised expression. Panel 3 at right: mechanical owl above the companions points with wing at three distinct distant crystal supply towers, linked by glowing violet energy streams to the demon king's shield. One north, one east, one west, visually three towers, no maps or labels. Three clearly separated equal-width cinematic panels with narrow cream gutters. Art should communicate the concrete problem: attack blocked by shield fed by three towers. No text, no speech bubbles, no letters, no numbers, no watermark. Every panel meaningful and close enough to read on projection.

## 统计漫画提示词

Use case: illustration-story. Asset: 16:9 horizontal illustration for an age 10-13 Chinese Python adventure course. References only for consistent character identity and polished 3D animated film rendering. Keep same brown-haired young warrior, blue scarf silver-gold armor, yellow goggle helper blue uniform, blue-white mechanical owl, panda scientist when specified. Navy cobalt cream gold palette, detailed cinematic environment, friendly adventurous tone. Three equal-width panels separated by cream gutters. Panel1 boy at war room desk sees three piles of observation cards corresponding to blue north tower, orange east tower, teal west tower, unsure which to investigate. Panel2 panda scientist in round glasses joins yellow goggle helper to examine a paper with THREE SIMPLE BARS, left low middle tall right medium, no numbers. Panel3 yellow helper suddenly spots a dramatic brief dip in an orange line on a DIFFERENT time-chart parchment, boy surprised, visually explaining averages can hide short weak moments. Charts are rough narrative props only, not precise data graphics. No text, no speech bubbles, no letters, no numbers, no watermark. All panels must have consistent characters and clear actions, readable on classroom projection.

## 其余三图的共同提示词

Use case: illustration-story. Create a polished 16:9 horizontal story illustration for a friendly fantasy classroom lesson. Reference for consistent character identity, blue-gold costumes and colorful detailed 3D animated film style. [Scene below] No text, no letters, no speech bubbles, no readable numbers, no watermark.

### records

Three equal-width comic panels with narrow cream gutters. Left: friendly mechanical owl brings a bundle of blank parchment observation cards to a desk; brown-haired blue-scarf adventurer and yellow goggle helper look excited. Middle: helper sorts the papers by blue, orange, teal tower pictograms into a neat notebook, while boy carefully checks one card. Right: communication crystal on desk goes dark but boy confidently holds the saved notebook, walking toward a doorway. No weapons, no conflict, no danger. Focus on gathering, organizing, and preserving observations.

### latest

Three equal-width comic panels with narrow cream gutters. Left: brown-haired blue-scarf adventurer and yellow goggle helper study a folded observation chart beside three crystal towers in a peaceful twilight landscape. Middle: mechanical owl delivers a fresh glowing observation card and both companions pause to examine it. Right: they compare their notebook with the fresh card and point toward a teal crystal tower with dim outer glow; blue and orange towers glow more brightly. Focus on updating a plan after new information, no weapons, no combat.

### victory

One wide cinematic scene in a sunny castle courtyard: brown-haired blue-scarf adventurer in silver-gold armor, small yellow goggle helper in blue uniform, and friendly panda scientist with round glasses celebrate their completed adventure. Blue-white mechanical owl above. Soft violet protective dome dissolves into harmless sparkles in distant background, now peaceful. A desk in foreground shows an open observation notebook and two charts on parchment. Warm gold sunlight, joyful expressions, earned teamwork accomplishment. No weapons, no violence.

## 三队部署与三塔战役补充漫画

2026-10-19 使用内置 image_gen；三个独立生成调用。角色与风格参考本课 opening.jpg 和第五课 opening.jpg。最终项目素材：strategy.png、tower-assault.jpg、boss-reveal.png。

共用提示词：Use case: illustration-story. Create a polished child-friendly fantasy educational comic, panoramic 3:1 composition, three equal left-to-right panels with thin warm cream gutters. Match reference images: same brown-haired teen knight in silver/gold armor and blue cape, same small yellow two-eyed goggle helper in blue overalls, same white/blue/gold mechanical owl, panda professor with glasses and white coat. Reference 1 establishes three magical crystal towers supplying a purple armored demon king shield. Reference 2 establishes cast and flame, vine, ice monster designs. Consistent expressive high quality animated fantasy art, navy/cream/blue/yellow with warm light. No text, no numbers, no letters, no speech balloons; story readable through actions. Non-gory adventurous tone.

### strategy.png

Scene: battle strategy in castle command tent. Panel1 owl spreads many intelligence cards on table; knight and helper puzzled by many tower observations and three guardian families. Panel2 panda and helper organize cards into three tower columns blue north flame beast, orange east vine beast, teal west ice wing beast; knight compares shield curves and defense dots on a broad paper chart with NO tiny numbers. Panel3 hero assigns three allied warrior squads blue/amber/teal paths on map to three towers; squad leaders receive bright light orb, fire torch, warm glowing crystal respectively. Make clear choosing tower, time and guardian equipment based on evidence.

### tower-assault.jpg

Scene: coordinated assault against three towers, each panel one different tower and squad. Panel1 blue-cloaked allied warriors use a brilliant white light orb against a large flame-horned guardian outside north tower with blue crystal; a weakening purple outer shield opens a narrow gap. Panel2 amber-accented allied warriors use controlled magical flames against green vine-armored guardian outside east tower with orange crystal, shield opens. Panel3 teal-accented allied warriors use warm orange heat crystal against icy winged guardian outside west tower with teal crystal, ice melts gently, shield opens. Include small helper reading paper plot/handheld data device in panel1 and owl overhead traveling toward next tower. Towers have distinct architecture, no demon king defeat yet; teamwork and observation, non-gory.

### boss-reveal.png

Scene after all THREE tower crystals have gone dark, all three squads converge for demon king final battle. Panel1 wide valley shows three now-dark tower crystals with all three purple supply beams broken; knight, helper and owl celebrate modestly at castle gate. Panel2 tall purple armored demon king steps from fading shield, imposing but child-friendly; nine armor sections distinct, especially chestplate. Knight prepares but helper raises hand to observe first. Panel3 owl brings a large fresh scroll showing demon armor silhouette with dot observations; panda, helper and knight study chestplate weak spot with magnifier before final attack. Clear final challenge begins only AFTER three towers disabled.

### strategy-v2.jpg（最终使用）

使用内置 image_gen 编辑 strategy.png，修正中间分镜的塔与守卫卡对应；保持三分镜、角色、动作和风格。参考原图已保留。

Use case: precise-object-edit. Edit the attached three-panel fantasy educational comic. Keep the entire composition, all three panels, characters, faces, outfits, scene framing, art style, lighting, and all story actions unchanged. Change only the guardian illustration cards displayed below the three tower cards on the table in the MIDDLE panel. Required exact associations: under the LEFT BLUE crystal tower, show the dark lava flame-horned beast (not ice); under the CENTER ORANGE crystal tower, show the GREEN VINE-ARMORED beast (not flame); under the RIGHT GREEN/TEAL crystal tower, show the BLUE ICE-WINGED beast (not vine). Also swap the small elemental sample drawings below those matching cards consistently: flame horn scales beneath the flame beast; leaves/vines beneath the vine beast; ice crystals/ice wings beneath the ice beast. This mapping is critical for educational consistency. No text, no letters, no numbers. Preserve everything else; especially left panel many papers and right panel the three squads receiving light/fire/warmth tools. Maintain panoramic 3:1.

## 第4页战场信息与第5页路线卡背景

内置 image_gen，2026-10-19。参考：本课 opening.jpg（人物与世界观）。第4页采用双格漫画配独立HTML信息；第5页四格保留原文字，以CSS设置背景透明度和渐变。

### battle-rules-comic.png

Use case: illustration-story. Reference image is only for recurring cast and fantasy world: same brown-haired teenage knight with silver/gold armor and a royal-blue cape, same small yellow two-eyed goggle helper wearing blue overalls, and blue-white-gold mechanical owl. Keep these characters consistent and recognizable. Child-friendly adventurous fantasy comic with clean expressive ink lines, simple shapes and restrained flat colors (navy, cobalt, gold, cream, a little purple), much simpler and less crowded than the reference. No words, letters, numbers, labels, speech balloons, watermarks, UI, charts with labels, or typography. Asset: one educational two-panel comic for a projected lesson slide, landscape 3:2, thin cream gutter, no outer title. Left panel: knight and yellow helper stand outside a blue-crystal magic tower. A purple transparent outer shell is dim and has opened a narrow safe gap; helper points at the weakening barrier while the knight waits, showing that first they need an opening in the outer shield. Right panel: after passing the weakened shell, the pair encounters a flame-horned rocky guardian. Knight holds a brilliant white light orb, helper holds open the flame-beast illustrated field guide and points from its matching picture toward the glowing orb; the flame guardian shields its eyes. Show the second obstacle is the guardian and that matching a tool to its weakness matters. Both panels are clear medium shots with only 2-3 main subjects, readable at classroom size. No victory against the demon king yet. No shield threshold numerals; all precise rules will be typeset outside the image.

### route-prepare.png

Use case: illustration-story. Reference image is only for recurring cast and fantasy world: same brown-haired teenage knight with silver/gold armor and a royal-blue cape, same small yellow two-eyed goggle helper wearing blue overalls, and blue-white-gold mechanical owl. Keep these characters consistent and recognizable. Child-friendly adventurous fantasy comic with clean expressive ink lines, simple shapes and restrained flat colors (navy, cobalt, gold, cream, a little purple), much simpler and less crowded than the reference. No words, letters, numbers, labels, speech balloons, watermarks, UI, charts with labels, or typography. Asset: a single simple comic vignette used as the background of a narrow vertical lesson roadmap card, portrait 2:3. Place all recognizable action in the BOTTOM 40 percent, leaving the upper 60 percent almost empty warm paper cream with only very faint castle lines. At bottom, mechanical owl delivers a small bundle of intelligence scrolls; yellow helper and knight put scrolls into a neat archive box beside a closed field notebook. Data collection and storage, cheerful preparation. One scene, no panel grid. The image must work behind transparent overlays, a few large readable shapes, no busy details.

### route-towers.png

Use case: illustration-story. Reference image is only for recurring cast and fantasy world: same brown-haired teenage knight with silver/gold armor and a royal-blue cape, same small yellow two-eyed goggle helper wearing blue overalls, and blue-white-gold mechanical owl. Keep these characters consistent and recognizable. Child-friendly adventurous fantasy comic with clean expressive ink lines, simple shapes and restrained flat colors (navy, cobalt, gold, cream, a little purple), much simpler and less crowded than the reference. No words, letters, numbers, labels, speech balloons, watermarks, UI, charts with labels, or typography. Asset: one simple comic vignette for a narrow vertical lesson roadmap card background, portrait 2:3. All action in the BOTTOM 43 percent; upper 57 percent almost empty warm cream paper with only faint distant mountains. Three small squads with blue, amber and teal banners stand before three distinct crystal towers; tower crystals fading out, a blue-cloaked knight and yellow helper hold a simple paper curve with no axes labels or text. Coordinated assault on all three towers guided by evidence. One scene, no panel grid. Very few large clear forms, no busy tiny warriors, no demon king.

### route-boss.png

Use case: illustration-story. Reference image is only for recurring cast and fantasy world: same brown-haired teenage knight with silver/gold armor and a royal-blue cape, same small yellow two-eyed goggle helper wearing blue overalls, and blue-white-gold mechanical owl. Keep these characters consistent and recognizable. Child-friendly adventurous fantasy comic with clean expressive ink lines, simple shapes and restrained flat colors (navy, cobalt, gold, cream, a little purple), much simpler and less crowded than the reference. No words, letters, numbers, labels, speech balloons, watermarks, UI, charts with labels, or typography. Asset: one simple comic vignette for a narrow vertical lesson roadmap card background, portrait 2:3. Keep all recognizable action in the TOP 40 percent, with lower 60 percent almost empty warm cream paper and faint castle stone outlines. Purple armored demon king stands at a distant castle gate with no enclosing shield; three dark tower silhouettes behind him establish all towers already disabled. In foreground upper half, knight and yellow helper inspect an armor drawing with magnifier before deciding where to attack. New evidence for final confrontation. One scene, no panel grid, no immediate victory, no busy details.

### route-strategy.png

Use case: illustration-story. A peaceful fantasy classroom illustration used as a narrow vertical card background, portrait 2:3. Clean friendly storybook ink-and-color drawing on warm cream paper, simple uncluttered shapes. Only the TOP 40 percent contains characters and objects: a cheerful brown-haired blue-cloaked explorer and a small yellow round two-eyed goggle-wearing helper examine a tabletop map of three castle towers, with blue, amber and teal markers and three paths. A little mechanical owl is beside the map. They compare paper records and plan three travel routes together. The LOWER 60 percent is mostly blank warm cream parchment with very faint map contour lines so readable slide text can be placed there later. No fighting, weapons, threat, words, letters, numbers, labels, speech balloons, logos or watermark.
