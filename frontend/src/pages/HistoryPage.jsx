import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Code2, 
  Calendar, 
  Loader2, 
  AlertCircle,
  Eye,
  GitCompare,
  ArrowRight
} from 'lucide-react';
import { debugApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { DiagnosisView } from '../components/DiagnosisView';

const LANGUAGES = ['All', 'Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'SQL'];

export const HistoryPage = ({ onInspectItem }) => {
  const { addToast } = useNotification();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [activeItem, setActiveItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const items = await debugApi.getHistory({
        search: searchTerm,
        language: selectedLanguage,
      });
      setHistoryItems(items);
    } catch (err) {
      console.error('Failed to load history:', err);
      addToast('Failed to load debugging history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedLanguage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;
    
    setDeletingId(id);
    try {
      await debugApi.deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
      if (activeItem?.id === id) {
        setActiveItem(null);
      }
      addToast('Analysis deleted successfully', 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      addToast('Failed to delete analysis record', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-dark-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-brand-neon/30 text-brand-neon">
              <History className="w-5 h-5" />
            </span>
            <span>Debugging History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access, search, and revisit your saved error diagnoses and AI solutions.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or error..."
              className="bg-dark-900 border border-dark-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-neon transition-colors w-48 sm:w-64"
            />
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-neon transition-colors"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-xs font-semibold text-slate-200 border border-dark-600 transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* If inspecting an item in full view */}
      {activeItem ? (
        <div className="space-y-4">
          <button
            onClick={() => setActiveItem(null)}
            className="inline-flex items-center gap-1.5 text-xs text-brand-neon hover:underline font-mono"
          >
            ← Back to All Records
          </button>
          <DiagnosisView
            analysis={activeItem}
            onReset={() => setActiveItem(null)}
          />
        </div>
      ) : (
        /* History Items List */
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-brand-neon" />
              <p className="text-xs font-mono">Loading saved records...</p>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dark-700 bg-dark-900/60 text-center space-y-3">
              <History className="w-10 h-10 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-white">No Saved Analyses Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchTerm || selectedLanguage !== 'All'
                  ? 'No records match your active search filters.'
                  : 'Errors you analyze in the AI Error Analyzer will automatically be stored here for future review.'}
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="p-4 rounded-xl border border-dark-700 bg-dark-900 hover:border-brand-neon/40 hover:bg-dark-850/80 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-600">
                      {item.language}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-neon transition-colors truncate">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-rose-300/80 font-mono line-clamp-1">
                    {item.error_message}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {item.diagnosis?.summary || 'Analysis recorded.'}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      disabled={deletingId === item.id}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-dark-800 transition-colors"
                      title="Delete this record"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-200 group-hover:bg-brand-neon group-hover:text-dark-950 font-semibold transition-colors"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

