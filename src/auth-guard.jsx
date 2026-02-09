import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, Outlet, useParams } from 'react-router-dom';

// ==================== 1. 全局认证状态管理 ====================
// 使用 Context 管理用户登录状态和角色信息

const AuthContext = createContext(null);

// 提供认证状态的 Provider
function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null 表示未登录
  
  // 模拟登录
  const login = (username, role) => {
    setUser({ username, role });
  };
  
  // 模拟登出
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 Hook：方便组件获取认证信息
function useAuth() {
  return useContext(AuthContext);
}


// ==================== 2. 路由守卫组件 ====================
// 🔥 这是核心！面试重点

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  const location = useLocation();
  
  // 🔥 情况1：用户未登录
  if (!user) {
    // 跳转到登录页，并保存当前位置（登录后可以跳回来）
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 🔥 情况2：需要特定角色
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // 检查用户角色是否在允许的角色列表中
    if (!roles.includes(user.role)) {
      // 已登录但角色不匹配 → 403 禁止访问
      return <Navigate to="/forbidden" replace />;
    }
  }
  
  // 🔥 情况3：权限验证通过，渲染目标组件
  return children;
}


// ==================== 3. 页面组件 ====================

// 登录页
function Login() {
  const { login } = useAuth();
  const location = useLocation();
  
  // 获取跳转前的位置，登录后跳回去
  const from = location.state?.from?.pathname || '/';
  
  const handleLogin = (role) => {
    login('测试用户', role);
    // 实际项目中，这里应该触发路由跳转
    window.location.href = from; // 简化演示
  };
  
  return (
    <div style={{ padding: '20px', background: '#e3f2fd' }}>
      <h2>登录页</h2>
      <p>请选择身份登录：</p>
      <button onClick={() => handleLogin('user')} style={{ marginRight: '10px' }}>
        普通用户登录
      </button>
      <button onClick={() => handleLogin('editor')} style={{ marginRight: '10px' }}>
        编辑登录
      </button>
      <button onClick={() => handleLogin('admin')}>
        管理员登录
      </button>
    </div>
  );
}

// 403 禁止访问页
function Forbidden() {
  const { user } = useAuth();
  
  return (
    <div style={{ padding: '20px', background: '#ffebee', color: 'red' }}>
      <h2>403 - 禁止访问</h2>
      <p>当前用户：{user?.username} (角色: {user?.role})</p>
      <p>您没有权限访问此页面</p>
      <Link to="/">返回首页</Link>
    </div>
  );
}

// 公开首页（无需登录）
function Home() {
  const { user } = useAuth();
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>首页（公开页面）</h2>
      {user ? (
        <p>欢迎回来，{user.username}！角色：{user.role}</p>
      ) : (
        <p>您还未登录</p>
      )}
    </div>
  );
}

// Dashboard（只需登录，不限角色）
function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div style={{ padding: '20px', background: '#e8f5e9' }}>
      <h2>Dashboard（需要登录）</h2>
      <p>当前用户：{user.username}</p>
      <p>角色：{user.role}</p>
      <p>✅ 任何登录用户都能看到这个页面</p>
    </div>
  );
}

// 编辑器（需要 editor 或 admin）
function Editor() {
  const { user } = useAuth();
  
  return (
    <div style={{ padding: '20px', background: '#fff3e0' }}>
      <h2>编辑器（需要 editor 或 admin）</h2>
      <p>当前用户：{user.username}</p>
      <p>角色：{user.role}</p>
      <p>✅ 只有 editor 和 admin 能看到</p>
    </div>
  );
}

// 管理面板（只有 admin）
function AdminPanel() {
  const { user } = useAuth();
  
  return (
    <div style={{ padding: '20px', background: '#f3e5f5' }}>
      <h2>管理面板（只有 admin）</h2>
      <p>当前用户：{user.username}</p>
      <p>角色：{user.role}</p>
      <p>✅ 只有 admin 能看到</p>
    </div>
  );
}

