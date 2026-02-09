import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';

// ==================== 🎯 编程式导航完全指南 ====================
/*
面试高频考点：
1. useNavigate() 的完整用法
2. push vs replace 的区别
3. state 传递（隐藏参数）
4. 相对路径 vs 绝对路径
5. 返回上一页 navigate(-1)
*/

// ==================== 1. 导航演示面板 ====================

function NavigationDemo() {
  const navigate = useNavigate();
  const [inputPath, setInputPath] = useState('/target');
  
  return (
    <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>🧭 编程式导航演示</h2>
      
      {/* 基础导航 */}
      <section style={{ marginBottom: '20px' }}>
        <h3>1️⃣ 基础用法：navigate(path)</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/target')}>
            跳转到 /target
          </button>
          <button onClick={() => navigate('/target/123')}>
            跳转到 /target/123
          </button>
          <button onClick={() => navigate('/target?name=test&id=456')}>
            带查询参数
          </button>
        </div>
        <pre style={{ background: '#fff', padding: '10px', marginTop: '10px' }}>
{`// 代码
navigate('/target')
navigate('/target/123')
navigate('/target?name=test&id=456')`}
        </pre>
      </section>
      
      {/* push vs replace */}
      <section style={{ marginBottom: '20px' }}>
        <h3>2️⃣ push vs replace</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/target')} style={{ background: '#4caf50', color: 'white' }}>
            push（默认）
          </button>
          <button onClick={() => navigate('/target', { replace: true })} style={{ background: '#ff9800', color: 'white' }}>
            replace
          </button>
        </div>
        <pre style={{ background: '#fff', padding: '10px', marginTop: '10px' }}>
{`// push（默认）- 添加历史记录，可以回退
navigate('/target')

// replace - 替换当前记录，不能回退到当前页
navigate('/target', { replace: true })`}
        </pre>
        <p style={{ color: '#666', fontSize: '14px' }}>
          💡 <strong>面试重点</strong>：登录成功后通常用 replace，避免用户点返回又回到登录页
        </p>
      </section>
      
      {/* state 传递 */}
      <section style={{ marginBottom: '20px' }}>
        <h3>3️⃣ state 传递（隐藏参数）🔥</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/target', { 
            state: { 
              from: 'demo-page',
              secretData: '这是隐藏数据，URL中看不到',
              timestamp: Date.now()
            } 
          })}>
            带 state 跳转
          </button>
          <button onClick={() => navigate('/target', {
            state: { message: '来自按钮的问候！' }
          })}>
            传递消息
          </button>
        </div>
        <pre style={{ background: '#fff', padding: '10px', marginTop: '10px' }}>
{`// state 不会显示在 URL 中，但可以在目标页面获取
navigate('/target', {
  state: {
    from: 'demo-page',
    secretData: '这是隐藏数据',
    timestamp: Date.now()
  }
})`}
        </pre>
        <p style={{ color: '#666', fontSize: '14px' }}>
          💡 <strong>vs 查询参数</strong>：state 适合传敏感信息、对象数据；查询参数适合可分享的筛选条件
        </p>
      </section>
      
      {/* 相对路径 */}
      <section style={{ marginBottom: '20px' }}>
        <h3>4️⃣ 相对路径导航</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('child')}>
            相对：'child'
          </button>
          <button onClick={() => navigate('../sibling')}>
            相对：'../sibling'
          </button>
          <button onClick={() => navigate('/absolute')}>
            绝对：'/absolute'
          </button>
        </div>
        <pre style={{ background: '#fff', padding: '10px', marginTop: '10px' }}>
{`// 相对路径 - 基于当前路由
navigate('child')      // 当前路径 + /child
navigate('../sibling') // 返回上一层 + /sibling

// 绝对路径 - 从根开始
navigate('/absolute')  // 直接跳到 /absolute`}
        </pre>
      </section>
      
      {/* 返回/前进 */}
      <section style={{ marginBottom: '20px' }}>
        <h3>5️⃣ 历史导航</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#9c27b0', color: 'white' }}>
            ← 返回上一页 navigate(-1)
          </button>
          <button onClick={() => navigate(1)} style={{ background: '#9c27b0', color: 'white' }}>
            前进一页 navigate(1) →
          </button>
          <button onClick={() => navigate(-2)} style={{ background: '#673ab7', color: 'white' }}>
            返回两页 navigate(-2)
          </button>
        </div>
        <pre style={{ background: '#fff', padding: '10px', marginTop: '10px' }}>
{`// 类似浏览器的前进后退
navigate(-1)  // 返回上一页
navigate(1)   // 前进一页
navigate(-2)  // 返回两页`}
        </pre>
      </section>
      
      {/* 动态输入 */}
      <section>
        <h3>6️⃣ 动态跳转</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            value={inputPath}
            onChange={(e) => setInputPath(e.target.value)}
            style={{ padding: '8px', width: '200px' }}
            placeholder="输入路径"
          />
          <button onClick={() => navigate(inputPath)}>
            跳转
          </button>
        </div>
      </section>
    </div>
  );
}


