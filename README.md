# 二维码生成小工具

一个纯前端的美学二维码生成器，基于 React + Vite + TypeScript + Tailwind CSS，使用 Canvas 绘制二维码并支持形状/颜色/渐变/Logo 等自定义效果。

## 功能特性

- Canvas 渲染二维码，可自定义方块、圆点、圆角、液态模块
- 前景色/背景色/渐变填充
- 定位图（眼睛）独立颜色与形状
- Logo 上传与居中嵌入（自动切换到 H 纠错等级）
- 文档页支持本地 Markdown 文章、搜索、时间筛选与按年月分组

## 目录结构

- `src/components/QRCanvas.tsx`：二维码绘制核心逻辑
- `src/components/Controls.tsx`：左侧控制面板
- `src/components/About.tsx`：关于页
- `src/components/Docs.tsx`：文档页（列表/搜索/时间筛选/渲染）
- `src/content/docs`：Markdown 文档目录

## 文档格式

文档使用 Frontmatter + Markdown：

```md
---
title: 标题
date: 2025-01-01
tags: 标签1, 标签2
---

正文内容...
```

## 开发与运行

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

## 添加新文档

1. 在 `src/content/docs` 新建 `.md` 文件
2. 填写 `title`、`date`、`tags`
3. 启动项目后会自动加载并展示

## 备注

- 建议保持前景/背景对比度，以提升扫码成功率。
- 文档列表按时间从近到远排序，并按年月分组显示。
