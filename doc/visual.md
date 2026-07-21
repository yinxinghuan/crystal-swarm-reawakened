# Visual Bible — Crystal Swarm: Reawakened

## 1. Visual thesis

- Game and audience: 为内容流用户准备的 45–75 秒单指感官体验。
- Emotional promise: 你的手势使沉睡在黑暗里的晶体获得生命，并留下独一无二的短暂宇宙。
- One-sentence visual thesis: **在深海般的暗场中，几何棱晶被手指留下的折射裂光逐一唤醒，最终汇成带有极光色散的星云花。**
- Signature visual moment: 42 枚晶体围成旋转螺旋，中心的青绿/洋红星云连续脉冲三次。
- Three required qualities: 黑而不死、锐利而不冰冷、稀疏开场而密集收束。
- Three directions to avoid: 游戏 HUD 感、霓虹赛博网格、泛滥的紫粉渐变。

## 2. Composition and camera

- Orientation and aspect ratios: 竖屏，优先 390 × 844；兼容 320 × 568。
- Camera and perspective: 正交的微观舞台，无地平线；所有晶体带 6–12 px 的伪 3D 高光边。
- Playfield focal area: 中心 X=195、Y=430，允许向用户路径偏移 60 px。
- Foreground, midground, background: 前景为细碎尘埃和折射线，中景为晶体群，背景为黑蓝径向雾和极少量远星。
- HUD safe areas: 顶部 56 px 仅放标题与静音；底部 64 px 仅放重启及水印，不能覆盖可触主区域。
- Attention path: 暗点 → 手指轨迹 → 逐个唤醒的晶体 → 中心星云。

## 3. Color

- Background, surfaces, text, and muted text: 深空 `#050913`、雾蓝 `#0B1730`、主文字 `#EAF5FF`、次文字 `#90A6BC`。
- Player/subject, action, reward, danger, success: 棱晶青 `#77F7E6`、电蓝 `#77ACFF`、极光洋红 `#F59AEF`、罕见金色 `#FFE7A4`；无危险红。
- Usage ratios: 82% 深色、10% 蓝青、6% 白蓝高光、2% 洋红/金色峰值。
- Forbidden combinations: 大面积紫粉渐变、纯白背景、红绿对撞和面板玻璃拟态。

## 4. Typography

- Display: `Georgia`, `Noto Serif SC`, serif；UI/body: `Inter`, `PingFang SC`, sans-serif；数值不用作常驻 HUD。
- Size, weight, case, tracking, and outline rules: 标题 18 px/600，提示 14 px/400，峰值文案 15 px/500；标题可 0.12em 字距，其他文字正常；不加描边和文字发光。

## 5. Shape, material, and lighting

- Dominant shapes and corner language: 细长不规则六边棱晶与短线轨迹；按钮是 44 px 透明圆形命中区，图标不包胶囊卡。
- Outline, border, and shadow rules: 晶体有 1 px 半透明白蓝高光边；界面只用 1 px `rgba(170,224,255,.18)` 细线，不用投影。
- Materials and textures: 半透明玻璃、折射边与冷雾；Canvas 噪点仅限背景，颗粒不应像雪花。
- Light direction and atmosphere: 高光从左上方 35° 来，峰值时中心有短促背光但不泛白。

## 6. Characters, environments, and assets

- Proportions and silhouettes: 每枚晶体 8–26 px 长，宽度为长度 0.34–0.58；尖端不规则。
- Expression and pose range: 无角色；晶体静止时缓慢漂浮，激活后向轨迹微倾，峰值时轨道旋转。
- Perspective, scale, detail density, edge treatment: 纯 Canvas 程序化，无贴图或 AI 素材；大晶体少、小晶体多，边缘干净不锯齿。
- Export size, format, alpha, and cropping rules: 无批量视觉素材；图标内联 SVG，`viewBox` 24 × 24，描边 1.6 px。

## 7. UI and icons

