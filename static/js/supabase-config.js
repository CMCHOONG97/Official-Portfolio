// ============================================
// Supabase 前端配置
// 去 Supabase Dashboard -> Project Settings -> API 里拿这两个值
// SUPABASE_ANON_KEY 是「公开」的 key，可以放心放在前端代码里，
// 它的权限完全由你在 schema.sql 里设置的 RLS policy 决定。
// 千万不要把 service_role key 放到这里！那个 key 拥有绕过 RLS 的权限，
// 只能在本地脚本（比如 migrateToSupabase.js）或服务器端使用。
// ============================================

const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
