# VINNO 设计系统

方向：未来感的科研基础设施。深色、留白、细线，不用宠物插画，也不用大面积发光渐变。

## 色彩

变量定义在 `src/app/globals.css` 的 `:root`。

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--color-bg` | `#07111F` | 页面背景 |
| `--color-bg-secondary` | `#0B1929` | 交替章节 |
| `--color-bg-card` | `#102338` | 卡片 |
| `--color-primary` | `#46C8E8` | 链接、当前项、主按钮 |
| `--color-secondary` | `#7A9FE8` | 次级线条与「已规划」 |
| `--color-accent` | `#67E0D1` | 少量数据连接 |
| `--color-ai` | `#8F86D6` | 只用于 AI 模块的中心与选中描边 |
| `--color-text-primary` | `#F3F7FB` | 标题与正文重点 |
| `--color-text-secondary` | `#9BAFC1` | 正文。小字号标签也用它，以保证对比度 |
| `--color-text-muted` | `#657D91` | 装饰性序号，不用于 12px 以下的说明文字 |
| `--color-border` | `rgba(160, 195, 220, 0.16)` | 分割线与卡片边 |

主按钮用冰川蓝底、深色字。其余按钮是细边框。

## 字体

- 英文标题：Space Grotesk，字重 500，字距略紧
- 英文正文：Inter
- 中文：Noto Sans SC，只在 `/zh` 加载
- 中文标题在 Space Grotesk 缺字时落到 Noto Sans SC

不额外加载 IBM Plex Sans，避免再下一套英文正文。

## 版式

- 外层最大宽度 1440px，左右边距桌面 5vw、手机 20px
- 内文最大宽度 1240px
- 章节上下间距桌面约 128px，手机约 80px
- 卡片圆角 16px
- 锚点预留 5.5rem，避免被固定导航挡住

## 组件

- `Button`：主按钮与次按钮，高度至少 44px
- `Card` / `.surface`：统一底色和边线
- `SectionHeading`：序号、标题、副标题
- `StatusBadge`：只读取 `status.ts` 的四种状态
- `AnimatedReveal`：进入视口一次。系统开启「减少动效」时不位移
- `Logo`：字标，不使用图片照片

## 动效

- 滚动显现、架构与网络上的一条虚线流动
- 桌面端首屏在支持 WebGL、非窄屏、未开启减少动效时加载三维网络，离开视口后停止渲染
- 手机、省流和减少动效使用同一套静态图形
- 不用滚动锁定

## 语言

英文在 `/en`，中文在 `/zh`。同一段落不中英混排。中文页在文末保留英文品牌口号，并在下面给出中文表达。
