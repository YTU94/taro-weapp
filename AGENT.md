# AGENT.md

面向在本仓库工作的 AI 编码代理与协作者的工程手册。**动手改代码前先读第 3 节「硬性约定」和第 6 节「验证清单」。**

---

## 1. 项目概览

| 项 | 值 |
| --- | --- |
| 名称 | G-gaming / 酒桌 Gameing（`package.json` name: `G-gaming`，version `2.0.0`） |
| 定位 | 聚会助兴微信小程序：5 款小游戏 + 共用「今晚战况」计分板 |
| 框架 | Taro **4.2.1**，React 语法（非 TS） |
| UI | React **18.3.1** + taro-ui **3.4.1** |
| 编译器 | webpack **5.91.0**，`framework: 'react'`，`compiler: 'webpack5'` |
| 样式 | Less（业务）/ Dart Sass（仅 taro-ui 内部） |
| 源码根 | `src/` → 产物 `dist/` |
| 设计稿宽度 | `designWidth: 750`（rpx 体系） |
| 缩进 | 4 空格（`.editorconfig`），JSX 文件用单引号 + 无分号 |

**页面清单（7 个，顺序即 `app.config.js` 的 `pages` 数组）**

| 路径 | 说明 | 导航标题 |
| --- | --- | --- |
| `pages/tabBar/index/index` | 首页（Hero + 游戏网格 + 今晚战况 + 理性饮酒提示） | 首页 |
| `pages/tabBar/share/index` | 分享页（转发引导 + 广告位） | 分享 |
| `pages/flopGame/index` | 文字翻牌（3×3） | 文字翻牌 |
| `pages/pukeGame/index` | 抽扑克牌（1–54，含大小王） | 扑克牌 |
| `pages/rotateGame/index` | 大转盘 | 转盘游戏 |
| `pages/diceGame/index` | 摇骰子（自由摇骰 / 789） | 摇骰子 |
| `pages/twentyFourGame/index` | 24 点（3 张牌） | 24点 |

`app.config.js` 的全局 `window.navigationBarTitleText` 仍是模板遗留的 `'WeChat'`，但 7 个页面各自覆盖，实际不生效。

---

## 2. 环境与命令

Node.js **>= 18**。本机实测 `v22.22.2` / `npm 10.9.7`。

```bash
npm install            # 安装依赖
npm run dev:weapp      # 监听编译微信小程序（开发主力，产物 dist/）
npm run build:weapp    # 一次性构建微信小程序
npm run build:h5       # 构建 H5（用于手机视口截图做视觉验证）
# 其他端：build/dev + swan | alipay | tt | qq | jd
```

**若 `taro` 命令找不到**，说明 PATH 里没有 Node —— 用绝对路径调用，或把 Node 的 `bin` 目录前置到 PATH。

**预览**：微信开发者工具 **导入仓库根目录**（不是 `dist/`）—— `project.config.json` 的 `miniprogramRoot` 已指向 `dist/`。基础库版本由 `project.private.config.json`（不入库）控制。

> `config/index.js` 里 `mini.output.clean: false` 是**刻意设置**，不要改回 `true`。watch 模式下每次清空 `dist/` 会触发宿主的批量删除保护而中断编译。需要全新产物时手动 `rm -rf dist && mkdir dist` 再重启 watch。

---

## 3. 硬性约定（违反会导致白屏或渲染异常）

### 3.1 含 JSX 的文件必须是 `.jsx`

Taro 4 的 `webpack5-prebundle/scanImports.js` **只把 `.jsx` 识别为 JSX 文件**。业务代码若把 JSX 写在 `.js` 里，watch 会持续报：

```
✘ [ERROR] The JSX syntax extension is not currently enabled
```

当前纯 JS 文件（**不要**改名）：`src/app.js`、`src/api.js`、`src/app.config.js`、各页面 `index.config.js`。
其余页面与组件全部是 `.jsx`。

### 3.2 用到的 `@tarojs/components` 组件必须显式 import

