# 第三节 STORY 三幕漫画生成记录

生成方式：内置 `image_gen.imagegen`。风格参考及人物设计参考：`archive-room.png`、`archive-rescue.png`，生成前已实际查看。新图生成使用文字描述与已查看的参考上下文；定向修订使用已生成图的本地路径。没有调用外部 CLI/API，没有以绘图脚本替代图像生成。

最终文件均为 2172 × 724（3:1）PNG，每张左右两格，奶油色中缝。页面以 contain 完整显示，避免角色或屏幕被裁切。

- `rescue-act-01.png`：通信被紫雾阻断，本地文件仍在。初稿 2:1，后定向扩为 3:1。
- `rescue-act-02.png`：从本地文件夹打开已保存的三条记录，准备已有应对工具。定向统一成年男性夜班勇士外形。
- `rescue-act-03.png`：长记录难查找，提出整理表格的设想；下方真实屏幕仍为原有文件，避免暗示已完成后续练习。

教学约束：小派为黄色双眼护目镜蓝背带裤小伙伴，机械蓝金猫头鹰是独立信使；存档未消失，读取的是过去已记录的信息，不能实时定位敌人或获得新情报。所有图无文字、字幕、水印。第三幕云形图示为“设想”，需要配合页面文案说明。

## 第一幕初始生成提示词

```text
Use case: illustration-story.
Create a NEW course comic illustration: act 1 of a three-act story for children learning file reading and writing. Use the two viewed reference images only for character design and hand-painted anime castle fantasy visual style, do not reuse their layouts. Landscape aspect ratio 2:1, exactly TWO equal left and right panels with a thin cream vertical gutter, no outer title. Rich polished hand-drawn anime illustration, readable large central figures and props, warm golden interiors against blue evening exterior, age appropriate, not scary.
Continuity: young brown-haired boy hero in silver-and-gold armor with royal-blue cape and scarf; Xiaopai is the SAME short yellow two-eyed companion with silver round goggles and blue denim overalls as reference1; the separate messenger is a blue, gold and white mechanical owl with blue glowing eyes. Night guard is adult man with short dark-brown hair, subtle beard, blue-silver armor. Keep these distinct, no extra main characters.
LEFT PANEL: Night falls over castle watchtowers. A small distant non-frightening winged shadow demon is blowing purple-black fog between castle and watchtower communication beacons, breaking their glowing blue line. The mechanical owl is safely halted at the near edge of the fog, wings spread, unharmed and unable to deliver latest news. Wide scenic view with the owl clearly foregrounded. No violence.
RIGHT PANEL: In the warm castle intelligence room, boy hero, yellow goggled Xiaopai, and adult night guard look worried at a desktop computer. Its large readable graphical screen shows a disconnected-network symbol (simple connection line broken by red cross) and a blank latest-message area. Below or beside it a small normal yellow local folder icon remains intact, not deleted. Expressions communicate 'new messages cannot arrive'. The heroes do NOT already know the latest news.
Text: none. Absolutely no letters, words, numbers, speech balloons, captions, title or watermark. Only meaningful simple pictographic icons on screen. No book in place of computer. Keep characters and important screen elements in central 80% of each panel with crop-safe margins at top and bottom. No file deletion, no burning archives, no live tactical map, no swords striking or injuries.
```

初稿保留在生成目录，未作为课程素材引用。

## 第一幕宽幅修订最终提示词

参考图：`/Users/liye/.codex/generated_images/01a0c821-4b46-7610-b299-b6f3dd6800cb/exec-00a46c98-eb79-4759-b8e8-5f1a3f8dc9ed.png`

