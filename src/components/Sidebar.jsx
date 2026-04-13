import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  PhoneCall, 
  MessageSquare, 
  LogOut,
  Cpu
} from 'lucide-react';

const Sidebar = ({ isCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('askworx_token');
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads', icon: UserPlus, label: 'Leads' },
    { to: '/callbacks', icon: PhoneCall, label: 'Callbacks' },
    { to: '/contacts', icon: Users, label: 'Contacts' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
  ];

  return (
    <div className={`sidebar-container transition-all duration-500 border-r border-white/5 ${isCollapsed ? 'w-24' : 'w-72'}`}>
      <div className={`flex items-center gap-4 transition-all duration-500 overflow-hidden ${isCollapsed ? 'pt-10 px-0 justify-center' : 'p-10'}`}>
        <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-[18px] shadow-lg shadow-primary/20 shrink-0">
          <Cpu className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="animate-in whitespace-nowrap">
            <h1 className="font-black text-2xl leading-none text-white tracking-tighter uppercase">ASKworX</h1>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] mt-1.5">Elite AI</p>
          </div>
        )}
      </div>

      <nav className="flex-1 mt-10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0 py-6 mb-2' : ''}`
            }
            title={isCollapsed ? item.label : ''}
          >
            <item.icon className={`w-5 h-5 opacity-80 shrink-0 ${isCollapsed ? 'scale-[1.3] text-white' : ''}`} />
            {!isCollapsed && <span className="text-[12px] uppercase tracking-widest animate-in whitespace-nowrap font-black">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`transition-all duration-500 ${isCollapsed ? 'p-0 pb-12 flex justify-center' : 'p-10'}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 text-slate-500 hover:text-white transition-all text-left font-black text-[10px] uppercase tracking-[0.2em] ${isCollapsed ? 'justify-center border-t border-white/5 pt-10 w-full' : 'w-full'}`}
          title={isCollapsed ? 'Exit' : ''}
        >
          <LogOut className={`w-5 h-5 shrink-0 ${isCollapsed ? 'scale-[1.3] text-red-400' : ''}`} />
          {!isCollapsed && <span className="whitespace-nowrap">Exit Session</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
