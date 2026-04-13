import React, { useState, useEffect } from 'react';
import { getLeads } from '../api';
import { format } from 'date-fns';
import { formatSlug } from '../utils';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const resp = await getLeads();
      setLeads(resp.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 lg:p-14 max-w-[1800px] mx-auto animate-in h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-12 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Leads</span>
             </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
             Business <span className="bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent">Leads</span>
          </h1>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total Leads</span>
           <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">{leads.length}</span>
        </div>
      </div>

      <div className="premium-card flex-1 overflow-hidden bg-white shadow-sm border-none flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-10">
              <tr className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] bg-slate-50/80 backdrop-blur-md">
                <th className="px-10 py-6">Identity</th>
                <th className="px-10 py-6">Organization</th>
                <th className="px-10 py-6">Service Requirement</th>
                <th className="px-10 py-6 text-right">Interaction Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {leads.map((lead, idx) => (
                <tr key={lead.id || idx} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm tracking-tight capitalize">{lead.name ? formatSlug(lead.name) : 'Anonymous'}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">+{lead.phone}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-sm font-semibold text-slate-600 uppercase tracking-tight">{lead.company ? formatSlug(lead.company) : 'N/A'}</td>
                  <td className="px-10 py-8">
                    <p className="text-xs text-slate-600 font-medium max-w-md leading-relaxed">{lead.requirement || 'General Inquiry'}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Captured</span>
                     <span className="text-xs font-bold text-slate-700">{lead.created_at ? format(new Date(lead.created_at), 'MMM d, HH:mm') : '--:--'}</span>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-10 py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">No leads captured in current cycle</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