```text
Edit the provided comic to make a wider, classroom-friendly composition. Output aspect ratio EXACTLY 3:1, with exactly TWO equal landscape panels each 3:2 and a thin cream vertical gutter. Recompose the existing scene to this wide format rather than cropping characters. Preserve character designs, props, art style and story.
LEFT PANEL: same blue-gold mechanical owl safely stopped in foreground; purple fog blocks the blue communication line between distant castle towers at night, with same small distant winged fantasy creature. Make owl slightly smaller to fit fully in wide framing.
RIGHT PANEL: brown-haired blue-caped young hero, short yellow two-eyed goggled companion in blue overalls, and adult MALE guard with short dark-brown hair and beard, blue scarf and silver armor, all concerned while looking at same computer. Computer must clearly show a broken connection pictogram above an empty message box and an intact yellow local folder below. Keep all three faces and the computer screen large and visible, arranged horizontally to fit the wide panel.
Same warm anime castle library, blue night outdoors, no words, text, speech balloons, numbers, captions, watermark. All faces and essential screen evidence within central 75% image height. Do not change the meaning: current communications are interrupted; local files have NOT vanished. No map, no restored connection, no violence.
```

最终来源：`/Users/liye/.codex/generated_images/01a0c821-4b46-7610-b299-b6f3dd6800cb/exec-c06eaf6e-ca36-44c5-bb0f-c6377b02c5d3.png`

## 第二幕初始尝试

```text
Use case: illustration-story.
Create a NEW polished course comic illustration, act 2 of the archive rescue story, in the exact hand-painted anime castle fantasy style and same character designs of the viewed reference images and previous generated image. Extremely wide landscape canvas approximately 3:1. Exactly TWO equal left and right panels, thin cream vertical gutter, each panel landscape 3:2. Intended to display at 1100x330: all faces and key screen evidence must lie within central 65% height; avoid anything important near top and bottom.
Continuity: brown-haired boy hero wearing royal-blue cape and silver-gold armor; Xiaopai is short yellow TWO-eyed round silver-goggled companion with blue denim overalls; adult night guard short dark-brown hair, subtle beard, blue-silver armor. Distinct characters. Warm castle archive room at NIGHT. Style expressive readable and funny, rich ink contours, watercolor painterly anime.
LEFT PANEL: medium shot of boy hero and Xiaopai on one side of desktop computer, excited realization expressions pointing toward a normal yellow folder on the computer. Inside folder exactly one saved handover document icon. Visual contrast a small disconnected network symbol in upper screen corner while the locally saved folder/document remains safe and readable. The same adult guard stands behind them relieved, small in frame. Main point: white document file is already saved on local machine despite network outage. Not magical recovery and not a new incoming message.
RIGHT PANEL: the SAME existing saved file is now OPEN on the computer as a plain text-like document with THREE orderly short records, each with a small creature thumbnail and several unlettered horizontal gray line marks. Records: orange horned fire beast; green vine-armored creature; blue icy winged creature. Keep record rows large and clear. Boy hero and Xiaopai read the document, adult guard points thoughtfully to tools on the nearby desk: a brass searchlight, an unlit wooden torch, and a compact orange-glowing heat device. Their calm expressions show remembered weaknesses can help prepare. The computer stays offline, reading KNOWN records, no live map and no latest intel.
Text: absolutely no words, letters, numbers, captions, speech balloons, titles, watermark. On-screen document uses only creature thumbnails and blank gray lines. No paper book replacing the computer. No real-time enemy map, no live position markers, no restored connection, no new intel, no finishing victory, no action battle or violence. Preserve character identity. All main props and faces central and comfortably within crop-safe framing.
```

该次未返回图像，服务在输出阶段返回 `moderation_blocked / other`。以下使用同一友好课堂情节的更简洁表述重试。

## 第二幕生成提示词

