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

const Sidebar = () => {
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
    <div className="w-64 h-screen sidebar-gradient text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="bg-white/20 p-2 rounded-lg">
          <Cpu className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight uppercase tracking-wider">ASKworX</h1>
          <p className="text-[10px] text-white/60">Smart Automation Bot</p>
        </div>
      </div>

      <nav className="flex-1 p-4 mt-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-secondary text-primary font-bold shadow-lg shadow-secondary/20' 
                  : 'hover:bg-white/10 text-white/70'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-white/10 text-white/70 transition-all text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
