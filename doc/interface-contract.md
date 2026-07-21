# Game Screen Contract

## Global environment

- Playfield type: 混合；Canvas 画布全屏，轻量 DOM HUD 覆盖。
- Target viewports and orientation: 390 × 844、320 × 568 竖屏；桌面只作预览。
- Input methods: 单指 Pointer、鼠标拖拽、键盘 R/M/Space。
- Platform overlays and safe areas: 顶部预留 56 px、底部预留 64 px，额外读取 `env(safe-area-inset-*)`。
- Persistent navigation or watermark: 右上静音、左下重启、右下很低调的系列标记。

## Screen/state

### Idle / entry

- Entry condition: 首次加载或重启的 0–3 秒。
- Player question: 这里能做什么？
- Primary focus: 中心偏下的一枚暗晶与少量漂浮尘埃。
- Primary action: 在画布上划动。
- Secondary actions: 静音、重启。
- Persistent information: 标题 `CRYSTAL SWARM`。
- Temporary feedback: `划过黑暗，唤醒晶体` 4.5 秒后逐渐减弱，但在首个移动前保持可读。
- Exit/recovery path: 任意触碰进入 Awaken；Canvas 不可用显示静态恢复状态。
- Loading/empty/error behavior: Canvas 不可用时显示“此设备无法点亮晶体 / Try restarting this experience”及重启。
- Long-copy/localization behavior: 中文提示不超过 12 字；英文最多两行。
- Narrow/short viewport behavior: 标题缩至 15 px，提示移到距离顶部 80 px；不会压缩中心画布。
- Required screenshot or motion evidence: idle-390x844、idle-320x568。

### Awaken / core

- Entry condition: 第一次 pointer down。
- Player question: 我能把这群晶体带到哪里？
- Primary focus: 手指附近的折射轨迹与新亮起的晶体。
- Primary action: 连续划动。
- Secondary actions: 静音、重启。
- Persistent information: 小型唤醒文字 `N / 42` 仅在第 8 枚后出现，2 秒无新唤醒则淡出。
- Temporary feedback: 触点涟漪、晶体亮起、阶段环与短钟声。
- Exit/recovery path: 随时重启；停止输入只进入环境呼吸，不惩罚。
- Loading/empty/error behavior: 无网络依赖；运行异常时显示静态恢复状态。
- Long-copy/localization behavior: 计数固定短格式。
- Narrow/short viewport behavior: 计数避开右上静音，活动区域不缩小。
- Required screenshot or motion evidence: awaken-390x844、awaken-320x568、gesture sequence。

### Bloom / completion

- Entry condition: 唤醒第 42 枚且已交互超过 5 秒。
- Player question: 这次生成的景象是什么？
- Primary focus: 中心星云与环绕棱晶。
- Primary action: 停留、截图或重启。
- Secondary actions: 静音、重启。
- Persistent information: 隐藏进度，保留标题和图标。
- Temporary feedback: `留住这一刻 / Hold this moment` 4 秒，随后只留景象。
- Exit/recovery path: 重启把晶体倒吸到首屏；再次触碰可让已完成画面轻微呼吸。
- Loading/empty/error behavior: 无。
- Long-copy/localization behavior: 英文允许一行，中文一行。
- Narrow/short viewport behavior: 文案置于中心上方 24 px，不能压住星云中心。
- Required screenshot or motion evidence: bloom-390x844、bloom-320x568、peak sequence。

## Component state matrix

| Component | Default | Pressed | Focus | Disabled | Loading | Success/error |
| --- | --- | --- | --- | --- | --- | --- |
| 静音按钮 | 24 px 线性声波 | 0.9 缩放 | 2 px 青色环 | 无 | 无 | 静音时改为斜杠图标 |
| 重启按钮 | 24 px 线性回环箭头 | 0.9 缩放 | 2 px 青色环 | 无 | 无 | 重启时触发倒吸视觉 |
| 画布 | 暗晶呼吸 | 同帧涟漪 | 无 | 不可用时隐藏 | 首屏已渲染 | Bloom 时冻结并慢呼吸 |

## HUD contract

- Protected gameplay/finger area: X=24–366、Y=112–760，中心直径 250 px 始终无 HUD。
- Stable HUD regions: 标题左上、静音右上、重启左下、系列标记右下。
- Quiet persistent information: 标题/图标透明度不高于 0.8；计数仅在交互后短暂显示。
- High-emphasis warnings/rewards: 只有 Bloom 文案可提升到全不透明。
- Maximum score/name/copy lengths: 不用分数/名字；中英文提示最多 24 个拉丁字符或 12 个 CJK 字符。

## Onboarding contract

- First action to teach: 单指划过画布。
- Demonstration: 首屏暗晶每 2.4 秒发出一次细小折射脉冲，朝一个短弧线方向偏移。
- Practice response: 第一次按下立即有一圈涟漪，首次拖动点亮至少 1 枚晶体。
- Dismissal condition: 第一次连续移动超过 18 px 后，提示在 280 ms 内淡出。
- Fallback instruction: 12 秒仍无移动时，提示重新提升至 0.82 不透明度。