- Icon family and sizing: 自绘圆角线性 SVG，24 × 24，统一 `stroke-linecap=round`、`stroke-linejoin=round`。
- Button hierarchy and targets: 静音在右上、重启在左下，透明 44 × 44 命中区；首次提示后不显示开始按钮。
- HUD and panel treatment: 不使用卡片或面板；文字漂浮在暗场上，用低不透明度雾化确保可读。
- Default, pressed, focus, disabled, loading, warning, success states: 按下图标缩放至 0.9/120 ms，键盘焦点有 2 px 青色外环；Canvas 不可用时显示文字恢复提示；峰值文案只出现 4 秒。
- Emoji policy: never use emoji as functional UI icons.

## 8. Motion and VFX

- Motion personality and duration tokens: 迅速回应、缓慢聚合；120 ms 接触、240 ms 激活、800 ms 漂浮、5,400 ms 峰值，`cubic-bezier(.2,.8,.2,1)`。
- Hit/reward timing: 新触点同帧出现一圈折射环；晶体在 80 ms 内变亮，进度阈值以 320 ms 扩散响应。
- Particle shape, palette, density, and lifetime: 背景尘埃 180 粒/4–9 px，轨迹碎光 18 段/2.2 秒，峰值中心微粒 110 粒/1.4 秒；青蓝为主，洋红只在峰值出现。
- Screen shake/freeze limits: 不做屏幕抖动；峰值后画面在 600 ms 内慢下来并停驻。
- Reduced-motion behavior: 取消环绕旋转和拖影，改为静态颜色扩散与低频亮度呼吸；所有成果仍可完成。

## 9. References translated into principles

- Reference: HAS Studio 的实时实验。[HAS Studio](https://has.studio/)
- Useful principle: 用户输入应立即而明显地改变模拟，而不是只触发装饰动画。
- Adaptation: 手势附近的棱晶本地先亮起，再把效果传播到群体。
- Element not to copy: 不复制其具体的图像马赛克或项目界面。
- Reference: False Earth 的活环境叙事。[False Earth](https://tympanus.net/codrops/2026/04/21/false-earth-from-webgl-limits-to-a-webgpu-driven-world/)
- Useful principle: 环境应该像在自行呼吸，用户只是介入它。
- Adaptation: 晶体在未触及和峰值后仍具有微弱的群体运动。
- Element not to copy: 不制作写实地形或全 3D 摄像机。

## 10. Anti-patterns

- Forbidden icon/asset styles: Emoji 功能图标、游戏币/奖杯/进度条、通用圆角玻璃面板。
- Forbidden effects and color behavior: 全屏扫描线、RGB 故障、无边界 bloom、持续抖动、全程粉紫霓虹。
- Generic patterns to avoid: “点击开始”遮挡首屏奇观、显性分数、提示段落和教程弹窗。
- Examples of visual drift: 让晶体变成普通宝石贴图，或把场景做成科技仪表盘。

## 11. Vertical-slice acceptance

- Entry/start: 首屏 3 秒内可见一枚会呼吸的暗晶与不超过 12 字的手势提示。
- Gameplay: 拖动会同帧产生轨迹，晶体逐步亮起、追随并保持已唤醒状态。
- High-feedback moment: 达到第 42 枚时，形成 5.4 秒的星云花峰值，视觉密度明显高于首屏。
- Completion/end: 峰值停驻可截图；重启像倒吸回去，而非黑屏切换。
- Narrow mobile: 320 × 568 仍能看清标题、按钮、提示和中心构图，核心手势区不被遮挡。
- Visual QA findings and decision: 已检查 390 × 844 的首屏、拖动唤醒、Bloom，以及 320 × 568 的首屏。修复了“用户过快达到 42 枚时不会进入 Bloom”的状态门槛；首屏、核心反馈、完成构图和窄屏均通过。未发现 P0/P1；P2 观察项是后续可增加导出分享图，但不影响首次体验。
