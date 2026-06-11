/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClothingItem } from './types';
import { fetchItems, createItem, updateItem, deleteItem, updateItemTags } from './api';
import WardrobeGrid from './components/WardrobeGrid';
import ItemDetails from './components/ItemDetails';
import EditItemModal from './components/EditItemModal';
import { motion, AnimatePresence } from 'motion/react';
import { Shirt, Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [currentView, setCurrentView] = useState<'grid' | 'details' | 'add_edit'>('grid');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [editItem, setEditItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从 Supabase 加载数据
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchItems();
      setItems(data);
    } catch (err: any) {
      console.error('加载衣橱数据失败:', err);
      setError(err.message || '无法连接服务器');
    } finally {
      setLoading(false);
    }
  };

  // 快速切换标签 (PATCH tags)
  const handleUpdateTags = async (itemId: string, newTags: string[]) => {
    // 乐观更新
    const prevItems = items;
    const prevSelected = selectedItem;

    const updated = items.map(item => {
      if (item.id === itemId) return { ...item, tags: newTags };
      return item;
    });
    setItems(updated);
    if (selectedItem?.id === itemId) {
      setSelectedItem({ ...selectedItem, tags: newTags });
    }

    try {
      await updateItemTags(itemId, newTags);
    } catch (err: any) {
      // 回滚
      setItems(prevItems);
      setSelectedItem(prevSelected);
      console.error('更新标签失败:', err);
    }
  };

  // 添加/编辑保存
  const handleSaveItem = async (
    formData: Omit<ClothingItem, 'id' | 'createdAt'> & { id?: string }
  ) => {
    try {
      if (formData.id) {
        // 编辑模式
        const updated = await updateItem(formData.id, {
          name: formData.name,
          collection: formData.collection,
          price: formData.price,
          material: formData.material,
          color: formData.color,
          occasion: formData.occasion,
          description: formData.description,
          image: formData.image,
          tags: formData.tags,
          category: formData.category,
        });

        setItems(items.map(i => (i.id === updated.id ? updated : i)));
        setSelectedItem(updated);
        setCurrentView('details');
      } else {
        // 新建模式
        const created = await createItem({
          name: formData.name,
          collection: formData.collection,
          price: formData.price,
          material: formData.material,
          color: formData.color,
          occasion: formData.occasion,
          description: formData.description,
          image: formData.image,
          tags: formData.tags,
          category: formData.category,
        });

        setItems([created, ...items]);
        setCurrentView('grid');
      }
      setEditItem(null);
    } catch (err: any) {
      console.error('保存失败:', err);
      alert(`保存失败: ${err.message}`);
    }
  };

  // 删除单品
  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      setItems(items.filter(i => i.id !== itemId));
      setSelectedItem(null);
      setCurrentView('grid');
    } catch (err: any) {
      console.error('删除失败:', err);
      alert(`删除失败: ${err.message}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-bg text-text-primary antialiased selection:bg-primary-charcoal selection:text-white">
      {/* Visual Ambient Stage Frame helper (centered relative to mobile specs, mimicking iframe visual device bounds) */}
      <div className="relative mx-auto min-h-screen bg-neutral-bg select-none shadow-[2px_0px_30px_rgba(0,0,0,0.03)] border-x border-border-hairline/20 max-w-lg">
        
        {/* 加载状态 */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 size={36} className="text-purple-400 animate-spin" />
            <p className="text-sm text-white/50">正在从云端加载你的衣橱...</p>
          </div>
        )}

        {/* 错误状态 */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-500/30 flex items-center justify-center">
              <Shirt size={28} className="text-red-400" />
            </div>
            <p className="text-sm text-red-400 font-semibold">连接云端失败</p>
            <p className="text-xs text-white/40 max-w-xs">{error}</p>
            <button
              onClick={loadItems}
              className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-colors"
            >
              重新连接
            </button>
          </div>
        )}

        {/* Nav Router rendering inside spring animation slots */}
        {!loading && !error && (
        <AnimatePresence mode="wait">
          {currentView === 'grid' && (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <WardrobeGrid
                items={items}
                onSelectItem={(item) => {
                  setSelectedItem(item);
                  setCurrentView('details');
                }}
                onAddItem={() => {
                  setEditItem(null);
                  setCurrentView('add_edit');
                }}
              />
            </motion.div>
          )}

          {currentView === 'details' && selectedItem && (
            <motion.div
              key={`details-view-${selectedItem.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ItemDetails
                item={selectedItem}
                onBack={() => {
                  setSelectedItem(null);
                  setCurrentView('grid');
                }}
                onEdit={(item) => {
                  setEditItem(item);
                  setCurrentView('add_edit');
                }}
                onDelete={handleDeleteItem}
                onUpdateTags={handleUpdateTags}
              />
            </motion.div>
          )}

          {currentView === 'add_edit' && (
            <motion.div
              key="add-edit-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <EditItemModal
                item={editItem}
                onClose={() => {
                  // If we were editing an item, return to details. If adding, return to grid list
                  if (editItem) {
                    setCurrentView('details');
                  } else {
                    setCurrentView('grid');
                  }
                  setEditItem(null);
                }}
                onSave={handleSaveItem}
              />
            </motion.div>
          )}
        </AnimatePresence>
        )}

        {/* Ambient watermark signature per Architectural Honesty rules (modest, humble design styling) */}
        {currentView === 'grid' && (
          <div className="absolute bottom-6 left-0 right-0 text-center py-2 shrink-0 select-none pointer-events-none">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-secondary/40 font-mono tracking-widest uppercase">
              <Shirt size={10} />
              <span>Closet Digitized Engine v1.0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
