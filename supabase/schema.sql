-- ========================================================
-- DebugMate AI - Database Schema for Supabase PostgreSQL
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Debug Analyses Table
CREATE TABLE IF NOT EXISTS public.debug_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    language TEXT NOT NULL,
    error_message TEXT NOT NULL,
    source_code TEXT,
    diagnosis JSONB NOT NULL,
    corrected_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Debug Chat Messages Table (Follow-up conversations)
CREATE TABLE IF NOT EXISTS public.debug_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES public.debug_analyses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_debug_analyses_user_id ON public.debug_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_debug_analyses_created_at ON public.debug_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_debug_analyses_language ON public.debug_analyses(language);
CREATE INDEX IF NOT EXISTS idx_debug_chat_messages_analysis_id ON public.debug_chat_messages(analysis_id);

-- Trigger to automatically create a profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at)
    VALUES (new.id, new.email, timezone('utc'::text, now()))
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
