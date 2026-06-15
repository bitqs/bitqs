# 计划阶段的开发语言/技术栈选型 × 人机配合

> **一份深度研究报告** — 在软件项目的「计划阶段」，如何根据不同的**人群 / 需求 / 项目类型**选择开发语言，以及在这个决策过程中**人与 AI 如何分工配合**。
>
> 研究日期：2026-06 · 检索语言：中文 + 英文（多语言）· 作者：bitqs（人 + AI 协作产出）

---

## 目录

1. [TL;DR — 一页结论](#tldr--一页结论)
2. [研究方法与可信度说明](#研究方法与可信度说明)
3. [第一层：通用选型方法论与决策框架](#第一层通用选型方法论与决策框架)
4. [核心交付物：三张决策矩阵](#核心交付物三张决策矩阵)
5. [第二层：indie / 游戏×AI / 创意工具 / 视频自动化 场景落地](#第二层indie--游戏ai--创意工具--视频自动化-场景落地)
6. [第三层：人机配合 — 选型与规划阶段的协作工作流](#第三层人机配合--选型与规划阶段的协作工作流)
7. [落到 bitqs 自己的栈：一份具体建议](#落到-bitqs-自己的栈一份具体建议)
8. [附录：全部来源清单](#附录全部来源清单)

---

## TL;DR — 一页结论

1. **没有"最好的语言"，只有"对这个人群 + 这个需求 + 这个项目最合适的语言"。** 学术界与工业界一致：语言/栈选型是一个**多准则决策（MCDM）**问题，应显式权衡 trade-off，而非凭个人偏好。([ScienceDirect 七案例论文](https://www.sciencedirect.com/science/article/pii/S0950584921001051))

2. **把选型当成一项正式决策来做**：定义评估维度 → 加权打分（5–8 个判据）→ 跑轻量原型（PoC）验证 → 用 **ADR（架构决策记录）** 把"为什么选它、放弃了什么"写进代码仓库。([加权评分法](https://www.savio.io/product-roadmap/weighted-scoring-model/) · [ThoughtWorks ADR](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records))

3. **默认"选无聊技术"**：每个团队的"创新代币（innovation tokens）"有限（约 3 个），把它们花在真正的业务创新上，而不是用新潮技术替换成熟件。警惕"简历驱动开发"反模式。([Choose Boring Technology](https://mcfunley.com/choose-boring-technology))

4. **平台/受众约束常常直接锁死选择**：目标在浏览器、要零安装 → 几乎只能 JavaScript/TypeScript（及 WebAssembly 作补充）。([为什么浏览器只说 JS](https://dev.to/umarsiddique010/the-chosen-one-why-the-browser-speaks-only-javascript-and-why-we-cant-replace-it-450a))

5. **团队技能 + 招聘市场是最现实的约束**：Python/JavaScript/Java 人才池最深；Rust 虽连年"最受推崇"（2025 约 72–83%）但实际使用率仅约 12.6%，团队采用要算上 2–6 个月学习曲线和招聘成本。([Stack Overflow 2024/2025](https://survey.stackoverflow.co/2024/technology))

6. **人机配合的黄金分工**：**技术选型与架构权衡仍是人类的活**；AI 适合起草规格、拆解任务、扩展候选方案、做一致性检查。规格驱动开发（Spec Kit / Kiro）已把这条原则固化进流程——技术栈决策被刻意推迟到 `plan` 阶段、由人类填入。([GitHub Spec Kit](https://raw.githubusercontent.com/github/spec-kit/main/README.md))

7. **别被 AI 提效数字带偏**：同样是严谨 RCT，METR 实测 AI 让资深开发者在**熟悉的成熟仓库**里慢了 **19%**，而 GitHub Copilot 实测**孤立绿地小任务**快 **55.8%**。场景决定结论。DORA 2025 的定性最准：**AI 是放大器，不会修复团队，只会放大已有的好坏**。([METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) · [Copilot RCT](https://arxiv.org/abs/2302.06590) · [DORA 2025](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report))

---

## 研究方法与可信度说明

- **检索方式**：围绕 5 个角度（通用方法论 / 按项目类型 / 按人群与团队 / indie 与创意场景 / 人机配合）做多语言（中 + 英）并行检索，覆盖一手与权威来源。
- **可信度分级**：每条结论标注 **高 / 中 / 低**。
  - **高** = 一手来源（官方文档、GitHub 仓库、政府机构、严谨 RCT 论文）或多源交叉印证。
  - **中** = 二手统计、行业博客、趋势性判断、单一来源的具体数字。
- **已知局限**：本轮检索环境对多数第三方站点的全文抓取（WebFetch）返回 403，仅少数 GitHub / 官方页面完成逐字深读；其余结论基于搜索引擎返回的、引用了权威页面的摘要并经多源交叉印证。**凡涉及精确百分比的"中"可信度数字，引用前建议回原始报告页二次核对。**
- **对抗式核查的一个重要发现**：AI 提效的两个 RCT 数字（−19% 与 +55.8%）看似矛盾，实为**不同场景**，本报告在第三层显式拆解，避免误导。

---

## 第一层：通用选型方法论与决策框架

### 1. 先拆需求，再谈语言

选型的第一步不是比语言，而是拆解需求，分清两类：

| 需求类型 | 包含 | 对选型的影响 |
|---|---|---|
| **功能性需求** | 实时性、外部系统集成、复杂数据处理、多平台支持 | 决定"能不能做"，常直接排除某些栈 |
| **非功能性需求** | 性能、可扩展性、安全/合规、用户体验、预期负载、响应时间 | 决定"做得好不好"，是权衡的主战场 |

> 可信度：高。来源：[需求拆解指南](https://www.trendlypost.com/technology-stack-how-to-choose-the-right-stack-for-projects/)

### 2. 六个核心评估维度

最常被引用的一组评估维度（可作为打分表的行）：

1. **项目目标 / 需求匹配度**
2. **团队技能与上手成本**（现有专长、学习曲线）
3. **性能与可扩展性**（以未来 3–5 年业务量为基准，而非当前量）
4. **可维护性与长期生命力**（社区是否活跃、是否有持续投入、问题解决速度、业界案例）
5. **安全与合规**
6. **总体拥有成本 TCO**（开发成本 + 维护成本 + 招聘成本）

> 可信度：高（多源一致）。学术界（七工业案例决策模型）特别强调 **"开发者可获得性（招聘/人才池）"** 与 **"文档一致性/质量"** 是关键判据。来源：[选型维度](https://www.linkedin.com/pulse/choosing-right-tech-stack-strategic-decision-bill-rappleye) · [ScienceDirect 论文](https://www.sciencedirect.com/science/article/pii/S0950584921001051) · [可扩展性以 3-5 年为基准](https://blog.csdn.net/2503_92849275/article/details/149817721)

### 3. 三种可落地的决策框架

| 框架 | 怎么用 | 适用场景 | 可信度 |
|---|---|---|---|
| **加权评分矩阵**（Weighted Scoring Matrix） | 给每个判据设权重 → 给每个候选方案在各判据打分 → 求 Σ(权重×分数) 排序。判据控制在 **5–8 个**（超过 10 个会稀释信号） | 日常选型最常用、最轻量 | 高 |
| **AHP 层次分析法**（多准则决策 MCDM） | 用 Saaty 标度做两两成对比较，把主观因素定量化，输出优先级排序 | 判据多、利益相关方多、需要正式论证时 | 高 |
| **ADR 架构决策记录** | 用轻量 Markdown 记录每个重要决策的 **Status / Context / Decision / Consequences / Alternatives / Trade-offs**，**与代码同仓库**而非放 wiki | 记录"为什么这么选"，给未来的自己/团队 | 高 |

> 来源：[加权评分法](https://www.savio.io/product-roadmap/weighted-scoring-model/) · [判据数量 5-8](https://productschool.com/blog/product-fundamentals/weighted-scoring-model) · [AHP](https://www.6sigma.us/six-sigma-in-focus/analytic-hierarchy-process-ahp/) · [ThoughtWorks ADR](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records) · [ADR 模板仓库](https://github.com/joelparkerhenderson/architecture-decision-record)。中文社区也建议用 CMMI 的 **DAR（决策分析与解决）** 模型把准则量化：[DAR](https://blog.csdn.net/justyman/article/details/118267283)

### 4. 推荐的决策流程（数据驱动）

> 定义评分判据 → 跑轻量级原型（PoC）实测 → 比较预期 TCO → 写 ADR 归档。语言选型应是一项**预留专门资源和时间的正式决策**，最终决策权通常在架构师/项目负责人，而非个人偏好。可信度：高。来源：[数据驱动选型](https://upplabs.com/blog/how-to-choose-a-technology-stack-for-your-startup/)

### 5. 反模式：什么时候"不要"选某语言

- **"选无聊技术"原则（Dan McKinley, 2015）**：每个团队约只有 **3 个"创新代币"**，应花在真正的业务产品上，而非用新潮但未经验证的技术替换 PostgreSQL 这类成熟件——新技术的"未知的未知"更多。可信度：高。([原文](https://mcfunley.com/choose-boring-technology))
- **"简历驱动开发"反模式**：为了简历好看而引入时髦语言，作者交付后离开，留下全职团队无法维护的系统。可信度：中。([来源](https://www.goodreads.com/author_blog_posts/2146268-aligning-business-programmer-goals))
- **招聘单点故障**：例如 Go 的公开岗位约为 Rust 的 3–4 倍；若小团队上 Rust，专长易集中在 2–3 名资深人身上，形成单点故障。**没有"Rust 形状的具体问题"时，不要默认重写。** 可信度：中。([Rust vs Go 服务级决策](https://deepengineering.substack.com/p/issue51-rust-vs-go-service-level-backend-decisions))

---

## 核心交付物：三张决策矩阵

### 矩阵 A：按「项目类型」→ 推荐语言/技术栈

| 项目类型 | 首选 | 备选 / 何时换 | 关键依据 | 可信度 |
|---|---|---|---|---|
| **Web 前端** | **TypeScript + React**（生态/岗位最大，配 Next.js）或 **Vue**（上手快、中文资源足） | 追求极致体积/性能 → Svelte（满意度最高约 88%，但生态/岗位小）；强约定大企业 → Angular | React 使用率约 44.7% 居首；TS 已成事实标准（约 67% 开发者写 TS 多于 JS） | 高 |
| **Web 后端** | **Node.js（TS）** 全栈统一 / **Python** 快速开发 | 高并发云原生 → Go；大型企业 → Java；极致性能安全 → Rust | Node.js 使用率约 48.7%；Python 2025 同比 +7% | 高/中 |
| **移动端** | **跨平台 Flutter（Dart）约 46%** 或 **React Native（JS/TS）约 35%** | 极致性能/最小内存/深度系统集成 → 原生 Swift / Kotlin | Flutter UI 一致性强；RN 适合已有 JS 团队 | 中 |
| **浏览器 2D 游戏** | **Phaser 3/4（TypeScript）+ Vite** | 需要原生级 3D/重渲染 → 换引擎 | Phaser 免费开源、Canvas/WebGL、官方 TS+Vite 模板 | 高 |
| **移动/跨平台游戏** | **Unity（C#）** | — | 约 71% 头部移动游戏用 Unity；Steam 上架数第一（51%） | 高 |
| **免费许可的独立 2D 游戏** | **Godot（GDScript/C#）** | — | MIT 永久免费、专用 2D 渲染管线 | 高 |
| **照片级高保真 3D / AAA** | **Unreal（C++ / Blueprints）** | — | Nanite + Lumen；按销量份额 31% 居首 | 高 |
| **前沿/性能+内存安全的游戏** | **Bevy（Rust）** | 想快速出货 → 改用 Godot/Unity | ECS 架构、WASM 支持；但官方警告"早期阶段、API 每 3 月有破坏性变更" | 高 |
| **数据科学 / ML / AI** | **Python**（NumPy/pandas/scikit-learn 三件套 + **PyTorch**） | 统计/学术 → R；TPU 超大规模训练 → JAX；性能/边缘推理 → C++ | 数据科学从业者 Python 接受度约 88%；PyTorch 占顶会论文约 80–85% | 高/中 |
| **脚本 / 自动化** | **Python**（生态最丰富） | 系统胶水/短脚本 → Bash；Windows/Azure → PowerShell | 超 60% IT 专业人士首选 Python 做脚本 | 高/中 |
| **系统级 / 高性能** | **Rust**（安全+性能+底层控制） | 高并发网络服务 → Go；存量/最成熟生态/HFT → C/C++ | CISA 推荐迁移内存安全语言；Google Android 内存漏洞从 76% 降到 <20% | 高 |
| **Serverless / 边缘** | **JavaScript/TypeScript**（Cloudflare Workers 原生 V8 isolates） | CPU 密集/复用 Rust 库 → Rust + WASM（workers-rs） | Workers 启动 <1ms；免费档约 10 万请求/天 | 高 |

> 主要来源：游戏引擎份额 [VG Insights/GameDevReports](https://gamedevreports.substack.com/p/video-game-insights-game-engines)、[80.lv](https://80.lv/articles/less-than-10-of-games-released-on-steam-in-2024-were-made-with-proprierary-engines)、[App Radar](https://appradar.com/blog/mobile-game-engines-development-platforms)；前端 [SO 2025 + State of JS 2024 汇编](https://gist.github.com/tkrotoff/b1caa4c3a185629299ec234d2314e190)；数据科学 [Kaggle](https://www.kaggle.com/kaggle-survey-2022)、[Hugging Face](https://huggingface.co/docs/transformers/en/index)；系统级 [CISA](https://www.cisa.gov/news-events/news/urgent-need-memory-safety-software-products)、[Android 内存安全](https://source.android.com/docs/security/test/memory-safety)；边缘 [workers-rs](https://github.com/cloudflare/workers-rs)。

### 矩阵 B：按「人群 / 团队因素」→ 对选型的影响

| 人群/团队因素 | 实际影响 | 数据支撑 | 可信度 |
|---|---|---|---|
| **团队现有技能** | 优先选匹配现有专长的语言；引入不熟语言会拖慢生产力、积累架构债 | 行业实践共识 | 中 |
| **招聘市场 / 人才池** | Python/JavaScript/Java 最易招；Rust 等小众语言人才稀缺、要价高 | 约 42% 招聘方找 Python、约 41.6% 找 JS；Go 岗位约为 Rust 的 3–4 倍 | 中 |
| **学习曲线** | 需快速扩张团队/带新人 → 偏向 Python（最易上手）；Rust 需 2–6 个月才熟练 | Python 语法接近英语、社区最大 | 中 |
| **开发者趋势（顺势招人/留人）** | Python、TypeScript、Rust 是增长最快的三门语言 | TS 2017→2024 从 12%→35%；Python→57%；Rust→11%（JetBrains 2024） | 高 |
| **全球 vs 中国差异** | 中国市场 Java 仍最常用（约 40%），Python 紧随（约 35%）；与全球 GitHub"Python 登顶"有地域差 | CSDN《2024 中国开发者调查》 | 中 |
| **受众/平台约束** | 目标在浏览器、要零安装 → 锁定 JS/TS；需高性能+零安装 → WebAssembly（C/C++/Rust 编译进浏览器） | JS 是唯一所有浏览器原生运行的语言，支撑约 98% 网站 | 中/高 |

> 权威调查来源：[Stack Overflow 2024](https://survey.stackoverflow.co/2024/technology) / [2025](https://survey.stackoverflow.co/2025/technology/) · [JetBrains 2024](https://www.jetbrains.com/lp/devecosystem-2024/) · [GitHub Octoverse 2024](https://github.blog/news-insights/octoverse/octoverse-2024/)（Python 首次超越 JS 登顶，由 AI 项目 +98% 驱动）· [RedMonk 2024](https://redmonk.com/sogrady/2024/09/12/language-rankings-6-24/) · [WebAssembly 官方](https://webassembly.org/)。

### 矩阵 C：按「需求维度」→ 该往哪个方向权衡

| 需求权重高 | 倾向选择 | 要付出的代价 |
|---|---|---|
| **上市速度（time-to-market）** | Python / Node.js（TS）/ Godot / "选无聊技术" | 极致性能让步 |
| **运行时性能 / 低延迟** | Rust / C++ / C（无 GC） | 学习曲线、开发速度、招聘难度 |
| **跨平台覆盖** | Flutter（移动）/ Unity（游戏）/ Web 技术（TS） | 单平台极致体验让步 |
| **可维护性 / 长期** | 静态类型（TypeScript / Rust / Java）+ 成熟生态 | 前期类型/工程化投入 |
| **内存安全 / 合规** | Rust / Go / 内存安全语言（CISA 推荐） | 重写成本、生态成熟度 |
| **招聘可得性 / 团队规模化** | JavaScript / Python / Java | 放弃小众语言的技术优势 |

---

## 第二层：indie / 游戏×AI / 创意工具 / 视频自动化 场景落地

这一层把通用框架落到独立开发者最常用的几条栈上，并配真实案例。

### 1. 浏览器 2D 游戏：Phaser 3/4 + TypeScript + Vite

- 官方提供 **`template-vite-ts`** 模板（Vite 6.x + TypeScript 5.x，最新已升级 Phaser 4），自带热重载（HMR），`npm run dev` 起开发服、`npm run build` 产出 `dist/`。可信度：高（[GitHub 一手 README](https://github.com/phaserjs/template-vite-ts)）。
- 默认结构：`src/main.ts`（入口）、`src/game/main.ts`（游戏配置）、`src/game/scenes/`（场景）、`public/assets/`（静态资源）。
- **一个真实的"坑"**：模板内置匿名使用统计（`log.js`），可用 `npm run dev-nolog` / `build-nolog` 关闭。
- 官方还有 React、Vue 3 的 TS 模板，支持框架 UI 与游戏画布通信。
- **收益**：类型安全 + Vite 极快冷启动/HMR；**适用** 2D HTML5 游戏（三消、roguelike、survivor 割草原型），**不适用** 需要原生级 3D/重渲染的项目。

**真实案例 ——《吸血鬼幸存者》Vampire Survivors**（与你的"三国幸存者"同品类）：

- 由意大利开发者 Luca "poncle" Galante 在 2020 年失业期间用 **Phaser（HTML5）** 开发，2021 年底上 Steam。可信度：高（多源一致，[Game Developer](https://www.gamedeveloper.com/design/vampire-survivors-development-sounds-like-an-open-source-fueled-fever-dream)）。
- 最初基于 Phaser 并大量用引擎默认/示例素材搭原型，**直到 1.6 更新后才迁移到 Unity**。可信度：中-高。
- 桌面（Steam）版通过 **Electron** 打包。可信度：中-高（第三方逆向观察，[逆向仓库](https://github.com/TechnoLustMatty/Electron-Game-Hacking-Vampire-Survivors-)）。
- 作者公开表示："用 Phaser 做 Vampire Survivors 非常有趣，如果你想快速做出狂野的游戏，强烈推荐它。"

> **对 bitqs 的启示**：浏览器 survivor 割草 → Phaser+TS+Vite 是验证过的正确选择；当玩法验证成功、需要更强性能/商业化打包时，"Phaser 原型 → Unity/Electron"是一条被真实案例走通的演进路径。

### 2. 游戏引擎全景（2025–2026 数据）

| 引擎 | 语言 | 按 Steam 上架数 | 按销量 | 定位 |
|---|---|---|---|---|
| **Unity** | C# | **51%**（第一） | 26% | 移动/跨平台/2D 全能，人才池最大 |
| **Unreal** | C++ / Blueprints | 28% | **31%**（第一） | 高保真 3D / AAA |
| **Godot** | GDScript/C#/C++ | 5% | — | 免费 MIT、轻量 2D 独立游戏 |
| **GameMaker** | GML | 4% | — | 2D |
| **Bevy** | Rust | — | — | 前沿、ECS、约 46.6k stars，但官方警告"早期阶段" |

> 关键趋势：2024 年 Steam 仅约 10–13% 游戏用自研/专有引擎，自研引擎时代趋于终结；2023 Unity 定价危机后 Godot 信任度大涨，Unity 已通过取消安装费 + Unity 6 重建信任。来源：[GameDiscoverCo](https://newsletter.gamediscover.co/p/hows-pc-game-engine-usage-changing) · [StraySpark 2026](https://www.strayspark.studio/blog/godot-vs-unity-vs-unreal-2026) · [Bevy GitHub](https://github.com/bevyengine/bevy)。

### 3. 视频自动化：Remotion（用 React 以代码生成视频）

- 用 React 组件声明视频，逐帧渲染为 MP4/WebM；视频本质是**可类型化、可参数化、可版本控制、可在 CI 渲染的数据结构**。可信度：高（[GitHub](https://github.com/remotion-dev/remotion)）。
- 渲染管线：webpack 打包 → 无头 Chromium（Puppeteer）逐帧截图（`useCurrentFrame()`）→ FFmpeg 拼接。支持服务端/Lambda 渲染，适合**数据驱动 + 批量个性化短视频**（抖音/Reels/Shorts、每日数据可视化）。
- **重要授权坑**：Remotion **不是纯 MIT 免费**——部分商用情况需购买公司授权（company license）。可信度：高（[license](https://remotion.pro/license)）。**这正是"计划阶段就要查清授权成本"的典型反例。**

> **对 bitqs 的启示**：`douyin-factory`（想法 → 竖屏抖音视频）走 Remotion 流水线是对的；但**计划阶段必须把商用授权成本算进 TCO**——这是一个会被忽略、却可能直接改变选型的非技术约束。

### 4. 部署：Cloudflare Pages / Workers

- **Pages** 面向前端（静态/JAMstack，Git 集成自动 CI/CD 到全球 CDN）；**Workers** 面向计算（边缘 serverless，V8 isolates，启动 <1ms，但无 Node 专用 API）。Pages 通过 **Pages Functions（底层即 Workers）** 获得后端能力。可信度：高。
- 免费档约 **10 万请求/天**，CPU 时间受限（适合轻量请求-响应，不适合 CPU 密集）；可组合 D1（SQLite）、R2（对象存储，免出口费）、KV，对 indie 全栈友好。来源：[Cloudflare limits](https://developers.cloudflare.com/workers/platform/limits)。

### 5. 自动化胶水 & 高性能工具

- **Python** 在 AI 内容自动化里是"胶水层"：抓取 → 清洗 → LLM 生成 → 发布的流水线（可配多智能体）。可信度：中。
- **Rust vs Go 做工具**：Go 从想法到单一可分发二进制最快、跨平台编译简单、学习曲线平缓，适合简单 CLI；Rust 牺牲上手速度换性能+可维护性，是高性能工具（ripgrep、fd、bat、uv、turbo）首选，2025–2026 开发者工具趋势整体偏 Rust。可信度：中-高。

### 6. indie 复盘：最贵的一课

> **尽快发布优先于完美技术栈**——很多独立开发者死于"完美主义无法发布"；而且"人与协作"比框架选择更决定项目成败。可信度：中（[7 年独立开发者复盘](https://www.devas.life/tech-choices-for-continuing-indie-development-for-over-7-years/) · [失败项目复盘](https://canro91.github.io/2022/12/17/LessonsOnAFailedProject/)）。

---

## 第三层：人机配合 — 选型与规划阶段的协作工作流

### 1. 谁负责什么：人 vs AI 的分工表

| 阶段任务 | 主导方 | 说明 |
|---|---|---|
| 业务逻辑 / 领域规则 | **人类** | AI 缺乏领域上下文 |
| **技术选型与架构权衡** | **人类** | AI 是"扩展选项的初级架构师"，但"评估选项"必须人来做 |
| 复杂数据库设计（表关系、索引、分库分表） | **人类** | 高影响、难回滚 |
| 不可逆/高影响决策的审批 | **人类**（门禁） | 见 HITL |
| 起草规格 / 需求文档 | AI 起草 + 人类审 | |
| 拆解任务 / 生成一致性检查清单 | **AI** | |
| 扩展候选方案（你没想到的选项） | **AI** | "rubber duck / junior architect" |
| 按已评审的原子任务执行编码 | **AI**（人类抽查） | |

> 核心原则：**架构设计的本质，是区分"需要人类判断"与"不需要人类判断"的任务**，并按 AI 适用度分层（高适用让 AI 主导、中等建协作机制、低适用人类主导 AI 辅助）。可信度：中。来源：[为何架构决策仍靠人](https://insights.daffodilsw.com/blog/why-human-judgment-still-beats-ai-in-software-architecture-decisions) · [人机协作分工](https://aicoding.csdn.net/68c98175a6dc56200e85848e.html)。

### 2. 规格驱动开发（Spec-Driven Development）— 把分工固化进流程

**GitHub Spec Kit** 把 SDD 固化为五个斜杠命令（可信度：高，[一手 README](https://raw.githubusercontent.com/github/spec-kit/main/README.md)）：

```
/speckit.constitution  →  确立项目原则
/speckit.specify       →  写"做什么/为什么"（刻意不写技术栈）
/speckit.plan          →  ★ 在此阶段才由人类填入技术栈与架构选择 ★
/speckit.tasks         →  拆解任务
/speckit.implement     →  执行
```

- **关键人机分工**：`specify` 只描述 what/why，**技术选型被刻意推迟到 `plan` 阶段、由人类提供**——这正好印证本报告的核心主张。
- 两个质量门禁：`/speckit.clarify`（plan 前澄清欠规约）、`/speckit.analyze`（implement 前做跨产物一致性检查）。官方把 checklist 比喻为"对英文规格做单元测试"。
- 理念：**多步精炼，而非一次性生成**。

**Amazon Kiro** 的 Spec 模式产出三件套：`requirements.md`（用户故事 + 验收标准，用 **EARS** 语法 "WHEN [条件] THE SYSTEM SHALL [行为]"）、`design.md`（架构 + 时序图）、`tasks.md`（可追踪任务）。可信度：高（[Kiro 文档](https://kiro.dev/docs/specs/)）。

> SDD 的目标：给"vibe coding"加上工程纪律，解决上下文缺失导致的幻觉、需求遗漏、风格不一致。

### 3. 人类门禁（Human-in-the-Loop）

三种标准审批模式（可信度：中）：

| 模式 | 含义 | 适用 |
|---|---|---|
| **执行前审批**（pre-execution） | 逐步确认后才动手 | 高风险操作 |
| **执行后审查**（post-execution） | 先做后审再提交 | 中等风险 |
| **升级触发**（escalation） | 正常自动，命中风险信号才求助 | 大部分日常 |

**应强制人类审批的动作**：金融交易、数据删除、生产/配置变更、数据库修改、代码部署、网络策略变更等不可逆或高影响操作。

> "先规划审核、后自主执行"使自动化更安全：Kiro 的 Autopilot 之所以可行，是因为任务已被拆成"原子、已评审"的小块，每个改动可回溯到规格的某条需求；高风险区域（基础设施、鉴权、外部契约）应切到逐步审批模式。来源：[HITL 最佳实践](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo) · [审批工作流](https://www.stackai.com/insights/human-in-the-loop-ai-agents-how-to-design-approval-workflows-for-safe-and-scalable-automation)。

### 4. ⚠️ 别被 AI 提效数字带偏（对抗式核查重点）

这是本报告最需要警惕的地方——**同样严谨的随机对照试验（RCT），结论可以完全相反**：

| 研究 | 结论 | 场景 | 可信度 |
|---|---|---|---|
| **METR 2025 RCT** | AI 让资深开发者**慢了 19%** | 16 名资深开源开发者、246 个任务、**他们极其熟悉的成熟大仓**、质量标准严苛 | 高（方法严谨）**但不可外推** |
| **GitHub Copilot RCT** | 完成任务**快 55.8%**（CI 21–89%） | 95 名程序员、**孤立绿地小任务**（写个 HTTP server）、含较多新手 | 高 **但场景特殊** |
| **DORA 2025** | AI 是**放大器/镜子** | 大样本行业调查 | 高 |

**怎么解读**：

- METR 的开发者**事前预期提速 24%、事后自认提速 20%，实测却慢了 19%**——存在巨大的"感知—现实落差"。METR 作者本人警告：样本仅 16 人、场景对 AI 异常不利、用的是 early-2025 模型，**对绿地项目/陌生代码库/快速原型，结论可能完全不同**。
- DORA 2025 的定性最实用：**90% 开发者用 AI、>80% 自认提效，但 30% 对 AI 代码"几乎不信任"；AI 与吞吐量正相关，却与交付稳定性持续负相关。"AI 不会修复团队，只会放大已有的好坏"**——松耦合 + 快反馈的团队获益，紧耦合 + 慢流程的团队几乎无收益。
- DORA 还显示**趋势反转**：2024 年 AI 与吞吐量是负向（约 −1.5%）、稳定性降约 7.2%；2025 年转为吞吐量正相关——说明存在"团队学会用好 AI"的学习曲线。

> 来源：[METR 论文](https://arxiv.org/abs/2507.09089) · [METR 博客](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) · [Copilot RCT](https://arxiv.org/abs/2302.06590) · [GitHub 研究](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) · [DORA 2025](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)。

**给独立开发者的可操作结论**：AI 在**绿地原型、陌生领域探索、起草规格、扩展候选方案**上收益最大（恰好是 indie 的主场）；在**你已极熟的成熟代码库做精细改动**时，AI 可能反而拖慢——这时把 AI 用在"评审/查错/写测试"而非"代写"更划算。

---

## 落到 bitqs 自己的栈：一份具体建议

结合你的项目实际（游戏 × AI、独立开发、人机协作框架 Gamage），把上面的框架落地：

| 你的场景 | 推荐 | 理由（对应本报告） |
|---|---|---|
| 浏览器割草/survivor 游戏（三国幸存者、mini-dmc） | **Phaser + TypeScript + Vite**（保持） | 矩阵 A：浏览器 2D 游戏首选；Vampire Survivors 同路径验证 |
| 玩法验证成功后要商业化/上 Steam | **评估 Phaser→Unity + Electron 演进** | 真实案例走通的路径；写 ADR 记录决策点 |
| 视频自动化（douyin-factory） | **Remotion**，但**计划阶段先确认商用授权成本** | Remotion 非纯 MIT，授权坑要进 TCO |
| 部署 | **Cloudflare Pages/Workers**（保持） | 免费档够用、边缘 + 全球 CDN |
| 自动化/AI 胶水脚本 | **Python** | 生态最丰富 |
| 需要高性能 CLI 工具 | **Rust**（若无明确性能需求则用 Go/Node 更快出活） | 反模式提醒：没有"Rust 形状的问题"别默认上 Rust |
| Gamage（六 Agent + 五门禁框架） | 与 **Spec Kit / Kiro 的 SDD + HITL** 思路高度一致，可互相借鉴 | 技术选型留人类、AI 起草执行、关键节点设门禁 |

**给 Gamage 框架的一条具体建议**：把"技术选型"显式设为一个**人类门禁节点**（对应 Spec Kit 的 `/plan` 阶段由人类填栈），并要求每次选型产出一份 **ADR**（含放弃了什么、为什么）——这能把本报告第一层的方法论直接变成 Gamage 的一道"门"。

---

## 附录：全部来源清单

### A. 通用选型方法论

- [Choosing the Right Tech Stack: A Strategic Decision (LinkedIn)](https://www.linkedin.com/pulse/choosing-right-tech-stack-strategic-decision-bill-rappleye)
- [Technology stack: How to choose (TrendlyPost)](https://www.trendlypost.com/technology-stack-how-to-choose-the-right-stack-for-projects/)
- [How to choose a technology stack for your startup (UppLabs)](https://upplabs.com/blog/how-to-choose-a-technology-stack-for-your-startup/)
- [A decision model for programming language ecosystem selection — 七工业案例 (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0950584921001051) · [PDF 全文](https://dspace.library.uu.nl/bitstream/handle/1874/420503/1_s2.0_S0950584921001051_main.pdf?sequence=1)
- [Weighted Scoring Model (Savio)](https://www.savio.io/product-roadmap/weighted-scoring-model/) · [Weighted decision matrix (airfocus)](https://airfocus.com/blog/weighted-decision-matrix-prioritization/) · [判据数量 5-8 (Product School)](https://productschool.com/blog/product-fundamentals/weighted-scoring-model)
- [AHP 层次分析法 (SixSigma.us)](https://www.6sigma.us/six-sigma-in-focus/analytic-hierarchy-process-ahp/)
- [Lightweight ADR (ThoughtWorks Radar)](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records) · [ADR 模板仓库 (GitHub)](https://github.com/joelparkerhenderson/architecture-decision-record)
- [Choose Boring Technology (Dan McKinley)](https://mcfunley.com/choose-boring-technology)
- [Rust vs Go service-level decisions](https://deepengineering.substack.com/p/issue51-rust-vs-go-service-level-backend-decisions) · [When to use Rust vs Go (LogRocket)](https://blog.logrocket.com/when-to-use-rust-when-to-use-golang/)
- [技术选型方法论 (知乎)](https://zhuanlan.zhihu.com/p/662775123) · [5 个评估维度 (CSDN)](https://blog.csdn.net/2503_92849275/article/details/149817721) · [DAR 模型 (CSDN)](https://blog.csdn.net/justyman/article/details/118267283)

### B. 按项目类型 / 语言对比

- [Front-end frameworks 汇编：SO 2025 + State of JS 2024 (gist)](https://gist.github.com/tkrotoff/b1caa4c3a185629299ec234d2314e190)
- [Most used web frameworks 2025 (Statista)](https://www.statista.com/statistics/1124699/worldwide-developer-survey-most-used-frameworks-web/) · [Backend languages (WebandCrafts)](https://webandcrafts.com/blog/backend-languages) · [roadmap.sh backend](https://roadmap.sh/backend/languages)
- [React & Next.js 2025 best practices (Strapi)](https://strapi.io/blog/react-and-nextjs-in-2025-modern-best-practices) · [TypeScript vs JavaScript 2025](https://medium.com/@may_sanders/typescript-vs-javascript-with-use-cases-2025-guide-3aa20fc25d6f)
- [Flutter vs RN 2026 (TechAhead)](https://www.techaheadcorp.com/blog/flutter-vs-react-native-in-2026-the-ultimate-showdown-for-app-development-dominance/) · [性能基准 (Synergyboat)](https://www.synergyboat.com/blog/flutter-vs-react-native-vs-native-performance-benchmark-2025)
- 游戏引擎：[VG Insights (GameDevReports)](https://gamedevreports.substack.com/p/video-game-insights-game-engines) · [GameDiscoverCo](https://newsletter.gamediscover.co/p/hows-pc-game-engine-usage-changing) · [80.lv 专有引擎 <10%](https://80.lv/articles/less-than-10-of-games-released-on-steam-in-2024-were-made-with-proprierary-engines) · [App Radar 移动引擎](https://appradar.com/blog/mobile-game-engines-development-platforms) · [Phaser (GitHub)](https://github.com/phaserjs/phaser) · [Godot 官方](https://godotengine.org/) · [Unreal Nanite 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine) · [Bevy 官网](https://bevy.org/) / [GitHub](https://github.com/bevyengine/bevy) · [StraySpark 2026](https://www.strayspark.studio/blog/godot-vs-unity-vs-unreal-2026)
- 数据科学/AI：[Kaggle Survey](https://www.kaggle.com/kaggle-survey-2022) · [Hugging Face Transformers](https://huggingface.co/docs/transformers/en/index) · [PyTorch vs TF 2026 (JetBrains)](https://blog.jetbrains.com/pycharm/2026/05/pytorch-vs-tensorflow-choosing-framework-2026/) · [JAX (The Sequence)](https://thesequence.substack.com/p/-dont-sleep-on-jax) · [Julia for SciML (arXiv)](https://arxiv.org/abs/2410.10908)
- 脚本/自动化：[Python vs Bash vs PowerShell (MoldStud)](https://moldstud.com/articles/p-python-for-automation-a-comparison-with-bash-and-powershell)
- Serverless/边缘：[Cloudflare Pages vs Workers](https://www.justaftermidnight247.com/insights/cloudflare-pages-vs-workers-which-one-should-you-use/) · [Workers limits](https://developers.cloudflare.com/workers/platform/limits) · [workers-rs (GitHub)](https://github.com/cloudflare/workers-rs)

### C. 人群 / 团队 / 开发者调查

- [Stack Overflow 2024 Technology](https://survey.stackoverflow.co/2024/technology) · [2025 Technology](https://survey.stackoverflow.co/2025/technology/) · [SO 2024 博客解读](https://stackoverflow.blog/2025/01/01/developers-want-more-more-more-the-2024-results-from-stack-overflow-s-annual-developer-survey/)
- [JetBrains State of Developer Ecosystem 2024](https://www.jetbrains.com/lp/devecosystem-2024/) · [JetBrains 博客版](https://blog.jetbrains.com/team/2024/12/11/the-state-of-developer-ecosystem-2024-unveiling-current-developer-trends-the-unstoppable-rise-of-ai-adoption-leading-languages-and-impact-on-developer-experience/)
- [GitHub Octoverse 2024](https://github.blog/news-insights/octoverse/octoverse-2024/) · [Python 登顶 (The Register)](https://www.theregister.com/2024/11/05/python_dethrones_javascript_github/) · [RedMonk 2024](https://redmonk.com/sogrady/2024/09/12/language-rankings-6-24/)
- [招聘策略与语言 (ParallelStaff)](https://parallelstaff.com/blog/most-popular-programming-languages-recruitment-strategy/) · [团队雇佣 (Revelo)](https://www.revelo.com/blog/most-popular-programming-languages)
- [为什么浏览器只说 JS (DEV)](https://dev.to/umarsiddique010/the-chosen-one-why-the-browser-speaks-only-javascript-and-why-we-cant-replace-it-450a) · [WebAssembly 官方](https://webassembly.org/) · [2024 中国开发者调查摘要](https://www.w3cschool.cn/article/41682286.html)

### D. indie / 游戏×AI / 视频自动化

- [Phaser + TS + Vite 模板 (GitHub)](https://github.com/phaserjs/template-vite-ts) · [Phaser React/Vue TS 模板](https://phaser.io/news/2024/03/phaser-3-and-react-typescript-template)
- Vampire Survivors：[Game Developer 复盘](https://www.gamedeveloper.com/design/vampire-survivors-development-sounds-like-an-open-source-fueled-fever-dream) · [Gamedev.js](https://www.gamedevjs.com/games/vampire-survivors-updated-with-phaser-dude/) · [Electron 逆向仓库](https://github.com/TechnoLustMatty/Electron-Game-Hacking-Vampire-Survivors-)
- [Remotion (GitHub)](https://github.com/remotion-dev/remotion) · [Remotion 授权](https://remotion.pro/license) · [Remotion + AI 流水线 (DEV)](https://dev.to/comlaterra_38/building-a-video-automation-pipeline-with-remotion-and-ai-apis-4i82)
- [7 年独立开发者技术栈复盘](https://www.devas.life/tech-choices-for-continuing-indie-development-for-over-7-years/) · [失败项目复盘](https://canro91.github.io/2022/12/17/LessonsOnAFailedProject/)

### E. 人机配合 / AI 协作开发

- [GitHub Spec Kit README (一手)](https://raw.githubusercontent.com/github/spec-kit/main/README.md)
- [Amazon Kiro Specs 文档](https://kiro.dev/docs/specs/) · [Kiro on AWS re:Post](https://repost.aws/articles/AROjWKtr5RTjy6T2HbFJD_Mw/) · [EARS/Spec 教程](https://tutorialsdojo.com/amazon-kiro-ai-ide-spec-driven-development/)
- [HITL 最佳实践 (Permit.io)](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo) · [审批工作流 (StackAI)](https://www.stackai.com/insights/human-in-the-loop-ai-agents-how-to-design-approval-workflows-for-safe-and-scalable-automation) · [Microsoft Agent Framework HITL](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)
- [为何架构决策仍靠人 (Daffodil)](https://insights.daffodilsw.com/blog/why-human-judgment-still-beats-ai-in-software-architecture-decisions)
- **生产力实证（含争议）**：[METR 论文 (arXiv 2507.09089)](https://arxiv.org/abs/2507.09089) · [METR 博客](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) · [TIME 报道](https://time.com/7302351/ai-software-coding-study/) · [Copilot RCT (arXiv 2302.06590)](https://arxiv.org/abs/2302.06590) · [GitHub Copilot 研究](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) · [DORA 2025](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) · [DORA 2024](https://dora.dev/research/2024/dora-report/)
- 中文：[Spec-Driven Development (知乎)](https://zhuanlan.zhihu.com/p/1993368909856912661) · [人机协作成为 AI 编程主流 (CSDN)](https://aicoding.csdn.net/68c98175a6dc56200e85848e.html) · [6 种 AI 协作方法 (知乎)](https://zhuanlan.zhihu.com/p/1956371601860847413)

---

> **本报告本身就是"人机配合"的产物**：由 AI 多语言并行检索 + 对抗式核查、人类定方向与审阅。报告中所有"中"可信度的精确数字，建议在正式引用前回一手来源二次核对（详见[研究方法与可信度说明](#研究方法与可信度说明)）。
