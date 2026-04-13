import React, { useState, useEffect } from 'react';
import { getCallbacks, markCallbackDone } from '../api';
import { format } from 'date-fns';
import { Phone, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { formatSlug } from '../utils';

const Callbacks = () => {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCallbacks();
  }, []);

  const fetchCallbacks = async () => {
    try {
      const resp = await getCallbacks();
      setCallbacks(resp.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await markCallbackDone(id);
      fetchCallbacks();
    } catch (err) {
      alert('Failed to mark as done');
    }
  };

  const pending = callbacks.filter(c => c.status === 'pending');
  const finished = callbacks.filter(c => c.status === 'done');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pending Callbacks</h1>
        <p className="text-gray-500">Scheduled calls requested by clients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {pending.map((c) => (
          <div key={c.id} className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-lg font-bold">URGENT</span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-1">{formatSlug(c.name)}</h3>
            <p className="text-primary font-bold text-lg mb-4">{c.phone}</p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Preferred: <strong>{c.preferred_time}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Requested: {c.created_at ? format(new Date(c.created_at), 'dd MMM, HH:mm') : 'N/A'}</span>
              </div>
            </div>

            <button
              onClick={() => handleMarkDone(c.id)}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Mark as Done
            </button>
          </div>
        ))}
        {pending.length === 0 && (
          <div className="col-span-full p-12 text-center glass-card rounded-3xl border-dashed border-2 border-gray-200 bg-transparent">
            <p className="text-gray-400 font-medium italic">No pending callback requests. Good job!</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest text-sm">Completed</h2>
      </div>
      
      <div className="glass-card rounded-3xl overflow-hidden opacity-60">
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-50">
            {finished.slice(0, 10).map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <span className="font-bold text-gray-700">{formatSlug(c.name)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.phone}</td>
                <td className="px-6 py-4 text-xs text-gray-400">
                  Completed {c.created_at ? format(new Date(c.created_at), 'dd MMM yyyy') : 'Recently'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Callbacks;
