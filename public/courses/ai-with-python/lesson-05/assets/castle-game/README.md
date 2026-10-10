# 魔堡潜入角色素材

- 日期：2026-10-10。
- 工具：内置 `image_gen`，使用 imagegen 技能的透明背景编辑流程。
- 新素材：`warrior.png`，1122 × 1402，RGBA。
- 编辑目标：第一课 `assets/final-guardian-hero.png`。移除黑底，保留既有棕发勇士、蓝金铠甲、蓝披风、盾牌与武器；不覆盖原图。
- 实际检查：透明通道正确，完整头身、盾牌和武器可见，并在游戏三种投屏尺寸中检查合成。
- 恶魔直接复用第三课 `assets/archive-siege/demons.png`，通过原 `DemonSprite` 的真实边界裁切三族；不生成替代角色。
- 月夜背景复用第四课 `assets/shield-game/arena.png`。主场景沿用初版的连通魔堡结构，以 SVG 石墙、塔楼、铺路、长桥、炮台与档案门呈现空间；人物脚底沿同一条道路移动。之前的静态档案室版本曾使用第三课 `assets/archive-siege/room.png`，当前场景统一展示整座魔堡。
- 光影、扫描、诱饵、行走、开门、退雾和粒子由独立 CSS 与 SVG 图层实现；不生成新角色。目标 D004 的角色形象在档案核实后显示，图中布局不代替真实数值证据。

## 最终编辑提示词

Use case: background-extraction. Asset type: transparent full-body character cutout for an existing classroom fantasy game. Input image 1 is the edit target, the established young brown-haired hero in cobalt blue and gold armor, blue scarf and cape, holding a blue-gold shield and short spear. Remove ONLY the solid black background and return true transparent alpha. Preserve the exact face, hair, pose, costume, armor ornament, shield, weapon, body proportions, detailed illustrated rendering, and original colors. Preserve the whole character head to feet, full shield and full weapon with a narrow transparent safe margin. No ground, no background, no shadow rectangle, no black matte, no extra objects, no text, no watermark. This is a clean background removal edit, not a character redesign.
