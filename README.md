# 技能库 · DSH Skill Library

> 一个 **DeepSeek Harness（DSH）** 插件：把散落在各处的 AI 技能与专家收进一个整页面板，可视化浏览、预览、一键导入，还能直接从 GitHub 发现并安装技能。

<p>
  <img alt="license" src="https://img.shields.io/badge/license-MIT-blue">
  <img alt="dsh" src="https://img.shields.io/badge/DeepSeek%20Harness-plugin-4f6ef7">
  <img alt="version" src="https://img.shields.io/badge/version-0.2.0-green">
</p>

---

## 它解决什么问题

技能（`SKILL.md`）现在散在五六个地方：DSH 自己的目录、WorkBuddy、Claude Code、Codex、豆包工作版，还有一堆躺在 GitHub 仓库里。想知道「我到底有哪些技能」「这个技能写了什么」「怎么装一个新的」，以前只能翻文件夹。

技能库把这五件事做成一个面板：

| 能力 | 说明 |
|---|---|
| **汇总** | 扫描 DSH / WorkBuddy / Claude Code / Codex / 豆包 的技能目录，统一成可搜索的卡片列表 |
| **预览** | 右侧直接看文件树、SKILL.md 摘要，还能「查看全文」弹层 |
| **导入 / 移除** | 一键复制成 DSH 常驻技能；移除只删自己导入的那份 |
| **专家** | 读取 WorkBuddy 专家包、豆包「工作伙伴」导出包，导入成带人设的技能 |
| **发现** | 在 GitHub 上按 `SKILL.md` 搜索，预览正文后一键安装到 `~/.dsh/skills` |
| **会话专家胶囊** | 输入框下方选专家，按轮次生效；助手回复上方显示头像与名字 |

界面在左侧栏「插件 / 自动化任务」同一组，是一个整页三栏布局：左分类、中卡片网格、右详情。

---

## 安装

### 方式一：本地目录（推荐，开发/自用）

```bash
git clone https://github.com/fenshal/dsh-skillbox.git
```

然后在 DSH 里把该目录装成 bundle（路径换成你的克隆位置）：

```
plugin_manager install_bundle  <克隆目录的绝对路径>
```

装完在左侧栏点「技能库」图标即可。

### 方式二：压缩包

