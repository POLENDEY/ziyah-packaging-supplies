-- Fix feedback RLS so CMS can save (UPDATE + INSERT for upsert)
GRANT SELECT, INSERT, UPDATE ON TABLE public.feedback TO anon, authenticated;

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

DROP POLICY IF EXISTS "Allow anon insert feedback" ON public.feedback;
CREATE POLICY "Allow anon insert feedback"
  ON public.feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the 4 slots exist
INSERT INTO public.feedback (id, name, role, rating, photo, quote)
VALUES
  (1, 'Maria Santos', 'Café owner · Makati', 5, '/logo.png', 'Our takeout looks more premium since we switched to Ziyah bento boxes. Fast replies and consistent stock.'),
  (2, 'James Rivera', 'Catering lead · Quezon City', 5, '/dummy-post-square-1.jpg', 'Reliable trays and lids for big events. Nationwide delivery made restocking simple for our team.'),
  (3, 'Aira Mendoza', 'Sushi stall · Pasay', 5, '/logo.png', 'Clear sushi trays show the food beautifully. Great guidance when we needed the right sizes.'),
  (4, 'Kenji Ong', 'Meal-prep brand · Cebu', 5, '/dummy-post-square-1.jpg', 'Wholesale pricing that works for our volume. Packaging quality holds up through delivery.')
ON CONFLICT (id) DO NOTHING;
