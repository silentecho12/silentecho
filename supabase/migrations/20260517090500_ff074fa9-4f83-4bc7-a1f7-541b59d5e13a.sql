insert into storage.buckets (id, name, public) values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

create policy "public read portfolio images"
on storage.objects for select
using (bucket_id = 'portfolio-images');

create policy "admin upload portfolio images"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-images' and public.has_role(auth.uid(), 'admin'));

create policy "admin update portfolio images"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-images' and public.has_role(auth.uid(), 'admin'));

create policy "admin delete portfolio images"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-images' and public.has_role(auth.uid(), 'admin'));