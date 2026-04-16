import React, { useState, useEffect } from 'react';
import { getEmployees, createReminder } from '../api';
import { Clock, Send, User, Calendar } from 'lucide-react';

const Reminders = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    desc: '',
    due: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const resp = await getEmployees();
      setEmployees(resp.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReminder(formData);
      alert("Reminder scheduled successfully!");
      setFormData({ phone: '', desc: '', due: '' });
    } catch (err) {
      alert("Error scheduling reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 lg:p-14 max-w-[1200px] mx-auto animate-in h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      <div className="mb-12 shrink-0 text-center lg:text-left">
        <div className="flex items-center gap-3 mb-3 justify-center lg:justify-start">
           <div className="px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-600">Productivity Tools</span>
           </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
           Staff <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Reminders</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 flex-1 overflow-hidden min-h-0">
        <div className="lg:col-span-3 overflow-y-auto no-scrollbar pb-10">
            <div className="premium-card bg-white p-10 border-none shadow-xl shadow-slate-200/50 rounded-[40px]">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4 px-1">1. Select Recipient</label>
                        <div className="grid grid-cols-2 gap-4">
                            {employees.map(emp => (
                                <button
                                    key={emp.id}
                                    type="button"
                                    onClick={() => setFormData({...formData, phone: emp.phone})}
                                    className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                                        formData.phone === emp.phone 
                                        ? 'border-amber-500 bg-amber-50/50 ring-4 ring-amber-500/10' 
                                        : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${formData.phone === emp.phone ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {emp.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className={`text-[11px] font-black uppercase tracking-widest truncate ${formData.phone === emp.phone ? 'text-amber-700' : 'text-slate-600'}`}>{emp.name}</span>
                                        <span className="text-[9px] font-bold text-slate-400 tracking-tight">{emp.phone}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4 px-1">2. Task Description</label>
                        <textarea
                            required
                            value={formData.desc}
                            onChange={(e) => setFormData({...formData, desc: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-8 py-6 text-sm font-semibold text-slate-800 focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-300 min-h-[150px]"
                            placeholder="Example: Finalize the client dashboard PPT by end of day..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4 px-1">3. Schedule Time</label>
                            <input
                                required
                                type="datetime-local"
                                value={formData.due}
                                onChange={(e) => setFormData({...formData, due: e.target.value})}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:border-amber-500 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                {loading ? 'Scheduling...' : 'Send Reminder'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div className="lg:col-span-2 hidden lg:block">
            <div className="premium-card bg-slate-900 rounded-[40px] p-10 h-fit relative overflow-hidden">
                <div className="relative z-10">
                    <Clock className="w-12 h-12 text-amber-400 mb-8" />
                    <h3 className="text-2xl font-black text-white tracking-tighter mb-4 leading-none">Smart <br/>Recall System</h3>
                    <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-8">
                        Our automated engine will notify employees exactly at the scheduled time via WhatsApp. Perfect for deadlines, meetings, and updates.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Real-time Delivery</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Employee Tracking</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10">
                   <Calendar className="w-64 h-64 text-white" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
