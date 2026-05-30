---
Task ID: p1-1+p1-2+p1-4
Agent: Main
Task: Fix product images, add reviews system, fix wishlist, add navbar search

Work Log:
- Fixed ProductPage.tsx image rendering: replaced placeholder ShoppingBag icons with actual img tags for both main image and thumbnails
- Added Review model to Prisma schema with fields: id, productId, userName, rating, comment, createdAt + relation to Product
- Ran db:push to update database schema
- Created Review API routes:
  - GET /api/reviews?productId=xxx - List reviews with stats (avg, distribution)
  - POST /api/reviews - Create new review (validates rating 1-5, updates product rating/reviewCount)
  - DELETE /api/reviews/[id] - Delete review (updates product rating/reviewCount)
- Seeded 20 sample reviews across 11 popular products via prisma/seed.ts
- Updated ProductPage.tsx to replace mock reviews with real API data:
  - Fetches reviews from /api/reviews?productId=xxx on mount
  - Shows loading skeletons while fetching
  - Shows empty state when no reviews
  - Added review dialog with name, star rating selector, and comment textarea
  - Dynamic average rating and review count from API
  - Toast notifications for success/error on review submission
- Fixed isWishlisted bug in CartDrawer.tsx (was already using correct isInWishlist method name)
- Added Wishlist View in CatalogPage.tsx:
  - When selectedCategory === wishlist, shows Mes Favoris page
  - Displays wishlist products from static data matched by productId
  - Empty state with Heart icon and Discover catalog button
  - No filters/sort controls for wishlist view (simplified)
- Created SearchOverlay component:
  - Glassmorphism style overlay with cream/gold backdrop
  - Debounced search using /api/products?search=XXX&limit=5
  - Autocomplete results with product image, name, category, price
  - Popular suggestions when empty (Collier, Sac, Lunettes, Bracelet, Foulard)
  - AnimatePresence for smooth open/close animation
  - Escape key and backdrop click to close
- Updated Navbar.tsx:
  - Search icon now opens SearchOverlay
  - Search closes on navigation
- Used separate PrismaClient instances in review routes to avoid stale global cache issues
- Lint passes with 0 errors

Stage Summary:
- Product images now render correctly in ProductPage (both main and thumbnails)
- Full review system with API, database, and UI integration
- 20 seeded reviews across popular products
- Wishlist view accessible via heart icon in navbar
- Search overlay with autocomplete functionality
- All features follow TONOMI design system (warm colors, glassmorphism, gold accents)
