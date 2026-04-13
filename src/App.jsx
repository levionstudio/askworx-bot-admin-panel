import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Callbacks from './pages/Callbacks';
import Contacts from './pages/Contacts';
import Messages from './pages/Messages';

const ProtectedRoute = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const token = localStorage.getItem('askworx_token');
  
  if (!token) return <Navigate to="/login" />;
  
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar isCollapsed={isCollapsed} />
      
      <div className={`flex-1 transition-all duration-500 flex flex-col ${isCollapsed ? 'ml-24' : 'ml-72'}`}>
        {/* Top Navigation Bar with Hamburger */}
        <header className="h-20 bg-white/40 backdrop-blur-md border-b border-slate-100 flex items-center px-8 sticky top-0 z-40">
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="p-3 hover:bg-slate-100 rounded-2xl transition-all group active:scale-95"
           >
              <div className="space-y-1.5 flex flex-col items-center">
                 <div className={`h-0.5 bg-slate-900 transition-all duration-300 ${isCollapsed ? 'w-6' : 'w-4'}`}></div>
                 <div className="h-0.5 bg-slate-900 w-6"></div>
                 <div className={`h-0.5 bg-slate-900 transition-all duration-300 ${isCollapsed ? 'w-4' : 'w-6'}`}></div>
              </div>
           </button>
           <div className="ml-6 h-6 w-px bg-slate-100"></div>
           <div className="ml-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Command Center</span>
           </div>
        </header>

        <main className="p-0">
          <div className="animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/callbacks" element={<ProtectedRoute><Callbacks /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
