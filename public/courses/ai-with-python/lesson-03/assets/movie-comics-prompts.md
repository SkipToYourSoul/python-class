# 电影档案 STORY 三幕漫画

本文件为早期“准备电影介绍”版本的历史记录。当前第三课第 3 页已改为“看电影 → 短暂断网 → 反思提前保存信息”，使用 `movie-watch-act-*.png`；新剧情及提示词见 [电影夜的断网提醒](movie-watch-comics-prompts.md)。

生成方式：内置 `image_gen.imagegen`，逐张生成；未使用 CLI。生成日期：2026-09-22。

参考角色：`archive-room.png` 中棕发、蓝披风、银金护肩少年为勇士；黄色双眼银色护目镜、蓝背带裤的小伙伴为小派。机械猫头鹰是另一位信使，本组三幕未出场。

风格及场景参考：`movie-archive.png` 中手绘动漫、暖色灯光、蓝金城堡电影馆，以及圆眼镜、棕发盘髻、蓝金长袍女管理员。参考图只用于角色和美术风格，新图的数字文件全部通过电脑呈现。第一、二幕宽版额外引用 `movie-act-03.png` 固定角色身份和 3:1 横构图。

共同约束：每张恰好左右两格、等宽、细奶油色中缝；图内不生成对白、字幕、文字或水印，网页负责教学文字。电影场景不出现恶魔情报。关键人物与道具尽量置于中央，预留投屏空间。

最终文件尺寸：三张均为 2172 × 724（3:1），适合投屏中完整展示。第一、二幕已用宽版替换本轮早期 2:1 稿，旧中间稿仅保留在 Codex 默认生成目录，不加入项目。

## 第一幕：片名有了，介绍呢？

```text
Use case: illustration-story. Create a new, friendly classroom comic, very wide landscape exactly 3:1 overall, TWO equal side-by-side panels with a thin cream middle gutter. Follow the third reference image's wide composition. The first reference defines the boy adventurer and his yellow two-eyed goggled companion Xiaopai; the second defines their warm anime castle cinema. Preserve these character appearances.
Act 1 of a story about saved movie information. LEFT panel: the blue-caped brown-haired boy and yellow companion are preparing a castle movie night. The boy points happily at a laptop showing three movie thumbnails, castle adventure, sailing ship, forest adventure. Empty audience seats and a projection screen establish the cinema. RIGHT panel: the companion holds a simple movie introduction card with one movie picture on top and a large blank area below. Both characters look thoughtfully puzzled because the details are missing. Clear emotional difference from left to right.
Hand-painted anime, crisp fine outlines, warm lamp light, blue and gold castle palette. Wide medium shots with complete faces, laptop screens and card clearly readable and within the middle 60 percent of image height. No captions, lettering, speech bubbles, watermarks, fake text or logos anywhere. No demons, no intelligence theme yet. This depicts preparing introductions, not watching an active film. Two panels only.
```

## 第二幕：网站暂时连不上

```text
Use case: illustration-story.
Asset type: a new wide 3:1 two-panel comic strip for a Chinese children's Python course, movie story act 2. Generate a NEW scene; input images are character/style references only.
Input images: image 1 archive-room.png defines the brown-haired teenage boy hero wearing a blue cape and silver/gold shoulder armor and Xiaopai, a small yellow oval companion with TWO eyes in silver goggles, blue denim overalls and black gloves. Image 2 movie-archive.png defines warm painterly anime castle style, castle cinema and the friendly female archivist: brown hair in a bun, round glasses, blue robe with gold trim.
Primary request: exactly TWO equally sized panels placed side by side with a thin cream central gutter.
Left panel: in the castle cinema, boy hero and Xiaopai lean toward the same modern laptop on a wooden desk with slightly worried faces. Its visible screen shows only a large simple disconnected Wi-Fi icon (curved arcs with a diagonal slash) above a muted empty rectangle; no text. Projection screen, audience seats and castle stone arches remain in background. Network unavailable while preparing film introductions.
Right panel: the friendly female archivist arrives beside the SAME desk and gently points at the laptop screen, reassuring the boy and Xiaopai. The laptop screen now shows a clear generic yellow folder icon containing three movie thumbnail page icons (castle, ship, forest). These represent ALREADY SAVED files on the computer, with no download arrows, no writing, no text labels. The boy and Xiaopai look relieved and interested. Digital archives exist on the laptop, not inside any paper book. Keep all three characters clearly readable.
Composition: 3:1 landscape, wider expressive medium shots; each of the two panels is about 3:2 landscape. Faces and complete computer screens in each panel's central vertical 60% with generous crop-safe top and bottom. Design for a 1100 by 330 pixel classroom comic display, fully showing all crucial props. Warm candle/lamplight, blue/gold palette, crisp fine linework, detailed hand-painted anime rendering consistent with references.
Constraints: no demon/intelligence yet. Xiaopai is the yellow goggled companion, NOT an owl. No speech bubbles, captions, words, letters, digits, logos, watermark or fake written glyphs. No paper archive as substitute for a digital file. Exactly two equal panels.
Additional input image 3 is movie-act-03.png, a finished panel of this same sequence. Follow its 3:1 total aspect ratio and character continuity while depicting the NEW act-2 events above. It is a composition reference only, do not repeat its actions.
```

## 第三幕：读出已有的档案

```text
Use case: illustration-story.
Asset type: a new wide 3:1 two-panel comic strip for a Chinese children's Python course, movie story act 3. Generate a NEW scene; input images are character/style references only.
Input images: image 1 archive-room.png defines the brown-haired teenage boy hero wearing a blue cape and silver/gold armor and Xiaopai, a small yellow oval companion with TWO eyes in silver goggles, blue denim overalls and black gloves. Image 2 movie-archive.png defines warm painterly anime castle style, cinema setting and the friendly female archivist with brown hair in a bun, round glasses, blue/gold robe.
Primary request: exactly TWO equally sized panels placed side by side with a thin cream central gutter.
Left panel: the female archivist shows the hero and Xiaopai a modern laptop on the castle cinema desk. Angle screen clearly toward viewer: it shows THREE already-saved webpage preview cards, each containing a movie image (castle, ship, forest) and only simple short horizontal gray bars for layout, no letters. She points to the folder/page previews to introduce reading the existing files. Hero and Xiaopai listen curiously.
Right panel: the hero now sits at the same laptop, both hands poised above keyboard, about to begin reading the saved movie files. Xiaopai stands beside the hero, points helpfully at the screen with a cheerful encouraging face. The archivist is quietly pleased in the background. Screen contains only a movie webpage thumbnail with a castle image and neutral horizontal bars; DO NOT show parsed result tables, completed lists, victory states, code or readable text. This is the start of a task, not a completed task. Keep the computer as the object of action; no pen and no writing in a paper book.
Composition: 3:1 landscape, wider medium shots; each of two panels is about 3:2 landscape. Important faces, hands and screens in each panel's middle vertical 60% with generous crop-safe top and bottom, suited to a 1100 by 330 pixel classroom display. Warm lamps, stone castle cinema, empty chairs/projection screen subtly in background; expressive faces, blue/gold accents, crisp ink outlines, painterly anime finish matching references.
Constraints: no demons yet. Yellow goggled Xiaopai, not owl companion. No speech bubbles, captions, words, letters, digits, logos, watermarks or fake glyph writing. Only rectangular bars for screen text placeholders. Exactly TWO equal panels.
```
