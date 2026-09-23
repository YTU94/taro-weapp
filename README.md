<p align="center"><img src="static/logo.png" width="100%" height="auto"/></p>

<h1 align="center">酒桌 Gameing</h1>

<p align="center">基于 Taro 4 + React 18 的聚会助兴小游戏合集</p>

酒桌上、牌桌前随时能开一局的小程序：摇骰子、大转盘、抽扑克牌、文字翻牌、24 点。五款游戏共用一套「今晚战况」计分板，谁喝了几杯一目了然。

---

## 技术栈

| 项 | 版本 |
| --- | --- |
| 框架 | Taro **4.2.1**（React 语法） |
| UI | React **18.3.1** + taro-ui **3.4.1** |
| 编译器 | webpack **5.91.0**（`compiler: 'webpack5'`） |
| 样式 | Less **4.9.1**（业务代码）／ Dart Sass（仅 taro-ui 内部） |
| 运行时 | Node.js **>= 18**，实测 v22.22.2 / npm 10.9.7 |
| 主要目标 | 微信小程序（同时保留 H5、支付宝、字节、百度、QQ、京东 构建脚本） |

> 项目于 2026-09 从 **Taro 1.3.20 + NervJS（webpack4）** 升级到 **Taro 4.2.1 + React 18（webpack5）**，详见文末「版本演进」。

---

## 功能

- [x] 摇骰子 —— 自由摇骰（1–6 颗）＋ **789 玩法**（两骰之和：7 加酒 / 8 半杯 / 9 全杯，自动判定并计入战况）
- [x] 大转盘 —— 扇区文字可自定义，落点随机且不压分割线
- [x] 抽扑克牌 —— 52 张 + 大小王，抽牌有盖牌节奏动画
- [x] 文字翻牌 —— 3×3 九宫格，输入文字随机翻出
- [x] 24 点 —— 发 3 张牌，用 + − × ÷ 算出 24
- [x] **今晚战况**（全局）—— 2–12 人玩家管理、杯数统计、「我好了」退出本轮、开新一局、本地持久化；5 个游戏页与首页均有入口
- [ ] 自动记杯目前**只有 789 骰子接入**（其余 4 款游戏待接入；面板也还没有手动「记一杯」入口）
- [x] 分享页 —— 转发给朋友 + 邮件反馈入口

> 「赞赏开发者」入口已移除。

---

## 目录结构

```
taro-weapp/
├── config/                     构建配置
│   ├── index.js                defineConfig（framework: react / compiler: webpack5）
│   ├── dev.js                  开发环境覆盖
│   └── prod.js                 生产环境覆盖
├── src/
│   ├── app.js                  应用入口（React 函数组件，useLaunch 中登录换 token）
│   ├── app.config.js           defineAppConfig（pages / tabBar / window）
│   ├── app.less                全局样式
│   ├── api.js                  Taro.request 封装（注入 x-token）★ 无引用，死代码
│   ├── index.html              H5 模板（含 rem 基准脚本）
│   ├── assets/images/          tabBar 图标（game / share 各 2 个）+ 纸飞机图标
│   ├── components/
│   │   ├── playerBar/          ★ 今晚战况：悬浮胶囊（游戏页）+ 内嵌卡片（首页）
│   │   ├── faces/              ★ 纯 CSS 自绘扑克牌 / 骰子（PokerCard / Die / cardInfo）
│   │   ├── cusInput/           带图标的输入框（转盘页自定义选项用）
│   │   ├── countCard/          （当前无引用，历史遗留）
│   │   └── footer/             （当前无引用，历史遗留）
│   ├── pages/
│   │   ├── tabBar/index/       首页：Hero + 双列游戏卡片 + 今晚战况 + 理性饮酒提示
│   │   ├── tabBar/share/       分享页（转发引导 + 广告位）
│   │   ├── diceGame/           摇骰子（自由摇骰 / 789）
│   │   ├── pukeGame/           抽扑克牌
│   │   ├── rotateGame/         大转盘
│   │   ├── flopGame/           文字翻牌
│   │   └── twentyFourGame/     24 点
│   ├── styles/page-common.less 页面通用设计令牌与组件类（page / card / primary-btn …）
│   └── utils/
│       ├── players.js          玩家与计分板 store（订阅式 + Storage 持久化）
│       └── punish.js           分级惩罚题库（★ 尚未接入任何页面，见「已知事项」）
├── static/                     仓库展示用图（README logo 等，不参与构建）
└── project.config.json         微信开发者工具配置（miniprogramRoot 指向 dist/）
```

