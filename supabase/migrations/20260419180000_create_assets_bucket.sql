-- supabase/migrations/20260419180000_create_assets_bucket.sql
-- Create assets bucket for TTS audio files
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do update set public = true;

-- Allow public access to read files
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'assets' );

-- Allow authenticated users to upload files to their own tenant folder
create policy "Authenticated Users can upload assets"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'assets' and
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own files
create policy "Authenticated Users can update their own assets"
on storage.objects for update
to authenticated
using (
    bucket_id = 'assets' and
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
create policy "Authenticated Users can delete their own assets"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'assets' and
    (storage.foldername(name))[1] = auth.uid()::text
);
