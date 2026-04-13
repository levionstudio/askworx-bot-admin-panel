import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { getStats, getLeads, getCallbacks } from '../api';
import { UserPlus, PhoneCall, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { formatSlug } from '../utils';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_contacts: 0,
    total_leads: 0,
    pending_callbacks: 0,
    new_leads: 0,
    total_messages: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([getStats(), getLeads()]);
        setStats(statsRes.data || { total_contacts: 0, total_leads: 0, pending_callbacks: 0, new_leads: 0, total_messages: 0 });
        setRecentLeads((leadsRes.data || []).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading Dashboard...</div>;

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Live Overview</h1>
          <p className="text-gray-500">Real-time performance metrics</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600">Syncing Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          label="New Leads" 
          value={stats.new_leads} 
          icon={UserPlus} 
          color="bg-blue-500" 
        />
        <StatCard 
          label="Pending Callbacks" 
          value={stats.pending_callbacks} 
          icon={PhoneCall} 
          color="bg-orange-500" 
        />
        <StatCard 
          label="Total Contacts" 
          value={stats.total_contacts} 
          icon={Users} 
          color="bg-purple-500" 
        />
        <StatCard 
          label="Messages Today" 
          value={stats.total_messages} 
          icon={MessageSquare} 
          color="bg-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Leads</h2>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-widest bg-gray-50">
                  <th className="px-6 py-4">Lead Info</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(recentLeads || []).map((lead, idx) => (
                  <tr key={lead.id || idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{lead.name ? formatSlug(lead.name) : 'New Lead'}</span>
                        <span className="text-xs text-gray-500">{lead.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{lead.company ? formatSlug(lead.company) : 'Private'}</td>
                    <td className="px-6 py-4 text-sm max-w-[150px] truncate">{lead.requirement || 'Consultation Request'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-600' : 
                        lead.status === 'converted' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-400">
                      {lead.created_at ? format(new Date(lead.created_at), 'MMM d, HH:mm') : 'N/A'}
                    </td>
                  </tr>
                ))}
                {(!recentLeads || recentLeads.length === 0) && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-sm">
                      No recent leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Service Stats</h2>
          <div className="space-y-6">
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-600">Industrial Automation</span>
                 <span className="font-bold">45%</span>
               </div>
               <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-primary" style={{width: '45%'}}></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-600">Software & Digital</span>
                 <span className="font-bold">30%</span>
               </div>
               <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-secondary" style={{width: '30%'}}></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-600">Analytics & IIoT</span>
                 <span className="font-bold">25%</span>
               </div>
               <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500" style={{width: '25%'}}></div>
               </div>
             </div>
          </div>

          <div className="mt-10 bg-primary/5 p-4 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-primary w-5 h-5" />
              <span className="font-bold text-primary">Efficiency Tip</span>
            </div>
            <p className="text-xs text-primary/70 leading-relaxed">
              Responded to 80% of new leads within 1 hour. This is 15% better than last week! Keep it up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
