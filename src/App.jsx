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
  const token = localStorage.getItem('askworx_token');
  if (!token) return <Navigate to="/login" />;
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        {children}
      </main>
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
