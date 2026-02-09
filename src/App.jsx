import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useParams, Navigate } from 'react-router-dom';

// ==================== Level 1: 基础嵌套路由 ====================
// 场景：一个 Dashboard，里面有多个子页面（Overview, Settings, Profile）

function Dashboard() {
  return (
    <div style={{ padding: '20px', border: '2px solid blue' }}>
      <h1>Dashboard (父组件)</h1>
      
      {/* 子路由导航 */}
      <nav style={{ marginBottom: '20px', background: '#f0f0f0', padding: '10px' }}>
        <Link to="overview" style={{ marginRight: '10px' }}>Overview</Link>
        <Link to="settings" style={{ marginRight: '10px' }}>Settings</Link>
        <Link to="profile">Profile</Link>
      </nav>

      {/* 🔥 关键点：<Outlet /> 就是 Vue 的 <router-view> */}
      {/* 子路由的组件会在这里渲染 */}
      <div style={{ border: '2px solid green', padding: '10px' }}>
        <p>👇 子组件渲染区域 👇</p>
        <Outlet />
      </div>
    </div>
  );
}

function Overview() {
  return <div style={{ background: '#e8f5e9', padding: '10px' }}>
    <h2>Overview 页面</h2>
    <p>这是子路由组件</p>
  </div>;
}

function Settings() {
  return <div style={{ background: '#fff3e0', padding: '10px' }}>
    <h2>Settings 页面</h2>
  </div>;
}

function Profile() {
  return <div style={{ background: '#f3e5f5', padding: '10px' }}>
    <h2>Profile 页面</h2>
  </div>;
}


// ==================== Level 2: 多层嵌套 + 动态路由 ====================
// 场景：一个用户管理系统，有多层嵌套

function UsersLayout() {
  return (
    <div style={{ padding: '20px', border: '2px solid purple' }}>
      <h1>用户管理 (第一层父组件)</h1>
      <nav style={{ background: '#e1bee7', padding: '10px' }}>
        <Link to="/users/list" style={{ marginRight: '10px' }}>用户列表</Link>
        <Link to="/users/create">创建用户</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function UserList() {
  const users = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' }
  ];

  return (
    <div style={{ padding: '10px', border: '2px solid orange' }}>
      <h2>用户列表 (第二层)</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {/* 🔥 注意：这里是相对路径，会拼接成 /users/list/1 */}
            <Link to={`${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
      {/* 第三层嵌套：用户详情会在这里渲染 */}
      <Outlet />
    </div>
  );
}

function UserDetail() {
  // 🔥 useParams() 获取动态路由参数，类似 Vue 的 this.$route.params
  const { userId } = useParams();
  
  return (
    <div style={{ background: '#ffccbc', padding: '10px', marginTop: '10px' }}>
      <h3>用户详情 (第三层)</h3>
      <p>用户 ID: {userId}</p>
      <p>这是三层嵌套的最内层</p>
    </div>
  );
}

function CreateUser() {
  return <div style={{ padding: '10px' }}>
    <h2>创建新用户</h2>
    <form>
      <input type="text" placeholder="用户名" />
      <button>提交</button>
    </form>
  </div>;
}


// ==================== Level 3: 实战完整示例 ====================
// 包含：默认路由、Index 路由、404、路由保护

function Home() {
  return <div style={{ padding: '20px' }}>
    <h1>首页</h1>
    <p>这不是嵌套路由</p>
  </div>;
}

function NotFound() {
  return <div style={{ padding: '20px', color: 'red' }}>
    <h1>404 - 页面不存在</h1>
    <Link to="/">回到首页</Link>
  </div>;
}


// ==================== 路由配置 ====================
function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <nav style={{ marginBottom: '20px', padding: '10px', background: 'white' }}>
          <Link to="/" style={{ marginRight: '15px' }}>首页</Link>
          <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
          <Link to="/users" style={{ marginRight: '15px' }}>用户管理</Link>
        </nav>

        <Routes>
          {/* 普通路由 */}
          <Route path="/" element={<Home />} />

          {/* ==================== Level 1 示例 ==================== */}
          <Route path="/dashboard" element={<Dashboard />}>
            {/* 🔥 index 路由：访问 /dashboard 时的默认子路由 */}
            <Route index element={<div>请选择一个子页面</div>} />
            
            {/* 子路由：注意这里的 path 是相对路径，不需要加 / */}
            <Route path="overview" element={<Overview />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* ==================== Level 2 示例 ==================== */}
          <Route path="/users" element={<UsersLayout />}>
            {/* 访问 /users 时重定向到 /users/list */}
            <Route index element={<Navigate to="list" replace />} />
            
            {/* 第二层嵌套 */}
            <Route path="list" element={<UserList />}>
              {/* 第三层嵌套：动态路由参数 */}
              <Route path=":userId" element={<UserDetail />} />
            </Route>
            
            <Route path="create" element={<CreateUser />} />
          </Route>

          {/* 404 路由 - 捕获所有未匹配的路径 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
