# 第四课结课游戏场景美术

生成日期：2026-10-04。

方式：内置 `image_gen`，默认 built-in tool mode。两张均为独立新生成，不使用 CLI，不修改旧课件图片。生成前查看了 `../story-arrival.png` 与 `../story-evidence.png`，将现有蓝金城堡、夜间森林与日漫奇幻质感作为风格依据；未把旧图片作为编辑目标。

## 资源与检查

- `investigation-map.png`：1672 × 941；夜色城堡庭院探索地图。左侧暖光战报室、右侧蓝光哨塔、中央远端雾林城门均清晰，石路连通，未绘制角色、文字或界面。
- `watchpost.png`：1672 × 941；夜间隐蔽观察背景。前景枝叶和岩石形成窥视框景，中部留空，远端三队恶魔使用橙、绿、蓝区分，未出现 Boss、铃铛或指挥暗示。

两图已通过 `view_image` 实际查看。约 16:9，作为背景时建议 `object-fit: cover`。关键地点处于可视主体区，顶栏与底栏可以叠加。允许游戏通过代码添加热点、视差、灯光、粒子和观察目标；图片本身不包含交互控件。

## investigation-map.png 精确生成提示词

```text
Use case: stylized-concept
Asset type: finished widescreen 16:9 background for a polished classroom fantasy detective adventure game, 2048x1152.
Primary request: A beautifully painted, richly dimensional night-time castle courtyard investigation map seen from a slightly elevated isometric three-quarter camera. Three clearly separated large explorable places connected by winding stone paths: LEFT MIDDLE a cozy stone war-records room with a wide open warmly glowing amber doorway, visible shelves and wooden desk inside; RIGHT MIDDLE a tall blue-roof watchtower with a distinct cyan glowing observation instrument on its balcony; FAR CENTER an open castle gate leading to a misty midnight-blue forest path. The central courtyard is spacious and walkable with branching pale cobblestone routes linking the three destinations.
Style/medium: Premium hand-painted fantasy puzzle adventure game environment, Japanese animation warmth with detailed 3D-like volumes, intricate stone blocks, blue tile roofs, brass lanterns, leaves, believable perspective, strong clear silhouette design. Family-friendly magical mystery, not horror.
Composition/framing: Landscape 16:9, complete single scene, no panels. All three interaction locations are large and recognizable inside the middle 70% of the image. The top 15% is only atmospheric sky and distant castle roofs; the bottom 15% is simple foreground paving and soft foliage, reserved for interface overlays. Focus locations near normalized coordinates left .25,.52; right .76,.48; forest gate .51,.33. Plenty of unobstructed central path. Keep the camera wide enough to show the entire courtyard and connected destinations.
Lighting/mood: Moonlit indigo, rich cyan glow in watchtower, warm golden light from record-room doorway and lanterns, atmospheric haze, subtle stars, curious inviting detective mood.
Constraints: Absolutely no text, lettering, captions, labels, icons, UI, border, watermarks, logos, arrows, or characters. No demon, no boss, no hero. Production-ready environment artwork, clear visual hierarchy, avoid flat vector or generic dashboard style.
```

## watchpost.png 精确生成提示词

```text
Use case: stylized-concept
Asset type: finished widescreen 16:9 hidden observation background for a premium fantasy detective adventure game, 2048x1152.
Primary request: A secret observer's view from concealment at the edge of a magical blue mist forest at night, looking toward a distant ruined stone bridge and a quiet enemy staging camp. Large dark oak branches and fern-covered rocks frame the LEFT and RIGHT foreground like a natural lookout, while the CENTRAL MIDDLE clearing is broad, open, legible and unobstructed. The old arched stone bridge crosses a narrow stream farther back. Three small separate demon patrol groups wait in the distant background at three different points: one subtle ember-orange rocky group left beyond the clearing, one moss-green tree-armored group beside the bridge, one pale-blue icy-winged group far right. Keep all demons small, distant, equal visual emphasis, non-scary and without any visible leader. No lone hooded figure and no bell. The scene should invite careful observation and clue finding.
Style/medium: High-quality hand-painted Japanese fantasy animation with 3D-like depth, painterly intricate foliage and moss-covered masonry, premium point-and-click mystery game environment. Richly detailed but readable, family-friendly adventure, not horror.
Composition/framing: Landscape 16:9, a single coherent cinematic environment, no panels. All useful observation areas inside the middle 70% of the image. Top 15% is atmospheric treetops and moonlit sky; bottom 15% dark simple foliage and rocks, reserved for game interface overlays. Central observation clearing remains empty enough for game animation and evidence overlays; foreground frames edges without obscuring it. Perspective feels like the player is physically hiding and looking out, no visible player body.
Lighting/mood: Deep midnight cobalt and indigo, luminous cyan mist flowing low near the river, a high pale moon, subtle amber camp lantern points far away, suspenseful but wondrous calm.
Constraints: No text, labels, UI, border, arrows, logos, watermark, huge close-up creature, boss cues, crown, commanding pose, magic control beams or victory reveal. No identifiable leader. Production-ready full-screen environment painting, readable silhouettes and depth, no flat vector style.
```
