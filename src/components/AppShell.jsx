import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { NAV_CONFIG } from '../config/navigation';

function LucideIcon({ name, size = 18, ...props }) {
  const Icon = Icons[name] || Icons.Circle;
  return <Icon size={size} {...props} />;
}

export default function AppShell({ role, user, activePage, onNavigate, children }) {
  const { isDark, toggle } = useTheme(role);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = NAV_CONFIG[role] || [];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const pageLabel = navItems.find(i => i.key === activePage)?.label || 'Dashboard';

  return (
    <div className="pm-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="pm-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`pm-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="pm-sidebar-brand">
          <div className="brand-name">Vista Medical Systems</div>
          <div className="brand-sub">Hospital Management System</div>
        </div>

        <nav className="pm-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`pm-nav-item${activePage === item.key ? ' active' : ''}`}
              onClick={() => { onNavigate(item.key); setSidebarOpen(false); }}
            >
              <LucideIcon name={item.icon} size={17} className="nav-icon" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pm-sidebar-footer">
          <button className="pm-emergency-btn">
            <LucideIcon name="Siren" size={14} />
            Emergency Alert
          </button>
          <button
            className="pm-nav-item"
            onClick={() => { onNavigate('myinfo'); setSidebarOpen(false); }}
          >
            <LucideIcon name="UserCircle" size={17} className="nav-icon" />
            My Information
          </button>
          <button
            className="pm-nav-item"
            onClick={() => { onNavigate('help'); setSidebarOpen(false); }}
          >
            <LucideIcon name="HelpCircle" size={17} className="nav-icon" />
            Help Center
          </button>
          <button
            className="pm-nav-item"
            onClick={() => onNavigate('__logout__')}
            style={{ color: 'var(--pm-danger)' }}
          >
            <LucideIcon name="LogOut" size={17} className="nav-icon" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="pm-main">
        {/* Topbar */}
        <header className="pm-topbar">
          {/* Mobile hamburger */}
          <button
            className="pm-icon-btn d-md-none"
            style={{ display: 'flex' }}
            onClick={() => setSidebarOpen(s => !s)}
          >
            <LucideIcon name="Menu" size={20} />
          </button>

          <h1 className="pm-topbar-title">{pageLabel}</h1>

          <div className="pm-search">
            <LucideIcon name="Search" size={15} className="pm-search-icon" />
            <input placeholder="Search patients, staff or records…" />
          </div>

          <div className="pm-topbar-actions">
            <button className="pm-icon-btn" onClick={toggle} title="Toggle dark mode">
              <LucideIcon name={isDark ? 'Sun' : 'Moon'} size={18} />
            </button>
            <button className="pm-icon-btn">
              <LucideIcon name="Bell" size={18} />
            </button>
            <div className="pm-avatar" title={user?.name}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="pm-content pm-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
