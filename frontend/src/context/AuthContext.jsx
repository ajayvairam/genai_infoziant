import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // 1. Check Supabase session if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setIsGuest(false);
        } else {
          checkGuestSession();
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setIsGuest(false);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      checkGuestSession();
      setLoading(false);
    }
  }, []);

  const checkGuestSession = () => {
    let guestToken = localStorage.getItem('debugmate_guest_token');
    let guestEmail = localStorage.getItem('debugmate_guest_email');
    if (!guestToken) {
      guestToken = `guest-${Math.random().toString(36).substring(2, 9)}`;
      guestEmail = `guest_${guestToken.substring(6)}@debugmate.local`;
      localStorage.setItem('debugmate_guest_token', guestToken);
      localStorage.setItem('debugmate_guest_email', guestEmail);
    }
    setUser({
      id: guestToken,
      email: guestEmail || 'guest@debugmate.local',
      user_metadata: { name: 'Demo Developer' }
    });
    setIsGuest(true);
  };

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      // Offline/Local demo sign-in
      const mockId = `usr-${Math.abs(email.split('').reduce((a,b)=>((a<<5)-a)+b.charCodeAt(0),0)) % 100000}`;
      const mockUser = { id: mockId, email, user_metadata: { name: email.split('@')[0] } };
      localStorage.setItem('debugmate_guest_token', mockId);
      localStorage.setItem('debugmate_guest_email', email);
      setUser(mockUser);
      setIsGuest(false);
      return { data: { user: mockUser }, error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      setUser(data.user);
      setIsGuest(false);
    }
    return { data, error };
  };

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      // Offline/Local demo sign-up
      const mockId = `usr-${Date.now().toString(36)}`;
      const mockUser = { id: mockId, email, user_metadata: { name: email.split('@')[0] } };
      localStorage.setItem('debugmate_guest_token', mockId);
      localStorage.setItem('debugmate_guest_email', email);
      setUser(mockUser);
      setIsGuest(false);
      return { data: { user: mockUser }, error: null };
    }
    return await supabase.auth.signUp({ email, password });
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    // Reset to fresh guest session
    localStorage.removeItem('debugmate_guest_token');
    localStorage.removeItem('debugmate_guest_email');
    checkGuestSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isGuest,
        loading,
        isSupabaseConfigured,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

