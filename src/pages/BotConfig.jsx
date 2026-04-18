import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../api';
import { Save, Bot, MessageSquare, LayoutGrid, Type } from 'lucide-react';

const BotConfig = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const resp = await getSettings();
      setSettings(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      alert('Settings updated successfully! Bot will now use new templates.');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Configuration...</div>;

  return (
    <div className="p-10 lg:p-14 max-w-[1200px] mx-auto animate-in">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600">Core Systems</span>
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
            Bot <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Brain</span>
          </h1>
          <p className="text-slate-500 mt-4 font-medium">Control what the bot says without touching a single line of code.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Sync Bot'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Morning Greetings */}
        <div className="premium-card bg-white p-10 border-none shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Morning Greetings</h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Scheduled Daily at 9:00 AM</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Team Member Greeting</label>
              <textarea
                className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 transition-all min-h-[120px]"
                value={settings.greeting_employee}
                onChange={(e) => handleChange('greeting_employee', e.target.value)}
                placeholder="Use {{name}} for dynamic employee name"
              />
              <p className="text-[9px] font-bold text-slate-400 bg-slate-100 p-2 rounded-lg w-fit">Note: Use {"{{name}}"} to insert employee names dynamically.</p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">General Contact Greeting</label>
              <textarea
                className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 transition-all min-h-[120px]"
                value={settings.greeting_customer}
                onChange={(e) => handleChange('greeting_customer', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Internal Hub Templates */}
        <div className="premium-card bg-white p-10 border-none shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Internal Hub (Menu)</h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Employee-Only Dashboard</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Hub Welcome Message</label>
              <textarea
                className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 transition-all min-h-[150px]"
                value={settings.hub_welcome}
                onChange={(e) => handleChange('hub_welcome', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Button: Start Day</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 text-xs font-black text-slate-700 outline-none"
                  value={settings.btn_start_day}
                  onChange={(e) => handleChange('btn_start_day', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Button: End Day</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 text-xs font-black text-slate-700 outline-none"
                  value={settings.btn_end_day}
                  onChange={(e) => handleChange('btn_end_day', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Button: Leave</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 text-xs font-black text-slate-700 outline-none"
                  value={settings.btn_apply_leave}
                  onChange={(e) => handleChange('btn_apply_leave', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotConfig;
