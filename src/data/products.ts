import { assignCoherentProductImages } from './product-image-map'

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in FCFA
  pricePromo?: number;
  category: string;
  colors: string[];
  sizes: string[];
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: 'nouveau' | 'promo' | 'epuise';
  isNew: boolean;
  isBestSeller: boolean;
  material: string;
}

const catalogProducts: Product[] = [
  // ===== BIJOUX (Jewelry) =====
  {
    id: "prod-001",
    name: "Collier Amira",
    slug: "collier-amira",
    description: "Collier élégant en or plaqué avec pendentif en forme de lune, inspiré des nuits maliennes. Finition artisanale soignée, parfait pour les occasions spéciales.",
    price: 25000,
    pricePromo: 19500,
    category: "bijoux",
    colors: ["or", "argent"],
    sizes: ["unique"],
    images: ["/images/products/necklace-1.png", "/images/products/necklace-2.png"],
    stock: 15,
    rating: 4.8,
    reviewCount: 42,
    badge: "promo",
    isNew: false,
    isBestSeller: true,
    material: "Or plaqué"
  },
  {
    id: "prod-002",
    name: "Bracelet Mandingue",
    slug: "bracelet-mandingue",
    description: "Bracelet rigide en métal doré avec motifs gravés inspirés de l'art mandingue. Un bijou qui raconte l'histoire du Mali.",
    price: 15000,
    category: "bijoux",
    colors: ["or", "doré"],
    sizes: ["S", "M", "L"],
    images: ["/images/products/bracelet-1.png"],
    stock: 25,
    rating: 4.6,
    reviewCount: 28,
    isNew: true,
    isBestSeller: false,
    material: "Métal doré"
  },
  {
    id: "prod-003",
    name: "Boucles Kénieba",
    slug: "boucles-kenieba",
    description: "Boucles d'oreilles pendantes en argent avec pierres semi-précieuses. Design inspiration sahélienne, légères et confortables.",
    price: 12000,
    pricePromo: 9000,
    category: "bijoux",
    colors: ["argent", "turquoise"],
    sizes: ["unique"],
    images: ["/images/products/earrings-1.png"],
    stock: 30,
    rating: 4.7,
    reviewCount: 35,
    badge: "promo",
    isNew: false,
    isBestSeller: true,
    material: "Argent 925"
  },
  {
    id: "prod-004",
    name: "Bague Ségou",
    slug: "bague-segou",
    description: "Bague ajustable en argent avec motif bogolan finement ciselé. L'élégance de la tradition malienne au bout de vos doigts.",
    price: 8500,
    category: "bijoux",
    colors: ["argent", "noir"],
    sizes: ["S", "M", "L"],
    images: ["/images/products/ring-1.png"],
    stock: 40,
    rating: 4.5,
    reviewCount: 19,
    isNew: false,
    isBestSeller: false,
    material: "Argent 925"
  },
  {
    id: "prod-005",
    name: "Collier Djenné",
    slug: "collier-djenne",
    description: "Collier multi-rangs en perles dorées et pierres naturelles. Inspiration architecturale de la célèbre mosquée de Djenné.",
    price: 35000,
    category: "bijoux",
    colors: ["or", "terracotta"],
    sizes: ["unique"],
    images: ["/images/products/necklace-2.png", "/images/products/necklace-1.png"],
    stock: 10,
    rating: 4.9,
    reviewCount: 56,
    badge: "nouveau",
    isNew: true,
    isBestSeller: true,
    material: "Perles dorées et pierres naturelles"
  },
  {
    id: "prod-006",
    name: "Bracelet Kayes",
    slug: "bracelet-kayes",
    description: "Bracelet en perles de verre traditionnelles maliennes, tissé à la main. Chaque pièce est unique et témoigne du savoir-faire artisanal.",
    price: 9500,
    category: "bijoux",
    colors: ["multicolore", "bleu", "vert"],
    sizes: ["S", "M", "L"],
    images: ["/images/products/bracelet-1.png"],
    stock: 20,
    rating: 4.4,
    reviewCount: 14,
    isNew: false,
    isBestSeller: false,
    material: "Perles de verre"
  },
  {
    id: "prod-007",
    name: "Chaîne de Cheville Sikasso",
    slug: "chaine-de-cheville-sikasso",
    description: "Chaîne de cheville délicate en or plaqué avec petits pendentifs étoilés. Parfaite pour l'été et les tenues légères.",
    price: 7500,
    category: "bijoux",
    colors: ["or", "argent"],
    sizes: ["unique"],
    images: ["/images/products/anklet-1.png"],
    stock: 35,
    rating: 4.3,
    reviewCount: 11,
    isNew: true,
    isBestSeller: false,
    material: "Or plaqué"
  },

  // ===== SACS (Bags) =====
  {
    id: "prod-008",
    name: "Sac Bamako",
    slug: "sac-bamako",
    description: "Grand sac à main en cuir véritable avec motifs gravés artisanaux. Compartiments multiples, doublure en wax. Le compagnon idéal de la femme moderne.",
    price: 45000,
    pricePromo: 38000,
    category: "sacs",
    colors: ["marron", "noir", "terracotta"],
    sizes: ["unique"],
    images: ["/images/products/bag-1.png", "/images/products/bag-2.png"],
    stock: 12,
    rating: 4.9,
    reviewCount: 67,
    badge: "promo",
    isNew: false,
    isBestSeller: true,
    material: "Cuir véritable"
  },
  {
    id: "prod-009",
    name: "Pochette Tombouctou",
    slug: "pochette-tombouctou",
    description: "Pochette élégante en cuir souple avec fermoir doré. Inspiration des manuscrits de Tombouctou, parfaite pour les soirées.",
    price: 22000,
    category: "sacs",
    colors: ["noir", "doré", "bordeaux"],
    sizes: ["unique"],
    images: ["/images/products/bag-2.png"],
    stock: 18,
    rating: 4.7,
    reviewCount: 33,
    isNew: true,
    isBestSeller: false,
    material: "Cuir souple"
  },
  {
    id: "prod-010",
    name: "Cabas Mopti",
    slug: "cabas-mopti",
    description: "Cabas en cuir tressé à la main par les artisans de Mopti. Spacieux et robuste, il allie tradition et modernité au quotidien.",
    price: 38000,
    category: "sacs",
    colors: ["naturel", "marron"],
    sizes: ["unique"],
    images: ["/images/products/bag-3.png", "/images/products/bag-1.png"],
    stock: 8,
    rating: 4.6,
    reviewCount: 22,
    isNew: false,
    isBestSeller: true,
    material: "Cuir tressé"
  },
  {
    id: "prod-011",
    name: "Mini Sac Gao",
    slug: "mini-sac-gao",
    description: "Mini sac à main en cuir avec bandoulière ajustable. Design compact et élégant avec finitions en métal doré.",
    price: 18500,
    pricePromo: 14500,
    category: "sacs",
    colors: ["noir", "rose", "bleu marine"],
    sizes: ["unique"],
    images: ["/images/products/bag-1.png"],
    stock: 22,
    rating: 4.5,
    reviewCount: 17,
    badge: "promo",
    isNew: false,
    isBestSeller: false,
    material: "Cuir synthétique premium"
  },
  {
    id: "prod-012",
    name: "Sac Bandoulière Kidal",
    slug: "sac-bandouliere-kidal",
    description: "Sac bandoulière en cuir grainé avec motifs sahariens. Fermeture aimantée et poche intérieure zippée pour un accès facile.",
    price: 32000,
    category: "sacs",
    colors: ["sable", "marron", "noir"],
    sizes: ["unique"],
    images: ["/images/products/bag-3.png"],
    stock: 14,
    rating: 4.4,
    reviewCount: 15,
    isNew: false,
    isBestSeller: false,
    material: "Cuir grainé"
  },

  // ===== FOULARDS (Scarves) =====
  {
    id: "prod-013",
    name: "Foulard Djenné",
    slug: "foulard-djenne",
    description: "Foulard en soie avec impressions bogolan artisanales. Chaque pièce est unique, créée par les teinturières de Djenné. Doux et léger.",
    price: 15000,
    category: "foulards",
    colors: ["noir et blanc", "terracotta", "indigo"],
    sizes: ["unique"],
    images: ["/images/products/scarf-1.png"],
    stock: 20,
    rating: 4.8,
    reviewCount: 45,
    badge: "nouveau",
    isNew: true,
    isBestSeller: true,
    material: "Soie"
  },
  {
    id: "prod-014",
    name: "Étole Niger",
    slug: "etole-niger",
    description: "Étole en cachemire mélangé aux motifs géométriques sahéliens. Chaleur et élégance pour les soirées fraîches.",
    price: 28000,
    pricePromo: 22000,
    category: "foulards",
    colors: ["gris", "bleu marine", "bordeaux"],
    sizes: ["unique"],
    images: ["/images/products/scarf-1.png"],
    stock: 15,
    rating: 4.7,
    reviewCount: 31,
    badge: "promo",
    isNew: false,
    isBestSeller: true,
    material: "Cachemire mélangé"
  },
  {
    id: "prod-015",
    name: "Foulard Wax Amina",
    slug: "foulard-wax-amina",
    description: "Foulard en tissu wax aux couleurs vibrantes. Parfait pour protéger vos cheveux ou accessoriser votre tenue avec style africain.",
    price: 8000,
    category: "foulards",
    colors: ["jaune", "vert", "orange", "multicolore"],
    sizes: ["unique"],
    images: ["/images/products/scarf-1.png"],
    stock: 50,
    rating: 4.5,
    reviewCount: 23,
    isNew: false,
    isBestSeller: false,
    material: "Wax 100% coton"
  },
  {
    id: "prod-016",
    name: "Cache-col Sahel",
    slug: "cache-col-sahel",
    description: "Cache-col en lin teinté naturellement aux couleurs du Sahel. Doux au toucher, idéal pour les journées venteuses.",
    price: 12000,
    category: "foulards",
    colors: ["sable", "terracotta", "kaki"],
    sizes: ["unique"],
    images: ["/images/products/scarf-1.png"],
    stock: 0,
    rating: 4.6,
    reviewCount: 18,
    badge: "epuise",
    isNew: false,
    isBestSeller: false,
    material: "Lin"
  },
  {
    id: "prod-017",
    name: "Foulard Soie Bambara",
    slug: "foulard-soie-bambara",
    description: "Foulard en soie pure avec bordures tissées à la main. Les motifs s'inspirent des proverbes bambara, each telling a story.",
    price: 35000,
    category: "foulards",
    colors: ["ivoire", "or", "noir"],
    sizes: ["unique"],
    images: ["/images/products/scarf-1.png"],
    stock: 7,
    rating: 4.9,
    reviewCount: 52,
    isNew: true,
    isBestSeller: true,
    material: "Soie pure"
  },

  // ===== LUNETTES (Sunglasses) =====
  {
    id: "prod-018",
    name: "Lunettes Ségou",
    slug: "lunettes-segou",
    description: "Lunettes de soleil cat-eye avec monture acétate et verres polarisés UV400. Style rétro inspiré des années folles maliennes.",
    price: 18000,
    pricePromo: 14000,
    category: "lunettes",
    colors: ["noir", "écaille", "tortue"],
    sizes: ["unique"],
    images: ["/images/products/sunglasses-1.png"],
    stock: 25,
    rating: 4.7,
    reviewCount: 38,
    badge: "promo",
    isNew: false,
    isBestSeller: true,
    material: "Acétate"
  },
  {
    id: "prod-019",
    name: "Lunettes Sahara",
    slug: "lunettes-sahara",
    description: "Lunettes de soleil rondes avec monture métallique dorée et verres dégradés. Protection UV400, légères et confortables.",
    price: 22000,
    category: "lunettes",
    colors: ["or", "argent", "rose gold"],
    sizes: ["unique"],
    images: ["/images/products/sunglasses-1.png"],
    stock: 20,
    rating: 4.6,
    reviewCount: 26,
    isNew: true,
    isBestSeller: false,
    material: "Métal doré"
  },
  {
    id: "prod-020",
    name: "Lunettes Timbuktu",
    slug: "lunettes-timbuktu",
    description: "Lunettes de soleil oversize avec monture épaisse et verres miroir. Pour celles qui osent se faire remarquer sous le soleil du Sahara.",
    price: 25000,
    category: "lunettes",
    colors: ["noir", "bleu", "rose"],
    sizes: ["unique"],
    images: ["/images/products/sunglasses-1.png"],
    stock: 15,
    rating: 4.8,
    reviewCount: 44,
    isNew: false,
    isBestSeller: true,
    material: "Acétate et polycarbonate"
  },
  {
    id: "prod-021",
    name: "Lunettes Aviateur Mandé",
    slug: "lunettes-aviateur-mande",
    description: "Lunettes aviateur classiques avec verres polarisés et monture en titane. L'alliance du style intemporel et de la technologie moderne.",
    price: 30000,
    pricePromo: 24000,
    category: "lunettes",
    colors: ["or", "argent", "noir"],
    sizes: ["unique"],
    images: ["/images/products/sunglasses-1.png"],
    stock: 10,
    rating: 4.5,
    reviewCount: 20,
    badge: "promo",
    isNew: false,
    isBestSeller: false,
    material: "Titane"
  },
  {
    id: "prod-022",
    name: "Montre Dakar",
    slug: "montre-dakar",
    description: "Montre-bracelet femme avec boîtier doré et bracelet en cuir véritable. Mouvement quartz japonais, étanche 30m.",
    price: 42000,
    category: "lunettes",
    colors: ["or", "argent", "roserose"],
    sizes: ["unique"],
    images: ["/images/products/watch-1.png"],
    stock: 12,
    rating: 4.8,
    reviewCount: 39,
    badge: "nouveau",
    isNew: true,
    isBestSeller: true,
    material: "Acier inoxydable et cuir"
  },

  // ===== CEINTURES (Belts) =====
  {
    id: "prod-023",
    name: "Ceinture Koulikoro",
    slug: "ceinture-koulikoro",
    description: "Ceinture en cuir véritable avec boucle dorée ornée de motifs sahéliens. Largeur 4cm, parfait pour sublimer une robe ou un pantalon.",
    price: 14000,
    category: "ceintures",
    colors: ["noir", "marron", "terracotta"],
    sizes: ["S", "M", "L", "XL"],
    images: ["/images/products/belt-1.png"],
    stock: 30,
    rating: 4.6,
    reviewCount: 25,
    isNew: false,
    isBestSeller: true,
    material: "Cuir véritable"
  },
  {
    id: "prod-024",
    name: "Ceinture Ornée Sikasso",
    slug: "ceinture-ornee-sikasso",
    description: "Ceinture fine en cuir tressé avec boucle artisanale en laiton. Le tressage délicat témoigne du savoir-faire des artisans du sud Mali.",
    price: 18000,
    pricePromo: 13500,
    category: "ceintures",
    colors: ["noir", "doré", "cognac"],
    sizes: ["S", "M", "L"],
    images: ["/images/products/belt-1.png"],
    stock: 18,
    rating: 4.7,
    reviewCount: 29,
    badge: "promo",
    isNew: false,
    isBestSeller: false,
    material: "Cuir tressé et laiton"
  },
  {
    id: "prod-025",
    name: "Ceinture Élastique Bamako",
    slug: "ceinture-elastique-bamako",
    description: "Ceinture élastique confortable avec boucle métallique dorée. S'adapte à toutes les morphologies pour un confort optimal toute la journée.",
    price: 7500,
    category: "ceintures",
    colors: ["noir", "bleu marine", "bordeaux"],
    sizes: ["S", "M", "L", "XL"],
    images: ["/images/products/belt-1.png"],
    stock: 45,
    rating: 4.3,
    reviewCount: 16,
    isNew: false,
    isBestSeller: false,
    material: "Élastique et métal"
  },
  {
    id: "prod-026",
    name: "Ceinture Chainée Sahel",
    slug: "ceinture-chainee-sahel",
    description: "Ceinture chaîne dorée avec fermoir à glissière. Accessoire tendance qui transforme instantanément n'importe quelle tenue.",
    price: 16000,
    category: "ceintures",
    colors: ["or", "argent"],
    sizes: ["unique"],
    images: ["/images/products/belt-1.png"],
    stock: 0,
    rating: 4.5,
    reviewCount: 12,
    badge: "epuise",
    isNew: false,
    isBestSeller: false,
    material: "Métal doré"
  },

  // ===== ACCESSOIRES CHEVEUX (Hair Accessories) =====
  {
    id: "prod-027",
    name: "Barrette Djenné",
    slug: "barrette-djenne",
    description: "Barrette ornée de perles et pierres semi-précieuses, inspirée de l'architecture de Djenné. Fixation solide et confortable.",
    price: 6500,
    category: "accessoires-cheveux",
    colors: ["or", "argent", "multicolore"],
    sizes: ["unique"],
    images: ["/images/products/hair-accessory-1.png"],
    stock: 40,
    rating: 4.5,
    reviewCount: 21,
    isNew: true,
    isBestSeller: false,
    material: "Métal et perles"
  },
  {
    id: "prod-028",
    name: "Serre-tête Mandingue",
    slug: "serre-tete-mandingue",
    description: "Serre-tête large en tissu wax avec motif bogolan. Confortable et élégant, il sublime tous les types de coiffure.",
    price: 5000,
    category: "accessoires-cheveux",
    colors: ["noir et blanc", "jaune", "vert", "multicolore"],
    sizes: ["unique"],
    images: ["/images/products/hair-accessory-1.png"],
    stock: 60,
    rating: 4.4,
    reviewCount: 34,
    isNew: false,
    isBestSeller: true,
    material: "Wax et bogolan"
  },
  {
    id: "prod-029",
    name: "Pince à Cheveux Amira",
    slug: "pince-a-cheveux-amira",
    description: "Pince à cheveux élégante en métal doré avec décor floral. Maintien parfait pour les chignons et demi-coiffures.",
    price: 4500,
    category: "accessoires-cheveux",
    colors: ["or", "argent", "rose gold"],
    sizes: ["unique"],
    images: ["/images/products/hair-accessory-1.png"],
    stock: 55,
    rating: 4.3,
    reviewCount: 18,
    isNew: false,
    isBestSeller: false,
    material: "Métal doré"
  },
  {
    id: "prod-030",
    name: "Tête Bande Sahélienne",
    slug: "tete-bande-sahelienne",
    description: "Bandeau en velours doux avec motifs dorés tissés. Largeur 5cm, extensible pour un confort optimal. L'accessoire chic des soirées.",
    price: 7000,
    pricePromo: 5500,
    category: "accessoires-cheveux",
    colors: ["noir", "bordeaux", "émeraude"],
    sizes: ["unique"],
    images: ["/images/products/hair-accessory-1.png"],
    stock: 25,
    rating: 4.6,
    reviewCount: 27,
    badge: "promo",
    isNew: false,
    isBestSeller: true,
    material: "Velours"
  },
  {
    id: "prod-031",
    name: "Chouchou Cristal Mali",
    slug: "chouchou-cristal-mali",
    description: "Élastique à cheveux orné de cristaux scintillants. Parfait pour une touche de brillance au quotidien comme en soirée.",
    price: 3500,
    category: "accessoires-cheveux",
    colors: ["transparent", "noir", "or"],
    sizes: ["unique"],
    images: ["/images/products/hair-accessory-1.png"],
    stock: 80,
    rating: 4.2,
    reviewCount: 13,
    isNew: false,
    isBestSeller: false,
    material: "Cristal et élastique"
  },
  {
    id: "prod-032",
    name: "Diadème Reine du Sahel",
    slug: "diademe-reine-du-sahel",
    description: "Diadème en métal doré avec ornements floraux délicats. Pour les grandes occasions, soyez la reine du Sahel.",
    price: 12000,
    category: "accessoires-cheveux",
    colors: ["or", "argent"],
    sizes: ["unique"],
    images: ["/images/products/hair-accessory-1.png"],
    stock: 10,
    rating: 4.9,
    reviewCount: 48,
    badge: "nouveau",
    isNew: true,
    isBestSeller: true,
    material: "Métal doré et strass"
  },

  // ===== Additional BIJOUX =====
  {
    id: "prod-033",
    name: "Collier Cascade Niger",
    slug: "collier-cascade-niger",
    description: "Collier en cascade avec multiples chaînes dorées et pendentifs en pierres naturelles. Un bijou spectaculaire pour les grandes occasions.",
    price: 42000,
    category: "bijoux",
    colors: ["or", "argent"],
    sizes: ["unique"],
    images: ["/images/products/necklace-1.png"],
    stock: 6,
    rating: 4.8,
    reviewCount: 37,
    isNew: false,
    isBestSeller: false,
    material: "Or plaqué et pierres naturelles"
  },
  {
    id: "prod-034",
    name: "Boucles Créoles Kayes",
    slug: "boucles-creoles-kayes",
    description: "Créoles en or plaqué avec gravures traditionnelles maliennes. Un classique revisité avec une touche d'authenticité.",
    price: 10000,
    pricePromo: 7500,
    category: "bijoux",
    colors: ["or", "doré"],
    sizes: ["S", "M"],
    images: ["/images/products/earrings-1.png"],
    stock: 28,
    rating: 4.4,
    reviewCount: 22,
    badge: "promo",
    isNew: false,
    isBestSeller: false,
    material: "Or plaqué"
  },
  {
    id: "prod-035",
    name: "Montre Féminine Bamako",
    slug: "montre-feminine-bamako",
    description: "Montre bracelet avec boîtier rectangulaire doré et bracelet maille milanaise. Cadran nacre avec aiguilles dorées, mouvement quartz.",
    price: 85000,
    pricePromo: 65000,
    category: "bijoux",
    colors: ["or", "roserose"],
    sizes: ["unique"],
    images: ["/images/products/watch-1.png"],
    stock: 5,
    rating: 4.9,
    reviewCount: 61,
    badge: "promo",
    isNew: false,
    isBestSeller: true,
    material: "Acier doré et nacre"
  },

  // ===== Additional SACS =====
  {
    id: "prod-036",
    name: "Sac à Dos Sahel",
    slug: "sac-a-dos-sahel",
    description: "Sac à dos en cuir souple avec motifs embossés. Compartiment rembourré pour ordinateur portable. Style urbain et artisanal.",
    price: 55000,
    category: "sacs",
    colors: ["marron", "noir"],
    sizes: ["unique"],
    images: ["/images/products/bag-2.png", "/images/products/bag-3.png"],
    stock: 9,
    rating: 4.7,
    reviewCount: 30,
    isNew: true,
    isBestSeller: false,
    material: "Cuir souple"
  },

  // ===== Additional ACCESSOIRES CHEVEUX =====
  {
    id: "prod-037",
    name: "Peigne Orné Tombouctou",
    slug: "peigne-orne-tombouctou",
    description: "Peigne de décoration en métal ciselé avec motifs géométriques inspirés des manuscrits de Tombouctou. Pour des coiffures de rêve.",
    price: 8500,
    category: "accessoires-cheveux",
    colors: ["or", "argent"],
    sizes: ["unique"],
    images: ["/images/products/hair-accessory-1.png"],
    stock: 15,
    rating: 4.7,
    reviewCount: 24,
    isNew: false,
    isBestSeller: false,
    material: "Métal ciselé"
  },

  // ===== Additional LUNETTES =====
  {
    id: "prod-038",
    name: "Lunettes Papillon Mopti",
    slug: "lunettes-papillon-mopti",
    description: "Lunettes de soleil forme papillon avec monture colorée et verres dégradés. Un look audacieux et féminin pour l'été.",
    price: 16000,
    category: "lunettes",
    colors: ["rose", "violet", "noir"],
    sizes: ["unique"],
    images: ["/images/products/sunglasses-1.png"],
    stock: 22,
    rating: 4.4,
    reviewCount: 19,
    isNew: false,
    isBestSeller: false,
    material: "Acétate coloré"
  },
];

export const products: Product[] = assignCoherentProductImages(catalogProducts)

export const productsById = new Map<string, Product>(
  products.map((p) => [p.id, p])
);

export const productsByCategory = new Map<string, Product[]>();
for (const product of products) {
  const list = productsByCategory.get(product.category) ?? [];
  list.push(product);
  productsByCategory.set(product.category, list);
}

export function getProductById(id: string): Product | undefined {
  return productsById.get(id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return productsByCategory.get(category) ?? [];
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getPromoProducts(): Product[] {
  return products.filter((p) => p.pricePromo !== undefined);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q)
  );
}
