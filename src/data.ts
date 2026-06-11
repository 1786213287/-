/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClothingItem } from './types';

export const SEED_ITEMS: ClothingItem[] = [
  {
    id: '1',
    name: '纯棉圆领T恤',
    collection: 'Essential Collection',
    price: 199,
    material: '100% 棉',
    color: '奶油白',
    occasion: '休闲',
    description: '采用高品质长绒棉织造，克重扎实，透气性佳。经典圆领剪裁，适合日常各种叠穿或单穿搭配。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmioX6Uw0xpnz58QwM0W1J3hGUvFvz6ZHmdIZCGzaQ4_KHNMi_Xq-shK6d4koACCYPL8fO8OIO1_VFeCu9z30X1dUrL8A4N3L5WWD_EOm0mBhJLWhn34tqT7AyRTe0cFpsGwg1ABWKehRW6TV1ZV869iW4NaFkFRK6odmLVhc-zbVxfCbLluc186GV-FD8dUZkYhe_ll4BA_p3KbYht7ltIyvglJRtwY7d19xUJgKvhjRdu9nZipaJtxi08HPcxMqTPSnbP6m4fKM',
    tags: ['已洗涤', '待搭配'],
    category: 'tops',
    createdAt: new Date('2026-06-01T12:00:00Z').toISOString(),
  },
  {
    id: '2',
    name: '精纺羊毛西装外套',
    collection: 'Formal Elegance',
    price: 1299,
    material: '85% 澳大利亚羊毛, 15% 桑蚕丝',
    color: '燕麦灰',
    occasion: '商务',
    description: '高密度羊毛精纺剪裁，挺阔有型，垂坠感极佳。肩部微结构化设计，完美衬托身形且活动舒适自如，是出席正式会议与差旅的最佳单品。',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600',
    tags: ['已洗涤', '最爱'],
    category: 'outerwear',
    createdAt: new Date('2026-06-02T10:30:00Z').toISOString(),
  },
  {
    id: '3',
    name: '美利奴针织开衫',
    collection: 'Cozy Layering',
    price: 680,
    material: '100% 美利奴羊毛',
    color: '冷茶色',
    occasion: '居家',
    description: '采用超细美利奴羊毛纱线，质地细腻软糯。轻柔包裹身体的同时拥有极佳保暖性，是初秋叠穿或室内办公的最佳温柔内搭。',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
    tags: ['待搭配', '最爱'],
    category: 'tops',
    createdAt: new Date('2026-06-03T09:15:00Z').toISOString(),
  },
  {
    id: '4',
    name: '复古直筒牛仔裤',
    collection: 'Vintage Denim',
    price: 450,
    material: '100% 重磅耐磨单宁棉',
    color: '深水洗蓝',
    occasion: '休闲',
    description: '经典中高腰直筒裤型，经过重磅水洗物理打磨工艺，呈现自然复古质地与绝佳落色。面料透气扎实，穿着越久越契合身体律动。',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
    tags: ['已洗涤'],
    category: 'bottoms',
    createdAt: new Date('2026-06-04T15:20:00Z').toISOString(),
  },
  {
    id: '5',
    name: '极简头层牛皮板鞋',
    collection: 'Active Footwear',
    price: 799,
    material: '意大利进口头层牛皮',
    color: '极简白',
    occasion: '运动',
    description: '精选高级粒面皮，手感丰满温润。内部搭配亲肤透气牛皮垫，手工包缝大底。无论是商务休闲还是日常出行，都是极佳的优雅伴侣。',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
    tags: ['已洗涤', '最爱'],
    category: 'shoes',
    createdAt: new Date('2026-06-05T11:45:00Z').toISOString(),
  },
  {
    id: '6',
    name: '英伦休闲折痕西裤',
    collection: 'Formal Elegance',
    price: 520,
    material: '70% 涤纶, 30% 粘胶纤维',
    color: '曜石黑',
    occasion: '商务',
    description: '利落的垂顺骨位中缝折痕，视觉延长腿部线条，适合日常职场或时尚出街。抗皱面料易于打理，保持全天挺括。',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    tags: ['待搭配'],
    category: 'bottoms',
    createdAt: new Date('2026-06-06T08:00:00Z').toISOString(),
  }
];

export const MOCK_IMAGES = [
  { label: '白色圆领 T 恤', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmioX6Uw0xpnz58QwM0W1J3hGUvFvz6ZHmdIZCGzaQ4_KHNMi_Xq-shK6d4koACCYPL8fO8OIO1_VFeCu9z30X1dUrL8A4N3L5WWD_EOm0mBhJLWhn34tqT7AyRTe0cFpsGwg1ABWKehRW6TV1ZV869iW4NaFkFRK6odmLVhc-zbVxfCbLluc186GV-FD8dUZkYhe_ll4BA_p3KbYht7ltIyvglJRtwY7d19xUJgKvhjRdu9nZipaJtxi08HPcxMqTPSnbP6m4fKM' },
  { label: '燕麦色羊毛西装', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600' },
  { label: '浅灰色针织上衣', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600' },
  { label: '复古直筒牛仔裤', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600' },
  { label: '高级极简小白鞋', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600' },
  { label: '轻商务黑色折痕裤', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600' },
  { label: '经典沙色轻便风衣', url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600' },
  { label: '极简摩登牛皮短靴', url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600' }
];


