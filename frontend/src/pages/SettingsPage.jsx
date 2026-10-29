import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink,
  Terminal,
  Lock
} from 'lucide-react';
import { debugApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const SettingsPage = () => {
  const { isSupabaseConfigured, user, isGuest } = useAuth();
  const { addToast } = useNotification();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await debugApi.checkHealth();
      setHealth(res);
      addToast('System status refreshed', 'info');
    } catch (err) {
      setHealth({ status: 'offline', gemini_configured: false, supabase_configured: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-dark-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-brand-neon/30 text-brand-neon">
              <Settings className="w-5 h-5" />
            </span>
            <span>Settings & System Status</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verify LLM connectivity, database configuration, security policies, and environment setup.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900 hover:bg-dark-800 text-slate-200 border border-dark-700 text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Check Status</span>
        </button>
      </div>

      {/* Services Connectivity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gemini Service Status */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Gemini API</h3>
                <p className="text-xs text-slate-400">LLM Diagnostic Engine</p>
              </div>
            </div>

            {health?.gemini_configured ? (
              <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-brand-neon border border-brand-neon/30">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3 h-3" /> Heuristic Fallback
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The backend connects to Gemini using the official Python SDK (<code className="text-brand-neon font-mono">google-genai</code>). 
            When active, stack traces and code snippets are diagnosed in real time with high accuracy.
          </p>

          <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div>Model: <span className="text-white">gemini-2.5-flash</span></div>
            <div>Key Location: <span className="text-slate-300">backend/.env (GEMINI_API_KEY)</span></div>
          </div>
        </div>

        {/* Supabase Database & Auth */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-brand-neon border border-brand-neon/20">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Supabase PostgreSQL</h3>
                <p className="text-xs text-slate-400">Database & Authentication</p>
              </div>
            </div>

            {isSupabaseConfigured || health?.supabase_configured ? (
              <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-brand-neon border border-brand-neon/30">
                <CheckCircle2 className="w-3 h-3" /> Supabase Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="w-3 h-3" /> Local / Guest Mode
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Persists user debug analyses and follow-up conversation histories with Row Level Security (RLS) enforcement.
          </p>

          <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div>User Session: <span className="text-white">{user?.email || 'Guest User'}</span></div>
            <div>Schema Files: <span className="text-slate-300">supabase/schema.sql, policies.sql</span></div>
          </div>
        </div>
      </div>

      {/* Security & Architecture Highlights */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex items-center gap-2.5 text-white">
          <Lock className="w-5 h-5 text-brand-neon" />
          <h3 className="text-sm font-bold">Security & Architecture Compliance</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-dark-950 border border-dark-800 space-y-1.5">
            <div className="font-semibold text-slate-200">Zero Frontend Secrets</div>
            <p className="text-slate-400 leading-relaxed">
              Gemini API keys and database service-role secrets reside strictly in the FastAPI backend environment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-950 border border-dark-800 space-y-1.5">
            <div className="font-semibold text-slate-200">Untrusted Input Isolation</div>
            <p className="text-slate-400 leading-relaxed">
              User-submitted code and error messages are treated as inert strings. Code is analyzed via LLM and never arbitrarily executed on the server.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-950 border border-dark-800 space-y-1.5">
            <div className="font-semibold text-slate-200">Per-User Data Isolation</div>
            <p className="text-slate-400 leading-relaxed">
              PostgreSQL Row Level Security (RLS) policies and backend JWT claims ensure users only access and modify their own analyses.
            </p>
          </div>
        </div>
      </div>

      {/* Environment Setup Guide */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex items-center gap-2.5 text-white">
          <Key className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold">Configuring Your API Keys</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          To enable live Google Gemini responses, create or edit <code className="text-brand-neon font-mono">backend/.env</code>:
        </p>

        <pre className="p-4 rounded-xl bg-dark-950 border border-dark-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`# backend/.env
GEMINI_API_KEY=your_actual_gemini_api_key_from_google_ai_studio
GEMINI_MODEL=gemini-2.5-flash

# Optional: Supabase configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret`}
        </pre>
      </div>
    </div>
  );
};
