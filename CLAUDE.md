# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
pnpm dev            # 开发服务器，默认端口 5050
pnpm build          # 生产构建
pnpm build-zip      # 构建 + 打包 zip
pnpm lint           # ESLint --fix (src/**/*.{js,jsx,ts,tsx,vue})
pnpm lint:style     # Stylelint --fix (src/**/*.{vue,scss})
pnpm typecheck      # vue-tsc --noEmit
pnpm preview        # vite preview
pnpm sizecheck      # vite-bundle-visualizer
```

## 技术栈

Vue 3 (Composition API + `<script setup>`) · Vite 8 · TypeScript 6 · Pinia 3 · Vue Router 5 (hash mode) · Element Plus · UnoCSS · SCSS

GIS: ArcGIS Maps SDK 4.x (`@arcgis/core`)、Cesium、vue-cesium
3D: Three.js、TresJS (`@tresjs/core`)
图表: ECharts 6 + vue-echarts
视频: xgplayer (HLS/FLV)

## 架构概览

### 入口与模块自动加载

`src/main.ts` 创建 Vue 应用后，通过 `import.meta.glob('./modules/*.ts', { eager: true })` 自动加载 `src/modules/` 下的所有模块文件。每个模块导出一个函数，接收 `app` 实例并安装自身（router、pinia、i18n、nprogress 等）。模块加载顺序由 `reverse()` 反转，确保 pinia 先于 router 注册。

### 路由系统

路由定义在 `src/router/routes.ts`，这是**菜单的唯一数据源**。路由树 = 菜单树，meta 字段控制菜单显示、权限、缓存等行为。

两种菜单获取模式，由环境变量 `VITE_FRONTEND_CTRL_ROUTER` 控制：
- **前端控制** (`true`)：`from-frontend.ts` 根据用户角色递归过滤 `routes` 树
- **后端控制** (`false`)：`from-backend.ts` 从 API 获取菜单数据

`src/modules/router.ts` 创建 router 实例（hash history），然后调用 `addStaticRoutes` 添加 `/login`、`/401`、`/:all(.*)` 等静态路由，最后注册 `routerBeforeEach` 守卫。

### 布局系统

`vite-plugin-vue-layouts` 提供基于文件的路由布局。`src/layouts/default.vue` 是默认布局：

- 侧边栏：Logo + Menu（支持折叠、抽屉模式）
- 顶部：Header + TagsView（多标签页）
- 主体：`<router-view>` 内容区 + 可选 Footer
- 全屏模式：路由 meta 设置后隐藏侧边栏和顶部

所有布局行为（菜单模式、标签页显隐、footer 配置）由 `useThemeStore` 控制。

### Store（Pinia）

- `user.ts` — 登录状态、用户信息，持久化到 sessionStorage
- `menu.ts` — 菜单树、按钮权限、权限路径列表
- `theme.ts` — 主题配置（侧边栏模式、标签页、footer、全屏等）
- `tags-view.ts` — 多标签页状态管理
- `common-data.ts` — 全局加载状态等

### 组件封装层 (`src/components/j-components/`)

对 Element Plus 的二次封装：JTable、JTablePro、JForm、JDialog、JPagination、JSelect、JDatePicker。通过 `config/plugins/components.ts` 的 `unplugin-vue-components` 自动注册。

### Vite 配置拆分

- `vite.config.ts` — 入口，组合各子配置
- `config/vite.plugins.ts` — 插件组合
- `config/vite.build.ts` — 构建配置（分包策略：vue/dayjs/lodash/axios/element-plus/xlsx/shiki/echarts/arcgis 各自独立 chunk）
- `config/vite.server.ts` — 开发服务器配置
- `config/plugins/` — 每个插件的独立配置文件

### 环境变量 (`.env`)

| 变量 | 说明 |
|------|------|
| `VITE_PORT` | 开发服务器端口 |
| `VITE_BASE_URL` | 部署基础路径 |
| `VITE_REDIRECT_PATH` | 登录后默认跳转路由 |
| `VITE_API_URL` | 后端 API 地址 |
| `VITE_FRONTEND_CTRL_ROUTER` | 是否前端控制路由权限 |

### api 层

`src/api/` 下每个模块一个文件，使用 axios 实例（配置在 `src/utils/` 中）。目前只有 `login.ts`。

### i18n

`src/modules/i18n.ts` 通过 `import.meta.glob` 懒加载 `src/locales/*.json`，默认语言 `zh-CN`。`loadLanguageAsync` 按需加载语言包。

### UnoCSS 配置

`uno.config.ts` 定义了自定义规则（`bd-{width}{unit}-{color}` 快捷边框、`grid-fit/grid-fill` 自适应网格）、shortcuts（`flex-bc`、`flex-center`、`bg-default`、`layout-default` 等），以及 `presetUno` + `presetAttributify` + `presetIcons`（carbon 图标集）。

### Git Hooks

`simple-git-hooks` 管理：pre-commit 触发 lint-staged（eslint + stylelint），commit-msg 触发 `scripts/verify-commit.js`。

## 注意事项

- 项目使用 `pnpm`，`.npmrc` 中 `shamefully-hoist=true`
- 路径别名 `@` 映射到 `src/`
- 全局 SCSS 变量通过 `vite.config.ts` 的 `css.preprocessorOptions.scss.additionalData` 注入：`@use "@/styles/element/index.scss" as *;`
- 没有测试框架配置（无 vitest/jest），不要尝试跑测试
- `src/composables/` 目录为空（composables 直接写在 hooks 或页面中）
