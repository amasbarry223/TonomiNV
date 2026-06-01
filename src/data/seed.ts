import type { Customer, CustomerOrder } from '@/stores/customer-store'

// ── Clients ───────────────────────────────────────────────────────────────────

export const seedCustomers: Customer[] = [
  {
    id: 'cust-demo-001',
    firstName: 'Fatima',
    lastName: 'Coulibaly',
    email: 'fatima.coulibaly@gmail.com',
    phone: '+223 76 45 12 89',
    password: 'demo1234',
    createdAt: '2026-02-14T09:00:00.000Z',
  },
  {
    id: 'cust-demo-002',
    firstName: 'Aminata',
    lastName: 'Traoré',
    email: 'aminata.traore@gmail.com',
    phone: '+223 65 33 87 54',
    password: 'demo1234',
    createdAt: '2026-02-28T11:30:00.000Z',
  },
  {
    id: 'cust-demo-003',
    firstName: 'Mariama',
    lastName: 'Keïta',
    email: 'mariama.keita@yahoo.fr',
    phone: '+225 07 88 44 21',
    password: 'demo1234',
    createdAt: '2026-03-10T14:00:00.000Z',
  },
]

// ── Adresses ─────────────────────────────────────────────────────────────────

const addrFatima = {
  id: 'addr-demo-001', label: 'Domicile', firstName: 'Fatima', lastName: 'Coulibaly',
  email: 'fatima.coulibaly@gmail.com', phone: '+223 76 45 12 89',
  address: 'ACI 2000, Rue 312', city: 'Bamako', country: 'Mali', isDefault: true,
}

const addrAminata = {
  id: 'addr-demo-002', label: 'Domicile', firstName: 'Aminata', lastName: 'Traoré',
  email: 'aminata.traore@gmail.com', phone: '+223 65 33 87 54',
  address: 'Quartier Médine', city: 'Ségou', country: 'Mali', isDefault: true,
}

const addrMariama = {
  id: 'addr-demo-003', label: 'Domicile', firstName: 'Mariama', lastName: 'Keïta',
  email: 'mariama.keita@yahoo.fr', phone: '+225 07 88 44 21',
  address: 'Cocody Riviera 2, Villa 48', city: 'Abidjan', country: "Côte d'Ivoire", isDefault: true,
}

// ── Helper ────────────────────────────────────────────────────────────────────

function item(productId: string, name: string, price: number, qty = 1, color = 'or', size = 'unique') {
  return { id: `item-${productId}-${Date.now() + Math.random()}`, productId, name, price, quantity: qty, color, size, image: '' }
}

function order(
  num: string,
  items: ReturnType<typeof item>[],
  subtotal: number,
  discount: number,
  shipping: number,
  status: CustomerOrder['status'],
  payment: CustomerOrder['payment'],
  address: typeof addrFatima,
  date: string,
  promoCode?: string,
): CustomerOrder {
  return {
    id: `order-demo-${num}`,
    number: `CMD-2026-${num}`,
    items,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    status,
    payment,
    address,
    promoCode,
    createdAt: date,
  }
}

// ── 25 commandes (90 jours) ───────────────────────────────────────────────────

