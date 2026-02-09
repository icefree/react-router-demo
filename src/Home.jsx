import React, { useState } from 'react';
import NestedRouterApp from './nested-router';
import AuthGuardApp from './auth-guard';
import LazyLoadApp from './lazy-load';
import ProgrammaticNavApp from './programmatic-nav';
import RouteCacheApp from './route-cache';

// ==================== 🎯 React Router Demo 入口首页 ====================

const demos = [
  {
    id: 'nested',
    title: '嵌套路由',
    subtitle: 'Nested Routes',
    description: '演示多层嵌套路由、Outlet 用法、动态参数、默认路由等',
    icon: '🪆',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    tags: ['Outlet', '动态路由', 'useParams'],
    component: NestedRouterApp
  },
  {
    id: 'auth',
    title: '路由守卫',
    subtitle: 'Auth Guard',
    description: '认证守卫、角色权限控制、受保护路由、登录状态管理',
    icon: '🔐',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    tags: ['ProtectedRoute', 'Context', 'RBAC'],
    component: AuthGuardApp
  },
  {
    id: 'lazy',
    title: '路由懒加载',
    subtitle: 'Lazy Loading',
    description: 'React.lazy、Suspense、代码分割、骨架屏加载效果',
    icon: '⚡',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    tags: ['React.lazy', 'Suspense', '代码分割'],
    component: LazyLoadApp
  },
  {
    id: 'programmatic',
    title: '编程式导航',
    subtitle: 'Programmatic Navigation',
    description: 'useNavigate、push/replace、state传参、返回上一页',
    icon: '🧭',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    tags: ['useNavigate', 'state', 'replace'],
    component: ProgrammaticNavApp
  },
  {
    id: 'cache',
    title: '路由缓存',
    subtitle: 'Keep-Alive',
    description: '组件状态保持、多种缓存方案、与 Vue keep-alive 对比',
    icon: '💾',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
    tags: ['Keep-Alive', '状态缓存', 'display:none'],
    component: RouteCacheApp
  }
];

const demoEntryPaths = {
  nested: '/',
  auth: '/',
  lazy: '/lazy-load',
  programmatic: '/programmatic-nav',
  cache: '/',
};

function withBasePath(pathname) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (!base || base === '/') {
    return normalizedPath;
  }

  return `${base}${normalizedPath}`.replace(/\/{2,}/g, '/');
}

function syncBrowserPath(pathname) {
  const fullPath = withBasePath(pathname);
  if (window.location.pathname !== fullPath) {
    window.history.replaceState(null, '', fullPath);
  }
}

// ==================== 首页样式 ====================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    padding: '40px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    color: '#8892b0',
    fontSize: '1.1rem',
    fontWeight: '400',
    marginBottom: '8px'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    background: 'rgba(99, 102, 241, 0.15)',
    borderRadius: '20px',
    color: '#818cf8',
    fontSize: '0.85rem',
    fontWeight: '500',
    marginTop: '16px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    background: 'rgba(30, 30, 50, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  },
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.15)'
  },
  cardIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
    display: 'block'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px'
  },
  cardSubtitle: {
    fontSize: '0.85rem',
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  cardDescription: {
    color: '#a1a1aa',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '16px'
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tag: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#9ca3af',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  enterButton: {
    marginTop: '20px',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease'
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  footer: {
    textAlign: 'center',
    marginTop: '60px',
    color: '#4b5563',
    fontSize: '0.9rem'
  }
};

// ==================== Demo 卡片组件 ====================
function DemoCard({ demo, onClick, isHovered, onHover }) {
  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      onMouseEnter={() => onHover(demo.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(demo.id)}
    >
      {/* 顶部渐变光效 */}
      <div
        style={{
          ...styles.glowEffect,
          background: demo.gradient,
          opacity: isHovered ? 1 : 0
        }}
      />
      
      <span style={styles.cardIcon}>{demo.icon}</span>
      <h3 style={styles.cardTitle}>{demo.title}</h3>
      <p style={styles.cardSubtitle}>{demo.subtitle}</p>
      <p style={styles.cardDescription}>{demo.description}</p>
      
      <div style={styles.tagContainer}>
        {demo.tags.map((tag, i) => (
          <span
            key={i}
            style={{
              ...styles.tag,
              borderColor: isHovered ? `${demo.color}40` : undefined,
              color: isHovered ? demo.color : undefined
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      
      <button
        style={{
          ...styles.enterButton,
          background: isHovered ? demo.gradient : 'rgba(255, 255, 255, 0.08)',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        进入演示
        <span style={{ transition: 'transform 0.3s', transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}>→</span>
      </button>
    </div>
  );
}

// ==================== 返回按钮组件 ====================
function BackButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 9999,
        padding: '12px 20px',
        borderRadius: '12px',
        border: 'none',
        background: isHovered 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
          : 'rgba(30, 30, 50, 0.9)',
        backdropFilter: 'blur(10px)',
        color: '#fff',
        fontWeight: '600',
        fontSize: '0.9rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <span style={{ transform: isHovered ? 'translateX(-2px)' : 'translateX(0)', transition: 'transform 0.3s' }}>←</span>
      返回首页
    </button>
  );
}

// ==================== 首页组件 ====================
function HomePage({ onSelectDemo }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>React Router 实战指南</h1>
        <p style={styles.subtitle}>
          全面掌握 React Router v6 核心知识点，覆盖面试高频考点
        </p>
        <div style={styles.badge}>
          <span>🎯</span>
          <span>5 个交互式 Demo · 含代码对比 · 面试要点详解</span>
        </div>
      </header>

      <div style={styles.grid}>
        {demos.map(demo => (
          <DemoCard
            key={demo.id}
            demo={demo}
            onClick={onSelectDemo}
            isHovered={hoveredCard === demo.id}
            onHover={setHoveredCard}
          />
        ))}
      </div>

      <footer style={styles.footer}>
        <p>Built with ❤️ for React Router learners</p>
      </footer>
    </div>
  );
}

// ==================== Demo 包装器 ====================
function DemoWrapper({ demoId, onBack }) {
  const demo = demos.find(d => d.id === demoId);
  
  if (!demo) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
        <h2>Demo 未找到</h2>
        <button onClick={onBack}>返回首页</button>
      </div>
    );
  }

  const DemoComponent = demo.component;

  return (
    <div style={{ position: 'relative' }}>
      <BackButton onClick={onBack} />
      <DemoComponent />
    </div>
  );
}

// ==================== 主应用 ====================
function App() {
  const [currentDemo, setCurrentDemo] = useState(null);

  const handleSelectDemo = (demoId) => {
    syncBrowserPath(demoEntryPaths[demoId] || '/');
    setCurrentDemo(demoId);
  };

  const handleBack = () => {
    syncBrowserPath('/');
    setCurrentDemo(null);
  };

  if (currentDemo) {
    return <DemoWrapper demoId={currentDemo} onBack={handleBack} />;
  }

  return <HomePage onSelectDemo={handleSelectDemo} />;
}

export default App;