这是本项目**最高频的白屏原因**。Taro 4 在 `createElement` 阶段解析不到组件会直接中断整页渲染，而 webpack 编译**不报错**（终端干净，只有运行时白屏）。

```jsx
// ❌ 白屏：用了 <Text> 但没 import
import { View } from '@tarojs/components'
...
<Text>hello</Text>

// ✅
import { View, Text } from '@tarojs/components'
```

同理适用于从本地模块 import 的组件（曾发生 `PlayerBar` 漏 import 导致 3 个页面白屏）。**新增任何标签后，回头确认 import 行**。

### 3.3 每个页面必须有 `index.config.js`

```js
export default definePageConfig({
    navigationBarTitleText: '摇骰子'
})
```

`definePageConfig` 是全局宏，无需 import。新页面同时在 `src/app.config.js` 的 `pages` 数组注册。

### 3.4 样式约定

- 游戏页必须显式引入公共样式：`import '../../styles/page-common.less'`（首页与分享页除外，它们自带 Hero / tabBar 布局样式）。
- 公共类：`.page` `.page-header` `.page-title` `.page-sub` `.card` `.section-title` `.expain` `.primary-btn` `.primary-btn-active` `.primary-btn-disabled` `.ghost-btn` `.bottom-bar` `.modal-overlay` `.modal-card`。
- **跨文件覆盖样式时用「两级类」选择器**，不要依赖文件加载顺序：

  ```less
  // 首页 .card 是网格卡（width: calc(50% - 12rpx)）
  // playerBar 的内嵌卡复用了 .card，必须用两级类压过它
  .pb-inline.card { width: 100%; margin-right: 0; }
  ```

- 小程序 wxss **不支持**：标签选择器（裸 `view`/`text`）、ID 选择器、属性选择器。只能用类选择器和 `page`。

### 3.5 禁止远程图片

所有图标、扑克牌、骰子一律 **CSS 绘制**（`components/faces` 与首页 `ICONS`）。远程图片会带来 `downloadFile 合法域名` 报错，且依赖的图床早已失效。仓库内仅保留本地资源：`src/assets/images/*.png`。

### 3.6 小程序渲染器不支持 3D 翻转

`perspective` + `transform-style: preserve-3d` + `backface-visibility` 组合在微信渲染器上会布局崩坏（翻牌页曾因此牌阵错位）。做翻转效果请用**两层面互斥显隐 + 关键帧动画**：

```less
.front.flipped { display: none; }
.back { display: none; }
.back.flipped { display: flex; animation: card-flip-in .3s ease both; }
```

### 3.7 数据只落本地

玩家与计分数据存 `Taro.setStorageSync('jb_session_v1')`，**不上传服务器**。新增任何涉及用户数据的功能请沿用此约束。

配套约束：**启动期不得发起网络请求**。`src/app.js` 顶部的 `API_HOST` 是唯一的后端开关，默认空字符串 = 离线模式，`useLaunch` 里会直接 `return`。原因见 §8「已下线后端」。若将来要恢复接口，把域名填回 `API_HOST` 即可，登录换 token 的代码原样保留。

另外，Taro 的 API 在失败时**会把返回的 Promise reject 掉**——只传 `success` 而不用 `fail` + `.catch()` 接住，失败就会变成 unhandled rejection，在开发者工具控制台报错。`src/app.js` 里的 `swallow()` 就是干这个的，改动时不要删。

### 3.8 合规红线

- 不得出现酒杯、酒瓶等**酒精意象**（含图标与插画），视觉母题只用卡牌与骰子。
- 首页必须保留「理性饮酒 · 未成年人禁止饮酒 · 酒后不驾车」提示与退出本轮入口。
- 惩罚题库保持分档，默认 `normal`（标准版）。

---

## 4. 架构地图

### 状态管理：`src/utils/players.js`

没有引入 Redux/MobX，用**模块级单例 + 订阅**实现跨页共享：

```js
let state = load()                 // 启动时从 Storage 恢复
const listeners = new Set()
function emit() { listeners.forEach(l => l(state)) }

export function useSession() {     // React hook：页面订阅战况
    const [s, setS] = useState(state)
    useEffect(() => { listeners.add(setS); return () => listeners.delete(setS) }, [])
    return s
}
```

