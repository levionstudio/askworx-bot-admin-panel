import React, { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus, sendMessage } from '../api';
import { format } from 'date-fns';
import { Search, Filter, MessageCircle, MoreVertical, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatSlug } from '../utils';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

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

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLeadStatus(id, status);
      fetchLeads();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredLeads = leads.filter(l => {
    const name = l.name || '';
    const company = l.company || '';
    const phone = l.phone || '';
    const contactPhone = l.contact_phone || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          phone.includes(searchTerm) ||
                          contactPhone.includes(searchTerm);
                          
    const matchesStatus = selectedStatus === 'all' || l.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leads Management</h1>
          <p className="text-gray-500">Track and convert potential customers</p>
        </div>
        <button 
          onClick={fetchLeads}
          className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all font-bold"
        >
          Refresh Data
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, company or phone..."
            className="input-field pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            className="outline-none bg-transparent text-sm font-medium"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-widest bg-gray-50/50">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Client Detail</th>
                <th className="px-6 py-4">Requirement</th>
                <th className="px-6 py-4">Received At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((lead, idx) => (
                <tr key={lead.id || idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <select 
                      value={lead.status}
                      onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase outline-none cursor-pointer border-0 ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-600' : 
                        lead.status === 'contacted' ? 'bg-orange-100 text-orange-600' :
                        lead.status === 'converted' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{lead.name ? formatSlug(lead.name) : 'New Lead'}</span>
                      <span className="text-xs text-gray-500 font-medium">{lead.company ? formatSlug(lead.company) : 'Private Inquiry'}</span>
                      <span className="text-xs text-primary font-bold mt-1">
                        {lead.contact_phone || lead.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-sm line-clamp-2">{lead.requirement || 'No details provided'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs">
                      <span className="text-gray-700 font-medium">{lead.created_at ? format(new Date(lead.created_at), 'dd MMM yyyy') : 'N/A'}</span>
                      <span className="text-gray-400">{lead.created_at ? format(new Date(lead.created_at), 'HH:mm') : ''}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => window.location.href = `/messages?phone=${lead.phone}`}
                         className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                         title="Open Chat"
                       >
                         <MessageCircle className="w-5 h-5" />
                       </button>
                       <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                         <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
             <div className="p-20 text-center">
                <p className="text-gray-400">No leads found matching your criteria</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