// ==================== 2. 目标页面（接收参数）====================

function TargetPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();  // 🔥 获取动态路由参数
  
  // 从 location.state 获取隐藏参数
  const state = location.state;
  
  return (
    <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
      <h2>🎯 目标页面</h2>
      
      {/* 🔥 显示动态路由参数 */}
      <div style={{ background: '#fff', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
        <h3>🆔 路由参数 (useParams) 🔥面试重点</h3>
        {Object.keys(params).length > 0 ? (
          <>
            <ul>
              {Object.entries(params).map(([key, value]) => (
                <li key={key}><strong>{key}</strong>: <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>{value}</code></li>
              ))}
            </ul>
            <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px', fontSize: '12px' }}>
{`// 路由配置
<Route path="/target/:id" element={<TargetPage />} />

// 获取参数
const params = useParams();
console.log(params.id);  // "${params.id}"

// 🔥 对比 Vue Router
// Vue: this.$route.params.id
// React: useParams().id`}
            </pre>
          </>
        ) : (
          <p style={{ color: '#999' }}>没有路由参数（试试访问 /target/123）</p>
        )}
      </div>
      
      {/* 显示当前路径信息 */}
      <div style={{ background: '#fff', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
        <h3>📍 当前位置信息</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>pathname</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}><code>{location.pathname}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>search</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}><code>{location.search || '(空)'}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>hash</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}><code>{location.hash || '(空)'}</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* 显示查询参数 */}
      <div style={{ background: '#fff', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
        <h3>🔍 查询参数 (searchParams)</h3>
        {Array.from(searchParams.entries()).length > 0 ? (
          <ul>
            {Array.from(searchParams.entries()).map(([key, value]) => (
              <li key={key}><strong>{key}</strong>: {value}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#999' }}>没有查询参数</p>
        )}
      </div>
      
      {/* 显示 state（隐藏参数）*/}
      <div style={{ background: '#fff', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
        <h3>🔐 隐藏参数 (location.state)</h3>
        {state ? (
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(state, null, 2)}
          </pre>
        ) : (
          <p style={{ color: '#999' }}>没有 state 数据</p>
        )}
        <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
          💡 注意：刷新页面后 state 会保留（存在 history 中），但新标签页打开则没有
        </p>
      </div>
      
      {/* 返回按钮 */}
      <button onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>
        ← 返回上一页
      </button>
      <button onClick={() => navigate('/programmatic-nav')}>
        回到演示页
      </button>
    </div>
  );
}


// ==================== 3. 实战场景演示 ====================

function RealWorldExamples() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // 场景1：表单提交后跳转
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // 模拟提交
    console.log('表单提交:', formData);
    
    // 🔥 跳转到成功页，传递表单数据
    navigate('/success', {
      state: { 
        formData,
        submittedAt: new Date().toISOString()
      },
      replace: true  // 用户不能回退到表单页
    });
  };
  
  // 场景2：模拟登录
  const handleLogin = () => {
    setIsLoggedIn(true);
    
    // 🔥 登录成功后跳转，使用 replace 避免回退到登录页
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 500);
  };
  
  // 场景3：列表点击跳转详情
  const products = [
    { id: 1, name: 'iPhone 15', price: 7999 },
    { id: 2, name: 'MacBook Pro', price: 14999 },
    { id: 3, name: 'AirPods Pro', price: 1899 },
  ];
  
  return (
    <div style={{ padding: '20px', background: '#fff3e0', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>💼 实战场景演示</h2>
      
      {/* 场景1：表单提交 */}
      <section style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '4px' }}>
        <h3>场景1：表单提交后跳转</h3>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            placeholder="姓名"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ padding: '8px' }}
          />
          <input 
            placeholder="邮箱"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ padding: '8px' }}
          />
          <button type="submit">提交表单</button>
        </form>
        <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px', fontSize: '12px' }}>
{`// 表单提交后跳转
navigate('/success', {
  state: { formData, submittedAt: new Date().toISOString() },
  replace: true  // 🔥 防止用户回退重复提交
})`}
        </pre>
      </section>
      
      {/* 场景2：登录跳转 */}
      <section style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '4px' }}>
        <h3>场景2：登录成功后跳转</h3>
        <button 
          onClick={handleLogin}
          disabled={isLoggedIn}
          style={{ background: isLoggedIn ? '#ccc' : '#4caf50', color: 'white' }}
        >
          {isLoggedIn ? '已登录，跳转中...' : '模拟登录'}
        </button>
        <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px', fontSize: '12px' }}>
{`// 登录成功后用 replace
navigate('/dashboard', { replace: true })

// 🔥 为什么用 replace？
// 因为用户登录后如果点返回，不应该再回到登录页`}
        </pre>
      </section>
      
      {/* 场景3：列表详情 */}
      <section style={{ padding: '15px', background: '#fff', borderRadius: '4px' }}>
        <h3>场景3：商品列表 → 详情页</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {products.map(product => (
            <div 
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`, {
                state: { product }  // 传递完整商品数据，避免详情页再请求
              })}
              style={{ 
                padding: '10px', 
                background: '#e3f2fd', 
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <strong>{product.name}</strong>
              <div>¥{product.price}</div>
            </div>
          ))}
        </div>
        <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px', fontSize: '12px' }}>
{`// 点击商品跳转详情，同时传递数据
navigate(\`/product/\${product.id}\`, {
  state: { product }  // 🔥 传递数据避免详情页重新请求
})`}
        </pre>
      </section>
    </div>
  );
}


// ==================== 4. 与 Vue Router 对比 ====================

function ComparisonWithVue() {
  return (
    <div style={{ padding: '20px', background: '#f3e5f5', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>🆚 React Router vs Vue Router 对比</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#e1bee7' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ce93d8' }}>功能</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ce93d8' }}>Vue Router</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ce93d8' }}>React Router v6</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>跳转方法</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>this.$router.push()</code></td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>navigate()</code></td>
          </tr>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>替换当前页</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>this.$router.replace()</code></td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>navigate(path, {'{ replace: true }'})</code></td>
          </tr>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>返回上一页</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>this.$router.go(-1)</code></td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>navigate(-1)</code></td>
          </tr>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>传递参数</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>query / params</code></td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>searchParams / state</code></td>
          </tr>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>命名路由</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>{'{ name: "user" }'}</code></td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>❌ 不支持</td>
          </tr>
          <tr>
            <td style={{ padding: '12px' }}>获取路由对象</td>
            <td style={{ padding: '12px' }}><code>this.$route</code></td>
            <td style={{ padding: '12px' }}><code>useLocation()</code></td>
          </tr>
        </tbody>
      </table>
      
      <div style={{ marginTop: '15px', padding: '15px', background: '#fff', borderRadius: '4px' }}>
        <h4>🔥 关键区别</h4>
        <ul>
          <li><strong>Vue Router</strong>：push 和 replace 是两个独立方法</li>
          <li><strong>React Router</strong>：只有 navigate，通过 options 控制行为</li>
          <li><strong>Vue Router</strong>：支持命名路由 <code>push({'{ name: "user", params: { id: 1 } }'})</code></li>
          <li><strong>React Router</strong>：只支持路径字符串，不支持命名路由</li>
        </ul>
      </div>
    </div>
  );
}


// ==================== 5. 成功页（接收表单数据）====================

function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  
  return (
    <div style={{ padding: '20px', background: '#c8e6c9', borderRadius: '8px' }}>
      <h2>✅ 提交成功！</h2>
      
      {state?.formData && (
        <div style={{ background: '#fff', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
          <h3>提交的数据：</h3>
          <p>姓名：{state.formData.name}</p>
          <p>邮箱：{state.formData.email}</p>
          <p style={{ color: '#666', fontSize: '12px' }}>
            提交时间：{state.submittedAt}
          </p>
        </div>
      )}
      
      <button onClick={() => navigate('/programmatic-nav')}>
        返回演示页
      </button>
    </div>
  );
}


// ==================== 6. 商品详情页 ====================

function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  
  return (
    <div style={{ padding: '20px', background: '#bbdefb', borderRadius: '8px' }}>
      <h2>📦 商品详情</h2>
      
      {product ? (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '4px' }}>
          <h3>{product.name}</h3>
          <p style={{ fontSize: '24px', color: '#e91e63' }}>¥{product.price}</p>
          <p style={{ color: '#666' }}>商品ID：{product.id}</p>
          <p style={{ color: '#999', fontSize: '12px' }}>
            💡 这些数据是从列表页通过 state 传递过来的，没有额外请求！
          </p>
        </div>
      ) : (
        <p>没有商品数据（可能是直接访问了这个URL）</p>
      )}
      
      <button onClick={() => navigate(-1)} style={{ marginTop: '15px' }}>
        ← 返回列表
      </button>
    </div>
  );
}


// ==================== 7. 首页 ====================

function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>首页</h2>
      <p>这是首页，请通过导航访问其他页面</p>
    </div>
  );
}


