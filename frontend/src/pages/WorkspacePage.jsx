import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Code2, 
  Trash2, 
  Loader2, 
  Play, 
  CheckCircle, 
  Layers, 
  AlertCircle,
  FileCode2,
  FolderOpen
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { DiagnosisView } from '../components/DiagnosisView';
import { debugApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { SAMPLE_ERRORS } from '../services/sampleErrors';

const LANGUAGES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C',
  'C++',
  'SQL',
  'HTML',
  'CSS',
  'Go',
  'Rust',
  'PHP',
  'Ruby'
];

const CATEGORIES = [
  'Auto-Detect',
  'Syntax Error',
  'Runtime Exception',
  'Compilation Error',
  'Logic Error',
  'Dependency / Import',
  'Database / SQL',
  'Type Error'
];

export const WorkspacePage = ({ initialSample = null }) => {
  const { addToast } = useNotification();

  const [language, setLanguage] = useState(initialSample?.language || 'Python');
  const [category, setCategory] = useState(initialSample?.category || 'Auto-Detect');
  const [errorMessage, setErrorMessage] = useState(initialSample?.errorMessage || '');
  const [sourceCode, setSourceCode] = useState(initialSample?.sourceCode || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleLoadSample = (sample) => {
    setLanguage(sample.language.charAt(0).toUpperCase() + sample.language.slice(1));
    setCategory(sample.category);
    setErrorMessage(sample.errorMessage);
    setSourceCode(sample.sourceCode);
    setAnalysisResult(null);
    addToast(`Loaded ${sample.title}`, 'info');
  };

  const handleClearAll = () => {
    setErrorMessage('');
    setSourceCode('');
    setAnalysisResult(null);
    addToast('Workspace cleared', 'info');
  };

  const handleAnalyze = async () => {
    if (!errorMessage.trim()) {
      addToast('Please enter an error message or stack trace to analyze.', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Parsing stack trace & code...');

    try {
      setTimeout(() => setLoadingStep('Calling Gemini LLM for diagnosis...'), 800);
      setTimeout(() => setLoadingStep('Synthesizing root cause & fix...'), 1800);

      const result = await debugApi.analyzeError({
        errorMessage,
        language,
        sourceCode,
        category,
      });

      setAnalysisResult(result);
      addToast('Analysis completed successfully!', 'success');
    } catch (err) {
      console.error('Analysis failed:', err);
      addToast(err.response?.data?.detail || 'Analysis request failed. Please check server connection.', 'error');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Workspace Header & Quick Sample Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-dark-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-brand-neon/30 text-brand-neon">
              <Terminal className="w-5 h-5" />
            </span>
            <span>AI Error Analyzer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Paste an error message, stack trace, or problematic code snippet to generate instant solutions.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden lg:inline">Quick Samples:</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {SAMPLE_ERRORS.slice(0, 3).map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(sample)}
                className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-dark-900 border border-dark-700 text-slate-300 hover:text-white hover:border-brand-neon/40 transition-colors"
                title={sample.title}
              >
                {sample.language}: {sample.category.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Section (Always available, collapses/updates smoothly when results show) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Error Message & Language Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Language & Category Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Programming Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-neon transition-colors"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Error Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-neon transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Error Message or Stack Trace</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Required</span>
              </div>
              <textarea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Paste the raw compiler output, runtime traceback, or error message here...
e.g. TypeError: Cannot read properties of undefined (reading 'map')"
                rows={9}
                className="w-full bg-dark-900 border border-dark-700 rounded-xl p-3.5 text-xs text-rose-100 font-mono placeholder-slate-600 focus:outline-none focus:border-rose-400/70 focus:ring-1 focus:ring-rose-400/50 transition-all resize-y"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !errorMessage.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-neon text-dark-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-glow-green disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-dark-950" />
                  <span>{loadingStep || 'Analyzing Error...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Error with AI</span>
                </>
              )}
            </button>

            <button
              onClick={handleClearAll}
              disabled={isLoading}
              className="p-3 rounded-xl border border-dark-700 bg-dark-900 text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
              title="Clear all inputs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Monaco Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-brand-neon" />
                <span>Problematic Source Code Snippet</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Optional but recommended</span>
            </div>

            <CodeEditor
              value={sourceCode}
              onChange={setSourceCode}
              language={language}
              height="300px"
              placeholder="// Paste your problematic code here so the LLM can pinpoint lines and generate exact fixes..."
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton / Status indicator */}
      {isLoading && (
        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-dark-900/80 backdrop-blur-md text-center space-y-4 animate-in fade-in">
          <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-brand-neon/20 animate-ping"></div>
            <Loader2 className="w-8 h-8 text-brand-neon animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {loadingStep || 'AI Debugger in Progress'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Our Gemini LLM engine is inspecting your stack trace, checking language grammar, and constructing verified code corrections.
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {analysisResult && !isLoading && (
        <DiagnosisView
          analysis={analysisResult}
          onReset={() => {
            setAnalysisResult(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onApplyFixToWorkspace={(fixedCode) => {
            setSourceCode(fixedCode);
          }}
        />
      )}
    </div>
  );
};
