/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Share2, Edit, Trash2, Palette, Ruler, Layers, Star, CheckCircle, RefreshCw } from 'lucide-react';
import { ClothingItem } from '../types';
import { motion } from 'motion/react';

interface ItemDetailsProps {
  item: ClothingItem;
  onBack: () => void;
  onEdit: (item: ClothingItem) => void;
  onDelete: (itemId: string) => void;
  onUpdateTags: (itemId: string, tags: string[]) => void;
}

export default function ItemDetails({ item, onBack, onEdit, onDelete, onUpdateTags }: ItemDetailsProps) {
  const [copied, setCopied] = useState(false);

  // Toggle single tag
  const handleToggleTag = (tag: string) => {
    let newTags = [...item.tags];
    if (newTags.includes(tag)) {
      newTags = newTags.filter(t => t !== tag);
    } else {
      newTags.push(tag);
    }
    onUpdateTags(item.id, newTags);
  };

  // Safe share action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `看看我衣橱里的这件: ${item.name} (${item.collection})`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`👗【我的衣橱分享】\n单品: ${item.name}\n价格: ¥${item.price}\n材质: ${item.material}\n配对属性: ${item.color} | ${item.occasion}\n描述: ${item.description}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-transparent text-white min-h-screen pb-36 relative">
      {/* Toast Notice when share is clicked (Fallback) */}
      {copied && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white rounded-full px-5 py-2 text-xs font-semibold z-50 shadow-[0_0_20px_rgba(168,85,247,0.3)] pointer-events-none flex items-center gap-1.5 border border-white/10">
          <CheckCircle size={14} className="text-purple-400" />
          <span>衣橱单品参数已复制到剪切板</span>
        </div>
      )}

      {/* Header Context Bar: Floats absolutely over image */}
      <header className="flex justify-between items-center px-margin-page h-16 w-full z-40 fixed top-0 left-0 right-0 max-w-lg mx-auto bg-transparent">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full glass-panel hover:scale-95 active:scale-90 transition-all border border-white/10 shadow-lg hover:bg-white/10"
          id="btn-detail-back"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <span className="text-sm font-semibold tracking-[0.18em] text-white font-display active-glow">CLOSET</span>
        <button 
          onClick={handleShare}
          className="w-10 h-10 flex items-center justify-center rounded-full glass-panel hover:scale-95 active:scale-90 transition-all border border-white/10 shadow-lg hover:bg-white/10"
          id="btn-detail-share"
        >
          <Share2 size={18} className="text-white" />
        </button>
      </header>

      {/* Hero Section: Large Full-bleed Clothes Image (Matches 530px template height) */}
      <section className="relative w-full h-[530px] overflow-hidden bg-slate-950/20">
        <motion.img 
          layoutId={`item-image-${item.id}`}
          className="w-full h-full object-cover" 
          src={item.image} 
          alt={item.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600';
          }}
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </section>

      {/* Sliding Glass Card with Info */}
      <section className="relative -mt-24 px-margin-page z-10">
        <motion.div 
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-6 rounded-squircle shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-white/10"
        >
          {/* Title and Price */}
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight active-glow">
                {item.name}
              </h1>
              <p className="text-sm text-white/50 font-semibold">{item.collection}</p>
            </div>
            <span className="font-display text-[22px] font-bold text-white leading-none pt-1">
              ¥{item.price}
            </span>
          </div>

          {/* Detailed Attributes Grid */}
          <div className="grid grid-cols-1 gap-y-3 mb-6">
            {/* Row 1: Material */}
            <div className="flex items-center gap-x-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Layers size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">材质</p>
                <p className="text-sm text-white font-semibold">{item.material || '未填写'}</p>
              </div>
            </div>

            {/* Row 2: Color */}
            <div className="flex items-center gap-x-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Palette size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">颜色</p>
                <p className="text-sm text-white font-semibold">{item.color || '未填写'}</p>
              </div>
            </div>

            {/* Row 3: Occasion (休闲, etc) */}
            <div className="flex items-center gap-x-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Star size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">场合</p>
                <p className="text-sm text-white font-semibold">{item.occasion || '未填写'}</p>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="mb-6">
            <h3 className="text-[11px] font-bold tracking-widest text-white/40 uppercase mb-2">描述</h3>
            <p className="text-sm text-white/80 leading-relaxed font-normal bg-white/5 p-3.5 rounded-xl border border-white/10">
              {item.description || '无详细描述。'}
            </p>
          </div>

          {/* Wash/Matching Chips Layer - Clickable switches to quickly toggle washed/pair statuses! */}
          <div>
            <h3 className="text-[11px] font-bold tracking-widest text-white/40 uppercase mb-2.5">
              状态管理 (可点击快速切换)
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleToggleTag('已洗涤')}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all border ${
                  item.tags.includes('已洗涤')
                    ? 'bg-purple-900/40 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
                id="btn-toggle-washed"
              >
                已洗涤
              </button>
              <button
                onClick={() => handleToggleTag('待搭配')}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all border ${
                  item.tags.includes('待搭配')
                    ? 'bg-purple-900/40 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
                id="btn-toggle-pair"
              >
                待搭配
              </button>
              <button
                onClick={() => handleToggleTag('最爱')}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all border ${
                  item.tags.includes('最爱')
                    ? 'bg-purple-900/40 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
                id="btn-toggle-favorite"
              >
                最爱
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Fixed Sticky Action Bar at the very bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-[#05020a] via-[#05020a]/90 to-transparent max-w-lg mx-auto">
        <div className="flex gap-4">
          {/* Edit Button - spans full ratio */}
          <button 
            onClick={() => onEdit(item)}
            className="flex-1 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white h-[56px] rounded-full font-display font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(168,85,247,0.35)] hover:scale-[1.01] transition-all active:scale-95 duration-200"
            id="btn-action-edit-item"
          >
            <Edit size={18} />
            <span>编辑单品</span>
          </button>
          
          {/* Delete Button */}
          <button 
            onClick={() => {
              if (window.confirm('确定要从数码衣橱中删除这件衣物单品吗？此操作无法撤销。')) {
                onDelete(item.id);
              }
            }}
            className="w-[56px] h-[56px] glass-panel border border-white/10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-300 hover:scale-[1.01] transition-all active:scale-95 duration-200 shadow-lg"
            title="删除单品"
            id="btn-action-delete-item"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
