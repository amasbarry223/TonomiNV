# Task p0-1: Connect Storefront Components to API

## Agent: Storefront API Integration Agent

## Summary
Successfully connected all storefront components to use API endpoints instead of static data files. Now changes made in the admin back-office are reflected on the storefront.

## Files Updated

| File | Change |
|------|--------|
| `src/components/home/NewArrivals.tsx` | Replaced `getNewProducts()` with fetch to `/api/products?limit=100` + client-side `isNew` filter |
| `src/components/home/BestSellers.tsx` | Replaced `getBestSellers()` with fetch to `/api/products?limit=100` + client-side `isBestSeller` filter |
| `src/components/home/CategoriesSection.tsx` | Replaced `categories` static import with fetch to `/api/categories` |
| `src/components/home/ProductCard.tsx` | Changed to `import type { Product }` (type-only) |
| `src/components/catalog/CatalogPage.tsx` | Replaced all static imports with API fetches; wishlist uses `allProducts.find()` |
| `src/components/catalog/FilterSidebar.tsx` | Replaced static `categories` import with categories prop |
| `src/components/catalog/FilterDrawer.tsx` | Updated to accept and pass categories prop |
| `src/components/catalog/ProductCard.tsx` | Removed `products` value import |
| `src/components/catalog/ProductGrid.tsx` | Changed to `import type { Product }` |
| `src/components/product/ProductPage.tsx` | Replaced `getProductById()`, `getProductsByCategory()`, `categories` with API fetches |
| `src/components/promotions/PromotionsPage.tsx` | Replaced all static imports with API fetches; countdown uses real flash sale dates |

## Key Decisions
- Fetch all products with `?limit=100` and filter client-side for `isNew` and `isBestSeller` (API doesn't support these filters)
- Categories passed as props from CatalogPage to FilterSidebar/FilterDrawer instead of each component fetching independently
- PromotionsPage builds a `productsMap` for flash sale lookups and bundle cards
- Active promos filtered by `isActive !== false && validUntil > now`
- Active flash sales filtered by `isActive !== false && stockLeft > 0 && endsAt > now`
- All imports from `@/data/*` are now type-only (no value imports)

## Verification
- `bun run lint` passes with 0 errors
- API endpoints verified returning 200 in dev server log
- No API routes were modified
- No admin components were modified
