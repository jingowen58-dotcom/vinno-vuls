# VINNO 网站项目审计（PHASE 0）

审计日期：2026-10-31  
审计范围：`/Users/kaixinkele/Desktop/宠物平台`（Git 远程 `jingowen58-dotcom/vinno-vuls`）  
结论：当前仓库是数据标准与参考验证工具，不是网站。官网应新建在 `vinno-website/`，不改写标准与验证器。

## 当前项目状态

仓库只有两条已落地的工作线：

| 目录 | 作用 | 状态 |
| --- | --- | --- |
| `vinno-universal-data-standard` | VULS 字段、规则、词典、虚构示例 | 草案，公开版本记到 0.2.4 |
| `vinno-data-validator` | 检查记录、修订链和数据集清单的 Python 参考实现 | 可用的命令行工具，不是科研平台 |

根目录 `README.md` 写明：这个仓库目前只放数据标准，不放商城，也不放科研门户。示例全部是虚构数据。草案没有经过兽医审核。

没有发现：

- `package.json`、Next.js、React 或任何前端工程
- 品牌官网、页面组件、设计稿或 logo 文件
- 用户系统、数据库服务、AI 服务、支付或订单
- 已发布的合作机构、用户规模或科研成果

Git 分支为 `main`，跟踪 `origin/main`。远程是 `https://github.com/jingowen58-dotcom/vinno-vuls.git`。

## 现有技术栈

- 标准：JSON Schema、YAML 词典、Markdown 规范（`spec/VULS_0.1.0.md`、`spec/VULS_0.2.0.md`）
- 验证器：Python 3，包名 `vuls_validator`，命令 `vuls`
- 测试：pytest
- 网站技术栈：无。需要从零建立，且不能覆盖上述目录

## 代码库里已经可以对外说明的能力

这些能力是草案，不是临床标准，也不是已上线产品。

已有：

- 家犬单次观察的数据结构。词典中的物种是 `Canis lupus familiaris`，配置状态为 `initial`
- 五个犬用概念：体重、体况评分、进食量、活动时长、粪便性状。粪便性状标明为临时分类 `VINNO_STOOL_CATEGORY_0.1`，不是临床评分
- 0.2 草案中的主体、研究、入组、观察分开存储。同一只狗可以在一个研究里留下多次观察
- 测量时间与录入时间分开；方法、设备、观察者、来源、质量和许可以及修订链分开
- 更正写成新版本，旧值保留，撤销不删除文件
- 数据集清单用 SHA-256 锁定文件。`dataset_version` 与 `vuls_version` 分开
- 开放记录必须写明许可。清单不能给出观察记录本身不允许的用途
- 参考验证器可以检查结构、词典、修订链和清单。它不判断动物是否健康

明确没有：

- 家猫数据配置。`species.yaml` 把 `Felis catus` 标为 `planned`。猫的示例记录按无效示例处理
- 其他人、其他动物、多组学、实验室检验面板
- 兽医审核、疾病定义、寿命预测、临床参考区间
- 按结构、测量、来源、审核、授权和版本链分开书写、且不打总分的质量报告。根 README 把这件事列为下一步
- 宠物健康档案产品、检测订单、健康寿命数据库、文献目录
- AI 问答、知识图谱、开放协作门户
- 任何真实合作机构接入

跨物种规则以仓库原文为准：同名指标不能把犬、猫和人当成可以直接比较的对象。

## 可复用资源

- 品牌与能力边界：根 `README.md`、标准 `README.md`、`CHANGELOG.md`
- 真实进度：`dictionaries/species.yaml`、`dictionaries/concepts.yaml`、`schemas/0.2/`
- 可公开引用的地址：`https://github.com/jingowen58-dotcom/vinno-vuls`
- 视觉素材：无。首屏和架构图用代码绘制，不使用库存照片，也不编造合作地图

网站路线图的状态只从 `vinno-website/src/config/status.ts` 和 `roadmap.ts` 读取。初始状态按上表填写，不把愿景标成已实现。

## 需要新增的模块

在 `vinno-website/` 新建 Next.js 官网，包含任务书中的首页章节、中英路由、交互式六层架构、科研方向、概念性 AI 图、路线图和页脚。不新增空的产品子站。

部署目标使用现有 GitHub 仓库的 Pages，站点路径为 `/vinno-vuls`。不把标准仓库改造成应用后端。

## 技术风险

1. 静态 Pages 不能承载数据库、登录和 AI。首期本来就不要这些功能，用静态导出即可。
2. 三维地球会影响性能。桌面端按需加载 WebGL；窄屏、减少动效和没有 WebGL 时改为静态图形。
3. 若把营销文案写进标准仓库的根 README，会冲淡“这里只放数据标准”的边界。根 README 只增加一段指向网站目录的说明。
4. 项目 Pages 的资源前缀必须是 `/vinno-vuls`。本地开发不使用这个前缀。
5. 没有真实对外邮箱。页脚不显示虚构地址，只指向已经存在的 GitHub 仓库。

## 开发顺序

1. 设计系统与基础组件，不改 `vinno-universal-data-standard` 和 `vinno-data-validator`
2. 导航、首屏、愿景、问题、三大引擎
3. 六层架构、VULS、五大方向
4. AI 概念图与开放网络，全部标明为规划
5. 路线图、未来、页脚、SEO
6. 类型检查、lint、生产构建、桌面与手机视口核对
7. 推送到现有 GitHub 仓库，并用 Actions 发布 Pages

## 状态对照（写入网站配置）

| 事项 | 状态 | 依据 |
| --- | --- | --- |
| 参考验证器 | Implemented | `vuls` 已能检查草案记录、修订链和清单 |
| VULS 草案、犬用数据结构、核心对象、质量与来源字段、记录级许可 | In Progress | 0.2.4 草案已在仓库中，未完成兽医审核，也还不是完整标准 |
| 宠物数字档案、检测产品、随访服务、健康寿命数据库 | Planned | 根 README 明确排在当前链路稳定之后 |
| 文献智能、知识图谱、AI 助手、比较生物学、全球协作网络 | Long-term Vision | 根 README 写明 AI 与开放门户更晚；仓库中没有这些系统 |
