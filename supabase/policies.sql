-- ========================================================
-- DebugMate AI - Row Level Security (RLS) Policies
-- ========================================================

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debug_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debug_chat_messages ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- 2. Debug Analyses Policies
-- Users can view their own debug analyses
CREATE POLICY "Users can view own debug analyses"
    ON public.debug_analyses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own debug analyses
CREATE POLICY "Users can insert own debug analyses"
    ON public.debug_analyses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own debug analyses
CREATE POLICY "Users can update own debug analyses"
    ON public.debug_analyses
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own debug analyses
CREATE POLICY "Users can delete own debug analyses"
    ON public.debug_analyses
    FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Debug Chat Messages Policies
-- Users can view chat messages for analyses they own
CREATE POLICY "Users can view own debug chat messages"
    ON public.debug_chat_messages
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert chat messages for analyses they own
CREATE POLICY "Users can insert own debug chat messages"
    ON public.debug_chat_messages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own debug chat messages
CREATE POLICY "Users can delete own debug chat messages"
    ON public.debug_chat_messages
    FOR DELETE
    USING (auth.uid() = user_id);
