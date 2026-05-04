# 国士

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[中文](README_CN.md) | [English](README.md)

一个纪念中国国家英雄（国士）的静态网站，展示他们的肖像、名言和多种艺术风格, 可以方便的保存图片和打印，或者保存pdf文件

网址：[https://guoshi.html5beta.com](https://guoshi.html5beta.com)

## 功能特点

- **国士**：展示中国最具影响力人物的肖像和名言
- **多种艺术风格**：每位英雄的肖像都有6种风格：
  - 原图
  - 黑白
  - 像素艺术
  - 素描
  - 复古
  - 怀旧
- **打印支持**：打印任意页面或保存为PDF
- **保存为图片**：下载任意风格的肖像
- **响应式设计**：支持桌面和移动设备
- **快速加载**：部署在Cloudflare Workers上的静态网站

## 国士名单

### 政治家
- 毛泽东 - 中华人民共和国主要缔造者

### 科学家
- 钱学森 - 中国航天之父
- 袁隆平 - 杂交水稻之父

## 开发指南

### 环境要求

- Node.js >= 18.0.0
- npm

### 安装与运行

```bash
# 安装依赖
npm install

# 构建网站
npm run build

# 启动开发服务器
npm start
```

### 可用脚本

- `npm run build` - 构建静态网站到 `public/` 目录
- `npm start` - 启动开发服务器
- `npm test` - 运行集成测试
- `npm run clean` - 清除构建输出

## 部署

本网站使用GitHub Actions部署到Cloudflare Workers。部署流程：

1. 推送到 `main` 分支
2. GitHub Actions 构建网站
3. 部署到 Cloudflare Workers

### 需要配置的密钥

- `CLOUDFLARE_API_TOKEN` - Cloudflare API 令牌
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 账户 ID

## 贡献指南

欢迎贡献！请随时提交 Pull Request。

### 添加新人物

1. 在 `src/data/persons.js` 中添加人物数据
2. 包含：id、name、nameEn、lifeYears、title、description、quote、photoUrl
3. 运行 `npm run build` 生成图片和页面
4. 提交 Pull Request

### 报告问题

如果发现任何问题，请在 GitHub 上提交 issue。

## 相关链接

- [中国 vs 印度](https://china-vs-india.html5beta.com/)
- [中国 vs 美国](https://china-vs-us.html5beta.com/)
- [中国 vs 世界其他国家](https://china-vs-rest-of-the-world.html5beta.com/)

## Matrix 项目系列

本项目是 **Matrix** 数据可视化项目系列的一部分：

- [中国 vs 印度](https://china-vs-india.html5beta.com/)
- [中国 vs 美国](https://china-vs-us.html5beta.com/)
- [中国 vs 世界其他国家](https://china-vs-rest-of-the-world.html5beta.com/)
- [国士 - 中国国家英雄](https://guoshi.html5beta.com)

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。