// ==================== 8. 主应用 ====================

function App({ basename = '/' }) {
  return (
    <BrowserRouter basename={basename}>
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        {/* 导航栏 */}
        <nav style={{ 
          padding: '15px 20px', 
          background: 'white', 
          borderBottom: '2px solid #e0e0e0',
          marginBottom: '20px'
        }}>
          <Link to="/programmatic-nav" style={{ marginRight: '15px' }}>🏠 演示首页</Link>
          <Link to="/target" style={{ marginRight: '15px' }}>🎯 目标页</Link>
          <Link to="/success" style={{ marginRight: '15px' }}>✅ 成功页</Link>
        </nav>
        
        <div style={{ padding: '0 20px 20px' }}>
          <Routes>
            {/* 主演示页 */}
            <Route path="/programmatic-nav" element={
              <>
                <NavigationDemo />
                <RealWorldExamples />
                <ComparisonWithVue />
              </>
            } />
            
            {/* 目标页面 */}
            <Route path="/target" element={<TargetPage />} />
            <Route path="/target/:id" element={<TargetPage />} />
            
            {/* 成功页 */}
            <Route path="/success" element={<SuccessPage />} />
            
            {/* 商品详情 */}
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Dashboard（用于登录跳转演示）*/}
            <Route path="/dashboard" element={
              <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
                <h2>🎉 Dashboard</h2>
                <p>恭喜！你已成功登录并跳转到这里</p>
                <Link to="/programmatic-nav">返回演示页</Link>
              </div>
            } />
            
            {/* 默认首页 */}
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        
        {/* 面试总结 */}
        <div style={{ 
          margin: '20px', 
          padding: '20px', 
          background: '#fff9c4', 
          borderRadius: '8px',
          border: '2px solid #fbc02d'
        }}>
          <h3>🎯 面试必背要点</h3>
          <ol>
            <li><strong>useNavigate()</strong> 返回一个函数，不是对象</li>
            <li><strong>replace: true</strong> 用于登录跳转、表单提交等不希望用户回退的场景</li>
            <li><strong>state</strong> 传递的数据不显示在 URL 中，适合敏感数据和复杂对象</li>
            <li><strong>navigate(-1)</strong> 等价于浏览器返回按钮</li>
            <li><strong>相对路径</strong> 基于当前路由，<strong>绝对路径</strong> 以 / 开头从根开始</li>
          </ol>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;


// ==================== 📝 完整 API 速查 ====================
/*
🔥 useNavigate() 完整签名：

const navigate = useNavigate();

// 1. 基础跳转
navigate('/path')

// 2. 带选项
navigate('/path', {
  replace: true,     // 替换当前历史记录
  state: { ... },    // 传递隐藏数据
  relative: 'path',  // 'route' | 'path'，相对路径的计算方式
})

// 3. 历史导航
navigate(-1)  // 返回
navigate(1)   // 前进
navigate(-2)  // 返回两步


🔥 获取传递的 state：

const location = useLocation();
const state = location.state;  // 获取 navigate 传递的 state


🔥 获取查询参数：

const [searchParams, setSearchParams] = useSearchParams();
searchParams.get('name')        // 获取单个参数
searchParams.getAll('tags')     // 获取数组参数
setSearchParams({ name: 'new' }) // 修改参数（会触发导航）
*/
