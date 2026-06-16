-- Policies for Supabase Storage bucket `media`
-- Run this in Supabase SQL Editor after creating the bucket `media` (public)

create policy "Public read access"
  on storage.objects for select using (bucket_id = 'media');

create policy "Users can upload their own media"
  on storage.objects for insert with check (
    bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]
  );
