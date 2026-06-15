# TRD · 技术需求文档 — SWARM（虫潮）

> 本文档讲**怎么做**，是 [PRD.md](./PRD.md) 的技术落地方案。核心是**技术栈决策**——这一步正是"人定方向"的门禁，AI 起草、由你拍板。
>
> 状态：**草案 v0.1（待人类审批）** · 日期：2026-06 · 关联：PRD v0.1

---

## 1. 目标与约束

| 约束 | 来源 | 影响 |
|---|---|---|
| 浏览器零下载、横竖屏自适应 | PRD §2 / US-5,6 | **平台直接锁定 Web → JS/TS**（研究矩阵 B：浏览器零安装几乎只能 JS/TS） |
| 同屏 2000 敌人 @ ≥50fps（手机） | PRD US-2 | 存在**真实性能热点** → 这是"Rust 形状的问题" |
| 单人开发、要尽快出可玩切片 | bitqs 实际 | **上市速度优先**（研究矩阵 C），先 TS 跑通再优化 |

## 2. 技术栈决策（本 TRD 的核心）

### 2.1 候选方案加权评分

为"渲染/游戏框架"层打分（判据权重之和 = 100，分 1–5）：

| 判据（权重） | Phaser+TS | PixiJS+TS | Unity(WebGL) | Bevy(Rust→WASM) |
|---|---|---|---|---|
| 上市速度（30） | 5 | 4 | 3 | 2 |
| 2D 生态/现成功能（25） | 5 | 3 | 4 | 2 |
| 浏览器零摩擦/包体（20） | 5 | 5 | 2 | 3 |
| 团队熟悉度（bitqs 已用）（15） | 5 | 3 | 3 | 2 |
| 性能上限（10） | 3 | 4 | 4 | 5 |
| **加权总分** | **4.8** | **3.75** | **3.2** | **2.45** |

**结论：渲染/框架层选 Phaser 3/4 + TypeScript。**（与 bitqs 现有栈一致、研究矩阵 A 浏览器 2D 游戏首选。）

### 2.2 ADR-001 · 用 Phaser 3/4 + TypeScript + Vite

- **Status**: 已接受（待审）
- **Context**: 浏览器 2D survivor；单人开发求快；bitqs 已用此栈做过三国幸存者。
- **Decision**: Phaser（Canvas/WebGL 渲染、场景/输入/补间/粒子现成）+ TypeScript（类型安全）+ Vite（官方 `template-vite-ts`，HMR）。
- **Consequences**: 复用已有经验、最快出可玩切片；Phaser 4 正转向 WebGPU/TS 重写，未来可平滑升级。
- **Alternatives / 为何不选**: PixiJS 渲染快但要自己补游戏系统（场景/物理/补间），拖慢上市；Unity WebGL 包体大、首屏慢、违背"零摩擦"；纯 Bevy(Rust) 全量重写 = 把"创新代币"一次花光，2D 工具链不如 Phaser 成熟。
- **坑（来自研究）**: 官方模板内置匿名统计 `log.js`，用 `npm run dev-nolog`/`build-nolog` 关闭。

### 2.3 ADR-002 · 敌群模拟核心：Rust → WebAssembly（**渐进引入**）

- **Status**: 已接受（待审）—— 但**分阶段、可证伪**
- **Context**: PRD 的差异点"群感"要求同屏 2000+ 敌人做避让/阵型/碰撞。这类 N-body 邻近计算（空间哈希 + 转向力）是 CPU 密集、每帧执行——**这是真正的 Rust 形状的问题**。
- **Decision**: 把"敌群模拟"隔离成一个**纯数据模块**（输入位置/目标，输出新位置/碰撞事件），定义稳定接口。**先用 TS 实现**跑通玩法；当 profiling 证明 TS 撑不住目标实体数时，**用 Rust→WASM 替换同一个接口**，渲染层无感。
- **Consequences（取舍）**:
  - 好处：性能天花板高、内存可控（无 GC 抖动）、是 bitqs 的技术招牌、Rust 名正言顺。
  - 代价：引入 `wasm-pack`/`wasm-bindgen` + Cargo 工具链；JS↔WASM 每帧数据编组有开销，必须用**共享内存 + TypedArray（SoA 布局）**而非逐对象传递。
- **关键纪律（研究铁律）**: **没有 Rust 形状的问题就别上 Rust。** 因此设 Go/No-Go 门槛——见 §7 性能预算：**只有当 TS 实现 < 50fps@1500 敌人时才启动 Rust 替换**，否则保持 TS，把 Rust 留作"招牌可选项"。这条让决策可证伪、不教条。

> 一句话：**Rust 不是地基，是为"群感热点"预留的涡轮增压。架构先把接口留好，性能不够再装。**

## 3. 系统架构（分层）

```
┌─────────────────────────────────────────────┐
│  表现层 Presentation (Phaser + TS)            │  场景/精灵/相机/粒子/HUD/输入
├─────────────────────────────────────────────┤
│  游戏逻辑 Game Logic (TS)                      │  武器/构筑/升级/波次/伤害结算
├─────────────────────────────────────────────┤
│  模拟核心 Simulation Core  ◀── 稳定接口 ──▶    │  敌群移动/避让/空间哈希/碰撞
│     impl A: TypeScript（先做）                 │
│     impl B: Rust → WASM（热点达标线后替换）     │
└─────────────────────────────────────────────┘
```

