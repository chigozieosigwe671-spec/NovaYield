/*
# NovaYield - Create storage bucket for deposit receipts

## Overview
Creates a public storage bucket for deposit receipt uploads.

## Notes
1. Bucket is public so receipts can be viewed by admin.
2. 10MB file size limit enforced in frontend.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload receipts
DROP POLICY IF EXISTS "Allow authenticated uploads to receipts" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'receipts');

-- Allow public read of receipts (admin needs to view them)
DROP POLICY IF EXISTS "Allow public read of receipts" ON storage.objects;
CREATE POLICY "Allow public read of receipts"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'receipts');

-- Allow users to delete their own receipts
DROP POLICY IF EXISTS "Allow authenticated delete receipts" ON storage.objects;
CREATE POLICY "Allow authenticated delete receipts"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'receipts' AND owner = auth.uid());