// 个人资料（需要登录）
function Profile() {
  const { user } = useAuth();
  
  return (
    <div style={{ padding: '20px', background: '#e1f5fe' }}>
      <h2>个人资料（需要登录）</h2>
      <p>用户名：{user.username}</p>
      <p>角色：{user.role}</p>
    </div>
  );
}

// --- 以下是从 App.jsx 迁移过来的嵌套路由示例组件 ---

function DashboardLayout() {
  return (
    <div style={{ padding: '20px', border: '2px solid blue' }}>
      <h1>Dashboard (父组件)</h1>
      <nav style={{ marginBottom: '20px', background: '#f0f0f0', padding: '10px' }}>
        <Link to="overview" style={{ marginRight: '10px' }}>Overview</Link>
        <Link to="settings" style={{ marginRight: '10px' }}>Settings</Link>
        <Link to="profile">Profile</Link>
      </nav>
      <div style={{ border: '2px solid green', padding: '10px' }}>
        <Outlet />
      </div>
    </div>
  );
}

function Overview() {
  return <div style={{ background: '#e8f5e9', padding: '10px' }}><h3>Overview 页面</h3></div>;
}

function Settings() {
  return <div style={{ background: '#fff3e0', padding: '10px' }}><h3>Settings 页面</h3></div>;
}

function UsersLayout() {
  return (
    <div style={{ padding: '20px', border: '2px solid purple' }}>
      <h1>用户管理</h1>
      <nav style={{ background: '#e1bee7', padding: '10px', marginBottom: '10px' }}>
        <Link to="list" style={{ marginRight: '10px' }}>用户列表</Link>
        <Link to="create">创建用户</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function UserList() {
  const users = [{ id: 1, name: '张三' }, { id: 2, name: '李四' }];
  return (
    <div>
      <h3>用户列表</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}><Link to={`${u.id}`}>{u.name}</Link></li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}

function UserDetail() {
  const { userId } = useParams();
  return <div style={{ background: '#ffccbc', padding: '10px' }}><h4>用户详情 ID: {userId}</h4></div>;
}

function CreateUser() {
  return <div><h3>创建用户</h3><button onClick={() => alert('保存成功')}>提交</button></div>;
}




// ==================== 4. 主应用 (方案升级：嵌套路由统一保护) ====================

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: '#fafafa' }}>
          <Navigation />
          
          <div style={{ padding: '20px' }}>
            <Routes>
              {/* ========== 公开路由 ========== */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forbidden" element={<Forbidden />} />
              
              {/* ========== 核心提效：嵌套路由统一保护 ========== */}
              {/* 只要是 login 目录下的，全部需要登录 */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <div style={{ border: '2px dashed #999', padding: '10px' }}>
                    <p style={{ color: '#999' }}>[受保护的布局区域]</p>
                    <Outlet />
                  </div>
                </ProtectedRoute>
              }>
                {/* 这里的子路由会自动继承父路由的 ProtectedRoute 保护 */}
                <Route path="profile" element={<Profile />} />
                
                {/* Dashboard 嵌套路由 */}
                <Route path="dashboard" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<Overview />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* 用户管理：只有 admin 和 editor 可见 */}
                <Route path="users" element={
                  <ProtectedRoute requiredRole={['admin', 'editor']}>
                    <UsersLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="list" replace />} />
                  <Route path="list" element={<UserList />}>
                    <Route path=":userId" element={<UserDetail />} />
                  </Route>
                  <Route path="create" element={<CreateUser />} />
                </Route>
              </Route>

              {/* 只有 Admin 可访问的顶级目录 */}
              <Route path="/admin-only" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } />

              {/* 兼容旧路由（演示用） */}
              <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
              <Route path="/editor" element={<Navigate to="/app/users" replace />} />
              <Route path="/admin" element={<Navigate to="/admin-only" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// 导航组件
function Navigation() {
  const { user, logout } = useAuth();
  
  return (
    <nav style={{ 
      padding: '15px 20px', 
      background: 'white', 
      borderBottom: '2px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ marginRight: '15px' }}>首页</Link>
        <Link to="/app/dashboard" style={{ marginRight: '15px' }}>Dashboard (嵌套)</Link>
        <Link to="/app/profile" style={{ marginRight: '15px' }}>个人资料</Link>
        <Link to="/app/users" style={{ marginRight: '15px' }}>用户管理 (Admin/Editor)</Link>
        <Link to="/admin-only" style={{ marginRight: '15px' }}>绝密后台 (Admin)</Link>
      </div>
      
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '15px' }}>
              {user.username} ({user.role})
            </span>
            <button onClick={logout}>登出</button>
          </>
        ) : (
          <Link to="/login">登录</Link>
        )}
      </div>
    </nav>
  );
}

