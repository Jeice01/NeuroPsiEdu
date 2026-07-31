-- Consolidated Supabase schema for official ProjetoOrbis
-- This migration is intended for a clean Supabase instance.
-- It is written with idempotency in mind for types, tables, functions,
-- triggers, policies, indexes, and storage bucket initialization.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'project_manager', 'team_member', 'client');
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
    CREATE TYPE public.project_status AS ENUM ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'cancelled');
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
    CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_type') THEN
    CREATE TYPE public.plan_type AS ENUM ('free', 'basic', 'pro', 'enterprise');
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pmbok_domain') THEN
    CREATE TYPE public.pmbok_domain AS ENUM (
      'stakeholders',
      'team',
      'planning',
      'project_work',
      'delivery',
      'measurement',
      'uncertainty'
    );
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'health_status') THEN
    CREATE TYPE public.health_status AS ENUM (
      'critical',
      'high_risk',
      'medium_risk',
      'low_risk',
      'healthy'
    );
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subtask_status') THEN
    CREATE TYPE public.subtask_status AS ENUM ('pending', 'in_progress', 'completed');
  END IF;
END$$;
-- Core tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  accepted_policy_version TEXT,
  privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE,
  terms_of_use_accepted_at TIMESTAMP WITH TIME ZONE,
  is_google_drive_connected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  status project_status DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2) DEFAULT 0,
  generated_value DECIMAL(12,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  due_date DATE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  status subtask_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view subtasks of accessible tasks" ON public.subtasks;
DROP POLICY IF EXISTS "Authorized users can create subtasks" ON public.subtasks;
DROP POLICY IF EXISTS "Authorized users can update subtasks" ON public.subtasks;
DROP POLICY IF EXISTS "Admins and project managers can delete subtasks" ON public.subtasks;
CREATE TABLE IF NOT EXISTS public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  subtask_id UUID REFERENCES public.subtasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.project_members (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);
CREATE TABLE IF NOT EXISTS public.project_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  cost_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  is_google_drive_file BOOLEAN NOT NULL DEFAULT false,
  google_drive_file_id TEXT,
  google_drive_icon_url TEXT,
  google_drive_web_view_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT task_or_project_attachment_check CHECK (
    (task_id IS NOT NULL AND project_id IS NULL)
    OR (task_id IS NULL AND project_id IS NOT NULL)
  )
);
CREATE TABLE IF NOT EXISTS public.comment_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  mentioned_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(comment_id, mentioned_user_id)
);
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type plan_type NOT NULL UNIQUE,
  price NUMERIC NOT NULL DEFAULT 0,
  max_projects INTEGER NOT NULL,
  max_tasks_per_project INTEGER NOT NULL,
  max_invites INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type plan_type NOT NULL DEFAULT 'free',
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);
CREATE TABLE IF NOT EXISTS public.project_pmbok_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  domain pmbok_domain NOT NULL,
  cpi NUMERIC DEFAULT 1.0,
  spi NUMERIC DEFAULT 1.0,
  earned_value NUMERIC DEFAULT 0,
  planned_value NUMERIC DEFAULT 0,
  actual_cost NUMERIC DEFAULT 0,
  completion_percentage NUMERIC DEFAULT 0,
  risk_level health_status DEFAULT 'low_risk',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, domain)
);
CREATE TABLE IF NOT EXISTS public.pmbok_standard_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain pmbok_domain NOT NULL,
  knowledge_area TEXT NOT NULL,
  process_group TEXT NOT NULL,
  task_name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER,
  is_mandatory BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.project_pmbok_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  standard_task_id UUID NOT NULL REFERENCES public.pmbok_standard_tasks(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, standard_task_id)
);
CREATE TABLE IF NOT EXISTS public.project_closure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  closed_by UUID NOT NULL REFERENCES auth.users(id),
  closure_date DATE NOT NULL,
  final_budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  final_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  final_roi DECIMAL(12,2) NOT NULL DEFAULT 0,
  stakeholder_satisfaction INTEGER,
  benefits_achieved TEXT,
  deliverables_summary TEXT,
  success_metrics TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(project_id)
);
CREATE TABLE IF NOT EXISTS public.project_lessons_learned (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  lesson TEXT NOT NULL,
  impact_level TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.tap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  patrocinador TEXT NOT NULL,
  justificativa TEXT NOT NULL,
  objetivos TEXT NOT NULL,
  aprovado BOOLEAN NOT NULL DEFAULT false,
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  beneficios TEXT,
  indicadores TEXT,
  premissas TEXT,
  restricoes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(project_id)
);
-- Enable row level security for protected tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_pmbok_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pmbok_standard_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_pmbok_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_closure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_lessons_learned ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tap ENABLE ROW LEVEL SECURITY;
-- Core utility functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = ANY(_roles)
  );
