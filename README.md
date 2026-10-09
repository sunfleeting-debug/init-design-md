<div align="center">
  <img src=".github/assets/icon.png" width="108" alt="init-design-md" />
  <h1>init-design-md</h1>
  <p><b>让 AI 代理按你的设计系统生成 UI</b><br /><sub>一条命令，为任何项目生成 DESIGN.md，并把规则写进 CLAUDE.md / AGENTS.md</sub></p>
  <p>
    <img src="https://img.shields.io/badge/Claude%20Code-%E6%8F%92%E4%BB%B6-D97757" alt="Claude Code 插件">
    <img src="https://img.shields.io/badge/Node-%E2%89%A518-339933" alt="Node >= 18">
    <img src="https://img.shields.io/badge/%E5%90%88%E5%B9%B6%E8%87%AA-Google%20design.md-4285F4" alt="兼容 Google design.md">
    <img src="https://img.shields.io/badge/License-Apache--2.0-97CA00" alt="License: Apache-2.0">
  </p>
  <p>
    <b>简体中文</b> ·
    <a href="README.en.md">English</a>
  </p>
</div>

一个 Claude Code 插件：先扫描项目，问几个关键问题（主色、字体、密度、圆角等），然后在项目根目录生成一份 `DESIGN.md` —— 用 YAML 写下**设计令牌**（颜色、字体、间距、圆角等），用 Markdown 写下**设计理念与使用规则**。同时它会把一段「先生成 UI 代码前先读 DESIGN.md」的引导写进 `CLAUDE.md` / `AGENTS.md`，让后续每一个 AI 代理都按你的设计系统产出 UI，杜绝颜色 / 间距 / 字体随机发挥。

**Zero config, one command.**

## 一览

| | |
| --- | --- |
| **形态** | Claude Code 插件（本仓库同时充当 plugin marketplace） |
| **插件 id** | `design-md-init` · 命令 `/init-design-md` |
| **产物** | `./DESIGN.md`（YAML 令牌 + Markdown 理念）+ `CLAUDE.md` / `AGENTS.md` 里的 `## Design System` 引导块 |
| **可后接** | `@google/design.md` 校验与导出（CSS / Tailwind 主题） |
| **依赖** | Node ≥ 18 |
| **许可** | Apache-2.0 |

---

## ✨ 它做什么

写两个文件：

1. **`./DESIGN.md`** —— 设计系统的"单一事实源"：YAML 令牌 + Markdown 理念。扫描你的项目后提问（主色、字体、密度、圆角风格…），把答案落成结构化令牌，而不是一段笼统的说明文字。
2. **`## Design System` 引导块** —— 追加到 `CLAUDE.md` / `AGENTS.md`（都不存在则新建 `.claude/CLAUDE.md`）。这样 AI 代理在**写 UI 之前**就会读到 DESIGN.md，而不是每次自由发挥。

```text
/init-design-md
      │
      ├─ Phase 1  扫描项目（技术栈、已有 UI 组件；--deep 会采样组件源码）
      ├─ Phase 3  问几个关键问题（--defaults 可跳过）
      ├─ Phase 5  写 DESIGN.md（--from-existing 时自动合并）
      └─ 追加 ## Design System 到 CLAUDE.md / AGENTS.md
```

---

## 📦 安装

本仓库本身就是一个 plugin marketplace，可以直接从 GitHub 装：

```bash
claude plugin marketplace add sunfleeting-debug/init-design-md
claude plugin install design-md-init
```

也可以从本地目录装：

```bash
claude plugin marketplace add /path/to/init-design-md
claude plugin install design-md-init
```

---

## 🚀 使用

```bash
# 初始化当前项目
/init-design-md

# 跳过提问，直接用默认值
/init-design-md --defaults

# 深度扫描：把已有 UI 组件源码也纳入分析
/init-design-md --deep

# 已有 DESIGN.md 时不提示，自动合并
/init-design-md --from-existing
```

生成后，校验并接入构建：

```bash
npx --yes @google/design.md lint DESIGN.md
npx --yes @google/design.md export --format css-tailwind DESIGN.md > theme.css
```

---

## 🛠 开发

```bash
npm install
npm test
```

测试套件包含**真实 linter 集成测试**（对黄金示例跑真实校验），以及命令 / question-bank / 静态结构检查。

> 发布前另有一份**人工冒烟流程**：[`docs/smoke-test.md`](docs/smoke-test.md)。
> 确定性 `test/` 套件无法执行 SKILL.md 里的自然语言指令，所以插件的实际行为是在那里靠真人跑一遍确认的。

---

## 📁 目录结构

```text
.
├── .claude-plugin/
│   ├── plugin.json           插件清单
│   └── marketplace.json      marketplace 清单（本仓库自己就是市场）
├── commands/
│   └── init-design-md.md     /init-design-md 命令入口（转发参数给 skill）
├── skills/init-design-md/
│   ├── SKILL.md              工作流主体（Phase 1/3/5）
│   ├── references/           question-bank、扫描清单、规范摘要、导出小抄
│   └── examples/minimal.md   最小示例产物
├── test/                     node --test 套件（含真实 linter 集成）
└── docs/smoke-test.md        发布前人工冒烟流程
```

---

## 📄 许可

[Apache-2.0](LICENSE)
