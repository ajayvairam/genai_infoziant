import React from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  History, 
  FolderGit2, 
  Settings, 
  Sparkles,
  Terminal,
  FileCode2,
  HelpCircle
} from 'lucide-react';

export const Sidebar = ({ activeTab, onSelectTab }) => {
  const menuItems = [
    {
      id: 'workspace',
      label: 'AI Error Analyzer',
      icon: Code2,
      badge: 'Core',
      badgeColor: 'text-brand-neon bg-emerald-500/10 border-brand-neon/30'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'history',
      label: 'Debugging History',
      icon: History,
    },
    {
      id: 'samples',
      label: 'Sample Error Library',
      icon: FileCode2,
      badge: '6 Built-in',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      id: 'settings',
      label: 'Settings & Status',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-dark-700/80 bg-dark-950 p-4 flex md:flex-col justify-between">
      <div className="space-y-4 w-full">
        <div className="hidden md:block px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>

        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-transparent text-white border-l-2 border-brand-neon shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-neon' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${item.badgeColor} hidden lg:inline-block`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* College Project / Pro Info Footer */}
      <div className="hidden md:block mt-auto pt-4 border-t border-dark-800">
        <div className="p-3 rounded-xl bg-dark-900 border border-dark-700/70">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-brand-neon" />
            <span className="text-xs font-semibold text-slate-200">DebugMate AI</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AI-driven stack trace diagnosis, code repair, and interactive programming tutor.
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>FastAPI + Gemini</span>
            <span className="text-emerald-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