```text
Use case: illustration-story. A friendly educational fantasy comic about reading an already saved local document during an internet outage.
Create a NEW very wide landscape image, aspect ratio 3:1, exactly TWO equal landscape panels with thin cream vertical center gutter. Match the warm hand-drawn anime style of the images viewed in context: a castle library with stone arch windows and wood desks, at night. Main characters: cheerful brown-haired young knight in silver armor and blue cape; small yellow two-eyed silver-goggled companion in blue overalls; adult short dark-haired blue-armored castle librarian. Same appearances across panels.
LEFT: the young knight and yellow companion happily notice a document icon inside a yellow folder on a desktop computer, adult librarian smiling behind them. The screen also has a small disconnected-network icon in a corner: internet is unavailable but the file is safe on this computer.
RIGHT: the computer now displays that already saved document, with three clear rows, each row showing a small friendly fantasy creature illustration followed by blank gray horizontal line marks. Creatures are orange horned creature, green leafy creature, blue winged creature. Characters are looking at the screen with thoughtful relieved expressions. On desk next to the monitor are a small brass spotlight, a wooden torch, and a compact orange-glowing heater. These are familiar supplies being prepared from previously recorded knowledge.
The story is offline file reading, not live information. Do not show maps, locations, new messages, a restored connection, battle, injury or any violence. No words, letters, numbers, captions, speech bubbles, titles or watermark. Screen is pictograms only. All faces, icons and important props centered in the middle 65% of height, leaving crop-safe top and bottom margins. Large clear readable characters and computer screen suitable for classroom projection.
```

## 第二幕人物连续性修订最终提示词

参考图：`/Users/liye/.codex/generated_images/01a0c821-4b46-7610-b299-b6f3dd6800cb/exec-e543675f-f536-4a18-9844-5b04c338d795.png`

```text
Edit the provided two-panel comic only to correct one supporting character. In BOTH panels, change the dark-haired adult standing behind the boy and yellow companion into the same MALE night guard seen in our earlier comic: adult man, short dark-brown hair, small neat brown beard, broad jaw, blue scarf and silver armor with gold trim. Keep his friendly relieved expression. Preserve everything else exactly: boy, yellow companion, all poses, computers, folder icon, offline symbol, three saved creature records, tools, library, lighting, very wide 3:1 two-panel layout and cream gutter. No new text or speech bubbles. This is solely character continuity correction.
```

最终来源：`/Users/liye/.codex/generated_images/01a0c821-4b46-7610-b299-b6f3dd6800cb/exec-5a4392e5-15f4-4e09-8585-5c3bda75a4f1.png`

## 第三幕最终生成提示词

```text
Use case: illustration-story.
Create a NEW educational fantasy comic in the warm hand-drawn anime castle library style of the images viewed in context. Act 3: making existing saved records easier to find.
Format: very wide landscape image aspect ratio exactly 3:1, TWO equal landscape panels each 3:2, separated by a thin cream vertical gutter. Important faces and screen evidence large and centered within middle 75% height; crop-safe top/bottom.
Characters consistent with the latest viewed image: brown-haired boy hero in silver-gold armor and blue cape; Xiaopai, short yellow two-eyed silver-goggled companion in blue denim overalls; adult MALE night guard with short dark-brown hair and short neat beard, broad jaw, blue scarf and silver armor. No extra characters.
LEFT PANEL: in the castle intelligence room at night, the computer monitor is crowded with a plain long document: many gray horizontal line marks; exactly THREE small existing creature pictures (orange horned creature, green leafy vine-armored creature, blue winged creature) appear at different points among the lines. Adult male guard leans toward the screen with a puzzled brow, trying to locate a detail. Young boy and Xiaopai beside him think carefully, finger on chin. Trouble is finding details in existing records, not lost records and not a network outage.
RIGHT PANEL: young boy and Xiaopai are smiling and gesturing toward a translucent, clearly imaginary sketch floated ABOVE THE SAME MONITOR, a soft cloud-edged envisioning overlay: a simple tidy three-column table layout with exactly three old creature icons down its first column and blank neutral line marks in other cells. Actual physical monitor BELOW still shows the existing crowded plain document, unchanged. Adult male guard watches with an intrigued expression. Their gestures and airy translucent sketch show 'we could organize it this way', not software already complete. No additional creature records; use only the same orange, green, blue icons.
Text: none. No letters, numbers, words, code, captions, speech balloons, titles or watermark. The cloud-like overlay contains only diagram shapes, not dialogue. No CSV words, no finished new file icon, no file save checkmark, no map, no new messages, no connection restoration, no battle. Large readable pictorial storytelling, humorous thoughtful character reactions, warm lamp light.
```

