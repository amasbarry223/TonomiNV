# Task 2-a: Data Layer & State Stores

## Summary
Created all data files and Zustand stores for the TONOMI ACCESSOIRES e-commerce project.

## Files Created

### Data Files (`/src/data/`)
1. **products.ts** - 38 products across 6 categories with full TypeScript interfaces, realistic Malian/African names, French descriptions, FCFA pricing, promo prices, badges, ratings, and image paths. Includes helper functions for product lookup, filtering, and search.
2. **categories.ts** - 6 categories (Bijoux, Sacs, Foulards, Lunettes, Ceintures, Accessoires Cheveux) with French descriptions and product counts. Includes lookup helpers.
3. **testimonials.ts** - 17 testimonials from African women with French text, Malian/West African cities, ratings, and dates. Includes filtering and sorting helpers.
4. **promos.ts** - 7 promo codes (percentage and fixed discounts) and 6 flash sales with validation logic and discount calculation helpers.

### Zustand Stores (`/src/stores/`)
5. **cart-store.ts** - Full cart management with add/remove/update quantity, coupon support, subtotal/total calculations, and localStorage persistence.
6. **wishlist-store.ts** - Wishlist with add/remove/toggle, move-to-cart functionality, and localStorage persistence.
7. **filter-store.ts** - Product filtering with category, price range, colors, sizes, sort options, search query, grid/list view mode, and reset functionality. Exported constants for available colors, sizes, and sort options.
8. **nav-store.ts** - SPA-style navigation with page state (home, catalog, promotions, about, contact, product), selected product/category tracking, and convenience navigation methods with smooth scroll.

## Key Decisions
- All data is in French with Malian/African cultural references
- Prices in FCFA range from 3,500 to 85,000
- Product images use the existing files in `/public/images/products/`
- Zustand stores use `persist` middleware for cart and wishlist (localStorage)
- Filter store does NOT persist (fresh filters on each page load)
- Nav store provides both generic `navigate()` and specific convenience methods
- All stores use proper TypeScript interfaces
