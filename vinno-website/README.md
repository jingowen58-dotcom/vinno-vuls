# VINNO 品牌网站

VINNO 的公开品牌站。它说明使命、三条业务路径、六层架构和建设顺序。

网站不提供账号、数据上传、检测下单或科研数据库。标成「已规划」或「长期愿景」的能力都还没有上线。

## 本地运行

```bash
cd vinno-website
npm install
npm run dev
```

浏览器打开：

- 英文：http://localhost:3000/en/
- 中文：http://localhost:3000/zh/

## 检查

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` 生成静态文件到 `out/`，资源前缀是站点根路径，适合本地打开。

GitHub Pages 使用项目路径 `/vinno-vuls`：

```bash
npm run build:pages
```

## 发布

代码在 `jingowen58-dotcom/vinno-vuls`。推送到 `main` 后，`.github/workflows/deploy-website.yml` 构建 `vinno-website` 并发布到 GitHub Pages。

公开地址：

https://jingowen58-dotcom.github.io/vinno-vuls/en/

仓库的 Pages 来源需要设为 GitHub Actions。没有公布对外邮箱，页脚只链接本仓库。

## 状态从哪里来

`src/config/status.ts` 定义四种状态。路线图、架构层、物种配置和三个引擎都引用这份配置，不在页面里另写一套。

进度以仓库里的 VULS 草案 0.2.4 和 `vinno-data-validator` 为准。见 `PROJECT_AUDIT.md`。
