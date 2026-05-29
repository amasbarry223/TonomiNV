import { create } from 'zustand';

export type PageName = 'home' | 'catalogue' | 'promotions' | 'about' | 'contact' | 'product' | 'admin';

interface NavStore {
  currentPage: PageName;
  selectedProductId: string | null;
  selectedCategory: string | null;
  navigate: (page: PageName, options?: { productId?: string; category?: string }) => void;
  goHome: () => void;
  goCatalog: (category?: string) => void;
  goCatalogue: (category?: string) => void;
  goProduct: (productId: string) => void;
  goPromotions: () => void;
  goAbout: () => void;
  goContact: () => void;
  goAdmin: () => void;
}

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const goCatalogueImpl = (set: (partial: Partial<NavStore>) => void, category?: string) => {
  set({
    currentPage: 'catalogue',
    selectedProductId: null,
    selectedCategory: category ?? null,
  });
  scrollToTop();
};

export const useNavStore = create<NavStore>()((set) => ({
  currentPage: 'home',
  selectedProductId: null,
  selectedCategory: null,

  navigate: (page, options) => {
    set({
      currentPage: page,
      selectedProductId: options?.productId ?? null,
      selectedCategory: options?.category ?? null,
    });
    scrollToTop();
  },

  goHome: () => {
    set({
      currentPage: 'home',
      selectedProductId: null,
      selectedCategory: null,
    });
    scrollToTop();
  },

  goCatalog: (category) => goCatalogueImpl(set, category),
  goCatalogue: (category) => goCatalogueImpl(set, category),

  goProduct: (productId) => {
    set({
      currentPage: 'product',
      selectedProductId: productId,
    });
    scrollToTop();
  },

  goPromotions: () => {
    set({
      currentPage: 'promotions',
      selectedProductId: null,
      selectedCategory: null,
    });
    scrollToTop();
  },

  goAbout: () => {
    set({
      currentPage: 'about',
      selectedProductId: null,
      selectedCategory: null,
    });
    scrollToTop();
  },

  goContact: () => {
    set({
      currentPage: 'contact',
      selectedProductId: null,
      selectedCategory: null,
    });
    scrollToTop();
  },

  goAdmin: () => {
    set({
      currentPage: 'admin',
      selectedProductId: null,
      selectedCategory: null,
    });
    scrollToTop();
  },
}));