最终来源：`/Users/liye/.codex/generated_images/01a0c821-4b46-7610-b299-b6f3dd6800cb/exec-b81ffa02-fc77-4ba6-8a87-831cc13eaad1.png`

## 实际检查

逐张检查生成图：三张均为双格，故事推进互异；男勇士、小派、夜班勇士清晰；第二幕离线符号和完整本地文件同屏；第三幕整理表格是悬浮设想而非已完成文件。没有可读伪文字。蓝金猫头鹰仅出现于第一幕外景。第二幕三种生物采用友好缩略图表达已有记录，第三幕延续橙/绿/蓝三种旧记录。

未改动页面代码或原有图片。

## 角色与恶魔身份统一修订（最终引用）

依据用户明确“所有漫画角色一致”的要求，实际查看并以 `handoff-act-02.png`（夜班勇士）、`movie-act-03.png`（少年勇士与小派）、第二课 `defense-demons.png`（三种恶魔定稿）为额外参考，对三张逐张做定向编辑。少年统一蓝金城堡纹衣装、银金肩甲、棕手套；夜班勇士统一短深棕发、轻胡茬、蓝金城堡纹衣装；小派统一双眼银护目镜、普通蓝背带裤、双黑手套，无胸章。02/03小图统一为熔岩四足牛、藤甲类猿兽、冰晶双翼龙。

最终来源：

- `rescue-act-01.png` ← `/Users/liye/.codex/generated_images/01a0c821-4b46-7610-b299-b6f3dd6800cb/exec-21789d72-ec8a-4b70-a7f3-4d1ae78b16c8.png`
- `rescue-act-02.png` ← `/Users/liye/.codex/generated_images/01a0c821-4b46-7610-b299-b6f3dd6800cb/exec-913e0790-b8dd-4570-88ab-968d185fdbc9.png`
- `rescue-act-03.png` ← `/Users/liye/.codex/generated_images/01a0c821-4b46-7610-b299-b6f3dd6800cb/exec-c3d76346-3d52-4533-909f-e4bcf5806903.png`

逐张实际查看：01通信中断与本地文件完整保留；02两只黑手套、轻胡茬、三种既有物种已修正；03右格夜班勇士露指手套已补成完整棕手套，少年头发细节加强。构图与教学证据保持，三张仍2172×724。

以下为完整修订提示词。identityPrompt3 首次输出审核未返回图，identityPrompt3Retry 为同一课堂整理文件任务的简洁重试；其余均返回图并实际检查。

### identityPrompt1

```text
Use case: identity-preserve.
EDIT image 1 (the two-panel night communication scene). Images 2 and 3 are STRICT CHARACTER IDENTITY AND COSTUME REFERENCE SHEETS, not alternate scenes.
Image 2 defines adult night guard: short layered dark brown hair, young adult angular face, only LIGHT chin/jaw STUBBLE, NO full beard, same blue cloak/scarf over BLUE cloth tunic carrying GOLD CASTLE emblem, silver shoulder armor with ornate gold edging, brown leather straps and gloves. Do NOT use all-silver chest breastplate, big star badge or fleur-de-lis chest emblem.
Image 3 defines boy hero and yellow companion exactly: boy's richly layered tousled chestnut hair, big brown eyes, white sleeves, royal blue tunic with GOLD CASTLE emblem, blue cape/scarf, silver-gold shoulder armor, brown leather gloves and bracers, small circular gold cape brooch. Yellow Xiaopai has TWO large silver circular goggles, small sparse black hair strands, plain blue DENIM overalls with only natural pocket stitching, black straps for goggles, BLACK GLOVES on BOTH hands; NO eyebrows patches, NO chest badge/crest/emblem.
Change ONLY character identity, costume and matching illustration detail in image 1's RIGHT panel to match references 2/3 faithfully. Keep their worried poses and expressions. LEFT panel owl, purple fog interrupting signal, distant small fantasy creature and entire castle landscape stay unchanged. RIGHT panel keep intact computer screen containing broken connection pictogram, empty message box and safe yellow folder; keep all evidence composition and desk. Preserve 3:1 wide aspect, exactly two equal panels, thin cream middle gutter. Match detailed finely inked painted anime quality of reference3, no simplified chibi rendering. No words, captions, letters, bubbles, watermark. No added characters.
```

