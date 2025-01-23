-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('cover-image', 'cover-image', true),
  ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload cover images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view cover images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own cover images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own gallery images" ON storage.objects;

-- Policy for cover images
CREATE POLICY "Allow authenticated users to upload cover images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'cover-image' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow public to view cover images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'cover-image');

CREATE POLICY "Allow users to delete their own cover images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'cover-image' AND
  auth.uid() = owner
);

-- Policy for gallery images
CREATE POLICY "Allow authenticated users to upload gallery images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'gallery' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow public to view gallery images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'gallery');

CREATE POLICY "Allow users to delete their own gallery images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'gallery' AND
  auth.uid() = owner
); 