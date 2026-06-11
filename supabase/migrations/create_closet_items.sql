-- 创建衣橱单品表
CREATE TABLE IF NOT EXISTS closet_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  collection TEXT NOT NULL DEFAULT 'Essential Collection',
  price INTEGER NOT NULL DEFAULT 0,
  material TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '',
  occasion TEXT NOT NULL DEFAULT '休闲',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('tops', 'bottoms', 'outerwear', 'shoes')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 启用 RLS 行级安全
ALTER TABLE closet_items ENABLE ROW LEVEL SECURITY;

-- 允许所有用户读取 (anon key)
CREATE POLICY "Allow read for all users" ON closet_items
  FOR SELECT USING (true);

-- 允许所有用户插入 (anon key)
CREATE POLICY "Allow insert for all users" ON closet_items
  FOR INSERT WITH CHECK (true);

-- 允许所有用户更新
CREATE POLICY "Allow update for all users" ON closet_items
  FOR UPDATE USING (true);

-- 允许所有用户删除
CREATE POLICY "Allow delete for all users" ON closet_items
  FOR DELETE USING (true);

-- 按创建时间降序索引，提升查询性能
CREATE INDEX IF NOT EXISTS idx_closet_items_created_at ON closet_items (created_at DESC);

-- 按分类索引
CREATE INDEX IF NOT EXISTS idx_closet_items_category ON closet_items (category);
