# React Router 实战指南 | React Router Practical Guide

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/React_Router-7.13.0-CA4245?style=for-the-badge&logo=react-router" alt="React Router">
  <img src="https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite" alt="Vite">
</p>

<p align="center">
  🎯 全面掌握 React Router v6 核心知识点，覆盖面试高频考点<br>
  🎯 Comprehensive React Router v6 guide with interactive demos
</p>

---

## 🌐 在线演示 | Live Demo

👉 **[点击访问 | Visit](https://github.io/icefree/react-router-demo/)**

---

## ✨ 功能特性 | Features

### 🪆 嵌套路由 (Nested Routes)

> 演示多层嵌套路由、Outlet 用法、动态参数、默认路由等

- 多层嵌套路由结构
- `<Outlet>` 组件的使用
- `useParams` 获取动态参数
- 默认子路由配置

### 🔐 路由守卫 (Auth Guard)

> 认证守卫、角色权限控制、受保护路由、登录状态管理

- `ProtectedRoute` 高阶组件实现
- React Context 状态管理
- RBAC 角色权限控制
- 登录/登出状态切换

### ⚡ 路由懒加载 (Lazy Loading)

> React.lazy、Suspense、代码分割、骨架屏加载效果

- `React.lazy()` 动态导入
- `<Suspense>` 加载边界
- 代码分割优化首屏加载
- 骨架屏加载体验

### 🧭 编程式导航 (Programmatic Navigation)

> useNavigate、push/replace、state 传参、返回上一页

- `useNavigate` Hook 使用
- `push` 与 `replace` 模式
- `state` 路由状态传参
- 历史记录导航控制

### 💾 路由缓存 (Keep-Alive)

> 组件状态保持、多种缓存方案、与 Vue keep-alive 对比

- 多种缓存策略实现
- `display: none` 隐藏策略
- 状态持久化方案
- 对比 Vue `<keep-alive>`

---

## 🚀 快速开始 | Quick Start

### 安装依赖 | Install Dependencies

```bash
# 推荐使用 pnpm
pnpm install

# 或使用 npm
npm install
```

### 开发模式 | Development

```bash
pnpm dev
```

### 构建生产版本 | Build for Production

```bash
pnpm build
```

### 预览构建结果 | Preview Build

```bash
pnpm preview
```

---

## 📁 项目结构 | Project Structure

```
react-router-demo/
├── src/
│   ├── Home.jsx              # 首页入口与 Demo 导航
│   ├── nested-router.jsx     # 嵌套路由演示
│   ├── auth-guard.jsx        # 路由守卫演示
│   ├── lazy-load.jsx         # 懒加载演示
│   ├── programmatic-nav.jsx  # 编程式导航演示
│   ├── route-cache.jsx       # 路由缓存演示
│   ├── main.jsx              # 应用入口
│   └── index.css             # 全局样式
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎓 面试考点 | Interview Topics

| 主题       | 核心考点                              |
| ---------- | ------------------------------------- |
| 嵌套路由   | Outlet、useParams、默认路由、路由配置 |
| 路由守卫   | ProtectedRoute、Context、权限控制     |
| 懒加载     | React.lazy、Suspense、代码分割        |
| 编程式导航 | useNavigate、state 传参、replace      |
| 路由缓存   | 状态保持、生命周期、性能优化          |

---

## 🛠️ 技术栈 | Tech Stack

- **React 19.2.0** - UI 框架
- **React Router DOM 7.13.0** - 路由管理
- **Vite 7.2.4** - 构建工具
- **ESLint** - 代码规范

---

## 📄 License

MIT License © 2024

---

<p align="center">
  Built with ❤️ for React Router learners
</p>
