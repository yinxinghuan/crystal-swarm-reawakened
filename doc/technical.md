# Technical

## 1. 技术栈

- React 18 + TypeScript 5 负责界面状态与输入绑定。
- Canvas 2D 负责 64 枚程序化晶体、轨迹、背景尘埃、光晕与 Bloom，不依赖图片或 WebGL。
- Less 负责轻量 HUD 与响应式安全区样式。
- Vite 5 负责开发与构建，`base: './'` 保持任意部署子路径可运行。
- Web Audio API 在用户首次交互后合成短音效；音频不可用不会阻断画面。

## 2. 目录结构

- `src/CrystalSwarmReawakened/CrystalSwarmReawakened.tsx`：Canvas 舞台、HUD、提示、完成文案与恢复状态。
- `src/CrystalSwarmReawakened/hooks/useCrystalSwarm.ts`：晶体模拟、Pointer 输入、Canvas 渲染循环、阶段切换与自适应像素比。
- `src/CrystalSwarmReawakened/utils/audio.ts`：交互后才创建的 Web Audio 短音效。
- `src/CrystalSwarmReawakened/i18n/index.ts`：中文/英文文案与 `game_locale` 覆盖。
- `src/CrystalSwarmReawakened/CrystalSwarmReawakened.less`：深色舞台、图标按钮、安全区和 reduced-motion 规则。
- `doc/requirements.md`、`doc/visual.md`、`doc/interface-contract.md`、`doc/feedback-matrix.md`：需求、视觉、界面状态和反馈合同。
- `meta.json`：平台展示用标题与预留海报路径。

## 3. 核心模块

- `useCrystalSwarm` 用 refs 保存高频晶体物理、触点、轨迹与 requestAnimationFrame，只有阶段、唤醒数、静音和提示等需要 DOM 改变的状态进入 React state。
- 晶体初始以随机环带分布；触点周围按椭圆半径激活，激活后施加小引力、阻尼和高光。42 枚激活且触碰超过 5 秒后进入 Bloom。
- Canvas 会用 `ResizeObserver` 重设 dpr 画布，限制 dpr 至 2；高 dpr 或 reduced-motion 时将尘埃从 180 减至 80，并取消晶体环绕。
- Pointer 控制绑定在整块舞台，使用 `onPointerDown`、`onPointerMove` 与 `setPointerCapture`；R/M/Space 提供桌面重启、静音与中心唤醒辅助。
- 页面不接入网络、存档、榜单或生成接口；Canvas 2D 不可用时显示本地静态恢复状态。

## 4. 扩展点

- 调晶体数量、阈值、触摸半径、Bloom 时长或颜色：改 `hooks/useCrystalSwarm.ts` 顶部常量与 `draw` 中的色相规则。
- 改视觉材质、字排、HUD 位置或按钮状态：改 `CrystalSwarmReawakened.less` 并同步 `doc/visual.md`。
- 改中英文文案：改 `i18n/index.ts`；用 `localStorage.setItem('game_locale', 'en')` 后刷新验证英文。
- 增加低性能档、触觉或分享图：先更新 `doc/requirements.md` 与反馈矩阵，再扩展 hook 中的输入/输出通道。
