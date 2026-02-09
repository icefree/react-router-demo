import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

// ==================== 🎯 路由懒加载完全指南 ====================
/*
面试高频考点：
1. React.lazy() 的用法
2. Suspense 的作用
3. 为什么要代码分割
4. 加载失败怎么处理
5. 与 Vue Router 懒加载的对比
*/


// ==================== 1. 懒加载组件定义 ====================

// 🔥 方式1：基础懒加载
// React.lazy() 接收一个返回 Promise 的函数
// 这个 Promise 应该 resolve 一个包含 default export 的模块

// 模拟懒加载组件（实际项目中应该是独立文件）
const LazyDashboard = lazy(() => {
  // 🔥 模拟网络延迟，让你看到 Loading 效果
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
            <h2>📊 Dashboard（懒加载）</h2>
            <p>✅ 这个组件是懒加载的！</p>
            <p>打开浏览器 DevTools → Network 面板，刷新页面看看：</p>
            <ul>
              <li>首次访问时不会加载这个组件的代码</li>
              <li>点击 Dashboard 链接后才会加载</li>
              <li>加载完成后会被缓存，再次访问不会重新加载</li>
            </ul>
          </div>
        )
      });
    }, 1500);  // 1.5秒延迟
  });
});

const LazyProfile = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px' }}>
            <h2>👤 个人资料（懒加载）</h2>
            <p>✅ 这个组件也是懒加载的！</p>
            <p>每个懒加载组件都会被打包成独立的 chunk 文件</p>
          </div>
        )
      });
    }, 1000);
  });
});

const LazySettings = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div style={{ padding: '20px', background: '#fff3e0', borderRadius: '8px' }}>
            <h2>⚙️ 设置页面（懒加载）</h2>
            <p>✅ 懒加载成功！</p>
          </div>
        )
      });
    }, 800);
  });
});

// 🔥 模拟加载失败的组件
const LazyErrorComponent = lazy(() => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('模拟加载失败！'));
    }, 1000);
  });
});


// ==================== 2. Loading 组件 ====================

// 🔥 简单的 Loading
function SimpleLoading() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      background: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
      <div>加载中...</div>
    </div>
  );
}

// 🔥 带动画的 Loading
function AnimatedLoading() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '8px',
      color: 'white'
    }}>
      <div style={{ 
        fontSize: '40px', 
        marginBottom: '15px',
        animation: 'spin 1s linear infinite'
      }}>
        🌀
      </div>
      <div style={{ fontSize: '16px' }}>正在加载组件...</div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// 🔥 骨架屏 Loading
function SkeletonLoading() {
  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
      <div style={{ 
        height: '30px', 
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '15px',
        width: '60%'
      }} />
      <div style={{ 
        height: '16px', 
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '10px'
      }} />
      <div style={{ 
        height: '16px', 
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        width: '80%'
      }} />
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}


// ==================== 3. 错误边界组件 ====================

