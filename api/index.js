/**
 * Vercel Serverless Function — 衣橱 API
 */
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ibdsfvftkeqhzvwcpjlp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZHNmdmZ0a2VxaHp2d2NwamxwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE1OTg1OCwiZXhwIjoyMDk2NzM1ODU4fQ.0f6zepUSvbsn-jooVoE0ADknV2F_pPVURrQJHDpqasI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
    const items = data.map(function(row) {
      return {
        id: row.id, name: row.name, collection: row.collection,
        price: row.price, material: row.material, color: row.color,
        occasion: row.occasion, description: row.description,
        image: row.image, tags: row.tags, category: row.category,
        createdAt: row.created_at,
      };
    });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/items/:id
app.get('/api/items/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('closet_items').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: '单品不存在' });
    res.json({ success: true, data: Object.assign({}, data, { createdAt: data.created_at }) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/items
app.post('/api/items', async (req, res) => {
  try {
    var name = req.body.name;
    var image = req.body.image;
    if (!name || !name.trim()) return res.status(400).json({ success: false, error: '服装名称为必填项' });
    if (!image) return res.status(400).json({ success: false, error: '服装照片为必填项' });
    var insertData = {
      name: name.trim(),
      collection: (req.body.collection || '').trim() || 'Essential Collection',
      price: Number(req.body.price) || 0,
      material: (req.body.material || '').trim() || '',
      color: (req.body.color || '').trim() || '',
      occasion: req.body.occasion || '休闲',
      description: (req.body.description || '').trim() || '',
      image: image,
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      category: req.body.category || 'tops',
    };
    var result = await supabase.from('closet_items').insert(insertData).select().single();
    if (result.error) throw result.error;
    res.status(201).json({ success: true, data: Object.assign({}, result.data, { createdAt: result.data.created_at }) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/items/:id
app.put('/api/items/:id', async (req, res) => {
  try {
    var name = req.body.name;
    if (!name || !name.trim()) return res.status(400).json({ success: false, error: '服装名称为必填项' });
    var updateData = {
      name: name.trim(),
      collection: (req.body.collection || '').trim() || 'Essential Collection',
      price: Number(req.body.price) || 0,
      material: (req.body.material || '').trim() || '',
      color: (req.body.color || '').trim() || '',
      occasion: req.body.occasion || '休闲',
      description: (req.body.description || '').trim() || '',
      image: req.body.image,
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      category: req.body.category || 'tops',
    };
    var result = await supabase.from('closet_items').update(updateData).eq('id', req.params.id).select().single();
    if (result.error) throw result.error;
    if (!result.data) return res.status(404).json({ success: false, error: '单品不存在' });
    res.json({ success: true, data: Object.assign({}, result.data, { createdAt: result.data.created_at }) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/items/:id
app.delete('/api/items/:id', async (req, res) => {
  try {
    var result = await supabase.from('closet_items').delete().eq('id', req.params.id);
    if (result.error) throw result.error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/items/:id/tags
app.patch('/api/items/:id/tags', async (req, res) => {
  try {
    var tags = req.body.tags;
    if (!Array.isArray(tags)) return res.status(400).json({ success: false, error: 'tags 必须为字符串数组' });
    var result = await supabase.from('closet_items').update({ tags: tags }).eq('id', req.params.id).select().single();
    if (result.error) throw result.error;
    if (!result.data) return res.status(404).json({ success: false, error: '单品不存在' });
    res.json({ success: true, data: { id: result.data.id, tags: result.data.tags } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;