### identityPrompt1Fix

```text
Edit IMAGE 1 only to correct two very small character details, leaving the entire comic unchanged otherwise.
First, the yellow silver-goggled companion in the right panel must have NO eyebrows or eyebrow-shaped lines on his yellow forehead above the goggles, exactly like the SAME yellow companion in reference IMAGE 2. Remove those two small eyebrow marks; keep sparse strands of head hair, eye expression inside goggles, skin, hands and clothing unchanged.
Second, refine the young boy's chestnut hair texture to the same finely layered inked tufts and highlights as the boy in IMAGE2, maintaining current face, expression, pose, silhouette and position. Do not change face proportions or outfit.
Everything else stays exactly: adult night guard's short hair/light stubble, blue gold-castle tunics, silver-gold shoulders, all black/brown gloves, owl, purple fog, castle, computer broken connection symbol/empty message/safe local folder. Keep 3:1 two-panel format and cream gutter. No words, captions or new elements.
```

### identityPrompt1Brow

```text
This is a precise tiny cleanup. In the right panel, the yellow companion has a small short black angled eyebrow mark on the upper-right part of his yellow forehead, just above the right goggle rim. ERASE THIS SHORT EYEBROW MARK COMPLETELY and replace its pixels with smooth plain yellow skin matching adjacent forehead. The area is near x=1440,y=490 on the 2172x724 canvas. There must be absolutely NO black line or curve between his head hair and the silver goggle rims; only smooth plain yellow skin. Preserve the sparse actual hair strands along the top contour of his head. Make no other changes anywhere in the image. Preserve all characters, expressions inside eyes, computer, owl, background, aspect ratio, artwork and colors. Do not add anything.
```

### identityPrompt2

```text
Use case: identity-preserve.
EDIT IMAGE 1, the two-panel saved-local-file comic. IMAGE 2 and IMAGE 3 are STRICT character identity and costume references; never import their scenes.
IMAGE 2 defines adult night guard: SAME short layered dark brown hair, young-adult angular face, only LIGHT sparse jaw STUBBLE. No thick moustache, no full beard. Same blue cloak/scarf and BLUE cloth tunic with GOLD CASTLE emblem (castle silhouette over fleur detail as in reference), silver shoulder armor with ornate gold edging, brown leather straps, gloves. NO plain full silver chest breastplate, no large star brooch.
IMAGE 3 defines hero and Xiaopai: hero must match richly layered tousled chestnut hair, brown eyes, royal blue tunic with GOLD CASTLE emblem, blue cape/scarf, silver-gold shoulder armor, white sleeves, BROWN leather gloves and bracers, SMALL ROUND gold cape brooch. Xiaopai is SAME yellow TWO-eyed silver-goggled companion, sparse hair, PLAIN blue DENIM bib overalls with pocket stitching only, BLACK GLOVES on both hands; NO eyebrows above goggles, no brow-shaped patches, no chest insignia or crest. Refer to image3 faithfully, not approximate.
In BOTH panels replace the currently simplified characters with these SAME identities and meticulously detailed hand-painted anime rendering, keeping same scene actions. Left: safely saved document in yellow local folder, small offline icon, boy and Xiaopai relieved. Right: opening EXISTING record, characters thoughtfully read it, tool props retained: brass searchlight, wooden torch, orange heater.
Also correct ONLY three creature thumbnails in right-hand document to match existing demon types shown on IMAGE2 screen: orange-red horned fire beast with robust body (not cute baby pet), green vine-armored creature with branch-like horns, blue ice-winged creature with angular icy wings. Use readable small illustrated busts, age-appropriate, exactly THREE document rows. Same three colors and identities, no new creatures. Existing gray unlettered line marks retained.
Preserve wide 3:1 two equal panels, cream gutter, camera framing and computer screen evidence. No words, text, code, speech balloons, watermark. No new scene, no live information, no connection restoration.
```

