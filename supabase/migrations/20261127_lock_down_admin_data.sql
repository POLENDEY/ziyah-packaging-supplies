-- Lock down inquiries and profile so anon/public cannot read or mutate admin data.
-- Public contact form still needs INSERT on inquiries.
-- Apply in Supabase SQL Editor if the CLI is unavailable.

-- Inquiries: keep public submit, remove public read/update/delete
DROP POLICY IF EXISTS "Allow anon select inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow anon update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow anon delete inquiries" ON public.inquiries;

-- Profile: login/profile updates go through service-role API only
DROP POLICY IF EXISTS "Allow anon select profile" ON public.profile;
DROP POLICY IF EXISTS "Allow anon update profile" ON public.profile;
DROP POLICY IF EXISTS "Allow anon insert profile" ON public.profile;
DROP POLICY IF EXISTS "Allow anon delete profile" ON public.profile;

-- Feedback: public may read home cards; writes go through service-role API
ALTER TABLE IF EXISTS public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon select feedback" ON public.feedback;
CREATE POLICY "Allow anon select feedback"
  ON public.feedback FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anon insert feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow anon update feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow anon delete feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow anon manage feedback" ON public.feedback;
