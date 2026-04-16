import React, { useState, useEffect } from 'react';
import { getLeaveRequests, updateLeaveStatus } from '../api';
import { CalendarRange, Check, X, Clock } from 'lucide-react';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const resp = await getLeaveRequests();
      setRequests(resp.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      fetchRequests();
    } catch (err) {
      alert("Error updating leave request");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="p-10 lg:p-14 max-w-[1800px] mx-auto animate-in h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-12 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-600">Personnel Records</span>
             </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
             Leave <span className="bg-gradient-to-r from-rose-500 to-orange-600 bg-clip-text text-transparent">Approvals</span>
          </h1>
        </div>
        <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Pending Requests</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                {requests.filter(r => r.status === 'Pending').length}
            </span>
        </div>
      </div>

      <div className="premium-card flex-1 overflow-hidden bg-white shadow-sm border-none flex flex-col min-h-0">
        <div className="flex-1 overflow-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead className="sticky top-0 z-10">
              <tr className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] bg-slate-50/80 backdrop-blur-md">
                <th className="px-10 py-6">Requested By</th>
                <th className="px-10 py-6">Leave Details</th>
                <th className="px-10 py-6">Justification</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {requests.map((r) => (
                <tr key={r.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm tracking-tight">{r.employee_name}</span>
                        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">📞 {r.employee_phone}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{r.leave_type.replace('leave_', '')}</span>
                        <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">🗓️ {r.leave_date}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-xs text-slate-500 font-semibold max-w-xs line-clamp-2 leading-relaxed italic">"{r.reason}"</p>
                  </td>
                  <td className="px-10 py-8">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${getStatusStyle(r.status)}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest">{r.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {r.status === 'Pending' ? (
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => handleAction(r.id, 'Rejected')}
                                className="group/btn p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleAction(r.id, 'Approved')}
                                className="group/btn p-4 bg-emerald-50 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/5"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Decision Finalized</span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-10 py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">No leave requests recorded</p>
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

export default LeaveRequests;