**接口（两种实现都满足）**：
```ts
interface SwarmSim {
  spawn(n: number, x: number, y: number): void;
  // 每帧：传入玩家位置与 dt，推进模拟；位置写回共享 TypedArray
  step(dt: number, playerX: number, playerY: number): void;
  positions(): Float32Array;          // SoA: [x0,y0, x1,y1, ...]
  collisions(): Uint32Array;          // 本帧与玩家/子弹碰撞的实体 id
  kill(ids: Uint32Array): void;
}
```
- TS 实现：普通数组 + 网格空间哈希。
- Rust 实现：`wasm-bindgen` 暴露同名方法；位置缓冲区用 `memory.buffer` 上的 `Float32Array` 视图**零拷贝**读给 Phaser 渲染。

## 4. 数据模型（面向性能：SoA）

实体用**结构数组（Structure of Arrays）**而非对象数组，便于 WASM 与缓存友好：
```
posX: Float32Array  posY: Float32Array
velX: Float32Array  velY: Float32Array
hp:   Float32Array   type: Uint8Array   alive: Uint8Array
```
- 渲染层不为每个敌人建 Phaser GameObject（2000 个对象会爆）；用 **Blitter / 自管理 sprite 池 / 粒子**批量绘制 position 数组。

## 5. 项目结构 & 构建

```
swarm-survivor/
├── PRD.md  TRD.md
├── index.html
├── package.json            # vite + phaser + typescript
├── vite.config.ts          # + vite-plugin-wasm / @rollup wasm 支持
├── src/
│   ├── main.ts
│   ├── scenes/{Boot,Game,UI,GameOver}.ts
│   ├── systems/{weapons,leveling,waves,damage}.ts
│   ├── sim/
│   │   ├── SwarmSim.ts        # 接口
│   │   ├── SwarmSimTS.ts      # impl A
│   │   └── SwarmSimWasm.ts    # impl B 的 JS 绑定
│   └── render/SwarmRenderer.ts
└── crates/swarm-core/         # Rust crate（impl B）
    ├── Cargo.toml
    └── src/lib.rs             # #[wasm_bindgen] 导出
```
- 构建：`vite`（前端）+ `wasm-pack build crates/swarm-core --target web`（产 wasm，Vite 引入）。
- 部署：Cloudflare Pages 或沿用 bitqs 的 GitHub Pages（纯静态，WASM 作静态资源）。

## 6. 关键技术风险与缓解

| 风险 | 缓解 |
|---|---|
| JS↔WASM 每帧编组吃掉 Rust 的性能优势 | 用共享线性内存 + TypedArray 视图，**零拷贝**；每帧只调一次 `step()` |
| 2000 个 Phaser 对象拖垮渲染 | 不用 GameObject/敌；用 Blitter/sprite 池/粒子批绘 |
| Rust 工具链拖慢迭代 | TS-first：玩法全程不依赖 Rust；Rust 仅在热点达标线后并行开发 |
| 移动端性能差异大 | 设实体数自适应上限；低端机降并发、保帧率 |

## 7. 性能预算 & Go/No-Go 门槛

- 帧预算：16.6ms/帧（60fps）。模拟 ≤ 6ms，渲染 ≤ 6ms，逻辑 ≤ 4ms。
- **Rust 启动门槛**：当 TS 实现在目标中端手机上 **< 50fps @ 1500 敌人** → 启动 ADR-002 的 Rust 替换；否则维持 TS。
- 验收：US-2（2000 敌人 @ ≥50fps 手机）作为里程碑 M3 的硬验收。

## 8. 里程碑（人机分工标注）

| 里程碑 | 内容 | 人 / AI | 门禁 |
|---|---|---|---|
| **M0** | Vite+TS+Phaser 脚手架 + 空场景跑通 | AI 搭，人 review | — |
| **M1** | 垂直切片：移动 + 1 武器 + TS 敌群（几百个）+ 升级三选一 | AI 实现，人验手感 | **手感门**（群感 A/B 可见） |
| **M2** | 武器×3 + 波次 + HUD + 结算 = 完整 MVP 循环 | AI 实现 | 对照 PRD 验收标准 |
| **M3** | 性能压测；**若不达标 → Rust→WASM 替换模拟核心** | 人决定是否上 Rust，AI 实现 | **性能门**（US-2） |
| **M4** | Boss + 进化 + 打击感润色 | AI + 人调参 | — |

## 9. 人机配合约定（落地研究方法论）

- **人类负责（门禁）**：审定 PRD/TRD、技术栈拍板、是否启动 Rust、手感与数值判断、每个里程碑验收。
- **AI 负责**：按已批准的 TRD 实现、拆任务、写测试、出可玩切片、性能压测报告。
- 每个重要技术拐点（如真正启动 Rust）补一条 ADR 进本目录。

---

> ✅ **下一步（人类门禁）**：你审这份 TRD——重点确认 **§2 技术栈决策**（尤其 ADR-002 的"TS-first、达标线后再上 Rust"是否同意）。通过后我从 **M0 脚手架**开始写代码。
