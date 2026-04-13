import React, { useState, useEffect, useRef } from 'react';
import { getContacts, getChatHistory, sendMessage } from '../api';
import { useSearchParams } from 'react-router-dom';
import { Send, Search, User, Phone, Briefcase, Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { formatSlug, getInitial } from '../utils';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchContacts();
    const phone = searchParams.get('phone');
    if (phone) {
       // We'll handle selecting this contact once contacts are loaded
    }
  }, []);

  useEffect(() => {
    if (contacts.length > 0 && !selectedContact) {
       const phone = searchParams.get('phone');
       if (phone) {
          const contact = contacts.find(c => c.phone === phone);
          if (contact) setSelectedContact(contact);
       }
    }
  }, [contacts]);

  useEffect(() => {
    if (selectedContact) {
      fetchHistory(selectedContact.phone);
      const interval = setInterval(() => fetchHistory(selectedContact.phone, true), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  useEffect(() => {
    if (messages.length > 0) {
      const latestId = messages[messages.length - 1].id;
      // Scroll to bottom on first load OR when a brand new message arrives
      if (!lastMessageId || latestId !== lastMessageId) {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        setLastMessageId(latestId);
      }
    }
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const resp = await getContacts();
      setContacts(resp.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchHistory = async (phone, background = false) => {
    if (!background) setLoadingHistory(true);
    try {
      const resp = await getChatHistory(phone);
      setMessages(resp.data || []);
    } catch (err) { console.error(err); }
    finally { if (!background) setLoadingHistory(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    try {
      await sendMessage(selectedContact.phone, newMessage);
      const sentMsg = {
        direction: 'outgoing',
        message: newMessage,
        sent_at: new Date().toISOString()
      };
      setMessages([...messages, sentMsg]);
      setNewMessage('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const filteredContacts = contacts.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar - Contact List */}
      <div className="w-80 border-r border-gray-100 flex flex-col pt-4">
        <div className="px-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search chat..."
              className="w-full bg-gray-50 border-0 rounded-xl pl-10 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((c) => (
            <div 
              key={c.id}
              onClick={() => setSelectedContact(c)}
              className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-all ${
                selectedContact?.phone === c.phone ? 'bg-primary/5 border-r-4 border-primary' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold">
                {getInitial(c.name, c.phone)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{c.name ? formatSlug(c.name) : c.phone}</h4>
                </div>
                <p className="text-xs text-gray-400 truncate">{c.company ? formatSlug(c.company) : 'Recent Activity'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col bg-[#fcfcfc]">
          {/* Top Bar */}
          <div className="px-8 py-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                 {(selectedContact.name || '?')[0].toUpperCase()}
               </div>
               <div>
                 <h3 className="font-bold text-gray-800">{selectedContact.name ? formatSlug(selectedContact.name) : selectedContact.phone}</h3>
                 <p className="text-xs text-green-500 font-medium">Online (via WhatsApp)</p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-black">Company</p>
                  <p className="text-sm font-bold text-gray-700">{selectedContact.company || 'N/A'}</p>
               </div>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8F9FB]" ref={scrollRef}>
             {loadingHistory ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm font-medium">Fetching history...</p>
                  </div>
                </div>
             ) : (
                messages.map((m, idx) => {
                  const imageRegex = /^\[[Ii]mage:\s*(https?:\/\/[^\]]+)\]\s*([\s\S]*)$/;
                  const match = m.message.match(imageRegex);
                  const imageUrl = match ? match[1] : null;
                  const textContent = match ? match[2] : m.message;
                  const isSystemAction = !m.direction || m.direction === 'incoming' && m.message.includes('_');

                  return (
                    <div key={idx} className={`flex ${m.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[70%] group`}>
                        <div className={`relative p-1 rounded-3xl transition-all ${
                          m.direction === 'outgoing' 
                            ? 'bg-gradient-to-br from-primary to-blue-700 text-white rounded-tr-none shadow-blue-200 shadow-lg' 
                            : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none'
                        }`}>
                          {imageUrl && (
                            <div className="mb-2 overflow-hidden rounded-2xl bg-gray-100">
                              <img 
                                src={imageUrl} 
                                alt="Shared" 
                                className="w-full h-auto object-cover max-h-80 hover:scale-105 transition-transform duration-500" 
                              />
                            </div>
                          )}
                          <div className={imageUrl ? "px-4 pb-3 pt-1" : "p-4"}>
                            {isSystemAction ? (
                               <div className="flex items-center gap-2 text-primary bg-primary/5 py-2 px-3 rounded-xl border border-primary/10 mb-1">
                                 <span className="text-[10px] font-black uppercase tracking-wider">Action</span>
                                 <p className="text-sm font-bold truncate">{formatSlug(textContent)}</p>
                               </div>
                            ) : (
                               <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{textContent}</p>
                            )}
                            <div className={`flex items-center justify-end gap-2 mt-2 transition-opacity ${m.direction === 'outgoing' ? 'opacity-70' : 'opacity-40'}`}>
                              <p className="text-[10px] font-bold">
                                {m.sent_at ? format(new Date(m.sent_at), 'HH:mm') : ''}
                              </p>
                              {m.direction === 'outgoing' && (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
             )}
          </div>

          {/* Action Input */}
          <div className="p-8 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="relative">
              <input 
                type="text" 
                placeholder="Type a message to reply via WhatsApp..."
                className="w-full bg-gray-50 border-0 rounded-2xl pl-6 pr-16 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 mt-3 text-center uppercase tracking-widest font-bold">
              Powered by ASKworX industrial automation
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
           <div className="bg-white p-12 rounded-full shadow-lg mb-8">
             <MessageSquare className="w-20 h-20 text-primary/10" />
           </div>
           <h2 className="text-xl font-bold text-gray-400">Select a contact to start messaging</h2>
           <p className="text-sm text-gray-300 mt-2">All conversations are synced in real-time</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