export const seedOrders: CustomerOrder[] = [
  // ── Mars ──────────────────────────────────────────────────────────────────
  order('1001',
    [item('prod-001', 'Collier Amira', 25000), item('prod-003', 'Boucles Kénieba', 12000)],
    37000, 0, 0, 'delivered', 'orange_money', addrFatima, '2026-03-02T10:15:00.000Z'),

  order('1002',
    [item('prod-008', 'Sac Bamako', 45000)],
    45000, 0, 0, 'delivered', 'wave', addrAminata, '2026-03-06T14:30:00.000Z'),

  order('1003',
    [item('prod-013', 'Foulard Djenné', 15000), item('prod-016', 'Cache-col Sahel', 12000)],
    27000, 2700, 2000, 'delivered', 'orange_money', addrFatima, '2026-03-12T09:00:00.000Z', 'BIENVENUE10'),

  order('1004',
    [item('prod-002', 'Bracelet Mandingue', 15000, 1, 'or', 'M'), item('prod-027', 'Barrette Djenné', 6500)],
    21500, 0, 2000, 'delivered', 'especes', addrFatima, '2026-03-16T16:00:00.000Z'),

  order('1005',
    [item('prod-018', 'Lunettes Ségou', 18000), item('prod-023', 'Ceinture Koulikoro', 14000)],
    32000, 0, 0, 'delivered', 'orange_money', addrFatima, '2026-03-22T11:45:00.000Z'),

  order('1006',
    [item('prod-022', 'Montre Dakar', 42000), item('prod-005', 'Collier Djenné', 35000)],
    77000, 0, 0, 'delivered', 'wave', addrAminata, '2026-03-28T15:20:00.000Z'),

  order('1007',
    [item('prod-012', 'Sac Bandoulière Kidal', 32000), item('prod-004', 'Bague Ségou', 8500)],
    40500, 0, 0, 'delivered', 'orange_money', addrFatima, '2026-04-02T08:30:00.000Z'),

  // ── Avril ─────────────────────────────────────────────────────────────────
  order('1008',
    [item('prod-015', 'Foulard Wax Amina', 8000, 2)],
    16000, 0, 5000, 'delivered', 'mobi_money', addrAminata, '2026-04-07T13:00:00.000Z'),

  order('1009',
    [item('prod-010', 'Cabas Mopti', 38000)],
    38000, 0, 0, 'delivered', 'orange_money', addrFatima, '2026-04-12T10:10:00.000Z'),

  order('1010',
    [item('prod-019', 'Lunettes Sahara', 22000), item('prod-024', 'Ceinture Ornée Sikasso', 18000)],
    40000, 0, 0, 'delivered', 'wave', addrAminata, '2026-04-16T17:00:00.000Z'),

  order('1011',
    [item('prod-033', 'Collier Cascade Niger', 42000)],
    42000, 8400, 0, 'delivered', 'orange_money', addrFatima, '2026-04-21T09:30:00.000Z', 'TONOMI20'),

  order('1012',
    [item('prod-035', 'Montre Féminine Bamako', 85000)],
    85000, 0, 0, 'cancelled', 'especes', addrMariama, '2026-04-24T14:00:00.000Z'),

  order('1013',
    [item('prod-036', 'Sac à Dos Sahel', 55000)],
    55000, 0, 0, 'delivered', 'wave', addrAminata, '2026-04-28T11:00:00.000Z'),

  order('1014',
    [item('prod-002', 'Bracelet Mandingue', 15000, 1, 'doré', 'S'), item('prod-034', 'Boucles Créoles Kayes', 10000)],
    25000, 0, 2000, 'delivered', 'orange_money', addrFatima, '2026-05-02T08:00:00.000Z'),

  order('1015',
    [item('prod-014', 'Étole Niger', 28000), item('prod-017', 'Foulard Soie Bambara', 35000)],
    63000, 0, 0, 'delivered', 'wave', addrAminata, '2026-05-05T16:30:00.000Z'),

  // ── Mai ───────────────────────────────────────────────────────────────────
  order('1016',
    [item('prod-030', 'Tête Bande Sahélienne', 7000), item('prod-020', 'Lunettes Timbuktu', 25000), item('prod-032', 'Diadème Reine du Sahel', 12000)],
    44000, 0, 0, 'delivered', 'orange_money', addrFatima, '2026-05-09T10:00:00.000Z'),

  order('1017',
    [item('prod-021', 'Lunettes Aviateur Mandé', 30000)],
    30000, 0, 0, 'shipped', 'mobi_money', addrMariama, '2026-05-13T13:45:00.000Z'),

  order('1018',
    [item('prod-008', 'Sac Bamako', 45000), item('prod-026', 'Ceinture Chainée Sahel', 16000)],
    61000, 0, 0, 'shipped', 'orange_money', addrFatima, '2026-05-17T09:15:00.000Z'),

  order('1019',
    [item('prod-001', 'Collier Amira', 19500), item('prod-004', 'Bague Ségou', 8500)],
    28000, 0, 2000, 'shipped', 'wave', addrAminata, '2026-05-19T14:00:00.000Z'),

  order('1020',
    [item('prod-009', 'Pochette Tombouctou', 22000)],
    22000, 0, 2000, 'processing', 'orange_money', addrFatima, '2026-05-22T11:30:00.000Z'),

  order('1021',
    [item('prod-013', 'Foulard Djenné', 15000), item('prod-028', 'Serre-tête Mandingue', 5000)],
    20000, 0, 15000, 'processing', 'especes', addrMariama, '2026-05-24T16:00:00.000Z'),

  order('1022',
    [item('prod-011', 'Mini Sac Gao', 18500), item('prod-027', 'Barrette Djenné', 6500)],
    25000, 5000, 2000, 'processing', 'wave', addrAminata, '2026-05-26T09:00:00.000Z', 'SAHEL5000'),

  order('1023',
    [item('prod-006', 'Bracelet Kayes', 9500, 2, 'or', 'M')],
    19000, 0, 2000, 'confirmed', 'orange_money', addrFatima, '2026-05-28T10:30:00.000Z'),

  order('1024',
    [item('prod-007', 'Chaîne de Cheville Sikasso', 7500)],
    7500, 0, 2000, 'cancelled', 'orange_money', addrFatima, '2026-05-29T15:00:00.000Z'),

  order('1025',
    [item('prod-005', 'Collier Djenné', 35000)],
    35000, 0, 0, 'pending', 'wave', addrAminata, '2026-05-31T08:45:00.000Z'),
]
