/**
 * 前端 API 层 — 直接对接 Supabase (RLS 保护)
 */
import { supabase } from './supabase';
import { ClothingItem } from './types';

function toItem(row: any): ClothingItem {
  return {
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
  };
}

// 获取所有单品
export async function fetchItems(): Promise<ClothingItem[]> {
  const { data, error } = await supabase
    .from('closet_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(toItem);
}

// 获取单个单品
export async function fetchItem(id: string): Promise<ClothingItem> {
  const { data, error } = await supabase
    .from('closet_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('单品不存在');
  return toItem(data);
}

// 创建单品
export async function createItem(
  payload: Omit<ClothingItem, 'id' | 'createdAt'>
): Promise<ClothingItem> {
  const { data, error } = await supabase
    .from('closet_items')
    .insert({
      name: payload.name,
      collection: payload.collection,
      price: payload.price,
      material: payload.material,
      color: payload.color,
      occasion: payload.occasion,
      description: payload.description,
      image: payload.image,
      tags: payload.tags,
      category: payload.category,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toItem(data);
}

// 更新单品
export async function updateItem(
  id: string,
  payload: Omit<ClothingItem, 'id' | 'createdAt'>
): Promise<ClothingItem> {
  const { data, error } = await supabase
    .from('closet_items')
    .update({
      name: payload.name,
      collection: payload.collection,
      price: payload.price,
      material: payload.material,
      color: payload.color,
      occasion: payload.occasion,
      description: payload.description,
      image: payload.image,
      tags: payload.tags,
      category: payload.category,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('单品不存在');
  return toItem(data);
}

// 删除单品
export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('closet_items')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// 更新标签
export async function updateItemTags(
  id: string,
  tags: string[]
): Promise<{ id: string; tags: string[] }> {
  const { data, error } = await supabase
    .from('closet_items')
    .update({ tags })
    .eq('id', id)
    .select('id, tags')
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('单品不存在');
  return { id: data.id, tags: data.tags };
}