// 🔥 错误边界 - 用于捕获懒加载失败
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('懒加载失败:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          background: '#ffebee', 
          borderRadius: '8px',
          border: '2px solid #f44336'
        }}>
          <h3 style={{ color: '#d32f2f' }}>❌ 组件加载失败</h3>
          <p style={{ color: '#666' }}>{this.state.error?.message}</p>
          <button 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{ 
              padding: '8px 16px', 
              background: '#f44336', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重新加载
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


// ==================== 4. 演示面板 ====================

function LazyLoadDemo() {
  const [loadingStyle, setLoadingStyle] = useState('simple');
  
  const LoadingComponent = {
    simple: SimpleLoading,
    animated: AnimatedLoading,
    skeleton: SkeletonLoading
  }[loadingStyle];
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>⚡ 路由懒加载演示</h1>
      
      {/* 说明区域 */}
      <div style={{ 
        background: '#e8f5e9', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>🎯 什么是路由懒加载？</h3>
        <p>默认情况下，所有路由组件会被打包到一个 bundle 中，导致首次加载很慢。</p>
        <p>懒加载会将每个路由组件打包成<strong>独立的 chunk</strong>，只有访问时才加载。</p>
        
        <h4>🔥 核心代码：</h4>
        <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// 1️⃣ 使用 React.lazy() 定义懒加载组件
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

// 2️⃣ 用 Suspense 包裹，提供 Loading 状态
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>`}
        </pre>
      </div>
      
      {/* Loading 风格选择 */}
      <div style={{ 
        background: '#fff3e0', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>🎨 选择 Loading 风格</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setLoadingStyle('simple')}
            style={{ 
              padding: '8px 16px',
              background: loadingStyle === 'simple' ? '#ff9800' : '#fff',
              border: '2px solid #ff9800',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            简单 Loading
          </button>
          <button 
            onClick={() => setLoadingStyle('animated')}
            style={{ 
              padding: '8px 16px',
              background: loadingStyle === 'animated' ? '#ff9800' : '#fff',
              border: '2px solid #ff9800',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            动画 Loading
          </button>
          <button 
            onClick={() => setLoadingStyle('skeleton')}
            style={{ 
              padding: '8px 16px',
              background: loadingStyle === 'skeleton' ? '#ff9800' : '#fff',
              border: '2px solid #ff9800',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            骨架屏
          </button>
        </div>
        <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>
          💡 选择后点击下方链接，观察不同的 Loading 效果
        </p>
      </div>
      
      {/* 导航链接 */}
      <div style={{ 
        background: '#e3f2fd', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>🧭 测试懒加载</h3>
        <p>点击下方链接，观察 Loading 状态和网络请求：</p>
        <nav style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
          <Link to="dashboard" style={{ 
            padding: '10px 20px', 
            background: '#4caf50', 
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            📊 Dashboard
          </Link>
          <Link to="profile" style={{ 
            padding: '10px 20px', 
            background: '#2196f3', 
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            👤 Profile
          </Link>
          <Link to="settings" style={{ 
            padding: '10px 20px', 
            background: '#ff9800', 
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            ⚙️ Settings
          </Link>
          <Link to="error" style={{ 
            padding: '10px 20px', 
            background: '#f44336', 
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            ❌ 模拟加载失败
          </Link>
        </nav>
      </div>
      
      {/* 懒加载组件渲染区域 */}
      <div style={{ 
        background: '#fafafa', 
        padding: '20px', 
        borderRadius: '8px',
        minHeight: '200px',
        border: '2px dashed #ccc'
      }}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingComponent />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}


// ==================== 5. 默认欢迎页 ====================

function WelcomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>👆</div>
      <h3>点击上方链接测试懒加载</h3>
      <p>观察 Loading 状态和组件加载过程</p>
    </div>
  );
}


// ==================== 6. 对比 Vue Router ====================

function ComparisonSection() {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#f3e5f5', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h2>🆚 React vs Vue 懒加载对比</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#e1bee7' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ce93d8' }}>特性</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ce93d8' }}>React Router</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ce93d8' }}>Vue Router</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>懒加载语法</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              <code>lazy(() =&gt; import('./Page'))</code>
            </td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              <code>() =&gt; import('./Page')</code>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Loading 状态</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              <code>&lt;Suspense fallback=&#123;...&#125;&gt;</code>
            </td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              路由配置中设置
            </td>
          </tr>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>错误处理</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              ErrorBoundary 组件
            </td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              onError 钩子
            </td>
          </tr>
          <tr>
            <td style={{ padding: '12px' }}>是否需要包裹</td>
            <td style={{ padding: '12px' }}>
              ✅ 必须用 Suspense 包裹
            </td>
            <td style={{ padding: '12px' }}>
              ❌ 不需要额外包裹
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style={{ marginTop: '15px', padding: '15px', background: '#fff', borderRadius: '4px' }}>
        <h4>📝 代码对比</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', fontSize: '12px' }}>
{`// React Router 懒加载
const Dashboard = lazy(() => import('./Dashboard'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>

// -----------------------------------------

// Vue Router 懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('./Dashboard.vue')
  }
]`}
        </pre>
      </div>
    </div>
  );
}


// ==================== 7. 面试要点总结 ====================

function InterviewTips() {
  return (
    <div style={{ 
      margin: '20px 0', 
      padding: '20px', 
      background: '#fff9c4', 
      borderRadius: '8px',
      border: '2px solid #fbc02d'
    }}>
      <h3>🎯 面试必背要点</h3>
      <ol>
        <li>
          <strong>React.lazy()</strong> 只支持 <strong>default export</strong>
          <pre style={{ background: '#fff', padding: '8px', fontSize: '12px' }}>
{`// ✅ 正确
export default function Dashboard() {}

// ❌ 错误 - named export 不支持
export function Dashboard() {}`}
          </pre>
        </li>
        <li>
          <strong>Suspense 是必须的</strong>，不包裹会报错
        </li>
        <li>
          <strong>加载失败处理</strong>：用 ErrorBoundary 捕获错误
        </li>
        <li>
          <strong>代码分割的好处</strong>：
          <ul>
            <li>减小首屏加载体积</li>
            <li>按需加载，提升性能</li>
            <li>更好的缓存策略</li>
          </ul>
        </li>
        <li>
          <strong>最佳实践</strong>：
          <ul>
            <li>路由级别懒加载（每个页面一个 chunk）</li>
            <li>大型第三方库单独分包</li>
            <li>预加载关键路由（如用户很可能访问的页面）</li>
          </ul>
        </li>
      </ol>
    </div>
  );
}


// ==================== 8. 主应用 ====================

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        {/* 导航栏 */}
        <nav style={{ 
          padding: '15px 20px', 
          background: 'white', 
          borderBottom: '2px solid #e0e0e0'
        }}>
          <Link to="/lazy-load" style={{ marginRight: '15px' }}>⚡ 懒加载演示</Link>
        </nav>
        
        <div style={{ padding: '0 20px 20px' }}>
          <Routes>
            {/* 懒加载演示 - 使用嵌套路由 */}
            <Route path="/lazy-load" element={<LazyLoadDemo />}>
              <Route index element={<WelcomePage />} />
              <Route path="dashboard" element={<LazyDashboard />} />
              <Route path="profile" element={<LazyProfile />} />
              <Route path="settings" element={<LazySettings />} />
              <Route path="error" element={<LazyErrorComponent />} />
            </Route>
            
            {/* 默认重定向 */}
            <Route path="/" element={<LazyLoadDemo />}>
              <Route index element={<WelcomePage />} />
            </Route>
          </Routes>
          
          {/* 对比和面试要点 */}
          <ComparisonSection />
          <InterviewTips />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;


// ==================== 📝 完整 API 速查 ====================
/*
🔥 React.lazy() 语法：

// 基础用法
const MyComponent = lazy(() => import('./MyComponent'));

// 使用时必须包裹 Suspense
<Suspense fallback={<Loading />}>
  <MyComponent />
</Suspense>


🔥 实际项目中的写法：

// src/pages/Dashboard.jsx
export default function Dashboard() {
  return <div>Dashboard</div>;
}

// src/App.jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}


🔥 预加载技巧（面试加分项）：

// 鼠标悬停时预加载
const dashboardImport = () => import('./pages/Dashboard');
const Dashboard = lazy(dashboardImport);

// 预加载函数
const preloadDashboard = () => dashboardImport();

// 使用
<Link 
  to="/dashboard" 
  onMouseEnter={preloadDashboard}  // 悬停时预加载
>
  Dashboard
</Link>


🔥 命名导出的处理（面试可能问）：

// 如果组件是 named export，需要这样处理：
const MyComponent = lazy(() => 
  import('./MyComponent').then(module => ({
    default: module.MyNamedComponent
  }))
);
*/