$$;
CREATE OR REPLACE FUNCTION public.is_project_member(_user_id UUID, _project_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE user_id = _user_id AND project_id = _project_id
  );
$$;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'team_member');

  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan_type)
  VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.check_project_limit(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max_projects INTEGER;
  v_current_projects INTEGER;
BEGIN
  IF auth.uid() IS NULL OR (auth.uid() <> _user_id AND NOT has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT p.max_projects INTO v_max_projects
  FROM public.user_subscriptions us
  JOIN public.plans p ON us.plan_type = p.type
  WHERE us.user_id = _user_id;

  SELECT COUNT(*) INTO v_current_projects
  FROM public.projects
  WHERE created_by = _user_id
    AND status != 'deleted';

  RETURN v_current_projects < v_max_projects;
END;
$$;
CREATE OR REPLACE FUNCTION public.check_task_limit(_project_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max_tasks INTEGER;
  v_current_tasks INTEGER;
  v_user_id UUID;
BEGIN
  IF auth.uid() IS NULL OR (
    NOT has_role(auth.uid(), 'admin'::app_role)
    AND NOT EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = _project_id
        AND (p.created_by = auth.uid() OR is_project_member(auth.uid(), _project_id))
    )
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT created_by INTO v_user_id FROM public.projects WHERE id = _project_id;

  SELECT p.max_tasks_per_project INTO v_max_tasks
  FROM public.user_subscriptions us
  JOIN public.plans p ON us.plan_type = p.type
  WHERE us.user_id = v_user_id;

  SELECT COUNT(*) INTO v_current_tasks
  FROM public.tasks
  WHERE project_id = _project_id
    AND status != 'cancelled';

  RETURN v_current_tasks < v_max_tasks;
END;
$$;
CREATE OR REPLACE FUNCTION public.check_invite_limit(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max_invites INTEGER;
  v_current_invites INTEGER;
BEGIN
  IF auth.uid() IS NULL OR (auth.uid() <> _user_id AND NOT has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT p.max_invites INTO v_max_invites
  FROM public.user_subscriptions us
  JOIN public.plans p ON us.plan_type = p.type
  WHERE us.user_id = _user_id;

  SELECT COUNT(*) INTO v_current_invites
  FROM public.user_subscriptions
  WHERE invited_by = _user_id;

  RETURN v_current_invites < v_max_invites;
END;
$$;
CREATE OR REPLACE FUNCTION public.notify_mentioned_users()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_project_id UUID;
  v_task_title TEXT;
  v_commenter_name TEXT;
BEGIN
  SELECT t.project_id, t.title, p.full_name
  INTO v_project_id, v_task_title, v_commenter_name
  FROM public.comments c
  JOIN public.tasks t ON c.task_id = t.id
  JOIN public.profiles p ON c.user_id = p.id
  WHERE c.id = NEW.comment_id;

  INSERT INTO public.notifications (user_id, project_id, message)
  VALUES (
    NEW.mentioned_user_id,
    v_project_id,
    v_commenter_name || ' mencionou você em "' || v_task_title || '"'
  );

  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.update_subtask_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.completed_at IS NULL THEN
    NEW.completed_at = NOW();
  END IF;

  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
  END IF;

  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.calculate_task_progress(task_uuid UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_subtasks INTEGER;
  v_progress NUMERIC;
BEGIN
  SELECT COUNT(*) INTO v_total_subtasks
  FROM public.subtasks
  WHERE task_id = task_uuid;

  IF v_total_subtasks = 0 THEN
    RETURN NULL;
  END IF;

  SELECT (
    SUM(CASE
      WHEN status = 'pending' THEN 0
      WHEN status = 'in_progress' THEN 50
      WHEN status = 'completed' THEN 100
      ELSE 0
    END)::NUMERIC / v_total_subtasks
  ) INTO v_progress
  FROM public.subtasks
  WHERE task_id = task_uuid;

  RETURN ROUND(v_progress, 2);
END;
$$;
CREATE OR REPLACE FUNCTION public.update_parent_task_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_subtasks INTEGER;
  v_completed_subtasks INTEGER;
  v_in_progress_subtasks INTEGER;
BEGIN
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'in_progress')
  INTO v_total_subtasks, v_completed_subtasks, v_in_progress_subtasks
  FROM public.subtasks
  WHERE task_id = COALESCE(NEW.task_id, OLD.task_id);

  IF v_total_subtasks > 0 AND v_completed_subtasks = v_total_subtasks THEN
    UPDATE public.tasks
    SET status = 'done'
    WHERE id = COALESCE(NEW.task_id, OLD.task_id)
      AND status != 'done';
  ELSIF v_in_progress_subtasks > 0 THEN
    UPDATE public.tasks
    SET status = 'in_progress'
    WHERE id = COALESCE(NEW.task_id, OLD.task_id)
      AND status = 'todo';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;
-- Trigger definitions
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_time_entries_updated_at ON public.time_entries;
CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON public.time_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_project_costs_updated_at ON public.project_costs;
CREATE TRIGGER update_project_costs_updated_at
  BEFORE UPDATE ON public.project_costs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_plans_updated_at ON public.plans;
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_project_pmbok_metrics_updated_at ON public.project_pmbok_metrics;
CREATE TRIGGER update_project_pmbok_metrics_updated_at
  BEFORE UPDATE ON public.project_pmbok_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_project_pmbok_checklist_updated_at ON public.project_pmbok_checklist;
CREATE TRIGGER update_project_pmbok_checklist_updated_at
  BEFORE UPDATE ON public.project_pmbok_checklist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_project_closure_updated_at ON public.project_closure;
CREATE TRIGGER update_project_closure_updated_at
  BEFORE UPDATE ON public.project_closure
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_tap_updated_at ON public.tap;
CREATE TRIGGER update_tap_updated_at
  BEFORE UPDATE ON public.tap
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();
DROP TRIGGER IF EXISTS trigger_notify_mentions ON public.comment_mentions;
CREATE TRIGGER trigger_notify_mentions
  AFTER INSERT ON public.comment_mentions
  FOR EACH ROW EXECUTE FUNCTION public.notify_mentioned_users();
DROP TRIGGER IF EXISTS update_subtasks_updated_at ON public.subtasks;
CREATE TRIGGER update_subtasks_updated_at
  BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_subtask_status_timestamps ON public.subtasks;
CREATE TRIGGER update_subtask_status_timestamps
  BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.update_subtask_timestamps();
DROP TRIGGER IF EXISTS update_parent_task_on_subtask_change ON public.subtasks;
CREATE TRIGGER update_parent_task_on_subtask_change
  AFTER INSERT OR UPDATE OR DELETE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.update_parent_task_status();
-- RLS policies for profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles of project members" ON public.profiles;
DROP POLICY IF EXISTS "view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "view_project_members_profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
-- RLS policies for user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;
-- RLS policies for projects
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view their own projects or projects they are members of" ON public.projects;
-- RLS policies for tasks
DROP POLICY IF EXISTS "Anyone authenticated can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view tasks from their projects" ON public.tasks;
DROP POLICY IF EXISTS "Admins, project managers, and team members can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins, project managers, and assigned users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins and project managers can delete tasks" ON public.tasks;
-- RLS policies for comments
DROP POLICY IF EXISTS "Anyone authenticated can view comments" ON public.comments;
DROP POLICY IF EXISTS "Users can view comments on accessible tasks" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments or admins can delete any" ON public.comments;
-- RLS policies for time_entries
DROP POLICY IF EXISTS "Users can view own time entries or admins/managers can view all" ON public.time_entries;
DROP POLICY IF EXISTS "Users can view time entries based on role" ON public.time_entries;
DROP POLICY IF EXISTS "Users can create own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can update own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can delete own time entries or admins can delete any" ON public.time_entries;
-- RLS policies for project_members
DROP POLICY IF EXISTS "Project creators can add members" ON public.project_members;
DROP POLICY IF EXISTS "Project creators can remove members" ON public.project_members;
DROP POLICY IF EXISTS "Members can view project members" ON public.project_members;
DROP POLICY IF EXISTS "Users can view members of their projects" ON public.project_members;
-- RLS policies for project_costs
DROP POLICY IF EXISTS "Users can view costs of their projects" ON public.project_costs;
DROP POLICY IF EXISTS "Admins and project managers can create costs" ON public.project_costs;
DROP POLICY IF EXISTS "Admins and project managers can update costs" ON public.project_costs;
DROP POLICY IF EXISTS "Admins and project managers can delete costs" ON public.project_costs;
-- RLS policies for notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "restrict_notification_creation" ON public.notifications;
-- RLS policies for task attachments
DROP POLICY IF EXISTS "Users can view attachments from accessible tasks" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can create attachments for accessible tasks" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can view task or project attachments" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can create task or project attachments" ON public.task_attachments;
-- RLS policies for comment_mentions
DROP POLICY IF EXISTS "Users can view their own mentions" ON public.comment_mentions;
DROP POLICY IF EXISTS "Comment authors can create mentions" ON public.comment_mentions;
-- RLS policies for plans and subscriptions
DROP POLICY IF EXISTS "Anyone can view plans" ON public.plans;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins can update subscriptions" ON public.user_subscriptions;
-- RLS policies for PMBOK metrics
DROP POLICY IF EXISTS "Users can view PMBOK metrics of their projects" ON public.project_pmbok_metrics;
DROP POLICY IF EXISTS "Admins and project managers can insert PMBOK metrics" ON public.project_pmbok_metrics;
DROP POLICY IF EXISTS "Admins and project managers can update PMBOK metrics" ON public.project_pmbok_metrics;
DROP POLICY IF EXISTS "Admins and project managers can delete PMBOK metrics" ON public.project_pmbok_metrics;
-- RLS policies for reference PMBOK tasks
DROP POLICY IF EXISTS "Anyone can view PMBOK standard tasks" ON public.pmbok_standard_tasks;
DROP POLICY IF EXISTS "Admins can manage PMBOK standard tasks" ON public.pmbok_standard_tasks;
-- RLS policies for project PMBOK checklist
DROP POLICY IF EXISTS "Users can view project PMBOK checklist" ON public.project_pmbok_checklist;
DROP POLICY IF EXISTS "Admins and project managers can manage project PMBOK checklist" ON public.project_pmbok_checklist;
-- RLS policies for project closure
DROP POLICY IF EXISTS "Users can view project closure" ON public.project_closure;
DROP POLICY IF EXISTS "Admins and project managers can manage closure" ON public.project_closure;
-- RLS policies for project lessons learned
DROP POLICY IF EXISTS "Users can view lessons learned" ON public.project_lessons_learned;
DROP POLICY IF EXISTS "Users can manage lessons learned" ON public.project_lessons_learned;
-- RLS policies for TAP
DROP POLICY IF EXISTS "Users can view TAP" ON public.tap;
DROP POLICY IF EXISTS "Users can manage TAP" ON public.tap;
DROP POLICY IF EXISTS "Admins can delete TAP" ON public.tap;
-- Consolidated RLS policies moved here by script

CREATE POLICY "Users can view subtasks of accessible tasks"
  ON public.subtasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = subtasks.task_id
      AND (
        t.assigned_to = auth.uid()
        OR t.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.project_members pm
          WHERE pm.project_id = t.project_id
          AND pm.user_id = auth.uid()
        )
      )
    )
  );
CREATE POLICY "Authorized users can create subtasks"
  ON public.subtasks
  FOR INSERT
  WITH CHECK (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role, 'team_member'::app_role])
    AND auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = subtasks.task_id
      AND (
        t.assigned_to = auth.uid()
        OR t.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.project_members pm
          WHERE pm.project_id = t.project_id
          AND pm.user_id = auth.uid()
        )
      )
    )
  );
