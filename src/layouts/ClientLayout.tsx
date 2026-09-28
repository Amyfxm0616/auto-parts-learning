import '../app/styles/tokens.css';
import '../app/styles/base.css';
import '../app/styles/layout.css';
import '../app/styles/utilities.css';

import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const NAV_ITEMS = [
  { to: '/home', label: '首页', icon: '🏠' },
  { to: '/apps', label: '应用中心', icon: '🧩' },
  { to: '/assistant', label: 'AI助手', icon: '✨' },
  { to: '/knowledge', label: '知识培训', icon: '📚' },
  { to: '/projects', label: '项目管理', icon: '📁' },
  { to: '/system-status', label: '系统状态', icon: '📡' },
];

export default function ClientLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Link to="/home" className="brand">
            <div className="brand-mark">NM</div>
            <div className="brand-text">
              <strong>非金属 AI 工作台</strong>
              <span>Materials AI Workbench</span>
            </div>
          </Link>
        </div>

        <div className="topbar-center">
          <div className="topbar-search">
            <input className="input" placeholder="搜索系统、知识、项目" />
          </div>
          <div className="topbar-assistant-entry">
            <input
              className="input"
              placeholder="问 AI：例如 帮我推荐门板骨架材料"
            />
            <Link className="btn btn-primary" to="/assistant">
              进入助手
            </Link>
          </div>
        </div>

        <div className="topbar-right">
          <button className="icon-btn" title="通知">
            🔔
          </button>
          <ThemeToggle />
          <button
            className="icon-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="菜单"
          >
            ☰
          </button>
        </div>
      </header>

      {menuOpen && (
        <div style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface)', padding: '12px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link is-active' : 'sidebar-link'
                }
                onClick={() => setMenuOpen(false)}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-text">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <div className="app-body">
        <aside className="left-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title">主导航</div>
            <nav className="sidebar-nav">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-link is-active' : 'sidebar-link'
                  }
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span className="sidebar-link-text">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="sidebar-footer-card">
            <div className="sidebar-footer-title">高频能力</div>
            <div className="sidebar-chip-list">
              <Link to="/apps/material-recommend" className="info-chip">
                智能选材
              </Link>
              <Link to="/apps/weight-cost-analysis" className="info-chip">
                减重降本
              </Link>
              <Link to="/apps/rubber-db" className="info-chip">
                橡胶数据库
              </Link>
            </div>
          </div>
        </aside>

        <main className="main-workspace">
          <Outlet />
        </main>

        <aside className="right-rail">
          <section className="rail-card">
            <h3>推荐操作</h3>
            <div className="rail-actions">
              <Link className="btn btn-secondary" to="/assistant">
                进入 AI 助手
              </Link>
              <Link className="btn btn-secondary" to="/apps">
                查看全部应用
              </Link>
            </div>
          </section>

          <section className="rail-card">
            <h3>平台状态</h3>
            <ul className="rail-list">
              <li>已接入项目：14</li>
              <li>核心能力：5</li>
              <li>当前阶段：原型落地</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
