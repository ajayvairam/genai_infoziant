import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Code2, 
  History, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  FolderPlus,
  Loader2
} from 'lucide-react';
import { debugApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#00FF87', '#10b981', '#38bdf8', '#818cf8', '#f43f5e', '#fbbf24', '#a855f7'];

export const DashboardPage = ({ onNavigateToWorkspace, onSelectHistoryItem }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await debugApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-3">
        <Loader2 className="w-8 h-8 text-brand-neon animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Loading dashboard metrics...</p>
      </div>
    );
  }

  const isEmpty = !stats || stats.total_analyses === 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-dark-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-brand-neon/30 text-brand-neon">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <span>Developer Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics and history derived directly from your debugging sessions.
          </p>
        </div>

        <button
          onClick={onNavigateToWorkspace}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-neon text-dark-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-glow-subtle shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start New Analysis</span>
        </button>
      </div>

      {isEmpty ? (
        /* Helpful Empty State for New Users */
        <div className="p-12 rounded-3xl border border-dark-700 bg-dark-900/60 text-center space-y-5 max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-brand-neon/30 flex items-center justify-center text-brand-neon shadow-glow-green">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">No Analyses Recorded Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Welcome to DebugMate AI! Once you analyze errors or stack traces, your language frequencies, resolution rates, and history logs will appear here.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onNavigateToWorkspace}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-neon text-dark-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-glow-subtle"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Analyze Your First Error</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-2 card-hover">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Analyses</span>
                <Code2 className="w-4 h-4 text-brand-neon" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {stats.total_analyses}
              </div>
              <p className="text-[11px] text-slate-400">Total errors diagnosed</p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-2 card-hover">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Code Fixes Generated</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {stats.resolved_count}
              </div>
              <p className="text-[11px] text-slate-400">
                {stats.total_analyses > 0 
                  ? `${Math.round((stats.resolved_count / stats.total_analyses) * 100)}% resolution rate`
                  : '0%'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-2 card-hover">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Top Language</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono truncate">
                {stats.top_languages[0]?.language || 'None'}
              </div>
              <p className="text-[11px] text-slate-400">
                {stats.top_languages[0]
                  ? `${stats.top_languages[0].count} analyses (${stats.top_languages[0].percentage}%)`
                  : 'No data'}
              </p>
            </div>
          </div>

          {/* Charts & Language Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bar Chart: Language Distribution (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Language Frequency</h3>
                  <p className="text-xs text-slate-400">Errors analyzed by programming language</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.top_languages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="language" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0b0f14',
                        borderColor: '#222c3c',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#f8fafc',
                      }}
                      formatter={(val) => [`${val} analyses`, 'Count']}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {stats.top_languages.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Language Breakdown Cards (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Language Share</h3>
                <p className="text-xs text-slate-400">Proportional breakdown</p>
              </div>

              <div className="space-y-3 my-auto">
                {stats.top_languages.map((lang, index) => (
                  <div key={lang.language} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-semibold flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        {lang.language}
                      </span>
                      <span className="font-mono text-slate-400">
                        {lang.count} ({lang.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${lang.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={onNavigateToWorkspace}
                  className="w-full py-2.5 rounded-xl border border-dark-600 bg-dark-850 hover:bg-dark-800 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Analyze Another Language
                </button>
              </div>
            </div>
          </div>

          {/* Recent Debugging Sessions */}
          <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-neon" />
                  <span>Recently Analyzed Errors</span>
                </h3>
                <p className="text-xs text-slate-400">Revisit past solutions or inspect diagnosis</p>
              </div>
            </div>

            <div className="divide-y divide-dark-800">
              {stats.recent_analyses.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectHistoryItem(item)}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-dark-850/50 px-2 rounded-lg transition-colors group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700">
                        {item.language}
                      </span>
                      <h4 className="text-xs font-semibold text-white group-hover:text-brand-neon transition-colors truncate">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-xl">
                      {item.error_message}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-slate-500 group-hover:text-slate-300 text-xs">
                    <span className="text-[10px] font-mono hidden sm:inline">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-brand-neon opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

