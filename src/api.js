import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://askworx-bot-production.up.railway.app';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// Create a separate instance for login to use the full URL easily
const authApi = axios.create({
  baseURL: BASE_URL,
});


// For simplicity in this demo, we'll just check for a token in localStorage
// Add ngrok-skip-browser-warning header for development
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('askworx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.baseURL && config.baseURL.includes('ngrok')) {
    config.headers['ngrok-skip-browser-warning'] = 'true';
  }
  return config;
});

export const login = (password) => authApi.post('/api/login', { password });

export const getStats = () => api.get('/stats');
export const getLeads = () => api.get('/leads');
export const updateLeadStatus = (id, status) => api.post('/leads/update-status', { id, status });
export const getCallbacks = () => api.get('/callbacks');
export const markCallbackDone = (id) => api.post('/callbacks/mark-done', { id });
export const getContacts = () => api.get('/contacts');
export const getMessages = () => api.get('/messages');
export const getChatHistory = (phone) => api.get(`/messages/${phone}`);
export const sendMessage = (phone, message) => api.post('/send-message', { phone, message });

// Campaign Management
export const getCampaigns = () => api.get('/campaigns');
export const createCampaign = (data) => api.post('/campaigns', data);
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);
export const getCampaignAnalytics = (id) => api.get(`/campaigns/${id}/analytics`);

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export default api;
