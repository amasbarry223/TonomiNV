import { create } from 'zustand';

export type AdminPage = 
  | 'dashboard' 
  | 'products' 
  | 'categories' 
  | 'orders' 
  | 'promos' 
  | 'flash-sales' 
  | 'contacts' 
  | 'newsletter' 
  | 'settings';

interface AdminStore {
  currentPage: AdminPage;
  sidebarOpen: boolean;
  navigate: (page: AdminPage) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAdminStore = create<AdminStore>()((set) => ({
  currentPage: 'dashboard',
  sidebarOpen: true,

  navigate: (page) => {
    set({ currentPage: page });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },
}));
