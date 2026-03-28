
-- Drop the handle_new_user function and any triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop existing has_role function
DROP FUNCTION IF EXISTS public.has_role(_user_id uuid, _role app_role) CASCADE;

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can CRUD own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can CRUD own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert own memory episodes" ON public.memory_episodes;
DROP POLICY IF EXISTS "Users can read own memory episodes" ON public.memory_episodes;
DROP POLICY IF EXISTS "Users can manage own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can read own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert own benchmark runs" ON public.benchmark_runs;
DROP POLICY IF EXISTS "Users can read own benchmark runs" ON public.benchmark_runs;
DROP POLICY IF EXISTS "Users can insert own improvement logs" ON public.improvement_logs;
DROP POLICY IF EXISTS "Users can read own improvement logs" ON public.improvement_logs;
DROP POLICY IF EXISTS "Service role can read all api keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can delete own api keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can insert own api keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can read own api keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can update own api keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can read benchmark questions" ON public.benchmark_questions;

-- Drop all foreign key constraints referencing auth.users before type change
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_user_id_fkey;
ALTER TABLE public.memory_episodes DROP CONSTRAINT IF EXISTS memory_episodes_user_id_fkey;
ALTER TABLE public.goals DROP CONSTRAINT IF EXISTS goals_user_id_fkey;
ALTER TABLE public.benchmark_runs DROP CONSTRAINT IF EXISTS benchmark_runs_user_id_fkey;
ALTER TABLE public.improvement_logs DROP CONSTRAINT IF EXISTS improvement_logs_user_id_fkey;
ALTER TABLE public.api_keys DROP CONSTRAINT IF EXISTS api_keys_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

-- Alter user_id columns from uuid to text
ALTER TABLE public.conversations ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE public.memory_episodes ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE public.goals ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE public.benchmark_runs ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE public.improvement_logs ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE public.api_keys ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE public.profiles ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE public.user_roles ALTER COLUMN user_id TYPE text USING user_id::text;

-- Re-add profiles primary key
ALTER TABLE public.profiles ADD PRIMARY KEY (id);

-- Recreate has_role function with text parameter
CREATE OR REPLACE FUNCTION public.has_role(_user_id text, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create service-role-only RLS policies
CREATE POLICY "Service role full access" ON public.conversations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.memory_episodes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.goals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.benchmark_runs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.improvement_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.api_keys FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.user_roles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.benchmark_questions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can read benchmark questions" ON public.benchmark_questions FOR SELECT TO anon, authenticated USING (true);

-- Create admin_insights table
CREATE TABLE public.admin_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type text NOT NULL DEFAULT 'pattern',
  category text NOT NULL DEFAULT 'general',
  description text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  applied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.admin_insights FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create learning_patterns table
CREATE TABLE public.learning_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type text NOT NULL DEFAULT 'common_question',
  pattern_data jsonb NOT NULL DEFAULT '{}',
  frequency integer NOT NULL DEFAULT 1,
  confidence_score numeric NOT NULL DEFAULT 0.5,
  applied_to_prompt_version integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.learning_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.learning_patterns FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create prompt_evolutions table
CREATE TABLE public.prompt_evolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version integer NOT NULL DEFAULT 1,
  prompt_text text NOT NULL,
  source_insights jsonb NOT NULL DEFAULT '[]',
  performance_delta numeric DEFAULT 0,
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.prompt_evolutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.prompt_evolutions FOR ALL TO service_role USING (true) WITH CHECK (true);