下载 [Releases](https://github.com/fenshal/dsh-skillbox/releases) 里的 `dsh-skillbox-0.2.0.zip`，解压后用同样方式 `install_bundle` 指向解压目录。

> 插件 ID 是 `@local/dsh-skillbox`，要求 DSH 客户端提供 `@deepseek-ai/dsh-client-ui-layout` 与 `-ui-sidebar`（DSH 0.1.x 起自带）。

---

## 使用

### 技能页签

- 左侧按来源分组（全部 / 已安装 / 各平台），顶部搜索框实时过滤
- 卡片显示标题、平台徽章、简介、路径；星标表示已安装
- 点卡片 → 右侧详情：文件树、大小、SKILL.md 摘要、`查看全文`
- 顶部可切换 **排序**（默认 / 名称 / 大小 / 最近使用）与 **中文/原文**

### 专家页签

- 卡片带头像与职业徽章，列出该专家自带的技能
- **不需要导入也能用**：在输入框下方的胶囊里选中即可，人设会注入到当前会话
- 导入 = 复制成 `~/.dsh/skills/expert-<名字>`，不挂专家时也能当普通技能用
- 选择按**轮次**记录：第 3 轮选的人，第 4 轮起才显示头像；取消后不再显示

### 发现页签

- 分类：Claude / Codex / DSH / 通用 Agent
- 两种模式：**技能**（GitHub 代码搜索 `filename:SKILL.md`）与 **仓库**（仓库搜索）
- 点卡片看仓库里的技能清单，点「预览」看正文，确认后「安装到技能库」

---

## 配置

| 配置项 | 位置 | 说明 |
|---|---|---|
| GitHub Token | 发现页顶部提示条，或 `~/.dsh/skillbox-github.json` 的 `{"token":"..."}` | 可选。没有也能用（匿名限流：代码搜索 10 次/分，仓库搜索 30 次/分） |
| Token 环境变量 | `GH_TOKEN` / `GITHUB_TOKEN` | 优先级低于上面的文件 |
| 导出包目录 | 环境变量 `DSH_SKILLBOX_IMPORTS`（`;` 分隔）、`~/.dsh/skillbox-imports.json` 的 `{"dirs":["D:/some/dir"]}`、或默认 `~/.dsh/imports` | 三个来源合并去重，用来扫描豆包「工作伙伴」导出包 |
| 数据文件 | `~/.dsh/skillbox-{selection,i18n,github,autoselect}.json` | 会话专家选择、翻译缓存、Token、自检旗标 |
| 日志 | `~/.dsh/skillbox-inject.log` | 每次注入专家人设记一行，便于排查 |

### Token 从哪来

优先级：`~/.dsh/skillbox-github.json` → `GH_TOKEN` / `GITHUB_TOKEN` → 已登录的 `gh` CLI（`gh auth token`）→ 匿名。

匿名模式下发现页仍能用，只是限流更紧、而且**拿不到星标/Fork 数**（GitHub 代码搜索不返回仓库统计），此时页面会提示你填 Token。

---

## 隐私与边界

- **只读**：扫描来源目录时只读不写，导入是**复制**一份到 `~/.dsh/skills`，不改动原目录
- **不碰加密数据**：只解析明文 `SKILL.md` / `plugin.json` / `manifest.json`；遇到加密或二进制存储直接跳过
- **Token 只存在本机**：`~/.dsh/skillbox-github.json` 明文保存，权限取决于系统；不会上传到任何第三方
- **翻译**：简介翻译走 MyMemory 公共接口（`api.mymemory.translated.net`），只发送简介文本，不发送文件内容
- **发现页**只调用 GitHub 官方 API

---

## 已知限制

- 专家只搬「人设 + 技能文本」，**不带工具集和连接器**（DSH 目前没有对应槽位）。依赖豆包/美图云服务的专家，导入后那些云端调用跑不了
- 豆包工作版的专家头像/介绍是服务端下发，本地没有，所以只能拿到技能文本
- 机翻对产品名不友好（如 `impeccable → 无可挑剔`），所以标题始终保留原名
- GitHub 没有「下载量」概念，发现页只能用 star / fork 近似热度

---

## 开发

```bash
# 语法检查
node --check index.js
node --check client.js

# 改完客户端代码后必须重挂 bundle，否则页面还是旧代码
# plugin_manager set_bundle  @local/dsh-skillbox  enabled:false
# plugin_manager set_bundle  @local/dsh-skillbox  enabled:true
```

目录结构：

```
index.js            # host 侧：扫描、导入、路由、会话专家注入
client.js           # web 侧：整页 UI、会话专家胶囊、助手头像条
cordis.patch.yml    # bundle 挂载点
locale/{zh,en}.json # 侧栏标题与描述
icon.png            # 侧栏图标（256×256）
```

host 侧路由一览：`/skillbox/{list,import,remove,detail,file,experts,import-expert,avatar,translate,preview,selection,select-expert,discover,discover/skills,discover/tree,discover/file,discover/install,discover/meta,gh-status,gh-token,report,autoselect}`。

调试小技巧：客户端会把整页几何与插入的头像条数量 POST 到 `/skillbox/report`，排查布局问题很方便。

---

## English

**DSH Skill Library** is a DeepSeek Harness plugin that pulls skills and experts scattered across DSH, WorkBuddy, Claude Code, Codex and Doubao Work into one full-page panel: browse, preview `SKILL.md`, import into `~/.dsh/skills`, and discover/install skills straight from GitHub.

- **Read-only scan** — source folders are never modified; import copies a skill into your own DSH skills directory.
- **Plain files only** — encrypted or binary stores are skipped.
- **Optional GitHub token** — falls back to `GH_TOKEN` / `GITHUB_TOKEN` / `gh auth token` / anonymous.
- **Session expert** — pick an expert from the composer chip; the persona is injected per session and tracked per turn.

Install: `git clone` this repo and run `plugin_manager install_bundle <abs-path>` inside DSH, or unzip a release and point at it.

License: MIT.

---

## 更新记录

见 [CHANGELOG.md](./CHANGELOG.md)。
