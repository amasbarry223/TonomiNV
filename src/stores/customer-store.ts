import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/stores/cart-store';

export interface DeliveryAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  instructions?: string;
  isDefault: boolean;
}

export type PaymentMethod = 'orange_money' | 'wave' | 'mobi_money' | 'especes';

export type CustomerOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface CustomerOrder {
  id: string;
  number: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: CustomerOrderStatus;
  payment: PaymentMethod;
  address: DeliveryAddress;
  promoCode?: string;
  createdAt: string;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

interface CustomerState {
  current: Customer | null;
  customers: Customer[];
  orders: CustomerOrder[];
  savedAddresses: DeliveryAddress[];

  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => { success: boolean; error?: string };

  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<Pick<Customer, 'firstName' | 'lastName' | 'phone'>>) => void;

  placeOrder: (data: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    payment: PaymentMethod;
    address: DeliveryAddress;
    promoCode?: string;
  }) => CustomerOrder;

  saveAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

function generateOrderNumber(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CMD-2026-${rand}`;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      current: null,
      customers: [],
      orders: [],
      savedAddresses: [],

      register: ({ firstName, lastName, email, phone, password }) => {
        const existing = get().customers.find(
          (c) => c.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) {
          return { success: false, error: 'Cette adresse email est déjà utilisée.' };
        }
        const customer: Customer = {
          id: `cust-${Date.now()}`,
          firstName,
          lastName,
          email,
          phone,
          password,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ customers: [...s.customers, customer], current: customer }));
        return { success: true };
      },

      login: (email, password) => {
        const customer = get().customers.find(
          (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
        );
        if (!customer) {
          return { success: false, error: 'Email ou mot de passe incorrect.' };
        }
        set({ current: customer });
        return { success: true };
      },

      logout: () => set({ current: null }),

      updateProfile: (data) =>
        set((s) => ({
          current: s.current ? { ...s.current, ...data } : null,
          customers: s.current
            ? s.customers.map((c) => (c.id === s.current!.id ? { ...c, ...data } : c))
            : s.customers,
        })),

      placeOrder: (data) => {
        const order: CustomerOrder = {
          id: `order-${Date.now()}`,
          number: generateOrderNumber(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          ...data,
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },

      saveAddress: (address) => {
        const id = `addr-${Date.now()}`;
        set((s) => {
          const list = address.isDefault
            ? s.savedAddresses.map((a) => ({ ...a, isDefault: false }))
            : s.savedAddresses;
          return { savedAddresses: [...list, { ...address, id }] };
        });
      },

      deleteAddress: (id) =>
        set((s) => ({ savedAddresses: s.savedAddresses.filter((a) => a.id !== id) })),

      setDefaultAddress: (id) =>
        set((s) => ({
          savedAddresses: s.savedAddresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),
    }),
    { name: 'tonomi-customer' }
  )
);

export const PAYMENT_INFO: Record<
  PaymentMethod,
  { label: string; description: string; number?: string; color: string; bg: string }
> = {
  orange_money: {
    label: 'Orange Money',
    description: 'Paiement mobile rapide',
    number: '+223 75 66 68 53',
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
  },
  wave: {
    label: 'Wave',
    description: 'Transfert Wave instantané',
    number: '+223 75 66 68 53',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  mobi_money: {
    label: 'Mobi Money',
    description: 'Paiement via Mobi',
    number: '+223 75 66 68 53',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
  },
  especes: {
    label: 'Espèces à la livraison',
    description: 'Payez en cash à la réception',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
  },
};

export const ORDER_STATUS_LABELS: Record<CustomerOrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export const ORDER_STATUS_COLORS: Record<CustomerOrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const COUNTRIES = [
  'Mali', 'Sénégal', "Côte d'Ivoire", 'Guinée', 'Burkina Faso',
  'Niger', 'Mauritanie', 'Gambie', 'France', 'Autre',
];

export const MALI_CITIES = [
  'Bamako', 'Ségou', 'Mopti', 'Tombouctou', 'Gao',
  'Kayes', 'Sikasso', 'Koulikoro', 'Kidal', 'Autre ville',
];

export function getShippingCost(city: string, country: string, subtotal: number): number {
  if (subtotal >= 30000) return 0;
  if (country !== 'Mali') return 15000;
  if (city === 'Bamako') return 2000;
  return 5000;
}