CREATE POLICY "Authorized users can update subtasks"
  ON public.subtasks
  FOR UPDATE
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    OR auth.uid() = assigned_to
    OR auth.uid() = created_by
  );
CREATE POLICY "Admins and project managers can delete subtasks"
  ON public.subtasks
  FOR DELETE
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
  );
CREATE POLICY "view_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "view_project_members_profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM public.project_members pm1
        JOIN public.project_members pm2 ON pm1.project_id = pm2.project_id
        WHERE pm1.user_id = auth.uid() AND pm2.user_id = profiles.id
      )
      OR EXISTS (
        SELECT 1 FROM public.tasks t
        WHERE (t.assigned_to = profiles.id OR t.created_by = profiles.id)
          AND (
            t.assigned_to = auth.uid()
            OR t.created_by = auth.uid()
            OR public.is_project_member(auth.uid(), t.project_id)
          )
      )
      OR EXISTS (
        SELECT 1 FROM public.projects p
        JOIN public.project_members pm ON p.id = pm.project_id
        WHERE p.created_by = auth.uid() AND pm.user_id = profiles.id
      )
    )
  );
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update roles"
  ON public.user_roles AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete roles"
  ON public.user_roles AS RESTRICTIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated users can create projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can view their own projects or projects they are members of"
  ON public.projects FOR SELECT TO authenticated
  USING (
    auth.uid() = created_by
    OR public.is_project_member(auth.uid(), id)
  );
CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE TO authenticated
  USING (auth.uid() = created_by);
CREATE POLICY "Users can view tasks from their projects"
  ON public.tasks FOR SELECT TO authenticated
  USING (
    auth.uid() IS NOT NULL AND (
      (project_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = tasks.project_id
          AND projects.created_by = auth.uid()
      ))
      OR (project_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_members.project_id = tasks.project_id
          AND project_members.user_id = auth.uid()
      ))
      OR auth.uid() = assigned_to
      OR (project_id IS NULL AND (auth.uid() = created_by OR auth.uid() = assigned_to))
    )
  );
CREATE POLICY "Admins, project managers, and team members can create tasks"
  ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role, 'team_member'::app_role])
  );
CREATE POLICY "Admins, project managers, and assigned users can update tasks"
  ON public.tasks FOR UPDATE TO authenticated
  USING (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    OR auth.uid() = assigned_to
  );
CREATE POLICY "Admins and project managers can delete tasks"
  ON public.tasks FOR DELETE TO authenticated
  USING (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
  );
CREATE POLICY "Users can view comments on accessible tasks"
  ON public.comments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = comments.task_id
        AND (
          t.assigned_to = auth.uid()
          OR t.created_by = auth.uid()
          OR (t.project_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = t.project_id
              AND p.created_by = auth.uid()
          ))
          OR (t.project_id IS NOT NULL AND public.is_project_member(auth.uid(), t.project_id))
        )
    )
  );
CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments or admins can delete any"
  ON public.comments FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );
CREATE POLICY "Users can view time entries based on role"
  ON public.time_entries FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR (
      public.has_role(auth.uid(), 'project_manager'::app_role)
      AND EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.projects p ON t.project_id = p.id
        WHERE t.id = time_entries.task_id
          AND p.created_by = auth.uid()
      )
    )
  );
CREATE POLICY "Users can create own time entries"
  ON public.time_entries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own time entries"
  ON public.time_entries FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own time entries or admins can delete any"
  ON public.time_entries FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );
CREATE POLICY "Project creators can add members"
  ON public.project_members FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );
CREATE POLICY "Project creators can remove members"
  ON public.project_members FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );
CREATE POLICY "Members can view project members"
  ON public.project_members FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );
CREATE POLICY "Users can view members of their projects"
  ON public.project_members FOR SELECT TO authenticated
  USING (public.is_project_member(auth.uid(), project_id));
CREATE POLICY "Users can view costs of their projects"
  ON public.project_costs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_costs.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Admins and project managers can create costs"
  ON public.project_costs FOR INSERT TO authenticated
  WITH CHECK (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    AND auth.uid() = created_by
  );
CREATE POLICY "Admins and project managers can update costs"
  ON public.project_costs FOR UPDATE TO authenticated
  USING (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_costs.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Admins and project managers can delete costs"
  ON public.project_costs FOR DELETE TO authenticated
  USING (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_costs.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "restrict_notification_creation"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (false);
CREATE POLICY "Users can view task or project attachments"
  ON public.task_attachments FOR SELECT TO authenticated
  USING (
    (task_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_attachments.task_id
        AND (
          t.assigned_to = auth.uid()
          OR t.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.project_members pm
            WHERE pm.project_id = t.project_id
              AND pm.user_id = auth.uid()
          )
        )
    ))
    OR (project_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = task_attachments.project_id
        AND (
          p.created_by = auth.uid()
          OR public.is_project_member(auth.uid(), p.id)
        )
    ))
  );
