# site-alcohol-core

喝酒去四站的共享工程底座。站点仓只放 Astro 应用，构建器、契约、UI 与品牌资产集中在这里。

```text
packages/build-tools/   内容读取、schema 校验、路由、页面清单、搜索聚合与 CLI
packages/contracts/     站点、类型、仓库、关系、标签与文案契约
packages/ui/            四站共享布局、组件、样式、品牌资产与客户端交互
```

契约以 `packages/contracts/sites.json` 为准：`main` 是唯一 `main: true`，host 为 `hejiu.org`；`beverages`、`culture`、`atlas` 各自对应子域。内容来自 `world-alcohol-encyclopedia` 的同名内容域。

## 命令

在 `implementation/` 工作区运行：

```text
npm run build:tools
npm run validate
npm run check:catalogs
npm run verify:pages
npm run verify:links
```
