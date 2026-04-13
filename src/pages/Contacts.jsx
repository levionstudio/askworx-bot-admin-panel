import React, { useState, useEffect } from 'react';
import { getContacts } from '../api';
import { format } from 'date-fns';
import { formatSlug } from '../utils';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const resp = await getContacts();
      setContacts(resp.data || []);
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
             <div className="px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600">Contacts</span>
             </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
             Global <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Contacts</span>
          </h1>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Authenticated</span>
           <span className="text-3xl font-black text-indigo-500 tracking-tighter tabular-nums">{contacts.length}</span>
        </div>
      </div>

      <div className="premium-card flex-1 overflow-hidden bg-white shadow-sm border-none flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-10">
              <tr className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] bg-slate-50/80 backdrop-blur-md">
                <th className="px-10 py-6">User Identity</th>
                <th className="px-10 py-6">Session ID</th>
                <th className="px-10 py-6">Engagement Rating</th>
                <th className="px-10 py-6 text-right">Synchronization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {contacts.map((contact, idx) => (
                <tr key={contact.id || idx} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-all shrink-0">
                         {(contact.name || 'A')[0].toUpperCase()}
                       </div>
                       <div className="flex flex-col min-w-0">
                          <span className="font-black text-slate-800 text-sm tracking-tight capitalize truncate">{contact.name ? formatSlug(contact.name) : 'Anonymous User'}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">+{contact.phone}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {contact.id}</span>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= 4 ? 'bg-indigo-500/40' : 'bg-slate-100'}`}></div>
                        ))}
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Last Joined</span>
                     <span className="text-xs font-bold text-slate-700">
                       {contact.created_at ? format(new Date(contact.created_at), 'MMM d, yyyy') : '--:--'}
                     </span>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-10 py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">No authenticated contacts found</p>
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

export default Contacts;