CREATE POLICY "Users can create task or project attachments"
  ON public.task_attachments FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = uploaded_by
    AND (
      (task_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.tasks t
        WHERE t.id = task_attachments.task_id
          AND (
            t.assigned_to = auth.uid()
            OR t.created_by = auth.uid()
            OR EXISTS (
              SELECT 1 FROM public.project_members pm
              WHERE pm.project_id = t.project_id
                AND pm.user_id = auth.uid()
            )
          )
      ))
      OR (project_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = task_attachments.project_id
          AND (
            p.created_by = auth.uid()
            OR public.is_project_member(auth.uid(), p.id)
          )
      ))
    )
  );
CREATE POLICY "Users can delete their own attachments"
  ON public.task_attachments FOR DELETE TO authenticated
  USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can view their own mentions"
  ON public.comment_mentions FOR SELECT TO authenticated
  USING (auth.uid() = mentioned_user_id);
CREATE POLICY "Comment authors can create mentions"
  ON public.comment_mentions FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.comments
      WHERE comments.id = comment_mentions.comment_id
        AND comments.user_id = auth.uid()
    )
  );
CREATE POLICY "Anyone can view plans"
  ON public.plans FOR SELECT
  USING (true);
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions"
  ON public.user_subscriptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update subscriptions"
  ON public.user_subscriptions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view PMBOK metrics of their projects"
  ON public.project_pmbok_metrics FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_pmbok_metrics.project_id
        AND (projects.created_by = auth.uid() OR public.is_project_member(auth.uid(), projects.id))
    )
  );
CREATE POLICY "Admins and project managers can insert PMBOK metrics"
  ON public.project_pmbok_metrics FOR INSERT TO authenticated
  WITH CHECK (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_pmbok_metrics.project_id
        AND (projects.created_by = auth.uid() OR public.is_project_member(auth.uid(), projects.id))
    )
  );
CREATE POLICY "Admins and project managers can update PMBOK metrics"
  ON public.project_pmbok_metrics FOR UPDATE TO authenticated
  USING (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_pmbok_metrics.project_id
        AND (projects.created_by = auth.uid() OR public.is_project_member(auth.uid(), projects.id))
    )
  );
CREATE POLICY "Admins and project managers can delete PMBOK metrics"
  ON public.project_pmbok_metrics FOR DELETE TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role]));
CREATE POLICY "Anyone can view PMBOK standard tasks"
  ON public.pmbok_standard_tasks FOR SELECT
  USING (true);
CREATE POLICY "Admins can manage PMBOK standard tasks"
  ON public.pmbok_standard_tasks FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view project PMBOK checklist"
  ON public.project_pmbok_checklist FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_pmbok_checklist.project_id
        AND (projects.created_by = auth.uid() OR public.is_project_member(auth.uid(), projects.id))
    )
  );
CREATE POLICY "Admins and project managers can manage project PMBOK checklist"
  ON public.project_pmbok_checklist FOR INSERT TO authenticated
  WITH CHECK (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_pmbok_checklist.project_id
        AND (projects.created_by = auth.uid() OR public.is_project_member(auth.uid(), projects.id))
    )
  );
CREATE POLICY "Admins and project managers can update project PMBOK checklist"
  ON public.project_pmbok_checklist FOR UPDATE TO authenticated
  USING (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_pmbok_checklist.project_id
        AND (projects.created_by = auth.uid() OR public.is_project_member(auth.uid(), projects.id))
    )
  );
CREATE POLICY "Admins and project managers can delete project PMBOK checklist"
  ON public.project_pmbok_checklist FOR DELETE TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role]));
CREATE POLICY "Users can view project closure"
  ON public.project_closure FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_closure.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Admins and project managers can manage closure"
  ON public.project_closure FOR INSERT TO authenticated
  WITH CHECK (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_closure.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Admins and project managers can update closure"
  ON public.project_closure FOR UPDATE TO authenticated
  USING (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_closure.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Admins and project managers can delete closure"
  ON public.project_closure FOR DELETE TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role]));
