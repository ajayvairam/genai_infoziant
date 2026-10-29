import React, { useState } from 'react';
import { X, Lock, Mail, UserPlus, LogIn, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp, isSupabaseConfigured } = useAuth();
  const { addToast } = useNotification();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          addToast('Successfully signed in!', 'success');
          closeAuthModal();
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          addToast('Account created successfully! Check your email or sign in.', 'success');
          setMode('signin');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-dark-700 bg-dark-900 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-neon/10 border border-brand-neon/30 text-brand-neon shadow-glow-subtle mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Sign in to DebugMate AI' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Save debugging histories, track error analytics, and access AI follow-up chat.
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex rounded-xl bg-dark-950 p-1 border border-dark-700 mb-6 text-xs font-semibold">
          <button
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-dark-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-dark-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full bg-dark-950 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-dark-950 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-neon text-dark-950 font-bold hover:bg-emerald-400 transition-colors shadow-glow-subtle mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-dark-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2">
            Testing for evaluation or college demonstration?
          </p>
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs font-semibold text-brand-neon hover:underline"
          >
            Continue in Guest Demo Mode →
          </button>
        </div>
      </div>
    </div>
  );
};