### identityPrompt2Fix

```text
Make two very small corrections to this provided illustration, preserving absolutely everything else including every screen, all creatures, costumes and 3:1 comic layout.
1. In BOTH panels, the smiling ADULT man standing behind the boy should have only light sparse stubble exactly like reference image 2. Remove the dark solid goatee shape and dark beard band from his chin, restoring natural skin with sparse fine stubble dots. Same head, face, smile and hair. He is the night guard in image2, not a different older man.
2. In the RIGHT panel, the yellow goggled companion's hand resting against the RIGHT side of his face (the hand on the screen side) is yellow and missing its glove. Paint ONLY that hand as a fitted BLACK glove matching the black glove on his other hand. All visible fingers of this hand must be black fabric. Leave his yellow forearm yellow. Keep the pose unchanged.
No other alterations. Preserve character expressions and computer evidence. No text.
```

### identityPrompt2Creatures

```text
Edit only the THREE small creature thumbnails on the RIGHT computer screen of IMAGE 1. Use IMAGE 2 as their exact identity reference. Replace top thumbnail by the same four-legged black rocky LAVA BULL with huge curved orange-glowing horns; middle thumbnail by the same broad APE-LIKE creature wearing green vine and leaf armor, round friendly furred face and twisting branch horns; bottom by the same blue-white CRYSTALLINE DRAGON with two big translucent icy wings. Keep them in the same three existing rows with same gray line marks. Small full-body thumbnails, silhouettes still readable. Copy these creatures exactly from image2, simplified to thumbnail size; no horned humanoid devils, deer humanoids, pets or birds.
Preserve EVERYTHING ELSE in image1 unchanged: all three human/companion character faces, hairstyles, sparse stubble, gold castle tunics, both black gloves on yellow companion, brown hero gloves, plain overalls, computer offline symbol, folder, tools, lighting, 3:1 two-panel format. No new text, no change of story or perspective.
```

### identityPrompt3

```text
Use case: identity-preserve. EDIT IMAGE 1 ONLY. Images 2/3 define exact consistent characters, image4 defines the already approved three small creature illustrations on screen.
Preserve scene, composition, two-panel 3:1 format, cream central divider, computer evidence and imaginary table overlay. Apply exact character identity to ALL characters in BOTH panels:
1 Boy hero EXACTLY like image3: layered tousled chestnut hair, brown eyes, royal-blue cloth tunic with GOLD CASTLE motif, blue cape/scarf, silver shoulders edged gold, white sleeves, BROWN leather gloves covering BOTH hands and ALL fingers, brown bracers, circular SMALL gold cape brooch. No all-silver chestplate, no big star badge.
2 Yellow companion Xiaopai EXACTLY like image3: yellow skin, two large round silver goggles, sparse black hair, NO eyebrow marks above goggles, plain blue denim overalls with plain pocket stitching and NO badge/crest, BLACK GLOVES covering BOTH hands entirely including fingertips. In left panel thinking hand on chin MUST be black. In right panel raised pointing hand MUST be black, resting hand MUST be black. Do NOT leave any bare yellow fingers.
3 Male night guard EXACTLY like image2: short layered dark brown hair, LIGHT sparse stubble only with mostly SKIN visibly showing on jaw/chin. NO solid dark beard patch, NO goatee, NO full beard. Blue cloak/scarf and BLUE cloth tunic with GOLD CASTLE motif, silver-gold shoulder armor, brown leather gloves, same face, no silver breastplate or star badge.
Match finely detailed hand-painted anime style of image3. Keep expressions: puzzled left, inspired right.
Small creature images throughout the existing document and imagined table: match image4 exactly, orange-red robust horned fire beast, green antlered vine-armored demon, blue ice-winged creature with angular crystalline wings. Same three existing records; NO additional or cute pet creatures. Imaginary table remains cloud-edged floating ABOVE unchanged real monitor; no actual new file saved.
No words, letters, numbers, code, captions, speech bubbles or watermark. No added characters or changes to story.
```

