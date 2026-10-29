import React, { useState } from 'react';
import { 
  FileCode2, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Sparkles,
  ArrowRight,
  Code
} from 'lucide-react';
import { SAMPLE_ERRORS } from '../services/sampleErrors';
import { useNotification } from '../context/NotificationContext';

export const SampleLibraryPage = ({ onLoadSample }) => {
  const { addToast } = useNotification();
  const [copiedId, setCopiedId] = useState(null);
  const [selectedLang, setSelectedLang] = useState('All');

  const languages = ['All', 'Python', 'JavaScript', 'Java', 'C', 'SQL'];

  const filteredSamples = selectedLang === 'All'
    ? SAMPLE_ERRORS
    : SAMPLE_ERRORS.filter((s) => s.language.toLowerCase() === selectedLang.toLowerCase());

  const handleCopyCode = async (sample, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(sample.sourceCode);
      setCopiedId(sample.id);
      addToast('Sample code copied to clipboard!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      addToast('Failed to copy code', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-dark-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-brand-neon/30 text-brand-neon">
              <FileCode2 className="w-5 h-5" />
            </span>
            <span>Sample Error Library</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured benchmark error scenarios for instant testing and demonstration.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedLang === lang
                  ? 'bg-brand-neon text-dark-950 shadow-glow-subtle'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-dark-700'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Samples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSamples.map((sample) => (
          <div
            key={sample.id}
            className="rounded-2xl border border-dark-700 bg-dark-900 overflow-hidden flex flex-col justify-between card-hover group"
          >
            {/* Card Header */}
            <div className="p-5 border-b border-dark-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-dark-800 text-brand-neon border border-brand-neon/20 font-bold">
                  {sample.language}
                </span>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-dark-800 border border-dark-700">
                  {sample.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-brand-neon transition-colors">
                {sample.title}
              </h3>
              <p className="text-xs text-slate-400">
                {sample.description}
              </p>
            </div>

            {/* Error Message Snippet */}
            <div className="px-5 py-3 bg-dark-950/70 border-b border-dark-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold mb-1">
                Error Message / Stack Trace
              </div>
              <pre className="text-xs text-rose-300 font-mono overflow-x-auto max-h-24 scrollbar-none whitespace-pre-wrap leading-relaxed">
                {sample.errorMessage}
              </pre>
            </div>

            {/* Source Code Snippet */}
            <div className="px-5 py-3 bg-dark-900 border-b border-dark-800">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase font-semibold mb-1">
                <span>Problematic Code</span>
                <button
                  onClick={(e) => handleCopyCode(sample, e)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedId === sample.id ? (
                    <Check className="w-3 h-3 text-brand-neon" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedId === sample.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-xs text-slate-300 font-mono overflow-x-auto max-h-28 scrollbar-none whitespace-pre-wrap">
                {sample.sourceCode}
              </pre>
            </div>

            {/* Actions */}
            <div className="p-4 bg-dark-850 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Sample Benchmark #{sample.id}
              </span>
              <button
                onClick={() => onLoadSample(sample)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-neon text-dark-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-glow-subtle"
              >
                <span>Load & Analyze</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
