-- Add read/unread tracking for inquiries (safe / additive)
ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE public.inquiries
SET is_read = TRUE
WHERE status IN ('replied', 'closed') AND is_read = FALSE;

-- Allow profile updates for CMS username/password changes
GRANT UPDATE ON TABLE public.profile TO anon, authenticated;

DROP POLICY IF EXISTS "Allow anon update profile" ON public.profile;
CREATE POLICY "Allow anon update profile"
  ON public.profile FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