每个页面均由 `index.jsx` + `index.less` + `index.config.js`（`definePageConfig`）三件套组成。

---

## 使用

需要 **Node.js >= 18**。

```bash
# 安装依赖
npm install

# 开发：监听编译微信小程序
npm run dev:weapp

# 打包微信小程序
npm run build:weapp

# 其他端（把 weapp 换成 h5 / alipay / tt / swan / qq / jd）
npm run build:h5
npm run dev:h5
```

编译产物在 `dist/`。用**微信开发者工具直接导入本仓库根目录**即可 —— `project.config.json` 的 `miniprogramRoot` 已指向 `dist/`，无需手动选目录。

> **`dist/` 只放小程序产物，H5 产物单独输出到 `dist-h5/`**（`config/index.js` 里按 `process.env.TARO_ENV` 分流）。
> 两者共用同一个目录会互相污染：H5 的 `index.html` / `js/` / `css/` 会被开发者工具编进小程序文件清单，
> 之后 dist 重建成纯小程序产物时，**上传会报 `ENOENT: ... open '.../dist/js/<id>.<hash>.js'`**。这个坑已经踩过，别再合回去。

**上传小程序**：先 `npm run build:weapp` 出生产产物，再在开发者工具里上传。不要拿 `dev:weapp` 的产物上传（未压缩、带 sourcemap），也不要在上传过程中让 watch 重写 `dist/`。

> 开发者工具的本地基础库版本在 `project.private.config.json`（该文件不入库）。项目根 `project.config.json` 不再写死 `libVersion`，由工具使用默认新版基础库。

---

## 设计规范

首页与 5 个游戏页共用一套设计令牌（`src/styles/page-common.less`）：

| 令牌 | 值 |
| --- | --- |
| 品牌渐变 | `linear-gradient(135deg, #6190e8, #7c6fe8)`（蓝 → 紫） |
| 页面底色 | `#f5f7fb` |
| 卡片 | `#fff`，圆角 `28rpx`，阴影 `0 6rpx 24rpx rgba(31,41,55,.06)` |
| 主文字 / 次文字 | `#1f2937` / `#98a2b3` |
| 通栏按钮 | 胶囊 `border-radius: 999rpx`，`.primary-btn` 渐变 / `.ghost-btn` 白底描边 |
| 装饰母题 | 半透明白圆（Hero 区 `::before` / `::after`） |

**图标与牌面一律 CSS 绘制**，不使用任何远程图片：首页游戏图标（迷你卡牌 / box-shadow 点阵骰子 / conic-gradient 转盘 / 24 字块）与 `components/faces` 的扑克牌、骰子都是纯 CSS 实现。

---

## 数据与合规

- **玩家数据只存本地**（`Taro.setStorageSync`，key `jb_session_v1`），不上传服务器，符合数据最小化要求。
- 首页固定展示**理性饮酒提示**：理性饮酒 · 未成年人禁止饮酒 · 酒后不驾车；战况面板提供「我好了，退出本轮」，不强迫参与。
- **惩罚题库已备但未接入**：`src/utils/punish.js` 整理了约 190 条分档内容（温和 75 / 标准 70 / 劲爆 45，各含真心话 · 大冒险 · 惩罚动作），但**当前没有任何页面或组件引用它**——牌桌的罚酒文案仍写在各游戏页里（如转盘的默认 10 项）。接入后即可支持按场合切换力度。
- UI 设计**刻意规避酒杯、酒瓶等酒精意象**（含 logo），只使用卡牌与骰子作为视觉母题，避免小程序审核踩线。

