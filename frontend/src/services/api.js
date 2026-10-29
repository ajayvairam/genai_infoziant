import axios from 'axios';
import { supabase } from './supabase';

const baseURL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for LLM generation
});

// Interceptor to automatically attach Auth Bearer Token
apiClient.interceptors.request.use(async (config) => {
  try {
    let token = null;

    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        token = session.access_token;
      }
    }

    // If no Supabase session, check localStorage for guest session
    if (!token) {
      token = localStorage.getItem('debugmate_guest_token');
      if (!token) {
        token = `guest-${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('debugmate_guest_token', token);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Could not retrieve auth session for API request:', err);
  }
  return config;
}, (error) => Promise.reject(error));

export const debugApi = {
  checkHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  analyzeError: async ({ errorMessage, language, sourceCode, category }) => {
    const res = await apiClient.post('/debug/analyze', {
      error_message: errorMessage,
      language: language || 'Python',
      source_code: sourceCode || '',
      category: category || 'Auto-Detect',
    });
    return res.data;
  },

  sendFollowupChat: async ({ analysisId, message, errorContext, chatHistory }) => {
    const res = await apiClient.post('/debug/chat', {
      analysis_id: analysisId || null,
      message,
      error_context: errorContext || {},
      chat_history: chatHistory || [],
    });
    return res.data;
  },

  getHistory: async ({ search = '', language = '' } = {}) => {
    const params = {};
    if (search) params.search = search;
    if (language && language !== 'All') params.language = language;
    const res = await apiClient.get('/debug/history', { params });
    return res.data;
  },

  getHistoryItem: async (id) => {
    const res = await apiClient.get(`/debug/history/${id}`);
    return res.data;
  },

  deleteHistoryItem: async (id) => {
    const res = await apiClient.delete(`/debug/history/${id}`);
    return res.data;
  },

  saveHistoryItem: async (data) => {
    const res = await apiClient.post('/debug/history', data);
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await apiClient.get('/dashboard/stats');
    return res.data;
  },
};