CREATE POLICY "Users can view lessons learned"
  ON public.project_lessons_learned FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_lessons_learned.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Users can manage lessons learned"
  ON public.project_lessons_learned FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_lessons_learned.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Users can update lessons learned"
  ON public.project_lessons_learned FOR UPDATE TO authenticated
  USING (
    auth.uid() = created_by
    OR public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
  );
CREATE POLICY "Users can delete lessons learned"
  ON public.project_lessons_learned FOR DELETE TO authenticated
  USING (
    auth.uid() = created_by
    OR public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
  );
CREATE POLICY "Users can view TAP"
  ON public.tap FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tap.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Users can manage TAP"
  ON public.tap FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tap.project_id
        AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
    )
  );
CREATE POLICY "Admins and project managers can update TAP"
  ON public.tap FOR UPDATE TO authenticated
  USING (
    public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role])
    OR auth.uid() = created_by
  );
CREATE POLICY "Admins and project managers can delete TAP"
  ON public.tap FOR DELETE TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'project_manager'::app_role]));
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users can upload attachments to authorized tasks/projects"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'task-attachments'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.task_attachments ta
      WHERE ta.file_path = storage.objects.name
        AND ta.uploaded_by = auth.uid()
        AND (
          (ta.task_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = ta.task_id
              AND (
                t.assigned_to = auth.uid()
                OR t.created_by = auth.uid()
                OR (t.project_id IS NOT NULL AND public.is_project_member(auth.uid(), t.project_id))
              )
          ))
          OR (ta.project_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = ta.project_id
              AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
          ))
        )
    )
  );
CREATE POLICY "Users can view authorized task or project attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'task-attachments'
    AND EXISTS (
      SELECT 1 FROM public.task_attachments ta
      WHERE ta.file_path = storage.objects.name
        AND (
          (ta.task_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = ta.task_id
              AND (
                t.assigned_to = auth.uid()
                OR t.created_by = auth.uid()
                OR (t.project_id IS NOT NULL AND public.is_project_member(auth.uid(), t.project_id))
              )
          ))
          OR (ta.project_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = ta.project_id
              AND (p.created_by = auth.uid() OR public.is_project_member(auth.uid(), p.id))
          ))
        )
    )
  );
CREATE POLICY "Users can delete their own attachments from storage"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'task-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
-- Storage bucket initialization
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', false)
ON CONFLICT (id) DO NOTHING;
-- Storage policies for avatars
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
-- Storage policies for task attachments
DROP POLICY IF EXISTS "Users can upload attachments to authorized tasks/projects" ON storage.objects;
DROP POLICY IF EXISTS "Users can view authorized task or project attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments from storage" ON storage.objects;
-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON public.task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_attachments_comment_id ON public.task_attachments(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_mentions_comment_id ON public.comment_mentions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_mentions_user_id ON public.comment_mentions(mentioned_user_id);
CREATE INDEX IF NOT EXISTS idx_task_attachments_google_drive ON public.task_attachments(is_google_drive_file) WHERE is_google_drive_file = true;
CREATE INDEX IF NOT EXISTS idx_project_pmbok_metrics_project_id ON public.project_pmbok_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_project_pmbok_metrics_domain ON public.project_pmbok_metrics(domain);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON public.subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_assigned_to ON public.subtasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_subtasks_status ON public.subtasks(status);
-- Seed plan data
INSERT INTO public.plans (name, type, price, max_projects, max_tasks_per_project, max_invites)
VALUES
  ('Plano Free', 'free', 0, 1, 5, 2),
  ('Plano Basic', 'basic', 29.90, 5, 50, 10),
  ('Plano Pro', 'pro', 99.90, 20, 200, 50),
  ('Plano Enterprise', 'enterprise', 299.90, 999, 9999, 999)
ON CONFLICT (type) DO NOTHING;
-- Revoke execute on internal helpers from anon/public
REVOKE EXECUTE ON FUNCTION public.check_project_limit(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.check_task_limit(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.check_invite_limit(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.calculate_task_progress(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_project_member(uuid, uuid) FROM anon, public;
