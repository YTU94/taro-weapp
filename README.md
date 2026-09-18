<p align="center"><img src="static/logo.png" width="100%" height="auto"/></p>

> 使用taro框架强力驱动

**技术栈：Taro 4.2.1 + React 18 + taro-ui 3.x（webpack5 编译）**

----------

### 简介

主要实现用于餐桌，酒桌上的娱乐小游戏，主要包括，摇骰子，大转盘，选扑克牌，文字翻牌游戏，外加账号分享功能。

### 功能

- [x] 选扑克牌游戏
- [x] 九宫格文字翻牌游戏
- [x] 摇骰子 
- [x] 幸运大转盘 
- [x] 账号分享
- [x] 给赞->赞赏功能

### 结构

- 结构简单
- 一目了然

### 计划

开发计划：https://github.com/users/YTU94/projects/2

### 后端

技术：node + mysql + express 
地址：https://github.com/YTU94/taro-GGameing-server

### 使用

需要 Node.js >= 18。

```
// 安装依赖
npm install

// 启动编译微信小程序（其他小程序请看 package.json）
npm run dev:weapp

// 打包微信小程序（其他小程序请看 package.json）
npm run build:weapp

// 编译 H5
npm run dev:h5
```

编译产物在 `dist/`，用微信开发者工具直接打开本仓库根目录即可（`project.config.json` 的 `miniprogramRoot` 已指向 `dist/`）。

### 目录约定

- `src/app.js` 应用入口（React 函数组件，`useLaunch` 中完成登录换 token）
- `src/app.config.js` 应用级配置（pages / tabBar / window）
- `src/pages/<name>/index.js` 页面组件，`index.config.js` 页面配置（`definePageConfig`）
- `config/index.js` 构建配置（`framework: react`、`compiler: webpack5`）
- `babel.config.js` babel 配置（`babel-preset-taro`）

**最后**欢迎大家使用，欢迎 ⭐️,Pr
