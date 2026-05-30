import { newsImagePath } from './product-images'

/** Photos réelles TONOMI — mapping produit → fichiers news/ (cohérence type + texte) */
const MAP: Record<string, string[]> = {
  // Bijoux — photo mixte avec bijoux argent/or visibles
  'prod-001': [
    'SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg',
    'SaveClip.App_623795216_18077429810058973_1750147104183870382_n.jpg',
  ],
  'prod-002': ['SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg'],
  'prod-003': ['SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg'],
  'prod-004': ['SaveClip.App_623795216_18077429810058973_1750147104183870382_n.jpg'],
  'prod-005': [
    'SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg',
    'SaveClip.App_623795216_18077429810058973_1750147104183870382_n.jpg',
  ],
  'prod-006': ['SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg'],
  'prod-007': ['SaveClip.App_623795216_18077429810058973_1750147104183870382_n.jpg'],
  'prod-033': [
    'SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg',
    'SaveClip.App_623795216_18077429810058973_1750147104183870382_n.jpg',
  ],
  'prod-034': ['SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg'],
  'prod-035': [
    'SaveClip.App_623795216_18077429810058973_1750147104183870382_n.jpg',
    'SaveClip.App_619649807_17933919750167936_6111403907602167773_n.jpg',
  ],

  // Sacs — photos produit directes
  'prod-008': [
    'SaveClip.App_498689858_1002296382110145_2970471386450614125_n.jpg',
    'SaveClip.App_624842911_18109681441730919_2715459493910666623_n.jpg',
  ],
  'prod-009': [
    'SaveClip.App_425431660_17975590664654491_6776023456782475995_n.jpg',
    'SaveClip.App_628393901_18421827190143276_2249806546006778380_n.jpg',
  ],
  'prod-010': [
    'SaveClip.App_376809335_17953066973654491_1111722511442810247_n.jpg',
    'SaveClip.App_622057586_18058725899662626_8116275419657281305_n.jpg',
  ],
  'prod-011': [
    'SaveClip.App_396140878_17960451524654491_5354495790345746301_n.jpg',
    'SaveClip.App_563353591_18047537921654491_16175400921883155_n.jpg',
  ],
  'prod-012': [
    'SaveClip.App_470362503_18012570113654491_2040627269766486044_n.jpg',
    'SaveClip.App_393369926_17958710861654491_6781343717346708553_n.jpg',
  ],
  'prod-036': [
    'SaveClip.App_622909059_18067289456543224_4254365618077781629_n.jpg',
    'SaveClip.App_376809335_17953066973654491_1111722511442810247_n.jpg',
  ],

  // Foulards — tenues wax/bazin et textiles traditionnels
  'prod-013': [
    'SaveClip.App_624844938_18118366936587198_7932406440548342551_n.jpg',
    'SaveClip.App_473421222_18016222190654491_2322860640812376119_n.jpg',
  ],
  'prod-014': [
    'SaveClip.App_547792230_18043807802654491_6244443645459248711_n.jpg',
    'SaveClip.App_624841817_18148514446451952_4438848685768798923_n.jpg',
  ],
  'prod-015': [
    'SaveClip.App_473421222_18016222190654491_2322860640812376119_n.jpg',
    'SaveClip.App_653983638_18065553050324278_6506280777076673544_n.jpg',
  ],
  'prod-016': [
    'SaveClip.App_624129385_18062592086313467_8549040442314171235_n.jpg',
    'SaveClip.App_358138009_17943328685654491_3081457647708760274_n.jpg',
  ],
  'prod-017': [
    'SaveClip.App_358138009_17943328685654491_3081457647708760274_n.jpg',
    'SaveClip.App_624129385_18062592086313467_8549040442314171235_n.jpg',
  ],

  // Lunettes & montres — portraits mode / accessoires luxe
  'prod-018': [
    'SaveClip.App_425339348_17976496187654491_8514973148160333259_n.jpg',
    'SaveClip.App_651759883_18054564998496406_6585206764210138650_n.jpg',
  ],
  'prod-019': [
    'SaveClip.App_503089955_1667954000523889_2425467813087263272_n.jpg',
    'SaveClip.App_624841817_18148514446451952_4438848685768798923_n.jpg',
  ],
  'prod-020': [
    'SaveClip.App_547792230_18043807802654491_6244443645459248711_n.jpg',
    'SaveClip.App_624658532_18081124817352838_4516062452983318324_n.jpg',
  ],
  'prod-021': [
    'SaveClip.App_619649807_17933919750167936_6111403907602167773_n.jpg',
    'SaveClip.App_470362503_18012570113654491_2040627269766486044_n.jpg',
  ],
  'prod-022': [
    'SaveClip.App_623795216_18077429810058973_1750147104183870382_n.jpg',
    'SaveClip.App_619649807_17933919750167936_6111403907602167773_n.jpg',
  ],
  'prod-038': [
    'SaveClip.App_481780539_18021409988654491_3635500629704056965_n.jpg',
    'SaveClip.App_396140878_17960451524654491_5354495790345746301_n.jpg',
  ],

  // Ceintures — unique photo dédiée (noir + cognac)
  'prod-023': ['SaveClip.App_424699123_17974587404654491_493932645542192401_n.jpg'],
  'prod-024': ['SaveClip.App_424699123_17974587404654491_493932645542192401_n.jpg'],
  'prod-025': ['SaveClip.App_424699123_17974587404654491_493932645542192401_n.jpg'],
  'prod-026': ['SaveClip.App_424699123_17974587404654491_493932645542192401_n.jpg'],

  // Accessoires cheveux — coiffures et headwraps
  'prod-027': ['SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg'],
  'prod-028': [
    'SaveClip.App_624129385_18062592086313467_8549040442314171235_n.jpg',
    'SaveClip.App_358138009_17943328685654491_3081457647708760274_n.jpg',
  ],
  'prod-029': ['SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg'],
  'prod-030': ['SaveClip.App_624129385_18062592086313467_8549040442314171235_n.jpg'],
  'prod-031': ['SaveClip.App_624841817_18148514446451952_4438848685768798923_n.jpg'],
  'prod-032': [
    'SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg',
    'SaveClip.App_358138009_17943328685654491_3081457647708760274_n.jpg',
  ],
  'prod-037': ['SaveClip.App_535231764_18040930577654491_8693184482494125673_n.jpg'],
}

const CATEGORY_FALLBACK: Record<string, string[]> = {
  bijoux: MAP['prod-001'],
  sacs: MAP['prod-008'],
  foulards: MAP['prod-013'],
  lunettes: MAP['prod-018'],
  ceintures: MAP['prod-023'],
  'accessoires-cheveux': MAP['prod-028'],
}

export function getProductImagePaths(
  productId: string,
  category?: string,
  count = 1
): string[] {
  const files = MAP[productId] ?? (category ? CATEGORY_FALLBACK[category] : undefined)
  if (!files?.length) return []
  return files.slice(0, count).map(newsImagePath)
}

export function assignCoherentProductImages<
  T extends { id: string; category: string; images: string[] },
>(items: T[]): T[] {
  return items.map((product) => {
    const count = Math.min(product.images.length, 2) || 1
    const images = getProductImagePaths(product.id, product.category, count)
    return images.length ? { ...product, images } : product
  })
}

/** Première image d'une catégorie pour les vignettes catégories */
export function getCategoryImagePath(categorySlug: string): string {
  const files = CATEGORY_FALLBACK[categorySlug]
  return files?.[0] ? newsImagePath(files[0]) : ''
}
