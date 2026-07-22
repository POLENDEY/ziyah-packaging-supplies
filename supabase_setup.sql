-- ============================================================
-- Ziyah Packaging Supplies – Database Setup (ADD ONLY)
-- Safe to re-run. Does NOT drop or modify unrelated tables.
-- ============================================================

-- 1) Contact form / CMS inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT,
  status      TEXT NOT NULL DEFAULT 'new',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ;

UPDATE public.inquiries
SET status = 'new'
WHERE status IS NULL;

ALTER TABLE public.inquiries
  ALTER COLUMN status SET DEFAULT 'new';

-- 2) CMS admin login (used by /admin/login)
CREATE TABLE IF NOT EXISTS public.profile (
  id          BIGSERIAL PRIMARY KEY,
  username    TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default admin account (change password after first login)
INSERT INTO public.profile (username, password)
SELECT 'admin', 'admin123'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profile WHERE username = 'admin'
);

-- 3) Products CMS (for future product management)
CREATE TABLE IF NOT EXISTS public.products (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT,
  price_from  NUMERIC(10, 2),
  unit        TEXT DEFAULT 'piece',
  type        TEXT DEFAULT 'Disposable',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  image_url   TEXT,
  icon        TEXT,
  badge       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 4) Optional chatbot conversation logs
CREATE TABLE IF NOT EXISTS public.chatbot_logs (
  id         BIGSERIAL PRIMARY KEY,
  session_id TEXT,
  user_msg   TEXT,
  bot_reply  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_logs ENABLE ROW LEVEL SECURITY;

-- inquiries: public can submit; public read/update/delete needed for current CMS API (anon key)
DROP POLICY IF EXISTS "Allow anon insert inquiries" ON public.inquiries;
CREATE POLICY "Allow anon insert inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select inquiries" ON public.inquiries;
CREATE POLICY "Allow anon select inquiries"
  ON public.inquiries FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anon update inquiries" ON public.inquiries;
CREATE POLICY "Allow anon update inquiries"
  ON public.inquiries FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon delete inquiries" ON public.inquiries;
CREATE POLICY "Allow anon delete inquiries"
  ON public.inquiries FOR DELETE
  TO anon, authenticated
  USING (true);

-- profile: allow login lookup (matches current LoginForm)
DROP POLICY IF EXISTS "Allow anon select profile" ON public.profile;
CREATE POLICY "Allow anon select profile"
  ON public.profile FOR SELECT
  TO anon, authenticated
  USING (true);

-- products: public can view active products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Allow anon manage products" ON public.products;
CREATE POLICY "Allow anon manage products"
  ON public.products FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- chatbot logs: allow insert
DROP POLICY IF EXISTS "Allow anon insert chatbot logs" ON public.chatbot_logs;
CREATE POLICY "Allow anon insert chatbot logs"
  ON public.chatbot_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================================
-- Helpful indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products (category);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products (is_active);
