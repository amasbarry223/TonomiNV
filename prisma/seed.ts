import { db } from '../src/lib/db';

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.flashSale.deleteMany();
  await db.promoCode.deleteMany();
  await db.review.deleteMany();
  await db.contactMessage.deleteMany();
  await db.newsletterSubscriber.deleteMany();
  await db.siteSetting.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  // ===== Categories =====
  console.log('📦 Creating categories...');
  const categoriesData = [
    {
      id: 'cat-001',
      name: 'Bijoux',
      slug: 'bijoux',
      description: "Colliers, bracelets, boucles d'oreilles et bagues artisanaux. Des pièces uniques inspirées du savoir-faire malien pour sublimer votre élégance naturelle.",
      image: '/images/products/necklace-1.png',
      productCount: 10,
    },
    {
      id: 'cat-002',
      name: 'Sacs',
      slug: 'sacs',
      description: "Sacs à main, pochettes et cabas en cuir véritable. Confectionnés par les artisans maliens avec passion et authenticité.",
      image: '/images/products/bag-1.png',
      productCount: 6,
    },
    {
      id: 'cat-003',
      name: 'Foulards',
      slug: 'foulards',
      description: "Foulards en soie, wax et cachemire aux motifs traditionnels et contemporains. L'art du drapé malien revisité.",
      image: '/images/products/scarf-1.png',
      productCount: 5,
    },
    {
      id: 'cat-004',
      name: 'Lunettes',
      slug: 'lunettes',
      description: 'Lunettes de soleil et montres de créateur. Protection UV et style sous le soleil du Sahel.',
      image: '/images/products/sunglasses-1.png',
      productCount: 6,
    },
    {
      id: 'cat-005',
      name: 'Ceintures',
      slug: 'ceintures',
      description: "Ceintures en cuir, tressées et chainées. Des accessoires qui affirment votre style avec élégance.",
      image: '/images/products/belt-1.png',
      productCount: 4,
    },
    {
      id: 'cat-006',
      name: 'Accessoires Cheveux',
      slug: 'accessoires-cheveux',
      description: "Barrettes, serre-tête, diadèmes et pinces ornées. Des accessoires pour couronner votre beauté au quotidien.",
      image: '/images/products/hair-accessory-1.png',
      productCount: 7,
    },
  ];

  for (const cat of categoriesData) {
    await db.category.create({ data: cat });
  }

  // ===== Products =====
  console.log('💍 Creating products...');
  const productsData = [
    {
      id: 'prod-001', name: 'Collier Amira', slug: 'collier-amira',
      description: "Collier élégant en or plaqué avec pendentif en forme de lune, inspiré des nuits maliennes. Finition artisanale soignée, parfait pour les occasions spéciales.",
      price: 25000, pricePromo: 19500, category: 'bijoux',
      colors: 'or,argent', sizes: 'unique', images: '/images/products/necklace-1.png,/images/products/necklace-2.png',
      stock: 15, rating: 4.8, reviewCount: 42, badge: 'promo', isNew: false, isBestSeller: true, material: 'Or plaqué',
    },
    {
      id: 'prod-002', name: 'Bracelet Mandingue', slug: 'bracelet-mandingue',
      description: "Bracelet rigide en métal doré avec motifs gravés inspirés de l'art mandingue. Un bijou qui raconte l'histoire du Mali.",
      price: 15000, category: 'bijoux',
      colors: 'or,doré', sizes: 'S,M,L', images: '/images/products/bracelet-1.png',
      stock: 25, rating: 4.6, reviewCount: 28, isNew: true, isBestSeller: false, material: 'Métal doré',
    },
    {
      id: 'prod-003', name: 'Boucles Kénieba', slug: 'boucles-kenieba',
      description: "Boucles d'oreilles pendantes en argent avec pierres semi-précieuses. Design inspiration sahélienne, légères et confortables.",
      price: 12000, pricePromo: 9000, category: 'bijoux',
      colors: 'argent,turquoise', sizes: 'unique', images: '/images/products/earrings-1.png',
      stock: 30, rating: 4.7, reviewCount: 35, badge: 'promo', isNew: false, isBestSeller: true, material: 'Argent 925',
    },
    {
      id: 'prod-004', name: 'Bague Ségou', slug: 'bague-segou',
      description: "Bague ajustable en argent avec motif bogolan finement ciselé. L'élégance de la tradition malienne au bout de vos doigts.",
      price: 8500, category: 'bijoux',
      colors: 'argent,noir', sizes: 'S,M,L', images: '/images/products/ring-1.png',
      stock: 40, rating: 4.5, reviewCount: 19, isNew: false, isBestSeller: false, material: 'Argent 925',
    },
    {
      id: 'prod-005', name: 'Collier Djenné', slug: 'collier-djenne',
      description: "Collier multi-rangs en perles dorées et pierres naturelles. Inspiration architecturale de la célèbre mosquée de Djenné.",
      price: 35000, category: 'bijoux',
      colors: 'or,terracotta', sizes: 'unique', images: '/images/products/necklace-2.png,/images/products/necklace-1.png',
      stock: 10, rating: 4.9, reviewCount: 56, badge: 'nouveau', isNew: true, isBestSeller: true, material: 'Perles dorées et pierres naturelles',
    },
    {
      id: 'prod-006', name: 'Bracelet Kayes', slug: 'bracelet-kayes',
      description: "Bracelet en perles de verre traditionnelles maliennes, tissé à la main. Chaque pièce est unique et témoigne du savoir-faire artisanal.",
      price: 9500, category: 'bijoux',
      colors: 'multicolore,bleu,vert', sizes: 'S,M,L', images: '/images/products/bracelet-1.png',
      stock: 20, rating: 4.4, reviewCount: 14, isNew: false, isBestSeller: false, material: 'Perles de verre',
    },
    {
      id: 'prod-007', name: 'Chaîne de Cheville Sikasso', slug: 'chaine-de-cheville-sikasso',
      description: "Chaîne de cheville délicate en or plaqué avec petits pendentifs étoilés. Parfaite pour l'été et les tenues légères.",
      price: 7500, category: 'bijoux',
      colors: 'or,argent', sizes: 'unique', images: '/images/products/anklet-1.png',
      stock: 35, rating: 4.3, reviewCount: 11, isNew: true, isBestSeller: false, material: 'Or plaqué',
    },
    {
      id: 'prod-008', name: 'Sac Bamako', slug: 'sac-bamako',
      description: "Grand sac à main en cuir véritable avec motifs gravés artisanaux. Compartiments multiples, doublure en wax. Le compagnon idéal de la femme moderne.",
      price: 45000, pricePromo: 38000, category: 'sacs',
      colors: 'marron,noir,terracotta', sizes: 'unique', images: '/images/products/bag-1.png,/images/products/bag-2.png',
      stock: 12, rating: 4.9, reviewCount: 67, badge: 'promo', isNew: false, isBestSeller: true, material: 'Cuir véritable',
    },
    {
      id: 'prod-009', name: 'Pochette Tombouctou', slug: 'pochette-tombouctou',
      description: "Pochette élégante en cuir souple avec fermoir doré. Inspiration des manuscrits de Tombouctou, parfaite pour les soirées.",
      price: 22000, category: 'sacs',
      colors: 'noir,doré,bordeaux', sizes: 'unique', images: '/images/products/bag-2.png',
      stock: 18, rating: 4.7, reviewCount: 33, isNew: true, isBestSeller: false, material: 'Cuir souple',
    },
    {
      id: 'prod-010', name: 'Cabas Mopti', slug: 'cabas-mopti',
      description: "Cabas en cuir tressé à la main par les artisans de Mopti. Spacieux et robuste, il allie tradition et modernité au quotidien.",
      price: 38000, category: 'sacs',
      colors: 'naturel,marron', sizes: 'unique', images: '/images/products/bag-3.png,/images/products/bag-1.png',
      stock: 8, rating: 4.6, reviewCount: 22, isNew: false, isBestSeller: true, material: 'Cuir tressé',
    },
    {
      id: 'prod-011', name: 'Mini Sac Gao', slug: 'mini-sac-gao',
      description: "Mini sac à main en cuir avec bandoulière ajustable. Design compact et élégant avec finitions en métal doré.",
      price: 18500, pricePromo: 14500, category: 'sacs',
      colors: 'noir,rose,bleu marine', sizes: 'unique', images: '/images/products/bag-1.png',
      stock: 22, rating: 4.5, reviewCount: 17, badge: 'promo', isNew: false, isBestSeller: false, material: 'Cuir synthétique premium',
    },
    {
      id: 'prod-012', name: 'Sac Bandoulière Kidal', slug: 'sac-bandouliere-kidal',
      description: "Sac bandoulière en cuir grainé avec motifs sahariens. Fermeture aimantée et poche intérieure zippée pour un accès facile.",
      price: 32000, category: 'sacs',
      colors: 'sable,marron,noir', sizes: 'unique', images: '/images/products/bag-3.png',
      stock: 14, rating: 4.4, reviewCount: 15, isNew: false, isBestSeller: false, material: 'Cuir grainé',
    },
    {
      id: 'prod-013', name: 'Foulard Djenné', slug: 'foulard-djenne',
      description: "Foulard en soie avec impressions bogolan artisanales. Chaque pièce est unique, créée par les teinturières de Djenné. Doux et léger.",
      price: 15000, category: 'foulards',
      colors: 'noir et blanc,terracotta,indigo', sizes: 'unique', images: '/images/products/scarf-1.png',
      stock: 20, rating: 4.8, reviewCount: 45, badge: 'nouveau', isNew: true, isBestSeller: true, material: 'Soie',
    },
    {
      id: 'prod-014', name: 'Étole Niger', slug: 'etole-niger',
      description: "Étole en cachemire mélangé aux motifs géométriques sahéliens. Chaleur et élégance pour les soirées fraîches.",
      price: 28000, pricePromo: 22000, category: 'foulards',
      colors: 'gris,bleu marine,bordeaux', sizes: 'unique', images: '/images/products/scarf-1.png',
      stock: 15, rating: 4.7, reviewCount: 31, badge: 'promo', isNew: false, isBestSeller: true, material: 'Cachemire mélangé',
    },
    {
      id: 'prod-015', name: 'Foulard Wax Amina', slug: 'foulard-wax-amina',
      description: "Foulard en tissu wax aux couleurs vibrantes. Parfait pour protéger vos cheveux ou accessoriser votre tenue avec style africain.",
      price: 8000, category: 'foulards',
      colors: 'jaune,vert,orange,multicolore', sizes: 'unique', images: '/images/products/scarf-1.png',
      stock: 50, rating: 4.5, reviewCount: 23, isNew: false, isBestSeller: false, material: 'Wax 100% coton',
    },
    {
      id: 'prod-016', name: 'Cache-col Sahel', slug: 'cache-col-sahel',
      description: "Cache-col en lin teinté naturellement aux couleurs du Sahel. Doux au toucher, idéal pour les journées venteuses.",
      price: 12000, category: 'foulards',
      colors: 'sable,terracotta,kaki', sizes: 'unique', images: '/images/products/scarf-1.png',
      stock: 0, rating: 4.6, reviewCount: 18, badge: 'epuise', isNew: false, isBestSeller: false, material: 'Lin',
    },
    {
      id: 'prod-017', name: 'Foulard Soie Bambara', slug: 'foulard-soie-bambara',
      description: "Foulard en soie pure avec bordures tissées à la main. Les motifs s'inspirent des proverbes bambara, each telling a story.",
      price: 35000, category: 'foulards',
      colors: 'ivoire,or,noir', sizes: 'unique', images: '/images/products/scarf-1.png',
      stock: 7, rating: 4.9, reviewCount: 52, isNew: true, isBestSeller: true, material: 'Soie pure',
    },
    {
      id: 'prod-018', name: 'Lunettes Ségou', slug: 'lunettes-segou',
      description: "Lunettes de soleil cat-eye avec monture acétate et verres polarisés UV400. Style rétro inspiré des années folles maliennes.",
      price: 18000, pricePromo: 14000, category: 'lunettes',
      colors: 'noir,écaille,tortue', sizes: 'unique', images: '/images/products/sunglasses-1.png',
      stock: 25, rating: 4.7, reviewCount: 38, badge: 'promo', isNew: false, isBestSeller: true, material: 'Acétate',
    },
    {
      id: 'prod-019', name: 'Lunettes Sahara', slug: 'lunettes-sahara',
      description: "Lunettes de soleil rondes avec monture métallique dorée et verres dégradés. Protection UV400, légères et confortables.",
      price: 22000, category: 'lunettes',
      colors: 'or,argent,rose gold', sizes: 'unique', images: '/images/products/sunglasses-1.png',
      stock: 20, rating: 4.6, reviewCount: 26, isNew: true, isBestSeller: false, material: 'Métal doré',
    },
    {
      id: 'prod-020', name: 'Lunettes Timbuktu', slug: 'lunettes-timbuktu',
      description: "Lunettes de soleil oversize avec monture épaisse et verres miroir. Pour celles qui osent se faire remarquer sous le soleil du Sahara.",
      price: 25000, category: 'lunettes',
      colors: 'noir,bleu,rose', sizes: 'unique', images: '/images/products/sunglasses-1.png',
      stock: 15, rating: 4.8, reviewCount: 44, isNew: false, isBestSeller: true, material: 'Acétate et polycarbonate',
    },
    {
      id: 'prod-021', name: 'Lunettes Aviateur Mandé', slug: 'lunettes-aviateur-mande',
      description: "Lunettes aviateur classiques avec verres polarisés et monture en titane. L'alliance du style intemporel et de la technologie moderne.",
      price: 30000, pricePromo: 24000, category: 'lunettes',
      colors: 'or,argent,noir', sizes: 'unique', images: '/images/products/sunglasses-1.png',
      stock: 10, rating: 4.5, reviewCount: 20, badge: 'promo', isNew: false, isBestSeller: false, material: 'Titane',
    },
    {
      id: 'prod-022', name: 'Montre Dakar', slug: 'montre-dakar',
      description: "Montre-bracelet femme avec boîtier doré et bracelet en cuir véritable. Mouvement quartz japonais, étanche 30m.",
      price: 42000, category: 'lunettes',
      colors: 'or,argent,roserose', sizes: 'unique', images: '/images/products/watch-1.png',
      stock: 12, rating: 4.8, reviewCount: 39, badge: 'nouveau', isNew: true, isBestSeller: true, material: 'Acier inoxydable et cuir',
    },
    {
      id: 'prod-023', name: 'Ceinture Koulikoro', slug: 'ceinture-koulikoro',
      description: "Ceinture en cuir véritable avec boucle dorée ornée de motifs sahéliens. Largeur 4cm, parfait pour sublimer une robe ou un pantalon.",
      price: 14000, category: 'ceintures',
      colors: 'noir,marron,terracotta', sizes: 'S,M,L,XL', images: '/images/products/belt-1.png',
      stock: 30, rating: 4.6, reviewCount: 25, isNew: false, isBestSeller: true, material: 'Cuir véritable',
    },
    {
      id: 'prod-024', name: 'Ceinture Ornée Sikasso', slug: 'ceinture-ornee-sikasso',
      description: "Ceinture fine en cuir tressé avec boucle artisanale en laiton. Le tressage délicat témoigne du savoir-faire des artisans du sud Mali.",
      price: 18000, pricePromo: 13500, category: 'ceintures',
      colors: 'noir,doré,cognac', sizes: 'S,M,L', images: '/images/products/belt-1.png',
      stock: 18, rating: 4.7, reviewCount: 29, badge: 'promo', isNew: false, isBestSeller: false, material: 'Cuir tressé et laiton',
    },
    {
      id: 'prod-025', name: 'Ceinture Élastique Bamako', slug: 'ceinture-elastique-bamako',
      description: "Ceinture élastique confortable avec boucle métallique dorée. S'adapte à toutes les morphologies pour un confort optimal toute la journée.",
      price: 7500, category: 'ceintures',
      colors: 'noir,bleu marine,bordeaux', sizes: 'S,M,L,XL', images: '/images/products/belt-1.png',
      stock: 45, rating: 4.3, reviewCount: 16, isNew: false, isBestSeller: false, material: 'Élastique et métal',
    },
    {
      id: 'prod-026', name: 'Ceinture Chainée Sahel', slug: 'ceinture-chainee-sahel',
      description: "Ceinture chaîne dorée avec fermoir à glissière. Accessoire tendance qui transforme instantanément n'importe quelle tenue.",
      price: 16000, category: 'ceintures',
      colors: 'or,argent', sizes: 'unique', images: '/images/products/belt-1.png',
      stock: 0, rating: 4.5, reviewCount: 12, badge: 'epuise', isNew: false, isBestSeller: false, material: 'Métal doré',
    },
    {
      id: 'prod-027', name: 'Barrette Djenné', slug: 'barrette-djenne',
      description: "Barrette ornée de perles et pierres semi-précieuses, inspirée de l'architecture de Djenné. Fixation solide et confortable.",
      price: 6500, category: 'accessoires-cheveux',
      colors: 'or,argent,multicolore', sizes: 'unique', images: '/images/products/hair-accessory-1.png',
      stock: 40, rating: 4.5, reviewCount: 21, isNew: true, isBestSeller: false, material: 'Métal et perles',
    },
    {
      id: 'prod-028', name: 'Serre-tête Mandingue', slug: 'serre-tete-mandingue',
      description: "Serre-tête large en tissu wax avec motif bogolan. Confortable et élégant, il sublime tous les types de coiffure.",
      price: 5000, category: 'accessoires-cheveux',
      colors: 'noir et blanc,jaune,vert,multicolore', sizes: 'unique', images: '/images/products/hair-accessory-1.png',
      stock: 60, rating: 4.4, reviewCount: 34, isNew: false, isBestSeller: true, material: 'Wax et bogolan',
    },
    {
      id: 'prod-029', name: 'Pince à Cheveux Amira', slug: 'pince-a-cheveux-amira',
      description: "Pince à cheveux élégante en métal doré avec décor floral. Maintien parfait pour les chignons et demi-coiffures.",
      price: 4500, category: 'accessoires-cheveux',
      colors: 'or,argent,rose gold', sizes: 'unique', images: '/images/products/hair-accessory-1.png',
      stock: 55, rating: 4.3, reviewCount: 18, isNew: false, isBestSeller: false, material: 'Métal doré',
    },
    {
      id: 'prod-030', name: 'Tête Bande Sahélienne', slug: 'tete-bande-sahelienne',
      description: "Bandeau en velours doux avec motifs dorés tissés. Largeur 5cm, extensible pour un confort optimal. L'accessoire chic des soirées.",
      price: 7000, pricePromo: 5500, category: 'accessoires-cheveux',
      colors: 'noir,bordeaux,émeraude', sizes: 'unique', images: '/images/products/hair-accessory-1.png',
      stock: 25, rating: 4.6, reviewCount: 27, badge: 'promo', isNew: false, isBestSeller: true, material: 'Velours',
    },
    {
      id: 'prod-031', name: 'Chouchou Cristal Mali', slug: 'chouchou-cristal-mali',
      description: "Élastique à cheveux orné de cristaux scintillants. Parfait pour une touche de brillance au quotidien comme en soirée.",
      price: 3500, category: 'accessoires-cheveux',
      colors: 'transparent,noir,or', sizes: 'unique', images: '/images/products/hair-accessory-1.png',
      stock: 80, rating: 4.2, reviewCount: 13, isNew: false, isBestSeller: false, material: 'Cristal et élastique',
    },
    {
      id: 'prod-032', name: 'Diadème Reine du Sahel', slug: 'diademe-reine-du-sahel',
      description: "Diadème en métal doré avec ornements floraux délicats. Pour les grandes occasions, soyez la reine du Sahel.",
      price: 12000, category: 'accessoires-cheveux',
      colors: 'or,argent', sizes: 'unique', images: '/images/products/hair-accessory-1.png',
      stock: 10, rating: 4.9, reviewCount: 48, badge: 'nouveau', isNew: true, isBestSeller: true, material: 'Métal doré et strass',
    },
    {
      id: 'prod-033', name: 'Collier Cascade Niger', slug: 'collier-cascade-niger',
      description: "Collier en cascade avec multiples chaînes dorées et pendentifs en pierres naturelles. Un bijou spectaculaire pour les grandes occasions.",
      price: 42000, category: 'bijoux',
      colors: 'or,argent', sizes: 'unique', images: '/images/products/necklace-1.png',
      stock: 6, rating: 4.8, reviewCount: 37, isNew: false, isBestSeller: false, material: 'Or plaqué et pierres naturelles',
    },
    {
      id: 'prod-034', name: 'Boucles Créoles Kayes', slug: 'boucles-creoles-kayes',
      description: "Créoles en or plaqué avec gravures traditionnelles maliennes. Un classique revisité avec une touche d'authenticité.",
      price: 10000, pricePromo: 7500, category: 'bijoux',
      colors: 'or,doré', sizes: 'S,M', images: '/images/products/earrings-1.png',
      stock: 28, rating: 4.4, reviewCount: 22, badge: 'promo', isNew: false, isBestSeller: false, material: 'Or plaqué',
    },
    {
      id: 'prod-035', name: 'Montre Féminine Bamako', slug: 'montre-feminine-bamako',
      description: "Montre bracelet avec boîtier rectangulaire doré et bracelet maille milanaise. Cadran nacre avec aiguilles dorées, mouvement quartz.",
      price: 85000, pricePromo: 65000, category: 'bijoux',
      colors: 'or,roserose', sizes: 'unique', images: '/images/products/watch-1.png',
      stock: 5, rating: 4.9, reviewCount: 61, badge: 'promo', isNew: false, isBestSeller: true, material: 'Acier doré et nacre',
    },
    {
      id: 'prod-036', name: 'Sac à Dos Sahel', slug: 'sac-a-dos-sahel',
      description: "Sac à dos en cuir souple avec motifs embossés. Compartiment rembourré pour ordinateur portable. Style urbain et artisanal.",
      price: 55000, category: 'sacs',
      colors: 'marron,noir', sizes: 'unique', images: '/images/products/bag-2.png,/images/products/bag-3.png',
      stock: 9, rating: 4.7, reviewCount: 30, isNew: true, isBestSeller: false, material: 'Cuir souple',
    },
    {
      id: 'prod-037', name: 'Peigne Orné Tombouctou', slug: 'peigne-orne-tombouctou',
      description: "Peigne de décoration en métal ciselé avec motifs géométriques inspirés des manuscrits de Tombouctou. Pour des coiffures de rêve.",
      price: 8500, category: 'accessoires-cheveux',
      colors: 'or,argent', sizes: 'unique', images: '/images/products/hair-accessory-1.png',
      stock: 15, rating: 4.7, reviewCount: 24, isNew: false, isBestSeller: false, material: 'Métal ciselé',
    },
    {
      id: 'prod-038', name: 'Lunettes Papillon Mopti', slug: 'lunettes-papillon-mopti',
      description: "Lunettes de soleil forme papillon avec monture colorée et verres dégradés. Un look audacieux et féminin pour l'été.",
      price: 16000, category: 'lunettes',
      colors: 'rose,violet,noir', sizes: 'unique', images: '/images/products/sunglasses-1.png',
      stock: 22, rating: 4.4, reviewCount: 19, isNew: false, isBestSeller: false, material: 'Acétate coloré',
    },
  ];

  for (const product of productsData) {
    await db.product.create({ data: product });
  }

  // ===== Promo Codes =====
  console.log('🎟️ Creating promo codes...');
  const promoCodesData = [
    { id: 'promo-001', code: 'BIENVENUE10', discount: 10, type: 'percentage', description: '10% de réduction sur votre première commande. Bienvenue chez TONOMI !', minPurchase: 10000, validUntil: '2026-12-31', isActive: true, usageCount: 15 },
    { id: 'promo-002', code: 'TONOMI20', discount: 20, type: 'percentage', description: "20% de réduction sur toute la collection bijoux. L'élégance à prix réduit !", minPurchase: 20000, validUntil: '2026-06-30', isActive: true, usageCount: 8 },
    { id: 'promo-003', code: 'SAHEL5000', discount: 5000, type: 'fixed', description: '5 000 FCFA de réduction sur les commandes de plus de 30 000 FCFA. Profitez-en !', minPurchase: 30000, validUntil: '2026-09-30', isActive: true, usageCount: 3 },
    { id: 'promo-004', code: 'FÊTE15', discount: 15, type: 'percentage', description: "15% de réduction pour les fêtes ! Offrez-vous ou offrez un accessoire TONOMI.", minPurchase: 15000, validUntil: '2026-01-15', isActive: true, usageCount: 22 },
    { id: 'promo-005', code: 'AMIE10000', discount: 10000, type: 'fixed', description: "10 000 FCFA de réduction sur les commandes de plus de 50 000 FCFA. Pour nos clientes fidèles !", minPurchase: 50000, validUntil: '2026-08-31', isActive: true, usageCount: 2 },
    { id: 'promo-006', code: 'NOUVEAU25', discount: 25, type: 'percentage', description: "25% de réduction sur les nouveaux arrivages ! Découvrez les dernières créations de nos artisans.", minPurchase: 15000, validUntil: '2026-04-30', isActive: true, usageCount: 11 },
    { id: 'promo-007', code: 'LIVRAISON', discount: 3000, type: 'fixed', description: "Livraison offerte ! 3 000 FCFA de réduction pour compenser les frais de livraison.", minPurchase: 20000, validUntil: '2026-12-31', isActive: true, usageCount: 45 },
  ];

  for (const promo of promoCodesData) {
    await db.promoCode.create({ data: promo });
  }

  // ===== Flash Sales =====
  console.log('⚡ Creating flash sales...');
  const flashSalesData = [
    { id: 'flash-001', productId: 'prod-001', discount: 22, stockLeft: 5, totalStock: 15, endsAt: '2026-03-20T23:59:59Z', isActive: true },
    { id: 'flash-002', productId: 'prod-008', discount: 16, stockLeft: 4, totalStock: 12, endsAt: '2026-03-18T23:59:59Z', isActive: true },
    { id: 'flash-003', productId: 'prod-018', discount: 22, stockLeft: 8, totalStock: 25, endsAt: '2026-03-22T23:59:59Z', isActive: true },
    { id: 'flash-004', productId: 'prod-013', discount: 15, stockLeft: 12, totalStock: 20, endsAt: '2026-03-25T23:59:59Z', isActive: true },
    { id: 'flash-005', productId: 'prod-035', discount: 24, stockLeft: 2, totalStock: 5, endsAt: '2026-03-15T23:59:59Z', isActive: true },
    { id: 'flash-006', productId: 'prod-024', discount: 25, stockLeft: 6, totalStock: 18, endsAt: '2026-03-28T23:59:59Z', isActive: true },
  ];

  for (const sale of flashSalesData) {
    await db.flashSale.create({ data: sale });
  }

  // ===== Sample Orders =====
  console.log('🛒 Creating sample orders...');
  const ordersData = [
    {
      id: 'order-001', customerName: 'Aminata Diallo', customerEmail: 'aminata@email.com', customerPhone: '+223 76 12 34 56',
      subtotal: 67000, discount: 6700, total: 60300, status: 'delivered', promoCode: 'TONOMI20',
      notes: 'Livraison à Badalabougou', createdAt: new Date('2025-12-15T10:30:00Z'),
      items: {
        create: [
          { productId: 'prod-001', productName: 'Collier Amira', price: 19500, quantity: 1, color: 'or', size: 'unique', image: '/images/products/necklace-1.png' },
          { productId: 'prod-008', productName: 'Sac Bamako', price: 38000, quantity: 1, color: 'marron', size: 'unique', image: '/images/products/bag-1.png' },
          { productId: 'prod-028', productName: 'Serre-tête Mandingue', price: 5000, quantity: 2, color: 'noir et blanc', size: 'unique', image: '/images/products/hair-accessory-1.png' },
        ],
      },
    },
    {
      id: 'order-002', customerName: 'Fatoumata Traoré', customerEmail: 'fatoumata@email.com', customerPhone: '+223 77 98 76 54',
      subtotal: 52000, discount: 0, total: 52000, status: 'delivered',
      createdAt: new Date('2026-01-05T14:20:00Z'),
      items: {
        create: [
          { productId: 'prod-005', productName: 'Collier Djenné', price: 35000, quantity: 1, color: 'or', size: 'unique', image: '/images/products/necklace-2.png' },
          { productId: 'prod-023', productName: 'Ceinture Koulikoro', price: 14000, quantity: 1, color: 'noir', size: 'M', image: '/images/products/belt-1.png' },
          { productId: 'prod-031', productName: 'Chouchou Cristal Mali', price: 3500, quantity: 1, color: 'or', size: 'unique', image: '/images/products/hair-accessory-1.png' },
        ],
      },
    },
    {
      id: 'order-003', customerName: 'Mariam Sissoko', customerEmail: 'mariam@email.com', customerPhone: '+223 65 43 21 09',
      subtotal: 93000, discount: 5000, total: 88000, status: 'shipped', promoCode: 'SAHEL5000',
      notes: 'Appeler avant livraison', createdAt: new Date('2026-02-10T09:15:00Z'),
      items: {
        create: [
          { productId: 'prod-035', productName: 'Montre Féminine Bamako', price: 65000, quantity: 1, color: 'or', size: 'unique', image: '/images/products/watch-1.png' },
          { productId: 'prod-020', productName: 'Lunettes Timbuktu', price: 25000, quantity: 1, color: 'noir', size: 'unique', image: '/images/products/sunglasses-1.png' },
          { productId: 'prod-031', productName: 'Chouchou Cristal Mali', price: 3500, quantity: 1, color: 'transparent', size: 'unique', image: '/images/products/hair-accessory-1.png' },
        ],
      },
    },
    {
      id: 'order-004', customerName: 'Oumou Sangaré', customerEmail: 'oumou@email.com', customerPhone: '+223 78 11 22 33',
      subtotal: 28000, discount: 0, total: 28000, status: 'confirmed',
      createdAt: new Date('2026-02-28T16:45:00Z'),
      items: {
        create: [
          { productId: 'prod-014', productName: 'Étole Niger', price: 22000, quantity: 1, color: 'gris', size: 'unique', image: '/images/products/scarf-1.png' },
          { productId: 'prod-004', productName: 'Bague Ségou', price: 8500, quantity: 1, color: 'argent', size: 'M', image: '/images/products/ring-1.png' },
        ],
      },
    },
    {
      id: 'order-005', customerName: 'Kadiatou Ba', customerEmail: 'kadiatou@email.com', customerPhone: '+223 79 55 66 77',
      subtotal: 88000, discount: 10000, total: 78000, status: 'delivered', promoCode: 'AMIE10000',
      createdAt: new Date('2026-01-20T11:00:00Z'),
      items: {
        create: [
          { productId: 'prod-010', productName: 'Cabas Mopti', price: 38000, quantity: 1, color: 'naturel', size: 'unique', image: '/images/products/bag-3.png' },
          { productId: 'prod-036', productName: 'Sac à Dos Sahel', price: 55000, quantity: 1, color: 'marron', size: 'unique', image: '/images/products/bag-2.png' },
        ],
      },
    },
    {
      id: 'order-006', customerName: 'Aïssata Maïga', customerEmail: 'aissata@email.com', customerPhone: '+223 66 88 99 00',
      subtotal: 45000, discount: 4500, total: 40500, status: 'delivered', promoCode: 'BIENVENUE10',
      createdAt: new Date('2025-12-25T08:30:00Z'),
      items: {
        create: [
          { productId: 'prod-008', productName: 'Sac Bamako', price: 38000, quantity: 1, color: 'noir', size: 'unique', image: '/images/products/bag-1.png' },
          { productId: 'prod-027', productName: 'Barrette Djenné', price: 6500, quantity: 1, color: 'or', size: 'unique', image: '/images/products/hair-accessory-1.png' },
        ],
      },
    },
    {
      id: 'order-007', customerName: 'Rokia Coulibaly', customerEmail: 'rokia@email.com', customerPhone: '+223 75 33 44 55',
      subtotal: 43000, discount: 0, total: 43000, status: 'pending',
      createdAt: new Date('2026-03-01T13:00:00Z'),
      items: {
        create: [
          { productId: 'prod-022', productName: 'Montre Dakar', price: 42000, quantity: 1, color: 'or', size: 'unique', image: '/images/products/watch-1.png' },
          { productId: 'prod-031', productName: 'Chouchou Cristal Mali', price: 3500, quantity: 1, color: 'noir', size: 'unique', image: '/images/products/hair-accessory-1.png' },
        ],
      },
    },
    {
      id: 'order-008', customerName: 'Djénéba Diabaté', customerEmail: 'djeneba@email.com', customerPhone: '+223 70 22 11 00',
      subtotal: 18000, discount: 0, total: 18000, status: 'cancelled',
      notes: 'Client a annulé - article en rupture de stock', createdAt: new Date('2026-02-05T17:30:00Z'),
      items: {
        create: [
          { productId: 'prod-018', productName: 'Lunettes Ségou', price: 14000, quantity: 1, color: 'noir', size: 'unique', image: '/images/products/sunglasses-1.png' },
          { productId: 'prod-007', productName: 'Chaîne de Cheville Sikasso', price: 7500, quantity: 1, color: 'or', size: 'unique', image: '/images/products/anklet-1.png' },
        ],
      },
    },
  ];

  for (const order of ordersData) {
    await db.order.create({ data: order });
  }

  // ===== Contact Messages =====
  console.log('📨 Creating contact messages...');
  const contactsData = [
    { name: 'Amadou Keita', email: 'amadou@email.com', subject: 'Question sur le Collier Djenné', message: "Bonjour, j'aimerais savoir si le Collier Djenné est disponible en argent également ? Merci.", isRead: true },
    { name: 'Sitan Touré', email: 'sitan@email.com', subject: 'Problème de livraison', message: "Ma commande order-003 n'est toujours pas arrivée. Pourriez-vous me donner une mise à jour ? Merci.", isRead: true },
    { name: 'Moussa Cissé', email: 'moussa@email.com', subject: 'Commande personnalisée', message: "Est-il possible de commander un bracelet personnalisé avec un prénom gravé ? Quel serait le délai et le prix ?", isRead: false },
    { name: 'Awa Dembélé', email: 'awa@email.com', subject: 'Retour et échange', message: "J'ai reçu le Sac Bamako mais la couleur ne correspond pas à ce que j'avais commandé. Comment procéder à un échange ?", isRead: false },
    { name: 'Ibrahim Sacko', email: 'ibrahim@email.com', subject: 'Partenariat commercial', message: "Nous sommes une boutique à Dakar et nous serions intéressés par une collaboration avec TONOMI. Pouvons-nous en discuter ?", isRead: false },
  ];

  for (const contact of contactsData) {
    await db.contactMessage.create({ data: contact });
  }

  // ===== Newsletter Subscribers =====
  console.log('📧 Creating newsletter subscribers...');
  const subscribersData = [
    { email: 'aminata.diallo@email.com' },
    { email: 'fatoumata.traore@email.com' },
    { email: 'mariam.sissoko@email.com' },
    { email: 'oumou.sangare@email.com' },
    { email: 'kadiatou.ba@email.com' },
  ];

  for (const sub of subscribersData) {
    await db.newsletterSubscriber.create({ data: sub });
  }

  // ===== Site Settings =====
  console.log('⚙️ Creating site settings...');
  const settingsData = [
    { key: 'store_name', value: 'TONOMI ACCESSOIRES' },
    { key: 'store_email', value: 'contact@tonomi.ml' },
    { key: 'store_phone', value: '+223 76 00 00 00' },
    { key: 'store_address', value: 'Bamako, Mali' },
    { key: 'whatsapp_number', value: '+223760000000' },
    { key: 'instagram_url', value: 'https://instagram.com/tonomi.accessoires' },
    { key: 'currency', value: 'FCFA' },
  ];

  for (const setting of settingsData) {
    await db.siteSetting.create({ data: setting });
  }

  // ===== Reviews =====
  console.log('⭐ Creating reviews...');
  const reviewsData = [
    { productId: 'prod-001', userName: 'Aminata D.', rating: 5, comment: 'Qualité exceptionnelle ! Le produit correspond parfaitement à la description. Je recommande vivement TONOMI.' },
    { productId: 'prod-001', userName: 'Fatoumata S.', rating: 4, comment: "Très beau collier, finitions soignées. La livraison était rapide. Un petit bémol sur l'emballage." },
    { productId: 'prod-001', userName: 'Mariam T.', rating: 5, comment: "Magnifique ! L'artisanat malien à son meilleur. J'ai reçu beaucoup de compliments. Merci TONOMI !" },
    { productId: 'prod-005', userName: 'Oumou B.', rating: 5, comment: "Le collier Djenné est une œuvre d'art. Les perles dorées sont magnifiques et les pierres naturelles ajoutent une touche unique." },
    { productId: 'prod-005', userName: 'Aïssata K.', rating: 4, comment: 'Très beau collier multi-rangs, parfait pour les grandes occasions. Le seul défaut est la fermeture un peu délicate.' },
    { productId: 'prod-008', userName: 'Kadiatou Ba', rating: 5, comment: "Le Sac Bamako est incroyable ! Le cuir est de très bonne qualité et les motifs gravés sont magnifiques. Compartiments pratiques." },
    { productId: 'prod-008', userName: 'Djénéba D.', rating: 5, comment: "Mon sac préféré ! La doublure en wax est une belle surprise. Il est spacieux et élégant à la fois." },
    { productId: 'prod-008', userName: 'Rokia C.', rating: 4, comment: "Très beau sac en cuir véritable. La qualité est au rendez-vous. Je recommande !" },
    { productId: 'prod-013', userName: 'Sitan T.', rating: 5, comment: "Le foulard en soie avec impressions bogolan est d'une beauté rare. Chaque pièce est vraiment unique comme promis." },
    { productId: 'prod-013', userName: 'Awa D.', rating: 4, comment: "Foulard magnifique et doux. Les couleurs bogolan sont authentiques. Parfait pour toutes les saisons." },
    { productId: 'prod-018', userName: 'Amadou K.', rating: 5, comment: "Lunettes de soleil stylées avec une protection UV excellente. Le style cat-eye est très élégant." },
    { productId: 'prod-018', userName: 'Moussa C.', rating: 4, comment: "Bonnes lunettes, verres polarisés efficaces. La monture acétate est légère et confortable." },
    { productId: 'prod-035', userName: 'Aminata D.', rating: 5, comment: "La Montre Féminine Bamako est magnifique ! Le boîtier doré et le bracelet maille milanaise sont d'une élégance rare." },
    { productId: 'prod-035', userName: 'Fatoumata S.', rating: 5, comment: "Qualité exceptionnelle pour le prix. Le cadran nacré est sublime. Ma montre préférée !" },
    { productId: 'prod-032', userName: 'Mariam T.', rating: 5, comment: "Le Diadème Reine du Sahel est parfait pour les mariages et grandes occasions. Les ornements floraux sont délicats." },
    { productId: 'prod-003', userName: 'Oumou B.', rating: 4, comment: "Boucles d'oreilles légères et élégantes. Les pierres semi-précieuses sont jolies. Bon rapport qualité-prix." },
    { productId: 'prod-017', userName: 'Aïssata K.', rating: 5, comment: "Foulard en soie pure d'une qualité exceptionnelle. Les bordures tissées à la main font toute la différence." },
    { productId: 'prod-020', userName: 'Kadiatou Ba', rating: 5, comment: "Lunettes oversize très tendance ! Les verres miroir sont super et la protection UV est au top." },
    { productId: 'prod-024', userName: 'Rokia C.', rating: 4, comment: "Ceinture fine et élégante. Le tressage est délicat et la boucle en laiton est magnifique." },
    { productId: 'prod-022', userName: 'Djénéba D.', rating: 5, comment: "Montre Dakar est une pièce magnifique ! Le boîtier doré et le bracelet cuir sont de très bonne qualité." },
  ];

  for (const review of reviewsData) {
    await db.review.create({ data: review });
  }

  // Update product ratings based on reviews
  console.log('📊 Updating product ratings...');
  const productIds = [...new Set(reviewsData.map(r => r.productId))];
  for (const pid of productIds) {
    const productReviews = await db.review.findMany({ where: { productId: pid } });
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    await db.product.update({
      where: { id: pid },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: productReviews.length,
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`  - ${categoriesData.length} categories`);
  console.log(`  - ${productsData.length} products`);
  console.log(`  - ${promoCodesData.length} promo codes`);
  console.log(`  - ${flashSalesData.length} flash sales`);
  console.log(`  - ${ordersData.length} orders`);
  console.log(`  - ${contactsData.length} contact messages`);
  console.log(`  - ${subscribersData.length} newsletter subscribers`);
  console.log(`  - ${settingsData.length} site settings`);
  console.log(`  - ${reviewsData.length} reviews`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