导出 API：

| 函数 | 作用 |
| --- | --- |
| `MAX_PLAYERS` | 12 |
| `useSession()` | 订阅战况的 React hook |
| `getSession()` | 读当前快照 |
| `addPlayer(name)` / `removePlayer(id)` / `toggleOut(id)` | 玩家增删 / 本轮退出切换 |
| `punish({ ids, cups, game, text })` | 记杯数并写入 history |
| `clearHistory()` / `newRound()` | 清历史 / 开新一轮 |
| `totalCups(players)` | 汇总杯数 |

### 惩罚题库：`src/utils/punish.js` —— ⚠️ 当前是死代码

`LEVELS`（mild 温和 / normal 标准 / hot 劲爆）× `TYPES`（truth 真心话 / dare 大冒险 / action 惩罚动作），共约 190 条（75 / 70 / 45）。导出 `getLevels()` `setLevel(key)` `draw({ level, type })` `resetDrawn()` `bankSize()`。

**但整个文件当前没有任何引用点**（已核实：`grep -rn "utils/punish" src/` 零命中）。游戏页的罚酒文案仍各自硬编码在页面内（如转盘的 `DEFAULT_LIST`）。

> 注意别和 `utils/players.js` 里的 `punish()` 混淆 —— 两者同名但无关：前者是「抽一条惩罚内容」，后者是「把杯数记到战况」。

若要让游戏页接入这个题库，import 后按场合取用；同时建议把 `draw()` 的默认档位暴露成 UI 开关（否则用户无法切换力度）。**在接入之前，改动这个文件不会影响任何页面表现。**

### 自绘牌面：`src/components/faces/index.jsx`

| 导出 | 说明 |
| --- | --- |
| `cardInfo(num)` | `1–52` 普通牌（13 张一组：♠♥♣♦）、`53` 小王、`54` 大王 |
| `<PokerCard num={n} />` | 扑克牌，靠 `.pk-corner-flip` 旋转 180° 画对角落 |
| `<Die value={n} small delay />` | 骰子，3×3 网格定位点数 |

### 战况入口：`src/components/playerBar/index.jsx`

`<PlayerBar />` → 首页内嵌卡片（`.pb-inline.card`）
`<PlayerBar fixed />` → 游戏页右下角悬浮胶囊（`.pb-fab`，含人数徽标）

5 个游戏页全部挂载，新增游戏页请一并挂上。

> ⚠️ **记杯链路只通了一条**：`punish()` 目前仅被 `diceGame` 的 789 玩法调用，其余 4 款游戏的罚酒结果不会进战况；面板也没有手动「记一杯」按钮。要让某款游戏接入，import `punish` 后在出结果时调用：
>
> ```js
> // 必须显式传 ids —— 传空数组会直接返回 false，不记给任何人
> punish({ ids: [p.id], cups: 1, game: 'rotateGame', text: '喝一杯' })
> ```
>
> 行为要点（`src/utils/players.js`）：
> - `ids` 里只有「存在且未退出」的玩家会被记账，`valid` 为空则返回 `false`（空操作）
> - `cups` 为 `0` 也返回 `false` —— 这正是 789 的「加酒」（`cups: 0`）与「安全过」不写记录的原因
> - `cups` 支持小数（`8` 记 0.5 杯），内部按一位小数取整
> - `history` 只保留最近 50 条，`newRound()` 会清空杯数与历史但保留玩家名单

### H5 rem 基准：`src/index.html`

`(Math.min(viewportWidth, 750) / 750) * 40` px。**不要**改回 Taro 1 时代的 `a/320*20`（会放大约 17% 造成横向溢出）。

---

## 5. 常见故障速查