export default App;


// ==================== 🎯 面试重点总结 ====================
/*
1. **ProtectedRoute 组件的职责**
   - 检查用户登录状态
   - 检查用户角色权限
   - 根据不同情况做跳转或渲染

2. **三种权限场景**
   场景A：未登录 → 跳转到 /login
   场景B：已登录但角色不符 → 跳转到 /forbidden
   场景C：权限通过 → 渲染目标组件

3. **API 设计**
   <ProtectedRoute>               // 只需登录
   <ProtectedRoute requiredRole="admin">  // 需要特定角色
   <ProtectedRoute requiredRole={['admin', 'editor']}>  // 多个角色

4. **与 Vue Router 的对比**
   Vue: beforeEach 全局守卫
   React: 组件包裹方式（更符合 React 的组件化思想）

5. **登录后跳转回原页面**
   <Navigate to="/login" state={{ from: location }} />
   利用 location.state 保存来源路径

6. **常见面试问题**
   Q: 为什么 React Router v6 不提供全局守卫？
   A: React 推崇组件化，每个路由独立配置权限更灵活、可维护

   Q: 如果有100个需要登录的路由，都要写 <ProtectedRoute> 包裹吗？
   A: 可以用嵌套路由统一处理（下面会讲）

   Q: 权限信息应该存在哪里？
   A: 通常用 Context / Redux / Zustand 等状态管理

7. **进阶优化方案**（面试加分项）
   方案1：用嵌套路由统一保护
   <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
     <Route path="dashboard" element={<Dashboard />} />
     <Route path="profile" element={<Profile />} />
   </Route>
   
   方案2：配置化路由
   const routes = [
     { path: '/dashboard', component: Dashboard, auth: true },
     { path: '/admin', component: Admin, role: 'admin' }
   ]
   
   方案3：路由元信息
   使用 route.meta 或自定义属性标记权限需求
*/


// ==================== 🧪 测试场景 ====================
/*
运行这个文件后，尝试以下操作来理解路由守卫：

1. **未登录状态**
   - 访问 /dashboard → 自动跳转到 /login
   - 访问 /admin → 自动跳转到 /login
   - 访问 / → 正常显示（公开页面）

2. **普通用户登录（user）**
   - 访问 /dashboard → ✅ 正常显示
   - 访问 /profile → ✅ 正常显示
   - 访问 /editor → ❌ 跳转到 /forbidden
   - 访问 /admin → ❌ 跳转到 /forbidden

3. **编辑登录（editor）**
   - 访问 /dashboard → ✅ 正常显示
   - 访问 /editor → ✅ 正常显示
   - 访问 /admin → ❌ 跳转到 /forbidden

4. **管理员登录（admin）**
   - 所有页面都能访问 ✅

5. **登录后跳回原页面**
   - 未登录时访问 /dashboard
   - 跳转到登录页后，选择身份登录
   - 登录成功后自动跳回 /dashboard
*/
