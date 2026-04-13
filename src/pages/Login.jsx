import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { Cpu, Lock } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const resp = await login(password);
      localStorage.setItem('askworx_token', resp.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid admin password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-10 rounded-3xl border-white/10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-4 rounded-2xl shadow-xl shadow-primary/20 mb-4">
            <Cpu className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ASKworX Admin</h1>
          <p className="text-gray-400 text-center text-sm">Industrial Automation Bot Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/70 text-sm mb-2 ml-1">Admin Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-secondary transition-all"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-primary font-bold py-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <p className="mt-8 text-white/20 text-center text-xs uppercase tracking-widest">
          Secure Access Only
        </p>
      </div>
    </div>
  );
};

export default Login;
