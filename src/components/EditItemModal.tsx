/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, HelpCircle, Check, Loader2, ArrowLeft, UploadCloud } from 'lucide-react';
import { ClothingItem, TabType } from '../types';
import { MOCK_IMAGES } from '../data';
import { motion } from 'motion/react';

interface EditItemModalProps {
  item?: ClothingItem | null; // If null, we are adding a new item
  onClose: () => void;
  onSave: (item: Omit<ClothingItem, 'id' | 'createdAt'> & { id?: string }) => void;
}

const OCCASION_OPTIONS = ['休闲', '商务', '居家', '运动', '通勤'];
const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'tops', label: '上装 (Tops)' },
  { value: 'bottoms', label: '下装 (Bottoms)' },
  { value: 'outerwear', label: '外套 (Outerwear)' },
  { value: 'shoes', label: '鞋履 (Shoes)' },
];

export default function EditItemModal({ item, onClose, onSave }: EditItemModalProps) {
  const isEdit = !!item;

  // Form States
  const [name, setName] = useState('');
  const [collection, setCollection] = useState('');
  const [price, setPrice] = useState<number>(199);
  const [category, setCategory] = useState('tops');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [occasion, setOccasion] = useState('休闲');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [customUrl, setCustomUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form state
  useEffect(() => {
    if (item) {
      setName(item.name);
      setCollection(item.collection);
      setPrice(item.price);
      setCategory(item.category);
      setMaterial(item.material);
      setColor(item.color);
      setOccasion(item.occasion);
      setDescription(item.description);
      setImage(item.image);
      setTags(item.tags);
      setCustomUrl(item.image);
    } else {
      // Defaults for a new item
      setName('');
      setCollection('Essential Collection');
      setPrice(199);
      setCategory('tops');
      setMaterial('100% 棉');
      setColor('奶油白');
      setOccasion('休闲');
      setDescription('');
      // Default to the white T-Shirt preset image
      setImage(MOCK_IMAGES[0].url);
      setTags(['已洗涤', '待搭配']);
      setCustomUrl('');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('请输入服装名称');
    if (!image) return alert('请确保服装已关联照片');

    onSave({
      id: item?.id,
      name: name.trim(),
      collection: collection.trim() || 'Custom Collection',
      price: price || 0,
      category,
      material: material.trim(),
      color: color.trim(),
      occasion,
      description: description.trim(),
      image,
      tags,
    });
  };

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  // Convert uploaded image file to usable base64 stream
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请确保上传合法的图像文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-transparent text-white min-h-screen relative pb-28 font-sans">
      {/* Header Context Bar */}
      <header className="flex justify-between items-center px-margin-page h-16 w-full sticky top-0 z-40 bg-[#05020a]/80 backdrop-blur-lg border-b border-white/10">
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:scale-95 active:scale-90 transition-all text-white border border-white/10 hover:bg-white/10"
          id="btn-edit-close"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm font-semibold tracking-wider text-white font-display active-glow">
          {isEdit ? '编辑衣橱单品' : '新增数码单品'}
        </span>
        <button 
          onClick={handleSubmit}
          className="text-sm font-semibold text-purple-300 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 hover:bg-purple-800/40 transition-colors"
          id="btn-edit-save-upper"
        >
          保 存
        </button>
      </header>

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="px-margin-page py-6 space-y-6">
        
        {/* SECTION 1: PHOTO ASSISTANCE */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase block">服装照片 (Presets & Upload)</span>
          
          {/* Main Photo Preview */}
          <div className="relative aspect-[3/4] w-2/3 mx-auto bg-black/30 rounded-card overflow-hidden border border-white/10 shadow-lg group">
            <img 
              src={image} 
              alt="Clothing preview" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=400';
              }}
            />
            {/* Camera Overlay tag */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="bg-slate-900/95 p-3 rounded-full shadow-lg text-white flex items-center gap-1.5 text-xs font-semibold border border-white/10">
                <Camera size={16} />
                <span>更换照片</span>
              </div>
            </div>
          </div>

          {/* Quick preset selector cards */}
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-white/50 block">1. 快速关联完美预设素材</span>
            <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {MOCK_IMAGES.map((mockImg, index) => {
                const isSelected = image === mockImg.url;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      setImage(mockImg.url);
                      setCustomUrl('');
                    }}
                    className={`relative w-20 aspect-[3/4] shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-purple-500 scale-95 shadow-[0_0_12px_#a855f7]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={mockImg.url} alt={mockImg.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] py-0.5 text-center truncate block px-1">
                      {mockImg.label}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-purple-600 text-white rounded-full p-0.5">
                        <Check size={8} className="stroke-[4]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core upload drag zone */}
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-white/50 block">2. 或者 上传本地珍藏相册或填入网络外链</span>
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-purple-500 bg-purple-950/20' 
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud size={28} className="mx-auto text-white/30 mb-1.5" />
              <p className="text-xs font-semibold text-white">点击或拖拽单品图片到此处</p>
              <p className="text-[10px] text-white/40 mt-0.5">完美支持 PNG, JPG, WEBP, HEIC</p>
            </div>

            {/* URL string editor */}
            <input
              type="text"
              placeholder="或直接输入高质量图片 HTTP URL 地址..."
              value={customUrl}
              onChange={(e) => {
                setCustomUrl(e.target.value);
                if (e.target.value.trim().startsWith('http')) {
                  setImage(e.target.value.trim());
                }
              }}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-xs focus:border-purple-500/50 focus:bg-white/10 focus:outline-none transition-colors placeholder:text-white/20"
            />
          </div>
        </div>

        {/* SECTION 2: ATTRIBUTES DETAILS */}
        <div className="space-y-4">
          <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase block">服装基础属性</span>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">服装名称 <span className="text-purple-400">*</span></label>
            <input
              type="text"
              placeholder="例如：纯棉圆领 T 恤、英伦高腰毛呢裙..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 px-4 py-3 rounded-2xl text-sm border border-white/10 focus:border-purple-500/40 focus:bg-white/10 focus:outline-none transition-all font-medium text-white placeholder:text-white/20"
              required
            />
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">专柜价格 (¥)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={price || ''}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-white/5 px-4 py-3 rounded-2xl text-sm border border-white/10 focus:border-purple-500/40 focus:bg-white/10 focus:outline-none transition-all font-medium text-white placeholder:text-white/20"
              />
            </div>

            {/* Category Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">分类归档</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{backgroundColor: '#05020a', color: '#fff'}}
                className="w-full bg-white/5 px-3 py-3 rounded-2xl text-sm border border-white/10 focus:border-purple-500/40 focus:bg-white/10 focus:outline-none transition-all font-medium text-white appearance-none cursor-pointer"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Material */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">面料材质</label>
              <input
                type="text"
                placeholder="100% 棉、羊毛混纺..."
                value={material}
                onChange={e => setMaterial(e.target.value)}
                className="w-full bg-white/5 px-4 py-3 rounded-2xl text-sm border border-white/10 focus:border-purple-500/40 focus:bg-white/10 focus:outline-none transition-all font-medium text-white placeholder:text-white/20"
              />
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">色调色彩</label>
              <input
                type="text"
                placeholder="奶油白、曜石黑、卡其色..."
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-full bg-white/5 px-4 py-3 rounded-2xl text-sm border border-white/10 focus:border-purple-500/40 focus:bg-white/10 focus:outline-none transition-all font-medium text-white placeholder:text-white/20"
              />
            </div>
            
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Occasions Slider */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70 block">适合场合</label>
              <div className="flex flex-wrap gap-2">
                {OCCASION_OPTIONS.map(occ => {
                  const isSelected = occasion === occ;
                  return (
                    <button
                      type="button"
                      key={occ}
                      onClick={() => setOccasion(occ)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.35)]' 
                          : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Collection Column Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">所属系列</label>
            <input
              type="text"
              placeholder="Essential Collection、2026 夏季常驻、职场正装..."
              value={collection}
              onChange={e => setCollection(e.target.value)}
              className="w-full bg-white/5 px-4 py-3 rounded-2xl text-sm border border-white/10 focus:border-purple-500/40 focus:bg-white/10 focus:outline-none transition-all font-medium text-white placeholder:text-white/20"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">单品描述 (Description)</label>
            <textarea
              placeholder="写写这件衣服的设计、保养或者搭配心得..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-white/5 px-4 py-3 rounded-2xl text-sm border border-white/10 focus:border-purple-500/40 focus:bg-white/10 focus:outline-none transition-all font-medium text-white resize-none placeholder:text-white/20"
            />
          </div>
        </div>

        {/* SECTION 3: STATUS LABELS */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase block">快捷管理状态标签</span>
          <div className="flex flex-wrap gap-2.5">
            {['已洗涤', '待搭配', '最爱', '待清洗', '已干洗'].map(tagOption => {
              const isActive = tags.includes(tagOption);
              return (
                <button
                  type="button"
                  key={tagOption}
                  onClick={() => handleToggleTag(tagOption)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-purple-900/40 border-purple-500 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {tagOption}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button persistent row */}
        <div className="pt-6 border-t border-white/10 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[52px] rounded-full border border-white/10 bg-white/5 text-white/80 font-semibold text-sm hover:bg-white/10 active:scale-95 transition-all"
          >
            取 消
          </button>
          <button
            type="submit"
            className="flex-1 h-[52px] rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold text-sm active:scale-95 transition-all shadow-[0_4px_20px_rgba(168,85,247,0.35)] border border-purple-500/30"
            id="btn-edit-save-lower"
          >
            {isEdit ? '保存修改' : '确认上架'}
          </button>
        </div>
      </form>
    </div>
  );
}
