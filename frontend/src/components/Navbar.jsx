import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  Sparkles, 
  Terminal, 
  User, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  AlertTriangle, 
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { debugApi } from '../services/api';

export const Navbar = ({ onNewAnalysis }) => {
  const { user, isGuest, signOut, openAuthModal, isSupabaseConfigured } = useAuth();
  const [healthStatus, setHealthStatus] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await debugApi.checkHealth();
        setHealthStatus(res);
      } catch (err) {
        setHealthStatus({ status: 'offline' });
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-700/80 bg-dark-950/80 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-brand-neon/10 border border-brand-neon/30 shadow-glow-green">
            <Bug className="w-5 h-5 text-brand-neon" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-neon"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono">
                DebugMate<span className="text-brand-neon">.AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-neon/10 border border-brand-neon/20 text-brand-neon">
                LLM Debugger
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent Error Diagnostics & Code Repair
            </p>
          </div>
        </div>

        {/* Center / Status Pills */}
        <div className="hidden md:flex items-center gap-3">
          {healthStatus && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-dark-700 text-xs">
              <Radio className={`w-3.5 h-3.5 ${healthStatus.status === 'healthy' ? 'text-brand-neon animate-pulse' : 'text-amber-400'}`} />
              <span className="text-slate-300">
                Backend: <strong className="text-white font-mono">{healthStatus.status}</strong>
              </span>
              {healthStatus.gemini_configured ? (
                <span className="text-emerald-400 font-mono text-[11px]">• Gemini Active</span>
              ) : (
                <span className="text-amber-400/90 font-mono text-[11px]">• Heuristic Fallback</span>
              )}
            </div>
          )}
        </div>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-brand-neon hover:bg-emerald-500/20 transition-all shadow-glow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Error</span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 rounded-lg border border-dark-700 bg-dark-900 hover:border-slate-600 transition-colors text-xs text-slate-200"
            >
              <div className="w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-brand-neon border border-brand-neon/20 font-mono text-[11px] font-bold">
                {user?.email ? user.email.charAt(0).toUpperCase() : 'G'}
              </div>
              <span className="max-w-[120px] truncate hidden sm:inline">
                {user?.email || 'Guest User'}
              </span>
              {isGuest && (
                <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Guest
                </span>
              )}
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl border border-dark-700 bg-dark-900 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-dark-800">
                  <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate font-mono mt-0.5">
                    {user?.email || 'Guest Developer'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-neon" />
                    <span>RLS Protected Workspace</span>
                  </div>
                </div>

                <div className="p-1 space-y-1">
                  {isGuest ? (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-neon hover:bg-emerald-500/10 rounded-lg transition-colors font-medium text-left"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Log in / Connect Supabase</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors font-medium text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
