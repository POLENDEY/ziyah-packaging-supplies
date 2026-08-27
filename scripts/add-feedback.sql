-- Customer feedback cards (exactly 4 editable slots for CMS)
CREATE TABLE IF NOT EXISTS public.feedback (
  id INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 4),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  photo TEXT NOT NULL DEFAULT '/logo.png',
  quote TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.feedback (id, name, role, rating, photo, quote)
VALUES
  (1, 'Maria Santos', 'Café owner · Makati', 5, '/logo.png', 'Our takeout looks more premium since we switched to Ziyah bento boxes. Fast replies and consistent stock.'),
  (2, 'James Rivera', 'Catering lead · Quezon City', 5, '/dummy-post-square-1.jpg', 'Reliable trays and lids for big events. Nationwide delivery made restocking simple for our team.'),
  (3, 'Aira Mendoza', 'Sushi stall · Pasay', 5, '/logo.png', 'Clear sushi trays show the food beautifully. Great guidance when we needed the right sizes.'),
  (4, 'Kenji Ong', 'Meal-prep brand · Cebu', 5, '/dummy-post-square-1.jpg', 'Wholesale pricing that works for our volume. Packaging quality holds up through delivery.')
ON CONFLICT (id) DO NOTHING;

GRANT SELECT, UPDATE ON TABLE public.feedback TO anon, authenticated;

DROP POLICY IF EXISTS "Allow anon read feedback" ON public.feedback;
CREATE POLICY "Allow anon read feedback"
  ON public.feedback FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anon update feedback" ON public.feedback;
CREATE POLICY "Allow anon update feedback"
  ON public.feedback FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
