import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, Trash2, Code2, Maximize2, Minimize2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const CodeEditor = ({
  value,
  onChange,
  language = 'python',
  height = '320px',
  readOnly = false,
  title = 'Source Code Editor',
  placeholder = '// Paste your problematic code snippet here...'
}) => {
  const { addToast } = useNotification();
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Map user-friendly language names to Monaco Editor languages
  const getMonacoLanguage = (lang) => {
    const l = (lang || '').toLowerCase();
    if (l.includes('python')) return 'python';
    if (l.includes('javascript') || l === 'js') return 'javascript';
    if (l.includes('typescript') || l === 'ts') return 'typescript';
    if (l.includes('java')) return 'java';
    if (l.includes('c++') || l === 'cpp') return 'cpp';
    if (l.includes('c')) return 'c';
    if (l.includes('sql')) return 'sql';
    if (l.includes('html')) return 'html';
    if (l.includes('css')) return 'css';
    if (l.includes('json')) return 'json';
    return 'plaintext';
  };

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      addToast('Code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast('Failed to copy code', 'error');
    }
  };

  const handleClear = () => {
    if (onChange && !readOnly) {
      onChange('');
      addToast('Code editor cleared', 'info');
    }
  };

  return (
    <div className={`rounded-xl border border-dark-700 bg-dark-900 overflow-hidden flex flex-col transition-all ${isExpanded ? 'fixed inset-4 z-50 shadow-2xl bg-dark-950' : ''}`}>
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-850 border-b border-dark-700 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-brand-neon" />
          <span className="font-semibold text-slate-200">{title}</span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-dark-750 text-slate-400 border border-dark-600">
            {getMonacoLanguage(language)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-brand-neon" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-dark-700 transition-colors"
              title="Clear editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand full screen'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 w-full" style={{ height: isExpanded ? 'calc(100vh - 120px)' : height }}>
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={value}
          onChange={(val) => onChange && onChange(val || '')}
          theme="vs-dark"
          options={{
            readOnly,
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            minimap: { enabled: isExpanded },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            lineNumbers: 'on',
            lineDecorationsWidth: 6,
            suggestOnTriggerCharacters: true,
            wordWrap: 'on',
          }}
          loading={
            <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
              Loading Monaco Editor...
            </div>
          }
        />
      </div>
    </div>
  );
};
