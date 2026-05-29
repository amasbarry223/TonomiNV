import { create } from 'zustand';

interface FilterStore {
  category: string;
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  sort: string;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  setCategory: (cat: string) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleColor: (color: string) => void;
  toggleSize: (size: string) => void;
  setSort: (sort: string) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const initialState = {
  category: '',
  priceRange: [0, 100000] as [number, number],
  colors: [] as string[],
  sizes: [] as string[],
  sort: 'featured',
  searchQuery: '',
  viewMode: 'grid' as const,
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  ...initialState,

  setCategory: (cat) => {
    set({ category: cat });
  },

  setPriceRange: (range) => {
    set({ priceRange: range });
  },

  toggleColor: (color) => {
    set((state) => {
      const colors = state.colors.includes(color)
        ? state.colors.filter((c) => c !== color)
        : [...state.colors, color];
      return { colors };
    });
  },

  toggleSize: (size) => {
    set((state) => {
      const sizes = state.sizes.includes(size)
        ? state.sizes.filter((s) => s !== size)
        : [...state.sizes, size];
      return { sizes };
    });
  },

  setSort: (sort) => {
    set({ sort });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  resetFilters: () => {
    set(initialState);
  },

  hasActiveFilters: () => {
    const state = get();
    return (
      state.category !== '' ||
      state.priceRange[0] !== 0 ||
      state.priceRange[1] !== 100000 ||
      state.colors.length > 0 ||
      state.sizes.length > 0 ||
      state.searchQuery !== ''
    );
  },
}));

export const AVAILABLE_COLORS = [
  { value: 'noir', label: 'Noir' },
  { value: 'blanc', label: 'Blanc' },
  { value: 'or', label: 'Or' },
  { value: 'argent', label: 'Argent' },
  { value: 'marron', label: 'Marron' },
  { value: 'terracotta', label: 'Terracotta' },
  { value: 'bordeaux', label: 'Bordeaux' },
  { value: 'bleu', label: 'Bleu' },
  { value: 'vert', label: 'Vert' },
  { value: 'rose', label: 'Rose' },
  { value: 'jaune', label: 'Jaune' },
  { value: 'multicolore', label: 'Multicolore' },
];

export const AVAILABLE_SIZES = [
  { value: 'unique', label: 'Unique' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'En vedette' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'rating', label: 'Meilleures notes' },
  { value: 'bestseller', label: 'Meilleures ventes' },
];
