import React, { useState, createContext, useContext, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// ==================== 🎯 路由缓存（Keep-Alive）完全指南 ====================
/*
面试高频考点：
1. React 没有原生 keep-alive，需要手动实现
2. 三种实现方案的优缺点
3. 与 Vue keep-alive 的对比
*/


// ==================== 1. Keep-Alive 实现 ====================

// 🔥 方案1：使用 display:none 隐藏组件（保留 DOM 和状态）
function KeepAliveSimple({ children, cacheKey, activeKey }) {
  return (
    <div style={{ display: cacheKey === activeKey ? 'block' : 'none' }}>
      {children}
    </div>
  );
}

// 🔥 方案2：完整的 Keep-Alive 实现（带缓存管理）
const CacheContext = createContext(null);

function KeepAliveProvider({ children, maxCache = 10 }) {
  const [cacheList, setCacheList] = useState([]);
  
  const addCache = (key, element) => {
    setCacheList(prev => {
      // 如果已存在，不重复添加
      if (prev.find(item => item.key === key)) {
        return prev;
      }
      // 超过最大缓存数，移除最早的
      const newList = [...prev, { key, element }];
      if (newList.length > maxCache) {
        return newList.slice(1);
      }
      return newList;
    });
  };
  
  const removeCache = (key) => {
    setCacheList(prev => prev.filter(item => item.key !== key));
  };
  
  const clearAllCache = () => {
    setCacheList([]);
  };
  
  return (
    <CacheContext.Provider value={{ cacheList, addCache, removeCache, clearAllCache }}>
      {children}
    </CacheContext.Provider>
  );
}

function useKeepAlive() {
  return useContext(CacheContext);
}


// ==================== 2. 带状态的页面组件 ====================

function PageWithState({ title, color }) {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const inputRef = useRef(null);
  
  // 记录组件挂载时间（用 useState 确保只在初次挂载时计算）
  const [mountTime] = useState(() => new Date().toLocaleTimeString());
  
  return (
    <div style={{ 
      padding: '20px', 
      background: color, 
      borderRadius: '8px',
      minHeight: '300px'
    }}>
      <h2>{title}</h2>
      <p>🕐 组件挂载时间: <strong>{mountTime}</strong></p>
      <p style={{ fontSize: '12px', color: '#666' }}>
        （如果时间不变，说明组件被缓存了，没有重新挂载）
      </p>
      
      <hr style={{ margin: '15px 0', border: '1px dashed #ccc' }} />
      
      {/* 计数器状态 */}
      <div style={{ marginBottom: '15px' }}>
        <strong>计数器状态：</strong>
        <button 
          onClick={() => setCount(c => c - 1)}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          -
        </button>
        <span style={{ 
          display: 'inline-block',
          minWidth: '40px',
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          {count}
        </span>
        <button 
          onClick={() => setCount(c => c + 1)}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          +
        </button>
      </div>
      
      {/* 输入框状态 */}
      <div style={{ marginBottom: '15px' }}>
        <strong>输入框状态：</strong>
        <input 
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入一些文字..."
          style={{ padding: '8px', marginLeft: '10px', width: '200px' }}
        />
      </div>
      
      {/* 列表状态 */}
      <div>
        <strong>列表状态：</strong>
        <button 
          onClick={() => setItems(prev => [...prev, `Item ${prev.length + 1}`])}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          添加项目
        </button>
        <button 
          onClick={() => setItems([])}
          style={{ marginLeft: '5px', padding: '5px 10px' }}
        >
          清空
        </button>
        {items.length > 0 && (
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


// ==================== 3. 演示面板 ====================

function CacheDemo() {
  const [activeTab, setActiveTab] = useState('page1');
  const [enableCache, setEnableCache] = useState(true);
  const [cacheKey, setCacheKey] = useState(0);
  
  // 页面配置
  const pages = [
    { key: 'page1', title: '📊 页面 A', color: '#e8f5e9' },
    { key: 'page2', title: '👤 页面 B', color: '#e3f2fd' },
    { key: 'page3', title: '⚙️ 页面 C', color: '#fff3e0' },
  ];
  
  // 清除缓存
  const clearCache = () => {
    setCacheKey(k => k + 1);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>🗂️ 路由缓存（Keep-Alive）演示</h1>
      
      {/* 说明区域 */}
      <div style={{ 
        background: '#ffebee', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #f44336'
      }}>
        <h3>🎯 什么是路由缓存？</h3>
        <p>默认情况下，React 切换路由时会<strong>销毁旧组件、创建新组件</strong>，组件状态会丢失。</p>
        <p>路由缓存（Keep-Alive）可以<strong>保留组件状态</strong>，避免重复渲染和数据丢失。</p>
      </div>
      
      {/* 控制区域 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={enableCache} 
            onChange={(e) => setEnableCache(e.target.checked)}
            style={{ width: '20px', height: '20px' }}
          />
          <span style={{ fontWeight: 'bold' }}>
            {enableCache ? '✅ 启用缓存（Keep-Alive）' : '❌ 禁用缓存（默认行为）'}
          </span>
        </label>
        
        <button 
          onClick={clearCache}
          style={{ 
            padding: '8px 16px', 
            background: '#f44336', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ 清除所有缓存
        </button>
      </div>
      
      {/* 测试说明 */}
      <div style={{ 
        background: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4>🧪 测试步骤：</h4>
        <ol style={{ marginLeft: '20px' }}>
          <li>在下方页面中修改计数器、输入文字、添加列表项</li>
          <li>切换到其他页面</li>
          <li>再切换回来，观察状态是否保留</li>
          <li>切换"启用/禁用缓存"看区别</li>
        </ol>
      </div>
      
      {/* 标签页导航 */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px' 
      }}>
        {pages.map(page => (
          <button
            key={page.key}
            onClick={() => setActiveTab(page.key)}
            style={{
              padding: '10px 20px',
              background: activeTab === page.key ? '#1976d2' : '#e0e0e0',
              color: activeTab === page.key ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === page.key ? 'bold' : 'normal'
            }}
          >
            {page.title}
          </button>
        ))}
      </div>
      
      {/* 内容区域 */}
      <div style={{ 
        border: '2px solid #1976d2', 
        borderRadius: '0 8px 8px 8px',
        overflow: 'hidden'
      }}>
        {enableCache ? (
          // 🔥 启用缓存：使用 display:none 隐藏，保留 DOM
          <div key={cacheKey}>
            {pages.map(page => (
              <div 
                key={page.key}
                style={{ display: activeTab === page.key ? 'block' : 'none' }}
              >
                <PageWithState title={page.title} color={page.color} />
              </div>
            ))}
          </div>
        ) : (
          // 🔥 禁用缓存：条件渲染，切换时销毁组件
          <div key={`${cacheKey}-${activeTab}`}>
            {pages.map(page => (
              activeTab === page.key && (
                <PageWithState key={page.key} title={page.title} color={page.color} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ==================== 4. 代码对比 ====================

function CodeComparison() {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#f3e5f5', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h2>🆚 React vs Vue 缓存对比</h2>
      
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
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>原生支持</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>❌ 不支持</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>✅ <code>&lt;keep-alive&gt;</code></td>
          </tr>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>实现方式</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>手动实现或第三方库</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>内置组件</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>生命周期</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>无专用钩子</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><code>activated</code> / <code>deactivated</code></td>
          </tr>
          <tr>
            <td style={{ padding: '12px' }}>缓存控制</td>
            <td style={{ padding: '12px' }}>需自行实现</td>
            <td style={{ padding: '12px' }}><code>include</code> / <code>exclude</code> / <code>max</code></td>
          </tr>
        </tbody>
      </table>
      
      <div style={{ marginTop: '15px', padding: '15px', background: '#fff', borderRadius: '4px' }}>
        <h4>📝 代码对比</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', fontSize: '12px' }}>
{`// Vue - 原生支持
<keep-alive :include="['Home', 'User']" :max="10">
  <router-view />
</keep-alive>

// -----------------------------------------

// React - 需要手动实现
// 方案1：display:none
{pages.map(page => (
  <div style={{ display: active === page.key ? 'block' : 'none' }}>
    <PageComponent />
  </div>
))}

// 方案2：第三方库
// npm install react-activation
import KeepAlive from 'react-activation';
<KeepAlive>
  <Component />
</KeepAlive>`}
        </pre>
      </div>
    </div>
  );
}


// ==================== 5. 面试要点 ====================

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
          <strong>React 没有原生 keep-alive</strong>，这是面试常问的对比点
        </li>
        <li>
          <strong>三种实现方案</strong>：
          <ul>
            <li><code>display: none</code> - 最简单，但 DOM 一直存在</li>
            <li>状态管理（Redux/Zustand）- 只缓存数据，组件仍会重新渲染</li>
            <li>第三方库（react-activation）- 功能完整，有学习成本</li>
          </ul>
        </li>
        <li>
          <strong>display:none 的缺点</strong>：
          <ul>
            <li>DOM 节点一直存在，占用内存</li>
            <li>某些事件监听器可能仍在运行</li>
            <li>没有 activated/deactivated 生命周期</li>
          </ul>
        </li>
        <li>
          <strong>什么时候需要缓存</strong>：
          <ul>
            <li>表单填写中途切换页面</li>
            <li>列表滚动位置保留</li>
            <li>复杂状态的页面（如编辑器）</li>
          </ul>
        </li>
      </ol>
    </div>
  );
}


// ==================== 6. 主应用 ====================

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <nav style={{ 
          padding: '15px 20px', 
          background: 'white', 
          borderBottom: '2px solid #e0e0e0'
        }}>
          <Link to="/" style={{ marginRight: '15px' }}>🗂️ 缓存演示</Link>
        </nav>
        
        <div style={{ padding: '0 20px 20px' }}>
          <Routes>
            <Route path="/*" element={<CacheDemo />} />
          </Routes>
          
          <CodeComparison />
          <InterviewTips />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;


// ==================== 📝 完整 API 速查 ====================
/*
🔥 方案1：display:none（最简单）

function TabPanel({ children, active }) {
  return (
    <div style={{ display: active ? 'block' : 'none' }}>
      {children}
    </div>
  );
}

// 使用
{tabs.map(tab => (
  <TabPanel key={tab.key} active={currentTab === tab.key}>
    <PageComponent />
  </TabPanel>
))}


🔥 方案2：使用 react-activation 库

// 安装
npm install react-activation

// 使用
import KeepAlive, { AliveScope } from 'react-activation';

function App() {
  return (
    <AliveScope>
      <Routes>
        <Route path="/home" element={
          <KeepAlive cacheKey="home">
            <HomePage />
          </KeepAlive>
        } />
      </Routes>
    </AliveScope>
  );
}


🔥 方案3：使用 Zustand 缓存状态

import create from 'zustand';

const usePageStore = create((set) => ({
  page1State: { count: 0, text: '' },
  setPage1State: (state) => set({ page1State: state }),
}));

function Page1() {
  const { page1State, setPage1State } = usePageStore();
  // 组件状态从 store 读取，不会因为切换路由而丢失
}
*/
