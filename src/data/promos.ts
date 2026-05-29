export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
  minPurchase: number;
  validUntil: string;
}

export interface FlashSale {
  id: string;
  productId: string;
  discount: number;
  stockLeft: number;
  totalStock: number;
  endsAt: string;
}

export const promoCodes: PromoCode[] = [
  {
    id: "promo-001",
    code: "BIENVENUE10",
    discount: 10,
    type: "percentage",
    description: "10% de réduction sur votre première commande. Bienvenue chez TONOMI !",
    minPurchase: 10000,
    validUntil: "2026-12-31",
  },
  {
    id: "promo-002",
    code: "TONOMI20",
    discount: 20,
    type: "percentage",
    description: "20% de réduction sur toute la collection bijoux. L'élégance à prix réduit !",
    minPurchase: 20000,
    validUntil: "2026-06-30",
  },
  {
    id: "promo-003",
    code: "SAHEL5000",
    discount: 5000,
    type: "fixed",
    description: "5 000 FCFA de réduction sur les commandes de plus de 30 000 FCFA. Profitez-en !",
    minPurchase: 30000,
    validUntil: "2026-09-30",
  },
  {
    id: "promo-004",
    code: "FÊTE15",
    discount: 15,
    type: "percentage",
    description: "15% de réduction pour les fêtes ! Offrez-vous ou offrez un accessoire TONOMI.",
    minPurchase: 15000,
    validUntil: "2026-01-15",
  },
  {
    id: "promo-005",
    code: "AMIE10000",
    discount: 10000,
    type: "fixed",
    description: "10 000 FCFA de réduction sur les commandes de plus de 50 000 FCFA. Pour nos clientes fidèles !",
    minPurchase: 50000,
    validUntil: "2026-08-31",
  },
  {
    id: "promo-006",
    code: "NOUVEAU25",
    discount: 25,
    type: "percentage",
    description: "25% de réduction sur les nouveaux arrivages ! Découvrez les dernières créations de nos artisans.",
    minPurchase: 15000,
    validUntil: "2026-04-30",
  },
  {
    id: "promo-007",
    code: "LIVRAISON",
    discount: 3000,
    type: "fixed",
    description: "Livraison offerte ! 3 000 FCFA de réduction pour compenser les frais de livraison.",
    minPurchase: 20000,
    validUntil: "2026-12-31",
  },
];

export const flashSales: FlashSale[] = [
  {
    id: "flash-001",
    productId: "prod-001",
    discount: 22,
    stockLeft: 5,
    totalStock: 15,
    endsAt: "2026-03-20T23:59:59Z",
  },
  {
    id: "flash-002",
    productId: "prod-008",
    discount: 16,
    stockLeft: 4,
    totalStock: 12,
    endsAt: "2026-03-18T23:59:59Z",
  },
  {
    id: "flash-003",
    productId: "prod-018",
    discount: 22,
    stockLeft: 8,
    totalStock: 25,
    endsAt: "2026-03-22T23:59:59Z",
  },
  {
    id: "flash-004",
    productId: "prod-013",
    discount: 15,
    stockLeft: 12,
    totalStock: 20,
    endsAt: "2026-03-25T23:59:59Z",
  },
  {
    id: "flash-005",
    productId: "prod-035",
    discount: 24,
    stockLeft: 2,
    totalStock: 5,
    endsAt: "2026-03-15T23:59:59Z",
  },
  {
    id: "flash-006",
    productId: "prod-024",
    discount: 25,
    stockLeft: 6,
    totalStock: 18,
    endsAt: "2026-03-28T23:59:59Z",
  },
];

export function validatePromoCode(code: string, cartTotal: number): PromoCode | null {
  const promo = promoCodes.find(
    (p) => p.code.toUpperCase() === code.toUpperCase()
  );
  if (!promo) return null;
  if (cartTotal < promo.minPurchase) return null;
  const now = new Date();
  const validUntil = new Date(promo.validUntil);
  if (now > validUntil) return null;
  return promo;
}

export function calculateDiscount(promo: PromoCode, subtotal: number): number {
  if (promo.type === 'percentage') {
    return Math.round(subtotal * (promo.discount / 100));
  }
  return promo.discount;
}

export function getActiveFlashSales(): FlashSale[] {
  const now = new Date();
  return flashSales.filter(
    (sale) => sale.stockLeft > 0 && new Date(sale.endsAt) > now
  );
}
