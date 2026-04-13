import React, { useState, useEffect } from 'react';
import { getContacts } from '../api';
import { format } from 'date-fns';
import { Users, Search, MessageSquare, ExternalLink } from 'lucide-react';
import { formatSlug, getInitial } from '../utils';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filtered = contacts.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) ||
    (c.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Contacts</h1>
          <p className="text-gray-500">Everyone who has interacted with the bot</p>
        </div>
        <div className="bg-primary/5 px-4 py-2 rounded-xl text-primary font-bold flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span>{contacts.length} Total</span>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search contacts..."
          className="input-field pl-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((c) => (
          <div key={c.id || c.phone} className="glass-card p-6 rounded-3xl hover:shadow-xl transition-all border border-transparent hover:border-primary/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                {getInitial(c.name, c.phone)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 truncate max-w-[150px]">{c.name ? formatSlug(c.name) : c.phone}</h3>
                <p className="text-xs text-gray-400">
                  Joined {c.joined_at ? format(new Date(c.joined_at), 'MMM yyyy') : 'Recently'}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-black">WhatsApp</span>
                <span className="text-sm font-bold text-gray-700">{c.phone}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-black">Company</span>
                <span className="text-sm text-gray-600 truncate">{c.company ? formatSlug(c.company) : 'Not Specified'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => window.location.href = `/messages?phone=${c.phone}`}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                View Chat
              </button>
              <button className="p-2 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
