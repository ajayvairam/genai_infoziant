import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { X, Copy, Check, GitCompare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const CodeComparisonModal = ({
  isOpen,
  onClose,
  originalCode = '',
  correctedCode = '',
  language = 'python',
  onApplyFix
}) => {
  const { addToast } = useNotification();
  const [copied, setCopied] = useState(false);
  const [renderSideBySide, setRenderSideBySide] = useState(true);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(correctedCode);
      setCopied(true);
      addToast('Corrected code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast('Failed to copy code', 'error');
    }
  };

  const handleApply = () => {
    if (onApplyFix) {
      onApplyFix(correctedCode);
      addToast('Fix applied to your editor!', 'success');
      onClose();
    }
  };

  const getMonacoLanguage = (lang) => {
    const l = (lang || '').toLowerCase();
    if (l.includes('python')) return 'python';
    if (l.includes('javascript') || l === 'js') return 'javascript';
    if (l.includes('typescript') || l === 'ts') return 'typescript';
    if (l.includes('java')) return 'java';
    if (l.includes('c++') || l === 'cpp') return 'cpp';
    if (l.includes('c')) return 'c';
    if (l.includes('sql')) return 'sql';
    return 'plaintext';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[85vh] flex flex-col rounded-2xl border border-dark-700 bg-dark-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 bg-dark-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-brand-neon">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Code Comparison & Diff</span>
                <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded bg-dark-800 border border-dark-700">
                  Original (Left) vs Corrected (Right)
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Review the changes made by the AI debugger before copying or applying.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => setRenderSideBySide(!renderSideBySide)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-dark-600 bg-dark-800 text-slate-300 hover:text-white transition-colors"
            >
              {renderSideBySide ? 'Switch to Inline View' : 'Switch to Side-by-Side'}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-200 border border-dark-600 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-neon" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Corrected'}</span>
            </button>

            {onApplyFix && (
              <button
                onClick={handleApply}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-neon text-dark-950 hover:bg-emerald-400 transition-colors shadow-glow-subtle"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply to Editor</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diff Editor Container */}
        <div className="relative flex-1 w-full bg-dark-900">
          <DiffEditor
            height="100%"
            language={getMonacoLanguage(language)}
            original={originalCode || '// (No original code provided)'}
            modified={correctedCode || '// (No corrected code generated)'}
            theme="vs-dark"
            options={{
              readOnly: true,
              renderSideBySide,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              diffWordWrap: 'on',
            }}
            loading={
              <div className="flex items-center justify-center h-full text-slate-500 font-mono text-sm">
                Generating Diff View...
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
