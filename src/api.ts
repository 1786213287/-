/**
 * 前端 API 层 — 通过 RPC 函数调用（token 认证）
 */
import { supabase, getToken } from './supabase';
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

function tokenOrThrow(): string {
  const t = getToken();
  if (!t) throw new Error('请先登录');
  return t;
}

// 获取所有单品
export async function fetchItems(): Promise<ClothingItem[]> {
  const { data, error } = await supabase.rpc('get_my_items', {
    p_token: tokenOrThrow(),
  });
  if (error) throw new Error(error.message);
  return (data || []).map(toItem);
}

// 创建单品
export async function createItem(
  payload: Omit<ClothingItem, 'id' | 'createdAt'>
): Promise<ClothingItem> {
  const { data, error } = await supabase.rpc('create_my_item', {
    p_token: tokenOrThrow(),
    p_name: payload.name,
    p_collection: payload.collection,
    p_price: payload.price,
    p_material: payload.material,
    p_color: payload.color,
    p_occasion: payload.occasion,
    p_description: payload.description,
    p_image: payload.image,
    p_tags: payload.tags,
    p_category: payload.category,
  });
  if (error) throw new Error(error.message);
  return toItem(data);
}

// 更新单品
export async function updateItem(
  id: string,
  payload: Omit<ClothingItem, 'id' | 'createdAt'>
): Promise<ClothingItem> {
  const { data, error } = await supabase.rpc('update_my_item', {
    p_token: tokenOrThrow(),
    p_item_id: id,
    p_name: payload.name,
    p_collection: payload.collection,
    p_price: payload.price,
    p_material: payload.material,
    p_color: payload.color,
    p_occasion: payload.occasion,
    p_description: payload.description,
    p_image: payload.image,
    p_tags: payload.tags,
    p_category: payload.category,
  });
  if (error) throw new Error(error.message);
  return toItem(data);
}

// 删除单品
export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.rpc('delete_my_item', {
    p_token: tokenOrThrow(),
    p_item_id: id,
  });
  if (error) throw new Error(error.message);
}

// 更新标签
export async function updateItemTags(
  id: string,
  tags: string[]
): Promise<{ id: string; tags: string[] }> {
  const { data, error } = await supabase.rpc('update_my_tags', {
    p_token: tokenOrThrow(),
    p_item_id: id,
    p_tags: tags,
  });
  if (error) throw new Error(error.message);
  return { id: data.id, tags: data.tags };
}