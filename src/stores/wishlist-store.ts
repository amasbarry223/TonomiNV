import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  isOpen: boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  toggleWishlist: () => void;
  setWishlistOpen: (open: boolean) => void;
  getCount: () => number;
  moveItemToCart: (productId: string) => WishlistItem | undefined;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const exists = get().isInWishlist(item.productId);
        if (!exists) {
          set((state) => ({
            items: [...state.items, item],
          }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      toggleItem: (item) => {
        const exists = get().isInWishlist(item.productId);
        if (exists) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      toggleWishlist: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setWishlistOpen: (open) => {
        set({ isOpen: open });
      },

      getCount: () => {
        return get().items.length;
      },

      moveItemToCart: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (item) {
          get().removeItem(productId);
        }
        return item;
      },
    }),
    {
      name: 'tonomi-wishlist',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