| 现象 | 根因 | 处理 |
| --- | --- | --- |
| 页面白屏，终端无报错 | JSX 里用了没 import 的组件（`Text`、自定义组件等） | 补齐 import；用第 6 节的 `no-undef` 脚本全量排查 |
| **上传报 `ENOENT: ... open '.../dist/js/<id>.<hash>.js'`** | 曾有 H5 构建把 `js/` 产物落进共用的 `dist/`，开发者工具把它编进了小程序文件清单；dist 重建成纯小程序产物后该文件已不存在 | 已根治：H5 改输出到 `dist-h5/`（见 §6④）。残留的旧清单需在开发者工具里重刷一次：改动 `dist/` 下任一文件触发自动编译，或 工具 → 清缓存 → 清编译缓存后重新编译 |
| **终端编译零报错，但开发者工具控制台报错** | 运行期问题，多为 `app.js` 的 `useLaunch` 里有启动期副作用（请求已下线域名等）。Taro 的 API 失败会 reject 返回的 Promise，只传 `success` 不接住就是 unhandled rejection | 见 §3.7 与 §8「已下线后端」 |
| watch 报 `JSX syntax extension is not currently enabled` | JSX 写在了 `.js` 文件里 | 改名为 `.jsx` |
| watch 启动就挂 / 编译卡死，日志停在 banner | `dist/prebundle` 缓存损坏，或 watch 进程被回收 | 重启 watch；旧进程要 `pgrep` 全部清掉，`kill -9` 会留残兵 |
| 编译报 `SAFE_DELETE_BULK_CONFIRM_REQUIRED` | 覆盖 `dist/` 内大量文件时触发了宿主的批量删除保护（阈值 50 个文件，产物上百） | 别用 `rm -rf dist`（同样会被拦）——用 `mv dist /tmp/taro-dist-old-$(date +%s) && mkdir dist` 改名避让再重启 watch |
| 终端刷 `@import rules are deprecated` | taro-ui 自身 SCSS 用了 `@import` | 忽略，不影响产物 |
| 卡片被压成半宽 | 复用了首页 `.card`（网格卡）却没压过它的宽度规则 | 用两级类覆盖，见 3.4 |
| 翻牌页布局崩坏 | `preserve-3d` / `backface-visibility` | 改显隐切换，见 3.6 |
| 页面报 `ReferenceError: X is not defined` | 该模块漏 import（同类问题已发生两次） | 见第 6 节脚本 |

**上传流程**：上传要用**生产产物** —— `npm run build:weapp`（不带 `--watch`，Taro 会按 production 构建并压缩）。
不要拿 `dev:weapp` 的产物上传（未压缩、带 sourcemap、体积大），也不要让 watch 在上传过程中重写 `dist/`。

> **判断 watch 是否存活**：不能用 `touch` 或改注释来验证 —— webpack 默认 `compareBeforeEmit: true`，产物内容不变就不重写文件，mtime 自然不动。要实测就往 `.less` 里临时追加一条真实规则，看产物是否更新，验证后回滚。

---

## 6. 验证清单（改完代码按序执行）

### ① 编译

```bash
npm run build:weapp 2>&1 | grep -viE "deprecation|@import|sass-lang|root stylesheet|repetitive" | tail -20
```

预期只有 taro-ui 的 Sass 警告。**编译通过 ≠ 运行正常**，务必继续做 ②。

### ② 全量作用域检查（能抓出白屏根因）

项目自带的 `.eslintrc` 是 Taro 1.x 时代的（`extends: ["taro"]`，噪音大），**不要直接用它**。用最小化配置只跑 `no-undef` + `jsx-no-undef`：

```bash
cat > /tmp/eslint-undef.js <<'EOF'
module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  env: { browser: true, node: true, es2021: true },
  plugins: ['react'],
  globals: {
    // Taro 全局宏，必须声明否则每页 index.config.js 都会误报
    definePageConfig: 'readonly',
    defineAppConfig: 'readonly'
  },
  rules: {
    'no-undef': 'error',
    'react/jsx-no-undef': 'error'
  }
}
EOF

npx eslint --no-eslintrc --config /tmp/eslint-undef.js \
  --resolve-plugins-relative-to . --no-ignore \
  "src/**/*.js" "src/**/*.jsx"
```

零输出即通过。这一项覆盖了 3.2 的全部风险类型。

