/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, Sparkles, Filter, CheckCircle2, Shirt, LogOut } from 'lucide-react';
import { ClothingItem, TabType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface WardrobeGridProps {
  items: ClothingItem[];
  onSelectItem: (item: ClothingItem) => void;
  onAddItem: () => void;
  onLogout: () => void;
}

const CATEGORIES: { value: TabType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'tops', label: '上装' },
  { value: 'bottoms', label: '下装' },
  { value: 'outerwear', label: '外套' },
  { value: 'shoes', label: '鞋履' },
];

const OCCASIONS = ['全部场合', '休闲', '商务', '居家', '运动', '通勤'];
const AVAILABLE_TAGS = ['已洗涤', '待搭配', '最爱', '待清洗', '已干洗'];

export default function WardrobeGrid({ items, onSelectItem, onAddItem, onLogout }: WardrobeGridProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('全部场合');
  const [activeFilterTags, setActiveFilterTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const total = items.length;
    const washed = items.filter(item => item.tags.includes('已洗涤') || item.tags.includes('已干洗')).length;
    const pendingMatch = items.filter(item => item.tags.includes('待搭配')).length;
    return { total, washed, pendingMatch };
  }, [items]);

  const toggleFilterTag = (tag: string) => {
    if (activeFilterTags.includes(tag)) {
      setActiveFilterTags(activeFilterTags.filter(t => t !== tag));
    } else {
      setActiveFilterTags([...activeFilterTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedOccasion('全部场合');
    setActiveFilterTags([]);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Category Filter
      if (activeTab !== 'all' && item.category !== activeTab) {
        return false;
      }
      // 2. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCollection = item.collection.toLowerCase().includes(query);
        const matchesColor = item.color.toLowerCase().includes(query);
        const matchesMaterial = item.material.toLowerCase().includes(query);
        if (!matchesName && !matchesCollection && !matchesColor && !matchesMaterial) {
          return false;
        }
      }
      // 3. Occasion
      if (selectedOccasion !== '全部场合' && item.occasion !== selectedOccasion) {
        return false;
      }
      // 4. Tags
      if (activeFilterTags.length > 0) {
        const hasAllTags = activeFilterTags.every(tag => item.tags.includes(tag));
        if (!hasAllTags) return false;
      }
      return true;
    });
  }, [items, activeTab, searchQuery, selectedOccasion, activeFilterTags]);

  const activeFiltersCount = (searchQuery ? 1 : 0) + (selectedOccasion !== '全部场合' ? 1 : 0) + activeFilterTags.length;

  return (
    <div className="w-full max-w-lg mx-auto bg-transparent min-h-screen px-margin-page pb-32 pt-6 text-white font-sans">
      {/* Premium Elegant Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.15em] text-white/50 font-semibold active-glow">My Closet</span>
          <h1 className="text-display-lg font-display tracking-tight text-white">我的衣橱</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onLogout}
            title="退出登录"
            className="w-10 h-10 rounded-full glass-panel border-white/10 text-white/60 flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-white/10 hover:text-white/80"
          >
            <LogOut size={16} />
          </button>
          <button 
            onClick={onAddItem}
            className="w-12 h-12 rounded-full glass-panel border-white/10 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-white/10 hover:border-white/20"
            id="btn-add-item-header"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-panel p-3 rounded-[18px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col justify-between">
          <span className="text-[11px] text-white/50">单品总数</span>
          <span className="text-xl font-display font-bold mt-1 text-white">{stats.total}</span>
        </div>
        <button 
          onClick={() => toggleFilterTag('已洗涤')}
          className={`p-3 rounded-[18px] border transition-all text-left flex flex-col justify-between ${
            activeFilterTags.includes('已洗涤')
              ? 'bg-purple-900/40 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
              : 'glass-panel border-white/10 text-white hover:bg-white/5'
          }`}
        >
          <span className={`text-[11px] ${activeFilterTags.includes('已洗涤') ? 'text-white' : 'text-white/50'}`}>已洗涤</span>
          <div className="flex items-baseline justify-between w-full mt-1">
            <span className="text-xl font-display font-bold">{stats.washed}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${activeFilterTags.includes('已洗涤') ? 'bg-purple-400 shadow-[0_0_8px_#a855f7]' : 'bg-green-500'}`}></span>
          </div>
        </button>
        <button 
          onClick={() => toggleFilterTag('待搭配')}
          className={`p-3 rounded-[18px] border transition-all text-left flex flex-col justify-between ${
            activeFilterTags.includes('待搭配')
              ? 'bg-purple-900/40 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
              : 'glass-panel border-white/10 text-white hover:bg-white/5'
          }`}
        >
          <span className={`text-[11px] ${activeFilterTags.includes('待搭配') ? 'text-white' : 'text-white/50'}`}>待搭配</span>
          <div className="flex items-baseline justify-between w-full mt-1">
            <span className="text-xl font-display font-bold">{stats.pendingMatch}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${activeFilterTags.includes('待搭配') ? 'bg-purple-400 shadow-[0_0_8px_#a855f7]' : 'bg-amber-500'}`}></span>
          </div>
        </button>
      </div>

      {/* Styled Tabs (Continuous Scrolling Menu) */}
      <div className="border-b border-white/10 mb-5 overflow-x-auto scrollbar-none flex gap-6">
        {CATEGORIES.map(category => {
          const isActive = activeTab === category.value;
          return (
            <button
              key={category.value}
              onClick={() => setActiveTab(category.value)}
              className="relative pb-3 text-[15px] font-medium transition-colors whitespace-nowrap"
              id={`tab-${category.value}`}
            >
              <span className={isActive ? 'text-white font-semibold active-glow' : 'text-white/40 hover:text-white/70'}>
                {category.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 shadow-[0_0_8px_#a855f7]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Advanced Filters Trigger Bar */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="搜索单品、系列、颜色..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 pl-10 pr-4 py-2.5 rounded-2xl text-[14px] border border-white/10 text-white focus:border-purple-500/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/30"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-2xl border transition-all flex items-center justify-center gap-1.5 px-3 hover:bg-white/5 ${
            showFilters || activeFiltersCount > 0
              ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
              : 'glass-panel border-white/10 text-white'
          }`}
          id="btn-filter-toggle"
        >
          <SlidersHorizontal size={18} />
          {activeFiltersCount > 0 && (
            <span className="bg-white text-purple-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filter Panel Expander */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-[0_15px_30px_rgba(0,0,0,0.5)] space-y-4"
          >
            {/* Occasion Selection */}
            <div>
              <span className="text-[11px] font-semibold text-white/50 block mb-2 tracking-wider uppercase">场合过滤</span>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map(occ => {
                  const isSelected = selectedOccasion === occ || (occ === '全部场合' && selectedOccasion === '全部场合');
                  return (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                        selectedOccasion === occ
                          ? 'bg-purple-600 text-white font-medium shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                          : occ === '全部场合' && selectedOccasion === '全部场合'
                          ? 'bg-purple-600 text-white font-medium shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                          : 'bg-white/5 text-white/60 border border-white/5 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Tag Selections */}
            <div>
              <span className="text-[11px] font-semibold text-white/50 block mb-2 tracking-wider uppercase">状态/标签过滤</span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map(tag => {
                  const isFiltered = activeFilterTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleFilterTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all border flex items-center gap-1 ${
                        isFiltered
                          ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {isFiltered && <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Control operations */}
            <div className="flex justify-end pt-2 border-t border-white/10 gap-3 text-xs">
              <button onClick={clearFilters} className="text-white/40 py-1 px-2 hover:text-white hover:underline">
                重置筛选
              </button>
              <button onClick={() => setShowFilters(false)} className="bg-white/5 text-white py-1 px-3 rounded-lg border border-white/10 font-medium hover:bg-white/10">
                完成
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Results Summary */}
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-xs text-white/50">
          已筛选 {filteredItems.length} 件单品
        </span>
        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-purple-400 font-semibold hover:underline flex items-center gap-1">
            清除所有过滤 ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Wardrobe Grid Layout: 2 Columns, 3:4 portrait aspect ratios */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`item-card-container-${item.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: index * 0.03 }}
                onClick={() => onSelectItem(item)}
                className="group cursor-pointer glass-panel rounded-card overflow-hidden border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.15)] hover:border-white/20 hover:shadow-[0_12px_40px_rgba(168,85,247,0.15)] hover:scale-[1.01] transition-all"
                id={`closet-grid-item-${item.id}`}
              >
                {/* Image Box 3:4 aspect-ratio */}
                <div className="relative aspect-[3/4] w-full bg-black/30 overflow-hidden border-b border-white/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 duration-700 transition-transform"
                    onError={(e) => {
                      // Fallback image in case of load fails
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  {/* Category Chip */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] font-semibold text-white/90 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                    {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                  </span>

                  {/* Status Badges Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1 max-w-[90%]">
                    {item.tags.slice(0, 2).map((tag, i) => (
                      <span 
                        key={i} 
                        className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${
                          tag === '已洗涤' || tag === '已干洗' || tag === '已保养'
                            ? 'bg-purple-900/60 border-purple-400/50 text-purple-200'
                            : tag === '待搭配'
                            ? 'bg-amber-900/60 border-amber-400/50 text-amber-200'
                            : 'bg-black/60 border-white/10 text-white'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info block */}
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] block uppercase tracking-[0.05em] text-white/40 font-bold max-w-full truncate">
                    {item.collection}
                  </span>
                  <div className="flex justify-between items-start gap-1">
                    <h3 className="text-sm font-semibold text-white line-clamp-1 flex-1 leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      ¥{item.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-white/50 pt-1">
                    <span className="truncate max-w-[60%]">{item.material}</span>
                    <span className="h-1 w-1 bg-white/20 rounded-full shrink-0"></span>
                    <span className="truncate">{item.color}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 glass-panel border border-white/10 rounded-[24px] space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/35">
            <Shirt size={32} />
          </div>
          <div className="text-center space-y-1">
            <p className="font-semibold text-white">未找到衣橱单品</p>
            <p className="text-xs text-white/50 max-w-xs">
              未能匹配当前过滤条件。你可以尝试更换上方分类、清除过滤标签或直接新增单品。
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10"
          >
            重置所有条件
          </button>
        </div>
      )}

      {/* Floating Add Item Button bottom persistent trigger */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-40 max-w-md mx-auto pointer-events-none">
        <button
          onClick={onAddItem}
          className="pointer-events-auto w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white h-[56px] rounded-full font-display font-semibold text-[15px] tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(168,85,247,0.35)] hover:scale-[1.01] transition-all active:scale-95 duration-200"
          id="btn-add-item-floating"
        >
          <Plus size={20} />
          <span>添加衣橱单品</span>
        </button>
      </div>
    </div>
  );
}
