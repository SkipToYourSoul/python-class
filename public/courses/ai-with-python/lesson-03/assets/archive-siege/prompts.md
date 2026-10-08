# 档案室正式美术素材

## defenses.png

胜利场景用透明防御装置图集：探照灯、火盆、供热装置。内置 image_gen 生成。

```text
Use case: stylized-concept
Asset type: production transparent game sprite atlas for classroom castle archive game victory, THREE evenly spaced isolated defensive devices in one horizontal row.
Style reference: use the same rich hand-painted 2.5D medieval castle adventure art as the provided archive room and dossiers: brass gold, deep cobalt blue, tactile metalwork, warm dramatic detail, crisp readable silhouettes. No characters.
Left device: ornate brass and cobalt blue castle spotlight on a sturdy short swivel pedestal, pointing diagonally right, near front three-quarter angle, large bright pale-gold glass lens visible, NO projected light beam.
Center device: ornate forged iron standing brazier / large castle torch on a short decorative base, vigorous warmly glowing orange and gold flame above, readable complete flame silhouette.
Right device: portable ornate brass radiant heater on short feet, square rounded cage with a clearly visible glowing orange serpentine heating coil, cobalt blue side panels, protective vertical brass grille. It reads immediately as a heat-producing defense device, not a lantern.
Composition: exactly three separate devices centered respectively inside equal-width thirds of wide landscape canvas. Similar apparent height, same baseline. Plenty of clear transparent gutter between objects. Entire each object visible. Flame fully within image. Three-quarter near-front view, consistent lighting and scale. No ground surface.
Constraints: actual transparent alpha background, no background painted checkerboard, no text, no letters, no numbers, no labels, no creatures, no people, no extra objects, no rooms, no scenic backgrounds, no panel cards, no cast shadow outside own silhouette, no light beam. Premium polished game asset.
```

使用内置 image_gen 生成，2026-09-29。保留生成 PNG 原始透明通道。所有文字由游戏界面叠加，图片无文字。

已用 `sips` 检查尺寸和 alpha，并读取透明通道检查物件横向边界：

| 文件       | 尺寸       | alpha | 物件横向范围（含端点）                 |
| ---------- | ---------- | ----- | -------------------------------------- |
| room.png   | 1672 × 941 | 无    | 全幅背景                               |
| books.png  | 2059 × 764 | 有    | 42–498；550–1006；1058–1513；1566–2022 |
| demons.png | 2172 × 724 | 有    | 39–758；766–1435；1460–2149            |

恶魔图集的第一只尾部稍跨三等分边界，显示单个角色时应按上述真实边界裁切，避免裁掉尾部。

## room.png

参考已确认概念图，以 16:9 背景呈现档案室；右侧窗景用于叠加来袭效果。

```text
Use case: stylized-concept
Asset type: production 16:9 game background for a classroom projected castle archive escape game. Create a polished environment plate based on the two style references, with no UI.
Input images: image 1 approved visual direction, image 2 room materials, colors, lighting and artistic quality reference. Use only their castle archive art style, no words or interfaces.
Scene: rich painted 2.5D fairytale castle archive room, cobalt blue and antique gold, walnut shelves on the left edge, broad quiet dark walnut wood backdrop occupying the central 70 percent, polished wooden desk at the bottom 15 percent, warm lanterns at the outer edges. RIGHTMOST 15 percent has a single very tall narrow gothic arched window, through which a blue-purple night, a distant castle and an empty diagonal stone bridge can be seen clearly. Leave the right window unobstructed to overlay animated approaching creatures in code.
Composition: landscape 16:9, direct nearly front-on view, beautifully crafted environmental edges and immersive texture, central area visually quiet since real interactive code and paper panels will be placed there. The large center background is real room wall and wood furniture, never a fake UI panel. Left-side shelves contain natural book spines. Desk has restrained small brass objects only at corners.
Lighting: warm amber interior rim light, cool moonlit blue-purple window, cinematic but readable on projection.
Constraints: absolutely no text, no letters, no numbers, no UI, no badges, no floating panels, no parchment sheets in center, no computer monitor, no characters, no people, no monsters, no faces. Keep objects within frame. High-end detailed hand-painted game environment with subtle 3D depth. Create a new usable clean production backdrop.
```

## books.png

四栏横向图集：值守记录、行踪记录、侦察员手记、防御物资。每栏宽度为图宽四分之一。

```text
Use case: stylized-concept
Asset type: transparent game sprite atlas, a single horizontal row of FOUR equally sized upright leather archive dossiers, each in one equal width cell, no grid lines. Wide 2.7:1 canvas.
Input image is style reference only: match its richly painted tactile cobalt/gold 2.5D castle archive objects. Create separate usable dossier sprites, no surrounding room.
Left to right: (1) dark royal blue leather dossier, large embossed gold shield crest; (2) reddish walnut brown leather dossier, large embossed pair of footprint symbols; (3) forest green leather dossier, large embossed gold feather; (4) dark plum purple leather dossier, large embossed gold lantern symbol.
All FOUR dossiers front-facing straight upright, same exact height, same baseline, same camera angle with only a slight visible left book spine, ornate brass gold corner protectors and gold leaf edges. All have lower 25 percent of the front cover occupied by a clean blank ivory parchment label with thin gold border, to overlay real UI text. Upper icon large recognizable silhouette. Spacious equal margin around each separate book and no overlap. Entire book fully visible from top to bottom. Equal visual weight and spacing. High-end hand-painted adventure game illustration. Subtle self shadows only.
Constraints: actual transparent background alpha, no checkerboard painted in, no floor or room, no text, no letters, no words, no labels, no numbers, no extra objects, no drop shadow outside silhouettes. Exactly four separate dossiers in four equal cells.
```

## demons.png

三栏横向图集：炎角兽、藤甲魔、冰翼魔。沿用第二课角色形象，透明底。

```text
Use case: identity-preserve
Asset type: production transparent game sprite atlas with THREE equal-width cells in a single horizontal row. Match the exact three friendly-fierce fantasy creatures in the reference. Remove the ivory background and recompose for clean separated sprites on actual alpha.
Image 1 is the identity reference. Preserve each creature's key colors, shapes and distinctive features. Left: the four-legged charcoal rock lava bull with sweeping orange molten horns and glowing cracks. Center: the stocky green leafy wood and vine beast with branch horns and a cream face. Right: the icy blue dragon with crystalline wings, a white face and blue ice crown.
Composition: exactly three full body creatures each centered within its own equal-width third of the canvas. Same baseline and equal apparent height. Each fully inside its cell, with transparent gutters between, NO overlapping wings or horns into neighboring cells, all feet and tails visible. Shrink ice wings enough to preserve full silhouette within its cell. Three-quarter front view looking slightly left as reference, active ready-to-advance stance.
Style: premium detailed hand-painted 2.5D fantasy adventure game illustration, rich shading and dimensional texture compatible with an ornate cobalt/gold medieval archive game, maintain youthful classroom appropriate appeal, crisp readable silhouettes at small size.
Constraints: actual transparent background, no painted checkerboard, no background color, no ground, no landscape, no extra objects, no separate shadow blobs, no text, no letters, no UI. Exactly three creatures.
```
