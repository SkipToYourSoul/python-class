# 身高比较页漫画

- 日期：2026-10-08。
- 工具：内置 `image_gen`，非 CLI。
- 课程素材：`public/courses/ai-with-python/lesson-05/assets/compare-heights.png`，1254 × 1254。
- 用途：`l5-compare` 的初始观察状态；点击后切换为读取同一份 CSV 的真实条形图。
- 参考：本课 `opening.png` 的人物与画风；第三课 `assets/archive-siege/demons.png` 的三类恶魔。
- 检查：五个个体从左至右对应 D001—D005，炎角兽、藤甲魔、冰翼魔、炎角兽、藤甲魔；同一地面基线，保留三位主要角色。插画承载比较情境，精确身高以表格及条形图为准。
- 生成：首次输出未成功，第二次生成成功；随后针对五个个体的相对高度做一次定向编辑，最终保留第二只最高、第三只最矮、第四与第五只接近的关系。未切换工具。

## 生成提示词

Use case: illustration-story. Create a new square 1:1 educational comic scene, in the same polished anime illustration style as image 1. Image 1 is a character/style reference only; image 2 is a fantasy creature design reference only.
A cheerful observation activity in a sunny castle courtyard: five friendly fantasy creatures stand side by side on ONE flat horizontal baseline, all the same distance from the viewer, so their HEIGHTS can be compared. All five creatures' feet and heads must be visible. From left to right, draw: an orange rocky horned creature of medium height; a green leafy creature which is the tallest; a blue crystalline creature with folded wings, clearly shortest; another orange rocky horned creature a little shorter than the tallest; another green leafy creature a little shorter than the fourth. The last two heights are close. Exactly FIVE creatures in this order. Their body sizes are visibly different, while maintaining the species designs from image 2.
In the lower foreground, the brown-haired young explorer with silver-and-gold armor and blue cape, his small yellow two-eyed goggle-wearing companion in blue overalls, and the panda scientist with round gold glasses and white coat from image 1 are observing and comparing a plain record sheet. They must not cover the lineup. The panda points thoughtfully toward the tallest creature; the yellow companion looks puzzled about two similar heights. Large clear faces and distinct silhouettes, clean medium-detailed courtyard background, warm friendly mood, no threatening behavior.
Fill the square canvas; no empty card area. Place important subjects within the central 84 percent of the canvas, leave only nonessential background at the top and bottom edges for slight responsive cropping. Full body lineup in the upper two thirds, observer characters in the lower third. No text, no numbers, no letters, no charts, no speech bubbles, no logos, no watermark, no borders, no split panels, no extra creatures.

## 最终定向编辑提示词

Use case: precise-object-edit.
Edit target: the attached square educational comic illustration.
Change ONLY the relative sizes of the FIVE creatures in the upper lineup to make the height comparison clearer and consistent with the lesson. Preserve the square composition, all three foreground observers, their faces and clothing, the record sheet, courtyard, lighting, species order, style, the horizontal line of all five creatures' feet, and all other parts.
Left to right: creature 1 (orange rocky horned) is 180 units tall; creature 2 (green leafy) is 216 units tall and tallest; creature 3 (blue crystalline) is 137 units tall and shortest; creature 4 (orange rocky horned) is 205 units tall; creature 5 (green leafy) is 197 units tall. These numbers are instructions for proportions only, NEVER render any text.
Specifically: Keep creature 2 as the tallest and creature 3 as the shortest. Make creature 4 noticeably taller than creature 1, nearly as tall as creature 2. Make creature 5 almost as tall as creature 4, a very small height difference, and clearly taller than creature 1. All five must stand on the same baseline and be viewed at the same distance. Align feet exactly as in the original. Keep the five creatures as distinct individuals; do not add or remove creatures. Make the two close heights (4 and 5) visually evident.
Do not change anything else. No words, letters, numbers, graph, speech bubbles or border.
