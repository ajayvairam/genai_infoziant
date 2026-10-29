import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare, Trash2, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { debugApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export const FollowUpChat = ({ analysis, language }) => {
  const { addToast } = useNotification();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "Why did this error occur?",
    "Explain the fix in simple terms",
    "Can you provide another solution?",
    "Explain the corrected code line by line",
    "How can I prevent this error in the future?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    setInputValue('');
    const userMsg = { role: 'user', message: query, created_at: new Date().toISOString() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const errorContext = {
        language: analysis.language || language,
        error_message: analysis.error_message,
        summary: analysis.diagnosis?.summary,
        root_cause: analysis.diagnosis?.root_cause,
        source_code: analysis.source_code,
        corrected_code: analysis.corrected_code,
      };

      const res = await debugApi.sendFollowupChat({
        analysisId: analysis.id,
        message: query,
        errorContext,
        chatHistory: updatedMessages,
      });

      const assistantMsg = {
        role: 'assistant',
        message: res.reply || 'No response generated.',
        created_at: res.created_at || new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Follow-up chat failed:', err);
      addToast('Failed to receive response from AI', 'error');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          message: '⚠️ Sorry, an error occurred while connecting to the AI assistant. Please ensure the backend is running and GEMINI_API_KEY is configured.',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-900/90 shadow-xl overflow-hidden mt-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-dark-850 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-neon/10 border border-brand-neon/20 text-brand-neon">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI Follow-Up Assistant</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-brand-neon border border-brand-neon/30">
                Context-Aware
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Ask follow-up questions, request alternative fixes, or get line-by-line breakdowns.
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-6 py-3 bg-dark-900/50 border-b border-dark-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-neon" />
          Quick Ask:
        </span>
        <div className="flex gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-dark-800 hover:bg-dark-700 hover:border-brand-neon/40 text-slate-300 hover:text-white border border-dark-700 transition-all text-left disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Bot className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-60" />
            <p className="text-sm font-medium text-slate-400">Have questions about this error?</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Select a quick prompt above or type your question below. The AI has the full context of this stack trace and code.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 text-xs leading-relaxed animate-in fade-in duration-150 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-brand-neon/30 flex items-center justify-center text-brand-neon shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-brand-neon text-dark-950 font-medium rounded-br-none shadow-md'
                    : 'bg-dark-800 border border-dark-700 text-slate-200 rounded-bl-none prose prose-invert max-w-none'
                }`}
              >
                {msg.role === 'user' ? (
                  <p>{msg.message}</p>
                ) : (
                  <div className="text-slate-200 space-y-2">
                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-brand-neon/30 flex items-center justify-center text-brand-neon shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-bl-none px-4 py-3 bg-dark-800 border border-dark-700 text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-neon" />
              <span>Analyzing follow-up question...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 bg-dark-850 border-t border-dark-700 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about this error or fix (e.g. 'Can you explain line 3?')..."
          disabled={isLoading}
          className="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-neon text-dark-950 font-bold hover:bg-emerald-400 transition-colors disabled:opacity-40 disabled:hover:bg-brand-neon shrink-0 shadow-glow-subtle"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
