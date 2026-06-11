-- 自定义用户表（不依赖 Supabase Auth Dashboard）
CREATE TABLE IF NOT EXISTS closet_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 注册
-- ============================================================
CREATE OR REPLACE FUNCTION register_user(p_email TEXT, p_password TEXT)
RETURNS TABLE(user_id UUID, auth_token TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_hash TEXT;
  v_token TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM closet_users WHERE email = p_email) THEN
    RAISE EXCEPTION '该邮箱已注册';
  END IF;
  v_hash := encode(sha256(p_password::bytea), 'hex');
  v_token := gen_random_uuid()::text;
  INSERT INTO closet_users (email, password_hash, token)
  VALUES (p_email, v_hash, v_token)
  RETURNING id, token INTO user_id, auth_token;
  RETURN NEXT;
END;
$$;

-- ============================================================
-- 登录
-- ============================================================
CREATE OR REPLACE FUNCTION login_user(p_email TEXT, p_password TEXT)
RETURNS TABLE(user_id UUID, auth_token TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_hash TEXT;
  v_token TEXT;
BEGIN
  v_hash := encode(sha256(p_password::bytea), 'hex');
  v_token := gen_random_uuid()::text;
  UPDATE closet_users SET token = v_token
  WHERE email = p_email AND password_hash = v_hash
  RETURNING id, token INTO user_id, auth_token;
  IF NOT FOUND THEN
    RAISE EXCEPTION '邮箱或密码错误';
  END IF;
  RETURN NEXT;
END;
$$;

-- ============================================================
-- 登出
-- ============================================================
CREATE OR REPLACE FUNCTION logout_user(p_token TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE closet_users SET token = NULL WHERE token = p_token;
END;
$$;

-- ============================================================
-- 通过 token 获取 user_id
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_id(p_token TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_id UUID;
BEGIN
  SELECT id INTO v_id FROM closet_users WHERE token = p_token;
  IF NOT FOUND THEN
    RAISE EXCEPTION '登录已过期，请重新登录';
  END IF;
  RETURN v_id;
END;
$$;

-- ============================================================
-- RPC: 获取我的单品（token 认证）
-- ============================================================
CREATE OR REPLACE FUNCTION get_my_items(p_token TEXT)
RETURNS SETOF closet_items
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_uid UUID;
BEGIN
  SELECT get_user_id(p_token) INTO v_uid;
  RETURN QUERY SELECT * FROM closet_items
    WHERE user_id = v_uid
    ORDER BY created_at DESC;
END;
$$;

-- ============================================================
-- RPC: 创建单品
-- ============================================================
CREATE OR REPLACE FUNCTION create_my_item(
  p_token TEXT, p_name TEXT, p_collection TEXT, p_price INT,
  p_material TEXT, p_color TEXT, p_occasion TEXT,
  p_description TEXT, p_image TEXT, p_tags TEXT[], p_category TEXT
)
RETURNS closet_items
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_uid UUID;
  v_item closet_items;
BEGIN
  SELECT get_user_id(p_token) INTO v_uid;
  INSERT INTO closet_items (name, collection, price, material, color, occasion, description, image, tags, category, user_id)
  VALUES (p_name, p_collection, p_price, p_material, p_color, p_occasion, p_description, p_image, p_tags, p_category, v_uid)
  RETURNING * INTO v_item;
  RETURN v_item;
END;
$$;

-- ============================================================
-- RPC: 更新单品
-- ============================================================
CREATE OR REPLACE FUNCTION update_my_item(
  p_token TEXT, p_item_id UUID,
  p_name TEXT, p_collection TEXT, p_price INT,
  p_material TEXT, p_color TEXT, p_occasion TEXT,
  p_description TEXT, p_image TEXT, p_tags TEXT[], p_category TEXT
)
RETURNS closet_items
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_uid UUID;
  v_item closet_items;
BEGIN
  SELECT get_user_id(p_token) INTO v_uid;
  UPDATE closet_items SET
    name = p_name, collection = p_collection, price = p_price,
    material = p_material, color = p_color, occasion = p_occasion,
    description = p_description, image = p_image, tags = p_tags, category = p_category
  WHERE id = p_item_id AND user_id = v_uid
  RETURNING * INTO v_item;
  IF NOT FOUND THEN
    RAISE EXCEPTION '单品不存在或无权操作';
  END IF;
  RETURN v_item;
END;
$$;

-- ============================================================
-- RPC: 删除单品
-- ============================================================
CREATE OR REPLACE FUNCTION delete_my_item(p_token TEXT, p_item_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_uid UUID;
BEGIN
  SELECT get_user_id(p_token) INTO v_uid;
  DELETE FROM closet_items WHERE id = p_item_id AND user_id = v_uid;
  IF NOT FOUND THEN
    RAISE EXCEPTION '单品不存在或无权操作';
  END IF;
END;
$$;

-- ============================================================
-- RPC: 更新标签
-- ============================================================
CREATE OR REPLACE FUNCTION update_my_tags(p_token TEXT, p_item_id UUID, p_tags TEXT[])
RETURNS TABLE(id UUID, tags TEXT[])
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_uid UUID;
  v_item closet_items;
BEGIN
  SELECT get_user_id(p_token) INTO v_uid;
  UPDATE closet_items SET tags = p_tags
  WHERE id = p_item_id AND user_id = v_uid
  RETURNING * INTO v_item;
  IF NOT FOUND THEN
    RAISE EXCEPTION '单品不存在或无权操作';
  END IF;
  id := v_item.id;
  tags := v_item.tags;
  RETURN NEXT;
END;
$$;

-- 先移除旧的外键约束
ALTER TABLE closet_items DROP CONSTRAINT IF EXISTS closet_items_user_id_fkey;

-- 清空旧数据中的 user_id（来自旧 auth.users 的引用）
UPDATE closet_items SET user_id = NULL;

-- 更新 closet_items 外键引用到自定义表
ALTER TABLE closet_items
ADD CONSTRAINT closet_items_user_id_fkey
FOREIGN KEY (user_id) REFERENCES closet_users(id) ON DELETE CASCADE;

-- 索引
CREATE INDEX IF NOT EXISTS idx_closet_users_token ON closet_users (token);
CREATE INDEX IF NOT EXISTS idx_closet_users_email ON closet_users (email);