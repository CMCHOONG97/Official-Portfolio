-- ============================================
-- Portfolio Supabase Schema
-- 在 Supabase Dashboard -> SQL Editor 里执行这个文件
--
-- 注意：项目数据（projects）已改用纯 Git 自动化方案
-- （netlify.toml + scripts/generateProjects.js），
-- 这里只保留 Contact Form 用的 contact_messages 表。
-- ============================================

-- contact_messages 表：存放联系表单提交的内容
create table if not exists contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

-- 任何人都可以「插入」（提交表单），但不能读别人的留言
create policy "Public can insert contact messages"
  on contact_messages for insert
  with check (true);

-- 注意：没有给 contact_messages 建 select policy，
-- 所以匿名用户完全无法读取任何留言，只有你自己在 Supabase Dashboard 里能看到。

