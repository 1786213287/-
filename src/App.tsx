import React, { useState, useEffect } from 'react';
import { ClothingItem } from './types';
import { fetchItems, createItem, updateItem, deleteItem, updateItemTags } from './api';
import { isLoggedIn, getToken, signOut, clearAuth } from './supabase';
import WardrobeGrid from './components/WardrobeGrid';
import ItemDetails from './components/ItemDetails';
import EditItemModal from './components/EditItemModal';
import AuthPage from './components/AuthPage';
import { motion, AnimatePresence } from 'motion/react';
import { Shirt, Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<boolean>(false);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [currentView, setCurrentView] = useState<'grid' | 'details' | 'add_edit'>('grid');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [editItem, setEditItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 检查登录状态
  useEffect(() => {
    if (isLoggedIn()) {
      setUser(true);
    }
  }, []);

  // 用户登录后加载数据
  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchItems();
      setItems(data);
    } catch (err: any) {
      console.error('加载衣橱数据失败:', err);
      setError(err.message || '无法连接服务器');
      // token 过期，强制登出
      if (err.message?.includes('过期') || err.message?.includes('登录')) {
        clearAuth();
        setUser(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setUser(true);
  };

  const handleLogout = async () => {
    await signOut();
    setUser(false);
    setItems([]);
  };

  const handleUpdateTags = async (itemId: string, newTags: string[]) => {
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
      setItems(prevItems);
      setSelectedItem(prevSelected);
      console.error('更新标签失败:', err);
    }
  };

  const handleSaveItem = async (
    formData: Omit<ClothingItem, 'id' | 'createdAt'> & { id?: string }
  ) => {
    try {
      if (formData.id) {
        const updated = await updateItem(formData.id, {
          name: formData.name, collection: formData.collection,
          price: formData.price, material: formData.material,
          color: formData.color, occasion: formData.occasion,
          description: formData.description, image: formData.image,
          tags: formData.tags, category: formData.category,
        });
        setItems(items.map(i => (i.id === updated.id ? updated : i)));
        setSelectedItem(updated);
        setCurrentView('details');
      } else {
        const created = await createItem({
          name: formData.name, collection: formData.collection,
          price: formData.price, material: formData.material,
          color: formData.color, occasion: formData.occasion,
          description: formData.description, image: formData.image,
          tags: formData.tags, category: formData.category,
        });
        setItems([created, ...items]);
        setCurrentView('grid');
      }
      setEditItem(null);
    } catch (err: any) {
      console.error('保存失败:', err);
      alert('保存失败: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      setItems(items.filter(i => i.id !== itemId));
      setSelectedItem(null);
      setCurrentView('grid');
    } catch (err: any) {
      console.error('删除失败:', err);
      alert('删除失败: ' + err.message);
    }
  };

  // ---- 未登录 → 登录页 ----
  if (!user) {
    return <AuthPage onAuthSuccess={handleLoginSuccess} />;
  }

  // ---- 已登录 → 主界面 ----
  return (
    <div className="w-full min-h-screen bg-neutral-bg text-text-primary antialiased selection:bg-primary-charcoal selection:text-white">
      <div className="relative mx-auto min-h-screen bg-neutral-bg select-none shadow-[2px_0px_30px_rgba(0,0,0,0.03)] border-x border-border-hairline/20 max-w-lg">
        
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 size={36} className="text-purple-400 animate-spin" />
            <p className="text-sm text-white/50">正在从云端加载你的衣橱...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-500/30 flex items-center justify-center">
              <Shirt size={28} className="text-red-400" />
            </div>
            <p className="text-sm text-red-400 font-semibold">连接云端失败</p>
            <p className="text-xs text-white/40 max-w-xs">{error}</p>
            <button onClick={loadItems} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-colors">重试</button>
            <button onClick={handleLogout} className="text-xs text-white/40 hover:text-white/70 underline">退出登录</button>
          </div>
        )}

        {!loading && !error && (
        <AnimatePresence mode="wait">
          {currentView === 'grid' && (
            <motion.div key="grid-view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <WardrobeGrid
                items={items}
                onSelectItem={(item) => { setSelectedItem(item); setCurrentView('details'); }}
                onAddItem={() => { setEditItem(null); setCurrentView('add_edit'); }}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
          {currentView === 'details' && selectedItem && (
            <motion.div key={`details-view-${selectedItem.id}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <ItemDetails item={selectedItem} onBack={() => { setSelectedItem(null); setCurrentView('grid'); }} onEdit={(item) => { setEditItem(item); setCurrentView('add_edit'); }} onDelete={handleDeleteItem} onUpdateTags={handleUpdateTags} />
            </motion.div>
          )}
          {currentView === 'add_edit' && (
            <motion.div key="add-edit-view" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <EditItemModal item={editItem} onClose={() => { if (editItem) setCurrentView('details'); else setCurrentView('grid'); setEditItem(null); }} onSave={handleSaveItem} />
            </motion.div>
          )}
        </AnimatePresence>
        )}

        {currentView === 'grid' && (
          <div className="absolute bottom-6 left-0 right-0 text-center py-2 shrink-0 select-none pointer-events-none">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-secondary/40 font-mono tracking-widest uppercase">
              <Shirt size={10} />
              <span>Closet Digitized Engine v2.0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}