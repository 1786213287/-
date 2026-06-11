/**
 * 前端 API 层 — 通过 Vite 代理调用后端 Express 服务
 */
import { ClothingItem } from './types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || '请求失败');
  }

  return json.data as T;
}

// 获取所有单品
export async function fetchItems(): Promise<ClothingItem[]> {
  return request<ClothingItem[]>('/items');
}

// 获取单个单品
export async function fetchItem(id: string): Promise<ClothingItem> {
  return request<ClothingItem>(`/items/${id}`);
}

// 创建单品
export async function createItem(
  data: Omit<ClothingItem, 'id' | 'createdAt'>
): Promise<ClothingItem> {
  return request<ClothingItem>('/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 更新单品
export async function updateItem(
  id: string,
  data: Omit<ClothingItem, 'id' | 'createdAt'>
): Promise<ClothingItem> {
  return request<ClothingItem>(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 删除单品
export async function deleteItem(id: string): Promise<void> {
  await request<void>(`/items/${id}`, { method: 'DELETE' });
}

// 更新标签
export async function updateItemTags(
  id: string,
  tags: string[]
): Promise<{ id: string; tags: string[] }> {
  return request<{ id: string; tags: string[] }>(`/items/${id}/tags`, {
    method: 'PATCH',
    body: JSON.stringify({ tags }),
  });
}
