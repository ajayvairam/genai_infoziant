import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  MapPin, 
  ListChecks, 
  Code, 
  GitCompare, 
  Copy, 
  Check, 
  RotateCcw, 
  ShieldAlert, 
  BookOpen, 
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { CodeComparisonModal } from './CodeComparisonModal';
import { FollowUpChat } from './FollowUpChat';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';

export const DiagnosisView = ({
  analysis,
  onReset,
  onApplyFixToWorkspace
}) => {
  const { addToast } = useNotification();
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);

  if (!analysis || !analysis.diagnosis) return null;

  const { diagnosis, language, error_message, source_code, corrected_code, title } = analysis;

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00FF87', '#10b981', '#38bdf8']
    });
  };

  const handleCopyCorrected = async () => {
    const code = corrected_code || diagnosis.corrected_code;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      triggerCelebration();
      addToast('Corrected code copied to clipboard!', 'success');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      addToast('Failed to copy code', 'error');
    }
  };

  const getConfidenceBadge = (confidence) => {
    const conf = (confidence || '').toLowerCase();
    if (conf.includes('high')) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-brand-neon border border-brand-neon/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> High Confidence
        </span>
      );
    }
    if (conf.includes('medium')) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" /> Moderate Confidence
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
        <AlertTriangle className="w-3.5 h-3.5" /> Needs More Context
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-dark-900 to-dark-850 border border-dark-700 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-dark-750 text-slate-300 border border-dark-600">
              {language}
            </span>
            {getConfidenceBadge(diagnosis.confidence)}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-neon" />
            <span>{title || `${language} Error Analysis`}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {source_code && (corrected_code || diagnosis.corrected_code) && (
            <button
              onClick={() => setIsDiffModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 border border-dark-600 transition-colors"
            >
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span>Compare Diff</span>
            </button>
          )}

          <button
            onClick={handleCopyCorrected}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-brand-neon border border-brand-neon/30 transition-all shadow-glow-subtle"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white border border-dark-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Another Analysis</span>
          </button>
        </div>
      </div>

      {/* Grid: 1. Error Summary & 2. Root Cause */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Error Summary */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
          <div className="flex items-center gap-2.5 text-brand-neon">
            <Lightbulb className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              1. Error Summary
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {diagnosis.summary}
          </p>
        </div>

        {/* Root Cause */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              2. Root Cause
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {diagnosis.root_cause}
          </p>
        </div>
      </div>

      {/* 3. Error Location */}
      <div className="p-4 rounded-xl bg-dark-900/70 border border-dark-700 flex items-start gap-3 text-xs">
        <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">3. Identified Error Location: </span>
          <span className="font-mono text-slate-300 bg-dark-800 px-2 py-0.5 rounded border border-dark-600">
            {diagnosis.error_location || 'Referenced line in stack trace'}
          </span>
        </div>
      </div>

      {/* 4. Step-by-Step Solution */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400">
          <ListChecks className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            4. Step-by-Step Solution
          </h3>
        </div>

        <div className="space-y-2.5">
          {diagnosis.steps_to_fix && diagnosis.steps_to_fix.length > 0 ? (
            diagnosis.steps_to_fix.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-dark-850 border border-dark-750 text-xs text-slate-200"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold shrink-0 mt-0.5 text-[11px]">
                  {idx + 1}
                </div>
                <div className="flex-1 leading-relaxed">{step}</div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">Review variable scope and traceback lines.</p>
          )}
        </div>
      </div>

      {/* 5. Corrected Code */}
      {(corrected_code || diagnosis.corrected_code) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-neon">
              <Code className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                5. Corrected Code
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {source_code && (
                <button
                  onClick={() => setIsDiffModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors border border-cyan-500/20"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Show Side-by-Side Diff</span>
                </button>
              )}
              <button
                onClick={handleCopyCorrected}
                className="flex items-center gap-1.5 px-3 py-1 text-xs text-brand-neon hover:bg-emerald-500/10 rounded-lg transition-colors border border-brand-neon/20"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <CodeEditor
            value={corrected_code || diagnosis.corrected_code}
            language={language}
            readOnly={true}
            height="280px"
            title="Generated Fix"
          />
        </div>
      )}

      {/* Grid: 7. Why the Fix Works & 8. Prevention Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why the Fix Works */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              7. Why The Fix Works
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {diagnosis.why_it_works || 'Aligns syntax and runtime memory requirements with the language specification.'}
          </p>
        </div>

        {/* Prevention Tips */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              8. Prevention Tips
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {diagnosis.prevention_tips && diagnosis.prevention_tips.length > 0 ? (
              diagnosis.prevention_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand-neon mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))
            ) : (
              <li>Use defensive programming checks and automated testing.</li>
            )}
          </ul>
        </div>
      </div>

      {/* 9. Confidence and Limitations Callout */}
      <div className="p-4 rounded-xl bg-dark-900/60 border border-dark-700/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Confidence & Limitations Notice: </strong>
          {diagnosis.limitations || 'Analysis is performed based on the provided code snippet. When project dependencies or database state are involved, supplementary testing is recommended.'}
        </div>
      </div>

      {/* AI Follow-Up Chat Section */}
      <FollowUpChat analysis={analysis} language={language} />

      {/* Diff Modal */}
      <CodeComparisonModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        originalCode={source_code}
        correctedCode={corrected_code || diagnosis.corrected_code}
        language={language}
        onApplyFix={(fixedCode) => {
          if (onApplyFixToWorkspace) {
            onApplyFixToWorkspace(fixedCode);
          }
        }}
      />
    </div>
  );
};