### identityPrompt3Retry

```text
Edit the FIRST image, a friendly educational comic about organizing saved computer files. Keep its complete 3:1 two-panel composition and both computers unchanged in meaning: left crowded existing document, right SAME crowded document plus a floating cloud-like idea for a tidy table. Make only visual continuity corrections using the three reference sheets.
SECOND IMAGE: exact identity reference for adult male night guard, short dark-brown hair, light fine stubble (mostly visible skin, not a solid beard), royal-blue cloth tunic with gold castle emblem, blue scarf, silver shoulder armor edged gold, brown leather straps and gloves.
THIRD IMAGE: exact identity reference for young boy hero and small yellow goggled companion. Boy has richly layered chestnut hair, brown eyes, blue tunic with gold castle emblem, blue scarf, white sleeves, silver-gold shoulder pieces, BROWN leather gloves on both hands and brown bracers. Small yellow companion has two large silver round goggles, sparse black hair, plain blue denim overalls with ordinary pocket and NO decorative badge, BLACK gloves fully covering both hands and ALL fingers, no eyebrows drawn above goggles. In the right panel his raised pointing hand must be BLACK-gloved. Boy's gesturing hand must be BROWN-gloved.
FOURTH IMAGE: exact reference for all three small creature illustrations shown in screen and imaginary table: (top) a FOUR-LEGGED black rocky BULL with glowing orange lava cracks and two huge curved horns; (middle) a stocky friendly-faced APE-LIKE creature in green leaf-and-vine armor with curling branch horns, powerful arms; (bottom) a blue-white CRYSTALLINE DRAGON with two large translucent ice wings. Copy their species and silhouettes, simplified only enough for small thumbnails. No substitute humanoid devils, pets, birds or foxes.
Use the finely inked, detailed painted anime style of third reference. Same poses/expressions, same warm castle room. Exactly three rows in imagined table and exactly three corresponding images in original document. No new records or changes to workflow. No readable text, letters, captions, title or watermark.
```

### identityPrompt3Fix

```text
Make only TWO tiny consistency corrections to IMAGE 1, preserving every other detail and the 3:1 two-panel comic exactly.
A) Adult night guard's thinking hand in RIGHT panel: complete his dark-brown leather glove over ALL currently bare skin-colored fingers including knuckles and fingertips. It is a full finger glove, matching his fully brown-gloved thinking hand in the left panel. Maintain same pose.
B) Young hero's hair in BOTH panels: refine its rendering to match the layered richly detailed chestnut tufts of this same boy in reference IMAGE 2, without changing face, expression, pose, placement, or hairstyle silhouette. Add the same fine inked texture/highlights; avoid broad simplified solid hair chunks. The boy is exactly the same person as IMAGE2.
Keep all existing costumes, gold CASTLE motifs, face proportions, silver-gold shoulder armor, boy's brown gloves and companion's black gloves unchanged. Keep all three correctly matched creature thumbnails on all screens and imagined table unchanged. No other modifications. No added text, letters, title or watermark.
```
