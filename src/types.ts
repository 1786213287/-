/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClothingItem {
  id: string;
  name: string;
  collection: string;
  price: number;
  material: string;
  color: string;
  occasion: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  createdAt: string;
}

export type TabType = 'all' | 'tops' | 'bottoms' | 'outerwear' | 'shoes';

export interface FilterOptions {
  searchQuery: string;
  occasion: string;
  tags: string[];
}
