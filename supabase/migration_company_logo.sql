-- 1. Voeg logo_url kolom toe aan companies tabel
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url text;

-- 2. Maak een storage bucket aan voor logo's
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage policies: bedrijfsleden mogen uploaden/verwijderen
CREATE POLICY "Bedrijfsleden kunnen logo uploaden"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Bedrijfsleden kunnen logo updaten"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Bedrijfsleden kunnen logo verwijderen"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text FROM profiles WHERE id = auth.uid()
  )
);

-- 4. Iedereen kan logo's lezen (publieke bucket)
CREATE POLICY "Logo's zijn publiek leesbaar"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-logos');
