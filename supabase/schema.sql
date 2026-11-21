-- ==============================================================================
-- 7P STUDIO — CONTROL CENTER DATABASE SCHEMA
-- PostgreSQL schema for Supabase integration
-- ==============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LEADS & INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  project_type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  turnaround TEXT,
  quote_id TEXT,
  source_url TEXT,
  form_name TEXT DEFAULT 'portfolio-contact',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'discussion', 'proposal_sent', 'in_progress', 'completed', 'rejected')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_starred BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  notes JSONB DEFAULT '[]'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for fast search and filtering
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_is_read ON public.leads(is_read);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  client TEXT NOT NULL,
  category_en TEXT NOT NULL,
  category_ar TEXT NOT NULL,
  short_en TEXT NOT NULL,
  short_ar TEXT NOT NULL,
  tags_en JSONB DEFAULT '[]'::jsonb,
  tags_ar JSONB DEFAULT '[]'::jsonb,
  url TEXT NOT NULL,
  preview_img TEXT NOT NULL,
  accent_color TEXT DEFAULT '#FF8500',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'fa-solid fa-code',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  role_or_project TEXT NOT NULL,
  comment_en TEXT,
  comment_ar TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT,
  platform TEXT DEFAULT 'tiktok',
  is_approved BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SITE SECTIONS (PAGES & SECTIONS CONTENT)
CREATE TABLE IF NOT EXISTS public.site_sections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ACTIVITY LOGS (AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  user_name TEXT NOT NULL DEFAULT 'Studio Admin',
  user_role TEXT NOT NULL DEFAULT 'owner',
  category TEXT NOT NULL CHECK (category IN ('project', 'lead', 'media', 'section', 'service', 'testimonial', 'settings', 'auth', 'system')),
  details TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_created_at ON public.activity_logs(created_at DESC);

-- 7. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('lead', 'message', 'deployment', 'system', 'alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'success', 'warning', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 8. ANALYTICS EVENTS (LIGHTWEIGHT FIRST-PARTY TRACKER)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  page_path TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  device TEXT DEFAULT 'desktop',
  browser TEXT,
  country TEXT DEFAULT 'EG',
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name);

-- 9. ADMIN USERS & ROLES
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'admin', 'editor')),
  avatar_url TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  studio_name TEXT NOT NULL DEFAULT '7P STUDIO',
  tagline TEXT NOT NULL DEFAULT 'Modern Web Development Studio',
  contact_email TEXT NOT NULL DEFAULT 'contact@7pstudio.tech',
  contact_whatsapp TEXT NOT NULL DEFAULT '+201515047449',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  meta_title TEXT DEFAULT '7P STUDIO — Modern Web Development Studio',
  meta_description TEXT DEFAULT 'Interactive 3D Web Experiences, High-Conversion Landing Pages and E-Commerce Solutions.',
  og_image TEXT DEFAULT '/og-image.jpg',
  social_links JSONB DEFAULT '{"whatsapp": "+201515047449", "tiktok": "@7p.studio6", "instagram": "@7p__studio"}'::jsonb,
  integrations JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public can insert leads (from contact form / estimator)
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- 2. Authenticated admins can view, update, and manage leads
DROP POLICY IF EXISTS "Admins can view and manage leads" ON public.leads;
CREATE POLICY "Admins can view and manage leads" ON public.leads
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 3. Public can view published projects
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 4. Public can view active services & approved testimonials
DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services" ON public.services
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;
CREATE POLICY "Public can view approved testimonials" ON public.testimonials
  FOR SELECT USING (is_approved = true);

-- 5. Public can record analytics events
DROP POLICY IF EXISTS "Public can log analytics" ON public.analytics_events;
CREATE POLICY "Public can log analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- 6. Public can read site settings
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT USING (true);

-- Trigger to auto-create notification when new lead is inserted
CREATE OR REPLACE FUNCTION public.handle_new_lead_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message, link, severity)
  VALUES (
    'lead',
    'New Lead Received',
    'New submission from ' || NEW.name || ' (' || COALESCE(NEW.project_type, 'General Inquiry') || ')',
    '/admin/#leads',
    'info'
  );
  
  INSERT INTO public.activity_logs (action, user_name, user_role, category, details)
  VALUES (
    'lead_received',
    'System',
    'system',
    'lead',
    'Received new inquiry from ' || NEW.name || ' via ' || NEW.form_name
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lead_inserted ON public.leads;
CREATE TRIGGER on_lead_inserted
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_lead_notification();
