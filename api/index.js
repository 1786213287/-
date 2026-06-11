/**
 * Vercel Serverless Function — 衣橱 API
 * 处理所有 /api/* 请求
 */
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// GET /api/items
app.get('/api/items', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('closet_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const items = data.map(row => ({
      id: row.id, name: row.name, collection: row.collection,
      price: row.price, material: row.material, color: row.color,
      occasion: row.occasion, description: row.description,
      image: row.image, tags: row.tags, category: row.category,
      createdAt: row.created_at,
    }));
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/items/:id
app.get('/api/items/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('closet_items').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: '单品不存在' });
    res.json({ success: true, data: { ...data, createdAt: data.created_at } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// POST /api/items
app.post('/api/items', async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, error: '服装名称为必填项' });
    if (!image) return res.status(400).json({ success: false, error: '服装照片为必填项' });
    const { data, error } = await supabase
      .from('closet_items')
      .insert({
        name: name.trim(), collection: req.body.collection?.trim() || 'Essential Collection',
        price: Number(req.body.price) || 0, material: req.body.material?.trim() || '',
        color: req.body.color?.trim() || '', occasion: req.body.occasion || '休闲',
        description: req.body.description?.trim() || '', image,
        tags: Array.isArray(req.body.tags) ? req.body.tags : [],
        category: req.body.category || 'tops',
      })
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data: { ...data, createdAt: data.created_at } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// PUT /api/items/:id
app.put('/api/items/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, error: '服装名称为必填项' });
    const { data, error } = await supabase
      .from('closet_items')
      .update({
        name: name.trim(), collection: req.body.collection?.trim() || 'Essential Collection',
        price: Number(req.body.price) || 0, material: req.body.material?.trim() || '',
        color: req.body.color?.trim() || '', occasion: req.body.occasion || '休闲',
        description: req.body.description?.trim() || '', image: req.body.image,
        tags: Array.isArray(req.body.tags) ? req.body.tags : [],
        category: req.body.category || 'tops',
      })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: '单品不存在' });
    res.json({ success: true, data: { ...data, createdAt: data.created_at } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// DELETE /api/items/:id
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('closet_items').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// PATCH /api/items/:id/tags
app.patch('/api/items/:id/tags', async (req, res) => {
  try {
    const { tags } = req.body;
    if (!Array.isArray(tags)) return res.status(400).json({ success: false, error: 'tags 必须为字符串数组' });
    const { data, error } = await supabase
      .from('closet_items').update({ tags }).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: '单品不存在' });
    res.json({ success: true, data: { id: data.id, tags: data.tags } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default app;
