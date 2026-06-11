-- 添加 user_id 列，关联到 Supabase Auth 用户
ALTER TABLE closet_items 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 已有数据设置一个默认值（可选：给旧数据指定一个虚拟用户）
-- 如果有旧数据需要保留，可以创建一个虚拟用户或留空

-- 删除旧的公开策略
DROP POLICY IF EXISTS "Allow read for all users" ON closet_items;
DROP POLICY IF EXISTS "Allow insert for all users" ON closet_items;
DROP POLICY IF EXISTS "Allow update for all users" ON closet_items;
DROP POLICY IF EXISTS "Allow delete for all users" ON closet_items;

-- 新的用户隔离 RLS 策略
-- 只能读取自己的数据
CREATE POLICY "Users can read own items" ON closet_items
  FOR SELECT USING (auth.uid() = user_id);

-- 只能创建自己的数据
CREATE POLICY "Users can insert own items" ON closet_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 只能更新自己的数据
CREATE POLICY "Users can update own items" ON closet_items
  FOR UPDATE USING (auth.uid() = user_id);

-- 只能删除自己的数据
CREATE POLICY "Users can delete own items" ON closet_items
  FOR DELETE USING (auth.uid() = user_id);

-- 按 user_id 索引提升查询性能
CREATE INDEX IF NOT EXISTS idx_closet_items_user_id ON closet_items (user_id);
