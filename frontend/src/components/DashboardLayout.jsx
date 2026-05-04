import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, HeartPulse, Bell, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const THEME_CSS = `
  :root {
    --primary: #0d9488;
    --primary-hover: #0f766e;
    --sidebar-bg: #0f172a;
    --sidebar-border: #1e293b;
    --sidebar-text: #94a3b8;
    --sidebar-active-text: #ffffff;
    --sidebar-active-bg: rgba(13, 148, 136, 0.15);
    --bg-light: #f8fafc;
    --bg-card: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --sidebar-width: 280px;
    --header-height: 80px;
    --radius-md: 12px;
    --font-main: 'Plus Jakarta Sans', sans-serif;
  }

  .layout-root {
    display: flex;
    min-height: 100vh;
    font-family: var(--font-main);
    background: var(--bg-light);
    overflow: hidden;
  }

  /* --- Mobile Overlay --- */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 20;
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  @media (min-width: 1024px) {
    .mobile-overlay { display: none; }
  }

  /* --- Sidebar --- */
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--sidebar-width);
    background: var(--sidebar-bg);
    border-right: 1px solid var(--sidebar-border);
    z-index: 30;
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  @media (min-width: 1024px) {
    .sidebar {
      position: static;
      transform: translateX(0);
    }
  }

  .sidebar-header {
    height: var(--header-height);
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--sidebar-border);
    background: rgba(15, 23, 42, 0.5);
  }
  .brand-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
    border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
    margin-right: 12px;
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
  }
  .brand-text {
    font-size: 1.5rem; font-weight: 700; color: white; letter-spacing: -0.5px;
  }
  .brand-text span { color: var(--primary); }
  
  .mobile-close {
    margin-left: auto; background: none; border: none; color: var(--sidebar-text);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .mobile-close:hover { color: white; }
  @media (min-width: 1024px) { .mobile-close { display: none; } }

  .user-profile {
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .user-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: var(--sidebar-border); border: 2px solid #334155;
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 700; font-size: 1.25rem;
  }
  .user-info p.role { font-size: 0.9rem; font-weight: 600; color: white; text-transform: capitalize; margin-bottom: 2px; }
  .user-info p.status { font-size: 0.75rem; color: var(--sidebar-text); display: flex; align-items: center; gap: 6px; }
  .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }

  .nav-menu {
    padding: 0 1rem;
    display: flex; flex-direction: column; gap: 0.5rem;
    flex: 1; overflow-y: auto;
  }
  .nav-item {
    width: 100%; display: flex; align-items: center; gap: 12px;
    padding: 0.85rem 1rem; border-radius: var(--radius-md);
    font-size: 0.95rem; font-weight: 600; font-family: inherit;
    color: var(--sidebar-text); background: transparent; border: 1px solid transparent;
    cursor: pointer; transition: all 0.2s; text-align: left;
  }
  .nav-item:hover {
    background: rgba(255, 255, 255, 0.05); color: white;
  }
  .nav-item.active {
    background: var(--sidebar-active-bg); color: var(--primary);
    border-color: rgba(13, 148, 136, 0.2);
  }
  .nav-indicator {
    margin-left: auto; width: 6px; height: 6px; border-radius: 50%; background: var(--primary);
  }

  .sidebar-footer { padding: 1.5rem; margin-top: auto; }
  .help-box {
    background: rgba(255, 255, 255, 0.03); border: 1px solid var(--sidebar-border);
    border-radius: var(--radius-md); padding: 1.25rem; text-align: center;
  }
  .help-box h4 { font-size: 0.85rem; font-weight: 600; color: white; margin-bottom: 4px; }
  .help-box p { font-size: 0.75rem; color: var(--sidebar-text); margin-bottom: 1rem; }
  .btn-support {
    width: 100%; padding: 0.6rem; background: var(--sidebar-border); color: white;
    border: none; border-radius: 8px; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: background 0.2s; font-family: inherit;
  }
  .btn-support:hover { background: #334155; }

  /* --- Main Content Area --- */
  .main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; /* Prevents flex flex-wrap overflow */
  }

  .top-header {
    height: var(--header-height);
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    z-index: 10;
  }
  @media (min-width: 1024px) {
    .top-header { padding: 0 2.5rem; }
  }

  .mobile-toggle {
    background: none; border: none; color: var(--text-muted);
    cursor: pointer; padding: 0.5rem; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .mobile-toggle:hover { background: var(--bg-light); color: var(--text-main); }
  @media (min-width: 1024px) { .mobile-toggle { display: none; } }

  .search-bar {
    display: none;
    align-items: center; gap: 8px;
    background: var(--bg-light); border: 1px solid var(--border);
    border-radius: 30px; padding: 0.6rem 1.25rem; width: 350px;
    transition: all 0.2s;
  }
  .search-bar:focus-within {
    width: 400px; border-color: var(--primary); background: white;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
  }
  @media (min-width: 768px) { .search-bar { display: flex; } }

  .search-input {
    border: none; background: transparent; outline: none; flex: 1;
    font-family: inherit; font-size: 0.9rem; color: var(--text-main);
  }
  .search-input::placeholder { color: #94a3b8; }

  .header-actions {
    display: flex; align-items: center; gap: 1rem;
  }

  .btn-icon {
    position: relative; background: none; border: none; color: var(--text-muted);
    cursor: pointer; padding: 0.5rem; border-radius: 50%; transition: all 0.2s;
  }
  .btn-icon:hover { background: var(--bg-light); color: var(--text-main); }
  .notification-dot {
    position: absolute; top: 4px; right: 4px; width: 8px; height: 8px;
    background: #ef4444; border-radius: 50%; border: 2px solid var(--bg-card);
  }

  .header-divider {
    width: 1px; height: 32px; background: var(--border); display: none;
  }
  @media (min-width: 640px) { .header-divider { display: block; } }

  .btn-logout {
    display: flex; align-items: center; gap: 8px;
    background: none; border: none; color: var(--text-muted);
    font-family: inherit; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; padding: 0.5rem 1rem; border-radius: var(--radius-md); transition: all 0.2s;
  }
  .btn-logout:hover { background: #fee2e2; color: #dc2626; }
  .logout-text { display: none; }
  @media (min-width: 640px) { .logout-text { display: block; } }

  .page-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }
  @media (min-width: 640px) { .page-content { padding: 2.5rem; } }
`;

export default function DashboardLayout({ children, role, navigation }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="layout-root">
      
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-icon">
            <HeartPulse color="white" size={24} />
          </div>
          <span className="brand-text">Medi<span>Care</span></span>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            {role ? role.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <p className="role">{role} Account</p>
            <p className="status"><span className="status-dot" /> Active status</p>
          </div>
        </div>

        <nav className="nav-menu">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} color={isActive ? "var(--primary)" : "var(--sidebar-text)"} />
                {item.name}
                {isActive && <div className="nav-indicator" />}
              </button>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <div className="help-box">
            <h4>Need Help?</h4>
            <p>Contact 24/7 support for technical assistance.</p>
            <button className="btn-support">Contact Support</button>
          </div>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="top-header">
          <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="search-bar">
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search patients, records..." 
              className="search-input"
            />
          </div>

          <div style={{ flex: 1 }} className="spacer-mobile" />

          <div className="header-actions">
            <button className="btn-icon">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            
            <div className="header-divider" />
            
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={18} />
              <span className="logout-text">Sign out</span>
            </button>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}