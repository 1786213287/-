import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = Number(process.env.SERVER_PORT) || 3001;

// Supabase 客户端 (使用 service_role_key 拥有完整权限)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============================================================
// GET /api/items — 获取所有衣橱单品
// ============================================================
app.get('/api/items', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('closet_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 将数据库字段映射到前端接口格式
    const items = data.map(row => ({
      id: row.id,
      name: row.name,
      collection: row.collection,
      price: row.price,
      material: row.material,
      color: row.color,
      occasion: row.occasion,
      description: row.description,
      image: row.image,
      tags: row.tags,
      category: row.category,
      createdAt: row.created_at,
    }));

    res.json({ success: true, data: items });
  } catch (err: any) {
    console.error('[GET /api/items] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// GET /api/items/:id — 获取单个单品
// ============================================================
app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('closet_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: '单品不存在' });
    }

    res.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        collection: data.collection,
        price: data.price,
        material: data.material,
        color: data.color,
        occasion: data.occasion,
        description: data.description,
        image: data.image,
        tags: data.tags,
        category: data.category,
        createdAt: data.created_at,
      },
    });
  } catch (err: any) {
    console.error('[GET /api/items/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// POST /api/items — 创建新单品
// ============================================================
app.post('/api/items', async (req, res) => {
  try {
    const {
      name,
      collection,
      price,
      material,
      color,
      occasion,
      description,
      image,
      tags,
      category,
    } = req.body;

    // 必填校验
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: '服装名称为必填项' });
    }
    if (!image) {
      return res.status(400).json({ success: false, error: '服装照片为必填项' });
    }

    const insertData = {
      name: name.trim(),
      collection: collection?.trim() || 'Essential Collection',
      price: typeof price === 'number' ? price : Number(price) || 0,
      material: material?.trim() || '',
      color: color?.trim() || '',
      occasion: occasion || '休闲',
      description: description?.trim() || '',
      image,
      tags: Array.isArray(tags) ? tags : [],
      category: category || 'tops',
    };

    const { data, error } = await supabase
      .from('closet_items')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        collection: data.collection,
        price: data.price,
        material: data.material,
        color: data.color,
        occasion: data.occasion,
        description: data.description,
        image: data.image,
        tags: data.tags,
        category: data.category,
        createdAt: data.created_at,
      },
    });
  } catch (err: any) {
    console.error('[POST /api/items] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// PUT /api/items/:id — 更新单品
// ============================================================
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      collection,
      price,
      material,
      color,
      occasion,
      description,
      image,
      tags,
      category,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: '服装名称为必填项' });
    }

    const updateData: Record<string, any> = {
      name: name.trim(),
      collection: collection?.trim() || 'Essential Collection',
      price: typeof price === 'number' ? price : Number(price) || 0,
      material: material?.trim() || '',
      color: color?.trim() || '',
      occasion: occasion || '休闲',
      description: description?.trim() || '',
      image,
      tags: Array.isArray(tags) ? tags : [],
      category: category || 'tops',
    };

    const { data, error } = await supabase
      .from('closet_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: '单品不存在' });
    }

    res.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        collection: data.collection,
        price: data.price,
        material: data.material,
        color: data.color,
        occasion: data.occasion,
        description: data.description,
        image: data.image,
        tags: data.tags,
        category: data.category,
        createdAt: data.created_at,
      },
    });
  } catch (err: any) {
    console.error('[PUT /api/items/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// DELETE /api/items/:id — 删除单品
// ============================================================
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('closet_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/items/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// PATCH /api/items/:id/tags — 局部更新标签
// ============================================================
app.patch('/api/items/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ success: false, error: 'tags 必须为字符串数组' });
    }

    const { data, error } = await supabase
      .from('closet_items')
      .update({ tags })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: '单品不存在' });
    }

    res.json({ success: true, data: { id: data.id, tags: data.tags } });
  } catch (err: any) {
    console.error('[PATCH /api/items/:id/tags] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Closet API Server] running on http://localhost:${PORT}`);
});
