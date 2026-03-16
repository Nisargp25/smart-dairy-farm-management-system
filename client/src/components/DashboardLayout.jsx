import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LogOut, Layout, ShoppingCart, List, Calendar, 
  Activity, Users, FileText, Droplets, Leaf, 
  ChevronRight, Menu, X, Search, Bell, User as UserIcon,
  Settings, Heart, Clipboard, HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const managementLinks = [
    { name: 'Dashboard', icon: Layout, path: '/owner', roles: ['admin', 'farmer', 'worker'] },
    { name: 'Animals Control', icon: Leaf, path: '/owner/animals', roles: ['admin', 'farmer', 'worker'] },
    { name: 'Milk Production', icon: Droplets, path: '/owner/milk', roles: ['admin', 'farmer', 'worker'] },
    { name: 'Vaccination Log', icon: Activity, path: '/owner/vaccinations', roles: ['admin', 'farmer', 'worker'] },
    { name: 'Worker Registry', icon: Users, path: '/owner/workers', roles: ['admin', 'farmer'] },
    { name: 'Feed Management', icon: List, path: '/owner/feed', roles: ['admin', 'farmer', 'worker'] },
    { name: 'Financial Audit', icon: FileText, path: '/owner/financial', roles: ['admin', 'farmer'] },
    { name: 'Farm Reports', icon: Clipboard, path: '/owner/reports', roles: ['admin', 'farmer'] },
  ];

  const customerLinks = [
    { name: 'Overview', icon: Layout, path: '/user', roles: ['customer'] },
    { name: 'Dairy Shop', icon: ShoppingCart, path: '/user/shop', roles: ['customer'] },
    { name: 'Active Orders', icon: List, path: '/user/orders', roles: ['customer'] },
    { name: 'Subscriptions', icon: Calendar, path: '/user/subscriptions', roles: ['customer'] },
    { name: 'Billing Audit', icon: FileText, path: '/user/billing', roles: ['customer'] },
  ];

  const links = (user?.role === 'customer' ? customerLinks : managementLinks).filter(link => link.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Premium Architecture Sidebar */}
      <aside className="sidebar shadow-premium" style={{ width: isSidebarOpen ? '280px' : '90px', transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div className="sidebar-logo">
          <div className="logo-icon animate-fade-in">
            <Leaf size={22} color="white" />
          </div>
          {isSidebarOpen && (
            <span className="font-heading font-extrabold text-xl tracking-tighter text-white">Dairy<span className="text-emerald-400">Precision</span></span>
          )}
        </div>

        <nav className="sidebar-nav">
          <p className="px-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 h-4 overflow-hidden">
            {isSidebarOpen ? 'Protocol Registry' : '...'}
          </p>
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <link.icon size={20} strokeWidth={location.pathname === link.path ? 2.5 : 2} />
              {isSidebarOpen && <span>{link.name}</span>}
              {isSidebarOpen && location.pathname === link.path && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
            </Link>
          ))}
        </nav>

        {/* User Workspace Status */}
        <div className="mt-auto pt-6 border-t border-white/5">
           {isSidebarOpen ? (
             <div className="bg-slate-800/40 p-4 rounded-2xl mb-6 border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
                     {user?.name?.[0]}
                   </div>
                   <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate text-white">{user?.name}</p>
                      <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-black opacity-80">{user?.role}</p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="w-10 h-10 rounded-xl bg-slate-800 mx-auto mb-6 flex items-center justify-center text-white font-bold text-xs">{user?.name?.[0]}</div>
           )}
           <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border-none bg-transparent cursor-pointer">
            <LogOut size={20} />
            {isSidebarOpen && <span>Terminate Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Framework Stage */}
      <main className="main-content" style={{ marginLeft: isSidebarOpen ? '280px' : '90px' }}>
        <header className="topbar">
           <div className="flex items-center gap-6">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="w-10 h-10 flex-center bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer">
                 {isSidebarOpen ? <Menu size={18} /> : <X size={18} />}
              </button>
              <div className="flex items-center gap-3 bg-slate-100/50 px-5 py-2.5 rounded-2xl border border-border w-[400px] focus-within:bg-white focus-within:shadow-lg transition-all">
                 <Search size={16} className="text-slate-400" />
                 <input type="text" placeholder="Global Registry Search..." className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-600" />
              </div>
           </div>

           <div className="flex items-center gap-5">
              <button className="w-10 h-10 flex-center bg-white border border-border rounded-xl hover:shadow-md transition-all relative cursor-pointer">
                 <Bell size={18} className="text-slate-600" />
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>
              <button className="w-10 h-10 flex-center bg-white border border-border rounded-xl hover:shadow-md transition-all cursor-pointer"><Settings size={18} className="text-slate-600" /></button>
              <div className="h-8 w-[1px] bg-slate-200 mx-2" />
              <div className="flex items-center gap-3 bg-emerald-50 pl-4 pr-1 py-1 rounded-full border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer">
                 <span className="text-[11px] font-black text-emerald-700 tracking-tighter">PRC-{user?._id?.slice(-4).toUpperCase()}</span>
                 <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
                   <UserIcon size={16} />
                 </div>
              </div>
           </div>
        </header>

        <div className="py-10 animate-fade-in">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
