import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User as UserIcon, HeartPulse, Bell, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children, role, navigation }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-slate-300 transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none border-r border-slate-800
      `}>
        <div className="h-20 flex items-center px-8 border-b border-slate-800/50 bg-slate-900/50">
          <div className="h-10 w-10 bg-gradient-to-br from-rose-500 to-orange-400 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-rose-500/20">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-outfit font-bold text-white tracking-tight">Health<span className="text-rose-400">OS</span></span>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="px-6 py-8">
          <div className="mb-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-white font-bold text-lg">
              {role.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white capitalize">{role} Account</p>
              <p className="text-xs text-slate-500">Active status</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2 mt-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 transition-colors ${isActive ? 'text-rose-400' : 'text-slate-500 group-hover:text-white'}`} />
                {item.name}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-400"></div>}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl -mr-10 -mt-10"></div>
            <h4 className="text-sm font-semibold text-white mb-1 relative z-10">Need Help?</h4>
            <p className="text-xs text-slate-400 mb-3 relative z-10">Contact 24/7 support for assistance.</p>
            <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors relative z-10">
              Contact Support
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-slate-900 z-0"></div>
        
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 z-10 border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:flex items-center bg-white/10 border border-white/10 rounded-full px-4 py-2 w-96 transition-all focus-within:w-[28rem] focus-within:bg-white/20 focus-within:border-rose-400/50">
            <Search className="h-4 w-4 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search patients, records..." 
              className="bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 w-full ml-2 text-sm outline-none"
            />
          </div>

          <div className="flex-1 md:hidden" /> {/* Spacer */}

          <div className="flex items-center space-x-5">
            <button className="relative p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 z-10">
          {children}
        </main>
      </div>
    </div>
  );
}