---

## 已知事项

- **后端已下线，现已切换为离线模式**：原作者域名 `ggapi.ytuj.cn` 的 DNS 记录已被撤销（子域不存在，根域 `ytuj.cn` 仅返回 403）。原先 `app.js` 会在启动时请求它登录换 token，**每次启动必然失败并抛出未捕获的 Promise 异常**（开发者工具控制台报错）。现已把 `src/app.js` 顶部的 `API_HOST` 置为空字符串进入离线模式 —— 启动时不发任何网络请求，玩家数据只落本地 Storage；登录代码与 `fail`/`.catch()` 兜底均保留，后端恢复后填回域名即自动生效。
- **`src/api.js` 是死代码**：无任何引用，且 `HOST` 写死同一个已下线域名（未被 `useLaunch` 使用、也不进产物）。如需接后端，建议先删除它，再按上面的 `API_HOST` 方式接入。
- **`components/countCard` 与 `components/footer` 已无引用**，属历史遗留，可安全删除。
- **`utils/punish.js` 同样无引用**（286 行惩罚题库，零调用点），等待接入或清理。
- **`assets/images/` 中的 `person-active.png`、`person-default.png`、`shake-icon.png` 已无引用**。
- **记杯链路只通了一条**：`utils/players.js` 的 `punish()` 目前仅被 `diceGame` 的 789 玩法调用，其余 4 款游戏的罚酒结果不会进战况；战况面板本身也没有手动加杯按钮（面板文案「各游戏的罚酒会自动记到这里」尚未实现）。
- **首页「24点」卡片描述写的是「四张牌巧算 24」，实际玩法是 3 张牌**（见 `pages/twentyFourGame/index.jsx` 的 `pickThree()`），文案待统一。
- **依赖漏洞**：Dependabot 报告 30+ 条，主要来自 taro-ui 及其传递依赖。taro-ui 3.x 与 Taro 4 的适配较敏感，升级需要单独评估。
- **taro-ui 的 Sass 弃用警告**：`@import rules are deprecated`，来自 taro-ui 自身 SCSS，Dart Sass 3.0 才会移除，当前不影响构建产物。

---

## 版本演进

| 版本 | 说明 |
| --- | --- |
| 2.0.0 | Taro 4.2.1 + React 18 + webpack5；新增今晚战况（玩家管理 / 杯数看板）、CSS 自绘牌面、789 骰子玩法、分级惩罚题库（暂未接入）；首页与 5 个游戏页 UI 现代化改版；移除远程图片依赖与「赞赏开发者」入口 |
| 1.x | Taro 1.3.20 + NervJS + webpack4 |

### 升级带来的主要变化

- `src/app.js` 改为 React 函数组件（`useLaunch`），原 `app.config.js` 接管应用级配置，每个页面新增 `index.config.js`
- 所有含 JSX 的文件从 `.js` 改名为 **`.jsx`**（Taro 4 的 webpack5 prebundle 只把 `.jsx` 识别为 JSX 文件）
- 移除 node-sass 补丁脚本，改用 Dart Sass；新增 `babel.config.js`
- `config/*` 重写为 ESM（`defineConfig`）
- `mini.output.clean` 设为 `false`，避免 watch 反复清空 `dist/`（详见 `AGENT.md`）

---

## 计划

开发计划：https://github.com/users/YTU94/projects/2

## 后端

原后端仓库：https://github.com/YTU94/taro-GGameing-server （node + mysql + express，**接口当前不可用**）

---

**欢迎大家使用，欢迎 ⭐️ 和 PR。**
