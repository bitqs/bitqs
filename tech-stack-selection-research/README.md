# 计划阶段的开发语言/技术栈选型 × 人机配合

> **一份深度研究报告** — 在软件项目的「计划阶段」，如何根据不同的**人群 / 需求 / 项目类型**选择开发语言，以及在这个决策过程中**人与 AI 如何分工配合**。
>
> 研究日期：2026-06 · 检索语言：中文 + 英文 + 日 / 韩 / 德 / 法 / 西 / 葡 / 俄（详见[多语言视角补充](#多语言视角补充日--韩--德--法西葡--俄)）· 作者：bitqs（人 + AI 协作产出）

---

## 目录

1. [TL;DR — 一页结论](#tldr--一页结论)
2. [研究方法与可信度说明](#研究方法与可信度说明)
3. [第一层：通用选型方法论与决策框架](#第一层通用选型方法论与决策框架)
4. [核心交付物：三张决策矩阵](#核心交付物三张决策矩阵)
5. [第二层：indie / 游戏×AI / 创意工具 / 视频自动化 场景落地](#第二层indie--游戏ai--创意工具--视频自动化-场景落地)
6. [第三层：人机配合 — 选型与规划阶段的协作工作流](#第三层人机配合--选型与规划阶段的协作工作流)
7. [落到 bitqs 自己的栈：一份具体建议](#落到-bitqs-自己的栈一份具体建议)
8. [多语言视角补充（日 / 韩 / 德 / 法西葡 / 俄）](#多语言视角补充日--韩--德--法西葡--俄)
9. [附录：全部来源清单](#附录全部来源清单)

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

- **检索方式**：第一版围绕 5 个角度（通用方法论 / 按项目类型 / 按人群与团队 / indie 与创意场景 / 人机配合）做中 + 英并行检索；第二版再用**日、韩、德、法、西、葡、俄** 7 个语种到各自母语社区检索，专挖中英文圈缺失的视角（见[多语言视角补充](#多语言视角补充日--韩--德--法西葡--俄)）。
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

## 多语言视角补充（日 / 韩 / 德 / 法西葡 / 俄）

> 第一版报告以中文 + 英文来源为主。本节专门用**日语、韩语、德语、法语/西语/葡语、俄语**到各自母语社区检索，挖出中英文圈里**没有或很少出现**的视角与一手资料。下面先提炼跨语言的共同模式，再分语种列特色发现。

### 跨语言的 6 个共同模式

1. **"数字主权 / 本地合规"是非英语世界独有的硬选型维度。** 德国 Bitkom 2025 调查：**68%** 受访者认为德国在 AI 上过度依赖美中、**60%** 希望摆脱对美国 AI 公司的依赖；法国把 **RGPD 合规 + 数字主权**直接当作 AI 视频工具的选型标准（如本土方案 Pitchy/Recii）；俄语圈则因外部环境出现整体"去 Java/去美系栈"与"本地市场 ≠ 全球排名"的论述。英文报告里几乎看不到这一维度。([Bitkom](https://www.bitkom.org/Presse/Presseinformation/Durchbruch-Kuenstliche-Intelligenz) · [Bpifrance](https://bigmedia.bpifrance.fr/nos-dossiers/comment-utiliser-les-generateurs-de-video-par-ia-en-entreprise))

2. **Godot 崛起是全球现象，但每个语种用不同硬数据佐证。** 德语：基于 Godot 的 Steam 游戏从 2020 年 47 款增至 2025 年 1500+ 款；葡语/俄语圈广传同一组基准——Godot 比 Unity 加载快 5 倍、导出快 20 倍、脚本编译快 31 倍，磁盘占用 **164MB vs 20GB**；日语圈直接提出"Godot 上位替代论"；韩语圈用"Steam 转向 + 2D 类型市场被验证"解释其走红。多语种交叉印证让"Godot 上升"这条结论可信度显著提高。([heise/nobreakpoints](https://blog.nobreakpoints.com/unity-vs-godot-engine/) · [Habr](https://habr.com/ru/news/1039340/))

3. **"母语文档量 / 本地化"是务实选型的头号变量。** 韩语圈把"韩文文档多不多"当作引擎选型第一标准（Unity、Phaser 都因此被选）；葡语/巴西圈把"是否支持巴西葡语合成语音"当作视频工具的关键标准；日语圈做自动视频的事实栈是 **Python + VOICEVOX（日语语音）+ MoviePy**。母语世界的选型，本地化往往压过纯技术优劣。([devkuma](https://www.devkuma.com/docs/game/game-engine/) · [Alura](https://www.alura.com.br/artigos/ia-para-criar-videos))

4. **规格驱动开发（SDD）的人机分工，各语种独立得出高度一致的结论，但口号各异。** 日："AI 是『写的人』，人类是『决定的人』"；西语："只有 0–20% 的任务可完全委托 AI"；俄语（X5 Tech）：开发者角色重定义为 **"设计工程师"**——核心技能是"把业务需求翻译成清晰契约"；德语（codecentric）：开发者应**"反思式（当陪练）"而非"委派式（外包）"**用 AI，且处于"驾驶座"；韩语（teo）：核心能力是**"规格能力"**——能精确下达"用 Express 写 POST /api/login，bcrypt 校验，签 JWT，失败返 401"这种指令。**五个语种、同一个结论：技术选型与规格制定是人类的活。**

5. **"Claude Code + Cursor 按阶段/前后端分工"被日、韩两个语种独立总结出来。** 日语：前半用 Claude Code 接需求、搭骨架，后半转 Cursor 做细节与 UI；韩语：后端用 Claude Code（擅长复杂任务）、前端用 Cursor（UI 集成好），互补同用。两个互不相通的语言社区得出同样的工具分工法，说明这是一条相当稳健的实践。([Zenn](https://zenn.dev/revvi/articles/377cd151ba39c2) · [velog](https://velog.io/@takuya/실제-경험-Claude-Code와-Cursor-일주일-사용-후-알게-된-진짜-비용-효율))

6. **"招聘市场决定选型"在东亚语种里被表达得最直白。** 韩语圈的二分法最典型：**用 Java/Spring 的几乎都是大公司，初创则多用 Node.js/Next.js——所以选型本质是"你想进哪类公司"**（Java 在 Jumpit 招聘栈中占 32–36% 居首）；日语圈讲"从招聘倒推技术选定"、要选"还算时髦"的技术以利招人；俄语 Habr Career 则给出按语言切分的本土薪资涨幅（2025 下半年 C +18%、C++ +14%、JS +11%）。([ZDNet Korea](https://zdnet.co.kr/view/?no=20230105082540) · [Habr 薪资](https://habr.com/ru/articles/981704/))

### 🇯🇵 日语圈特色发现

- **"Godot 上位替代论"**：初学者与 2D 项目首推 Godot 而非 Unity（安装约 25MB、启动约 5 秒、GDScript 适合边试错边做），与英文圈"Unity 默认起步"的惯性明显不同。可信度：高。([nishigames](https://nishigames.com/2025/11/22/game-engine/))
- **"ツクール（RPG Maker）vs Phaser"** 这条同人游戏特有的选型轴：无代码全套现成 vs 轻量但要自己补很多。可信度：中。([note](https://note.com/takuya_hb1/n/na6a50b8dd3f9))
- **日本国产 SDD 工具 cc-sdd**：一条命令 `npx cc-sdd@latest --lang ja` 把 Claude Code/Cursor/Gemini CLI 等"Kiro 化"、原生日语支持；"国产ツール"的身份认同是独有传播点。可信度：高。([Qiita](https://qiita.com/tomada/items/6a04114fc41d0b86ffee) · [GitHub](https://github.com/gotalab/cc-sdd/blob/main/docs/README/README_ja.md))
- **对 SDD 的认知论再诠释**："SDD 工具的本质是逼工程师自己把需求言语化，提升规格分辨率（解像度）是人类的工作"。可信度：高。([Zenn](https://zenn.dev/gmomedia/articles/8ccf71e50858de))
- **Findy 调查**：IT/Web 自由职业工程师生成 AI 活用率 **84.2%**，活用者中 **54%** 付费；2025 年 5 月发布的 Claude Code 利用率已逼近 Copilot。可信度：中（数字来自检索摘要，建议回原页核对）。([Findy](https://findy.co.jp/2820/))

### 🇰🇷 韩语圈特色发现

- **"别把 Next.js 当初始栈"的逆流共识**：无把握时选 Next.js 会"与它搏斗"，推荐 **Vite + React + TypeScript + react-router**，日后向 Next/Remix/Gatsby 迁移都有官方文档支持。与中英文圈"创业默认 Next.js"对照鲜明。可信度：高。([velog/woohm402](https://velog.io/@woohm402/dont-use-nextjs-to-initialize-project))
- **"先让 Opus 写 PRD/TRD"**：vibe coding 实操圈的关键动作——"仅仅学会 PRD、TRD 这两个词，项目完成度就提升几倍"；并提出 **RDD（Readme-Driven Development）**，先备好 PRD.md/UserFlow.md 再开工。可信度：中。([Threads](https://www.threads.com/@sihyun_adventure/post/DL47sadyNtG/) · [velog/prayme](https://velog.io/@prayme/바이브-코딩-후기))
- **大厂 AI 分岗落地**：Naver 用 AI 做代码评审、Toss 做图像、Kakao 做垃圾内容分类；TossPayments 建 MCP 服务器用自然语言自动化 PG 接入，但明确"架构设计与支付稳定性判断仍是工程师的职责"。可信度：中。([dalpha](https://app.dalpha.so/blog/ai-usecase-tech/))
- **数据点**：某调查 **72% 开发者不用 vibe coding**、仅 11.9% 在用；Go 开发者调查 53% 指最大问题是 AI 生成"无法运行的代码"。可信度：中。([ITWorld KR](https://www.itworld.co.kr/article/4121785/))

### 🇩🇪 德语圈特色发现（偏工程治理）

- **codecentric"AI 辅助开发的五个等级"**：明确指出等级间**不是优劣排序**（依语境/任务而定）；Level 5 = 无人工代码审查的自主产品开发（类比自动驾驶，目前尚未实现）。并提出 **"AI Readiness（AI 就绪度）"** 作为采用 AI 的先决条件。可信度：中。([codecentric](https://www.codecentric.de/wissens-hub/blog/die-fuenf-level-der-ki-gestuetzten-softwareentwicklung))
- **Fraunhofer IESE 引 DORA**：**30%** 开发者对 AI 代码"几乎不信任"、**61%** 完全回避自主 AI Agent；核心论断"**AI 是放大器，但前提是组织已做好准备**，局部生产率提升不会自动转化为系统层面更好结果"。可信度：中。([Fraunhofer IESE](https://www.iese.fraunhofer.de/blog/ki-in-der-softwareentwicklung-neue-erkenntnisse-aus-forschung-und-praxis/))
- **NIST 已将 Rust 列入"安全编程语言"清单**，Rust 基金会成立 Safety-Critical Rust Consortium；Android 内存安全漏洞占比 2019→2022 从 76% 降到 35%。可信度：高。([heise](https://www.heise.de/news/Android-Mehr-Rust-weniger-C-C-und-weniger-kritische-Schwachstellen-7364247.html))
- **ADR 史料精确化**：Nygard 2007 年《Release It!》提出、2011 年博文广传；德语圈强调其价值在 onboarding 与"数月/数年后回溯"时才显现。可信度：高。([mayflower](https://blog.mayflower.de/15888-architekturentscheidung-adr.html))

### 🇫🇷🇪🇸🇵🇹 法语 / 西语 / 葡语圈特色发现

- **【法】数字主权 + RGPD 作为 AI 视频工具选型标准**；法语 ADR 圈用 **Y-Statement** 格式"强制显式标明所接受的折中"，当作教初级工程师做架构权衡的教学工具。可信度：中/高。([Code Heroes](https://www.codeheroes.fr/2023/05/31/clarifiez-les-decisions-techniques-avec-les-adrs/))
- **【西】成体系的 SDD 人机分工话语**：人类提供技术栈/参考架构/设计约束，AI 生成完整技术计划（模块/API/数据模型/任务拆解），资深架构师验证可行性；并本地化引用 METR"无结构用 AI 慢 19%"。Carlos Azaustre 强调 **Plan 阶段最常被跳过但最能防技术债**。可信度：高。([aicode.academy](https://aicode.academy/blog/es/spec-driven-development/) · [Carlos Azaustre](https://carlosazaustre.es/blog/spec-driven-development-agentes-ia))
- **【法】一手证言**：法国工作室开发《Aetheris》后"被迫转 Godot 并不后悔，回 Unity 纯粹是讨厌"，理由含"用 Godot 做的东西都归我们所有"对工作室长期存续重要。可信度：中。([activdesign](https://activdesign.eu/blog/retour-dexperience-godot-le-jeu-aetheris))
- **【法】JetBrains 2025**：69% 开发者已用过 ChatGPT，近半数定期用于写代码。可信度：高。([BDM](https://www.blogdumoderateur.com/etude-langages-utilises-developpeurs-2025/))

### 🇷🇺 俄语圈特色发现

- **成本/负载驱动重写**：某后端团队把 Java(Spring Boot) 单体迁移到 Rust/Go/C++，触发点是 **100k+ RPS、单实例内存 16–32GB、云成本"相当于几个中级开发者工资"**；读者投票 Rust 40.31% / Go 30.69% / C++ 17.86%。可信度：中。([Habr](https://habr.com/ru/articles/953364/))
- **"全球排名 ≠ 本地市场"**：Go 在 TIOBE 2026 年初从第 7 跌到第 16，但在俄罗斯大厂持续升温（Go 开发者 4 万+）；Avito 官方技术博客专门发文回应"Golang 完蛋了？"的标题党，劝业界别据此调栈。可信度：中。([Habr](https://habr.com/ru/articles/989014/) · [Avito](https://habr.com/ru/companies/avito/news/992314/))
- **X5 Tech 的六阶段 SDD**：Constitution → Specify → **Clarify** → Plan → Tasks → Implement，强调 Clarify 作为独立必备阶段能"尽早暴露歧义、大幅减少返工"，并专门讨论棕地/遗留系统如何引入 SDD。可信度：中。([Habr/X5Tech](https://habr.com/ru/companies/X5Tech/articles/995466/) · [Habr](https://habr.com/ru/articles/982890/))
- **金融科技分层选型**："近端后端"用 Scala + Akka + Cats Effect，"深层后端"用 Kotlin + Spring；明确点出 Scala 缺点"可读性比 Java 差、编译慢——对大项目是致命点"。可信度：中。([Skillbox](https://skillbox.ru/media/code/kak-ustroena-razrabotka-v-bolshom-fintekhe-pri-chyem-tut-scala-i-za-chto-ne-lyubyat-java/))

> **一句话总结这一节**：技术选型从来不只是技术问题——**合规与主权、母语文档、招聘市场、云成本**这些"非技术约束"，在不同语言世界里常常才是真正的决定因素。而"人定方向/写规格、AI 做实现"这条人机分工原则，则是跨越所有语种的强共识。

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

### F. 多语言来源（日 / 韩 / 德 / 法西葡 / 俄）

**日语**：[个人开发引擎选型 (nishigames)](https://nishigames.com/2025/11/22/game-engine/) · [Phaser 决定 (note)](https://note.com/takuya_hb1/n/na6a50b8dd3f9) · [cc-sdd (Qiita)](https://qiita.com/tomada/items/6a04114fc41d0b86ffee) / [cc-sdd README (GitHub)](https://github.com/gotalab/cc-sdd/blob/main/docs/README/README_ja.md) · [SDD 三工具比较 (Zenn)](https://zenn.dev/gmomedia/articles/8ccf71e50858de) · [AI 驱动开发生命周期 (Serverworks)](https://www.serverworks.co.jp/blog/ai/ai_driven_development_lifecycle.html) · [工具使い分け (Zenn)](https://zenn.dev/revvi/articles/377cd151ba39c2) · [ADR 与 LLM (Qiita)](https://qiita.com/yonaka15/items/1a8e118d663ede340399) · [VOICEVOX+MoviePy 自动视频 (Qiita)](https://qiita.com/W_T2R/items/20a09106f64ab1c666a5) · [Findy 调查](https://findy.co.jp/2820/) · [日经 xTECH 语言调查 2025](https://xtech.nikkei.com/atcl/nxt/column/18/03407/)

**韩语**：[别用 Next.js 作初始栈 (velog)](https://velog.io/@woohm402/dont-use-nextjs-to-initialize-project) · [游戏引擎 (devkuma)](https://www.devkuma.com/docs/game/game-engine/) · [Godot 人气 (BatStudio)](https://www.ibatstudio.com/고도-엔진의-인기-비결-유니티와-간단-비교/) · [Remotion (Dale Seo)](https://daleseo.com/remotion/) · [PRD/TRD 实操 (Threads)](https://www.threads.com/@sihyun_adventure/post/DL47sadyNtG/) · [vibe coding 后记/RDD (velog)](https://velog.io/@prayme/바이브-코딩-후기) · [大厂 AI 落地 (dalpha)](https://app.dalpha.so/blog/ai-usecase-tech/) · ["规格能力" (velog/teo)](https://velog.io/@teo/ai-and-developer) · [Kurly 可预测 vibe coding](https://helloworld.kurly.com/blog/vibe-coding-with-claude-code/) · [Java 占比 (ZDNet Korea)](https://zdnet.co.kr/view/?no=20230105082540)

**德语**：[AI 辅助五个等级 (codecentric)](https://www.codecentric.de/wissens-hub/blog/die-fuenf-level-der-ki-gestuetzten-softwareentwicklung) · [AI 软件开发新认知 (Fraunhofer IESE)](https://www.iese.fraunhofer.de/blog/ki-in-der-softwareentwicklung-neue-erkenntnisse-aus-forschung-und-praxis/) · [Android Rust 漏洞下降 (heise)](https://www.heise.de/news/Android-Mehr-Rust-weniger-C-C-und-weniger-kritische-Schwachstellen-7364247.html) · [Rust 安全关键系统联盟 (heise)](https://www.heise.de/news/Rust-fuer-sicherheitskritische-Systeme-Konsortium-kuemmert-sich-um-den-Einsatz-9761117.html) · [ADR (mayflower)](https://blog.mayflower.de/15888-architekturentscheidung-adr.html) · [ADR (Production Ready)](https://www.production-ready.de/2023/12/28/lightweight-architecture-documentation-adr.html) · [Bitkom AI 突破调查](https://www.bitkom.org/Presse/Presseinformation/Durchbruch-Kuenstliche-Intelligenz) · [iX Workshop Copilot/Claude Code (heise)](https://www.heise.de/news/iX-Workshop-Produktiver-programmieren-mit-GitHub-Copilot-Claude-Code-Co-11109435.html)

**法语**：[ADR (Code Heroes)](https://www.codeheroes.fr/2023/05/31/clarifiez-les-decisions-techniques-avec-les-adrs/) · [ADR (S. Decout)](https://medium.com/@sylvain.decout/architecture-et-documentation-les-adrs-cbaac61aad4e) · [Godot 体验 Aetheris (activdesign)](https://activdesign.eu/blog/retour-dexperience-godot-le-jeu-aetheris) · [企业 AI 视频生成 (Bpifrance)](https://bigmedia.bpifrance.fr/nos-dossiers/comment-utiliser-les-generateurs-de-video-par-ia-en-entreprise) · [JetBrains 开发者调查 2025 (BDM)](https://www.blogdumoderateur.com/etude-langages-utilises-developpeurs-2025/)

**西语**：[SDD (aicode.academy)](https://aicode.academy/blog/es/spec-driven-development/) · [SDD 与 AI 代理 (Carlos Azaustre)](https://carlosazaustre.es/blog/spec-driven-development-agentes-ia) · [SDD/METR (Neuronic)](https://neuronic.com.ar/blog/spec-driven-development) · [Unity vs Godot (Codearte)](https://codearte.com.ar/blog/unity-vs-godot-cual-es-la-mejor-opcion-para-aprender-a-desarrollar-videojuegos)

**葡语**：[Godot 将成巨头 (GameGuild)](https://blog.gameguild.gg/como-o-godot-vai-se-tornar-um-gigante/) · [Godot vs Unity 2026 (DEV)](https://dev.to/linou518/godot-vs-unity-in-2026-which-engine-should-indie-developers-choose-50g4) · [AI 做视频 2026 (Alura)](https://www.alura.com.br/artigos/ia-para-criar-videos)

**俄语**：[高负载后端往哪重写 (Habr)](https://habr.com/ru/articles/953364/) · [Go 在 TIOBE 下跌 (Habr)](https://habr.com/ru/articles/989014/) · [Avito 回应 Golang 完蛋论](https://habr.com/ru/companies/avito/news/992314/) · [金融科技 Scala/Kotlin (Skillbox)](https://skillbox.ru/media/code/kak-ustroena-razrabotka-v-bolshom-fintekhe-pri-chyem-tut-scala-i-za-chto-ne-lyubyat-java/) · [2025 薪资调查 (Habr)](https://habr.com/ru/articles/981704/) · [vibe → SDD (Habr/X5Tech)](https://habr.com/ru/companies/X5Tech/articles/995466/) · [既有项目引入 SDD (Habr)](https://habr.com/ru/articles/982890/) · [Godot vs Unity 同游戏对比 (Habr)](https://habr.com/ru/news/1039340/)

> **本报告本身就是"人机配合"的产物**：由 AI 多语言并行检索 + 对抗式核查、人类定方向与审阅。报告中所有"中"可信度的精确数字，建议在正式引用前回一手来源二次核对（详见[研究方法与可信度说明](#研究方法与可信度说明)）。