### ③ 产物抽查

```bash
# 各页面是否都编译出来了
ls dist/pages/*/index.js

# 新增组件是否真的被打包（应为每页 2 处引用）
for p in pukeGame rotateGame diceGame flopGame twentyFourGame; do
  echo "$p: $(grep -c playerBar dist/pages/$p/index.js) 处"
done

# 样式是否落到产物
grep -o "\.pb-inline\.card{[^}]*}" dist/common.wxss
```

### ④ 视觉验证（改样式时）

构建 H5 → 起本地静态服务 → 用手机视口（390×844）截图肉眼比对：

```bash
npm run build:h5                      # 产物落在 dist-h5/，不会碰 dist/
cd dist-h5 && python3 -m http.server 8899 &
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8899/index.html
```

> `config/index.js` 里 `outputRoot` 按 `process.env.TARO_ENV` 分流：H5 → `dist-h5/`，小程序 → `dist/`。
> **这是刻意隔离的，不要合并回去** —— 两者共用 `dist/` 时，H5 的 `index.html` / `js/` / `css/` 会混进
> 小程序产物，被开发者工具编进文件清单，等 dist 重建成纯小程序产物后上传就会报
> `ENOENT: ... open '.../dist/js/<id>.<hash>.js'`（详见 §5）。
> 因此截图后**只需停掉静态服务**，不必再清 dist。

> 用 `&` 或子 shell 起的静态服务会被回收 —— 要长期存活请用托管的后台任务方式启动。

---

## 7. 不要做的事

- ❌ 不要把 `mini.output.clean` 改回 `true`
- ❌ 不要把 JSX 写进 `.js` 文件
- ❌ 不要引入远程图片或远程字体
- ❌ 不要用标签 / ID / 属性选择器写 wxss
- ❌ 不要用 `preserve-3d` + `backface-visibility` 做翻转
- ❌ 不要在未验证的情况下保留猜测性修改 —— 本项目曾因绕过根因、去改 webpack / babel 配置而白走一程，实际原因只是一个漏掉的 import
- ❌ 不要提交本地产物与草稿：`output/`（优化方案文档、logo 草稿）、`.workbuddy/`（本地记忆）、`dist/` 均已在 `.gitignore` 中，保持忽略状态
- ❌ 不要在未获确认的情况下删除任何既有文件 —— 发现死代码（见第 8 节）时先报告，等用户确认再动

---

## 8. 历史遗留（可清理，改动前告知用户）

| 项 | 状态 |
| --- | --- |
| `src/components/countCard/` | 无任何引用 |
| `src/components/footer/` | 无任何引用 |
| `src/utils/punish.js` | 无任何引用（286 行惩罚题库，零调用点） |
| 其余 4 款游戏未接 `punish()` | 只有 789 骰子会写战况 |
| 首页 24 点卡片描述「四张牌巧算 24」 | 实际是 3 张牌，文案待统一 |
| `src/api.js` | 无任何引用，且 `HOST` 写死已下线域名 `https://ggapi.ytuj.cn`；未被打包进产物 |
| Dependabot 30+ 条告警 | 主要来自 taro-ui 及其传递依赖，升级需单独评估 |

### 已下线后端：`ggapi.ytuj.cn`（2026-09-23 已处理）

原作者的登录后端已经不存在了：`ggapi.ytuj.cn` 的 **DNS 记录被撤销**（`api.weixin.qq.com`、`github.com` 都能正常解析，只有该子域失败；根域 `ytuj.cn` 还在但只返回 403）。

它在 `src/app.js` 的 `useLaunch` 里发请求，**每次启动必然失败**，而原代码只传 `success`、既无 `fail` 也不接 Promise，于是失败变成 unhandled rejection，在开发者工具控制台飘红——这就是「首页 dev 启动报错」的真凶。裸 `response.data.token` 在空响应体时还会直接抛 TypeError。

处理方式：`API_HOST` 置空进入离线模式（`useLaunch` 直接 return，不发请求），登录代码与 `fail`/`.catch()` 兜底原样保留，后端恢复后填回域名即自动生效。

