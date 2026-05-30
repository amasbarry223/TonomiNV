import { getCategoryImagePath } from "./product-image-map";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: "cat-001",
    name: "Bijoux",
    slug: "bijoux",
    description: "Colliers, bracelets, boucles d'oreilles et bagues artisanaux. Des pièces uniques inspirées du savoir-faire malien pour sublimer votre élégance naturelle.",
    image: getCategoryImagePath("bijoux"),
    productCount: 10,
  },
  {
    id: "cat-002",
    name: "Sacs",
    slug: "sacs",
    description: "Sacs à main, pochettes et cabas en cuir véritable. Confectionnés par les artisans maliens avec passion et authenticité.",
    image: getCategoryImagePath("sacs"),
    productCount: 6,
  },
  {
    id: "cat-003",
    name: "Foulards",
    slug: "foulards",
    description: "Foulards en soie, wax et cachemire aux motifs traditionnels et contemporains. L'art du drapé malien revisité.",
    image: getCategoryImagePath("foulards"),
    productCount: 5,
  },
  {
    id: "cat-004",
    name: "Lunettes",
    slug: "lunettes",
    description: "Lunettes de soleil et montres de créateur. Protection UV et style sous le soleil du Sahel.",
    image: getCategoryImagePath("lunettes"),
    productCount: 6,
  },
  {
    id: "cat-005",
    name: "Ceintures",
    slug: "ceintures",
    description: "Ceintures en cuir, tressées et chainées. Des accessoires qui affirment votre style avec élégance.",
    image: getCategoryImagePath("ceintures"),
    productCount: 4,
  },
  {
    id: "cat-006",
    name: "Accessoires Cheveux",
    slug: "accessoires-cheveux",
    description: "Barrettes, serre-tête, diadèmes et pinces ornées. Des accessoires pour couronner votre beauté au quotidien.",
    image: getCategoryImagePath("accessoires-cheveux"),
    productCount: 7,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
