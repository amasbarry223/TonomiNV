---
Task ID: 1
Agent: Main
Task: Build TONOMI ACCESSOIRES e-commerce site

Work Log:
- Attempted to fetch Instagram images from @tonomi.accessoires - account requires login
- Generated 15+ AI product images using z-ai image generation tool
- Generated images: hero, products (necklace, bag, scarf, sunglasses, bracelet, belt, earrings, ring, watch, hair accessory, anklet), Instagram feed, about page
- All images saved to /public/images/ directory

Stage Summary:
- Instagram account requires authentication, could not scrape images
- Generated high-quality AI product images as alternative
- 15+ product images created across all categories

---
Task ID: 2
Agent: Main
Task: Set up project foundation - CSS, data, stores, layout

Work Log:
- Updated globals.css with TONOMI color palette, custom animations (shimmer, float, spin-slow), glassmorphism, warm shadows, gold gradient, custom scrollbar, product card effects, WhatsApp button, back-to-top
- Updated layout.tsx with Playfair Display, Cormorant Garamond, DM Sans fonts
- Installed swiper.js package
- Created data files via subagent: products.ts (38 products), categories.ts (6), testimonials.ts (17), promos.ts (7 codes + 6 flash sales)
- Created stores via subagent: cart-store.ts, wishlist-store.ts, filter-store.ts, nav-store.ts
- Created layout components via subagent: Navbar.tsx, Footer.tsx, CartDrawer.tsx, MobileMenu.tsx, WhatsAppButton.tsx, BackToTop.tsx

Stage Summary:
- Complete data layer with 38 products across 6 categories
- Full Zustand stores with localStorage persistence
- Responsive layout with glassmorphism navbar, cart drawer, mobile menu
- All components follow TONOMI design system (cream/gold/caramel palette)

---
Task ID: 3
Agent: Main (via subagents)
Task: Build all page sections and components

Work Log:
- Created 9 home page section components: HeroSection, NewArrivals, BestSellers, BrandStory, CategoriesSection, TestimonialsSection, InstagramFeed, NewsletterSection, ProductCard
- Created catalog page components: CatalogPage, ProductGrid, FilterSidebar, FilterDrawer, QuickViewModal, ProductCard
- Created product detail page: ProductPage with gallery, variants, reviews, similar products
- Created PromotionsPage with countdown timer, flash sales, promo codes, bundles
- Created AboutPage with timeline, values, team, counters
- Created ContactPage with form (React Hook Form + Zod), FAQ, contact info
- Added page transitions with AnimatePresence in page.tsx

Stage Summary:
- Complete SPA with 6 pages: Home, Catalog, Product, Promotions, About, Contact
- All animations implemented with Framer Motion
- Cart and wishlist fully functional with Zustand
- Responsive design with mobile-first approach
- Lint passes with 0 errors

---
Task ID: 4
Agent: Backend Agent
Task: Set up Prisma Schema, API Routes, and Seed Data

Work Log:
- Updated prisma/schema.prisma: replaced User/Post models with 9 models (Product, Category, Order, OrderItem, PromoCode, FlashSale, ContactMessage, NewsletterSubscriber, SiteSetting)
- Added Product↔OrderItem relation (product field on OrderItem)
- Ran bun run db:push successfully - database synced
- Created prisma/seed.ts with complete seed data:
  - 6 categories
  - 38 products (all from static data files, with comma-separated fields)
  - 7 promo codes
  - 6 flash sales
  - 8 sample orders with items (various statuses: delivered, shipped, confirmed, pending, cancelled)
  - 5 contact messages (mix of read/unread)
  - 5 newsletter subscribers
  - 7 site settings (store_name, store_email, store_phone, store_address, whatsapp_number, instagram_url, currency)
- Created 16 API route files under src/app/api/:
  - /api/products - GET (search, category, pagination) + POST
  - /api/products/[id] - GET + PUT + DELETE
  - /api/categories - GET + POST
  - /api/categories/[id] - GET + PUT + DELETE
  - /api/orders - GET (status filter, pagination) + POST
  - /api/orders/[id] - GET (with items) + PUT + DELETE
  - /api/promos - GET + POST
  - /api/promos/[id] - GET + PUT + DELETE
  - /api/flash-sales - GET + POST
  - /api/flash-sales/[id] - PUT + DELETE
  - /api/contacts - GET + POST
  - /api/contacts/[id] - PUT (mark read) + DELETE
  - /api/newsletter - GET + POST (subscribe)
  - /api/newsletter/[id] - DELETE (unsubscribe)
  - /api/dashboard - GET (stats: totals, ordersByStatus, recentOrders, topProducts, monthlyRevenue, unreadMessages, subscriberCount)
  - /api/settings - GET (key-value) + PUT (upsert)
- All API routes use `import { db } from '@/lib/db'` and Next.js 16 style params: Promise<{ id: string }>
- Comma-separated fields (colors, sizes, images) converted to/from arrays in API responses
- Dashboard computes revenue from 'delivered' orders only
- Ran seed script successfully - all data inserted
- Lint passes with 0 errors

Stage Summary:
- Complete Prisma schema with 9 models and proper relations
- Full REST API with CRUD for all resources + dashboard stats endpoint
- Database seeded with all existing static data + sample orders/messages/subscribers/settings
- All API routes handle errors gracefully with try/catch and proper HTTP status codes

---
Task ID: 8
Agent: AdminCategories Agent
Task: Build AdminCategories component - Category Management

Work Log:
- Created /home/z/my-project/src/components/admin/AdminCategories.tsx
- Component uses 'use client' directive with TONOMI color scheme (cream/gold/caramel)
- Uses shadcn/ui components: Card, Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Badge, Skeleton, Textarea, Label
- Uses lucide-react icons: Plus, Edit, Trash2, FolderOpen
- French labels throughout

Features implemented:
1. **Header**: Title "Catégories" with dynamic count + "Ajouter une catégorie" button with gold gradient (btn-gold)
2. **Categories Grid**: Responsive grid (1 col mobile, 2 cols md, 3 cols lg)
   - Each card uses glass-card style with warm-shadow and hover effects
   - Category image (full width, aspect-video, rounded top)
   - Category name (font-serif, h3)
   - Slug displayed in text-mid text-xs
   - Description truncated to 2 lines (line-clamp-2)
   - Product count badge positioned top-right on image
   - Edit and Delete buttons at bottom
   - Fallback icon when no image
3. **Add/Edit Dialog**: Fields for name, slug (auto-generated from name with accent removal), description (textarea), image URL, productCount (number input)
   - Auto-generate slug from name via normalize/sanitize function
   - Save and Cancel buttons with loading spinner
   - Validation: name and slug required
4. **Delete Confirmation Dialog**: Shows category name, Annuler/Supprimer buttons, loading spinner during delete
5. **Loading State**: 6 skeleton cards matching card layout
6. **Empty State**: FolderOpen icon + message + add button
7. **Error Handling**: Toast notifications (sonner) for all CRUD operations

API integration:
- GET /api/categories - fetches all categories on mount
- POST /api/categories - creates new category
- PUT /api/categories/[id] - updates existing category
- DELETE /api/categories/[id] - deletes category with confirmation

- Lint passes with 0 errors

---
Task ID: 6
Agent: AdminDashboard Agent
Task: Build AdminDashboard component - Dashboard Overview Page

Work Log:
- Created /home/z/my-project/src/components/admin/AdminDashboard.tsx
- Component uses 'use client' directive with TONOMI color scheme (cream/gold/caramel)
- Uses shadcn/ui components: Card, CardContent, CardHeader, CardTitle, Badge, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, ChartContainer, ChartTooltip, ChartTooltipContent
- Uses lucide-react icons: TrendingUp, ShoppingCart, Package, Mail, AlertCircle
- Uses recharts: AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid
- French labels throughout
- Fetches data from /api/dashboard endpoint

Features implemented:
1. **KPI Cards Row** (responsive: 1 col mobile, 2 cols md, 4 cols lg):
   - Chiffre d'affaires (revenue) with TrendingUp icon, formatted in FCFA
   - Commandes (total orders) with ShoppingCart icon
   - Produits (total products) with Package icon
   - Messages non lus with Mail icon
   - Each card: icon in rounded bg-gold/15 container, large value, text-mid label, subtle gold/20 border
2. **Charts Row** (2 cols on lg, stacked on mobile):
   - "Revenus mensuels" - AreaChart with gold gradient fill (gold→transparent), TONOMI palette
   - "Commandes par statut" - BarChart with warm colors per status (orange=pending, blue=confirmed, gold=shipped, green=delivered, red=cancelled)
3. **Tables Row** (2 cols on lg, stacked on mobile):
   - "Commandes récentes" - Table with Client, Montant, Statut (color-coded badges), Date columns, max-h-96 scrollable
   - "Produits les plus vendus" - Table with Produit, Ventes (gold badge), Revenu columns, max-h-96 scrollable
4. **Quick Stats Footer** - 4 mini stat cards (Catégories, Commandes en attente, En cours d'expédition, Abonnés newsletter)
5. **Loading State** - Full skeleton layout matching the dashboard structure
6. **Error State** - AlertCircle icon with error message and retry button
7. **Empty State** - Graceful handling for empty tables

Data formatting:
- Numbers formatted in FCFA with spaces (e.g., 645 500 FCFA)
- Dates formatted in French locale (fr-FR)
- Status labels in French with color-coded Badge variants
- Y-axis abbreviates thousands as "k"

- Lint passes with 0 errors

---
Task ID: 9
Agent: AdminOrders Agent
Task: Build AdminOrders component - Order Management

Work Log:
- Created /home/z/my-project/src/components/admin/AdminOrders.tsx
- Component uses 'use client' directive with TONOMI color scheme (cream/gold/caramel)
- Uses shadcn/ui components: Card, CardContent, CardHeader, CardTitle, Button, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Tabs, TabsList, TabsTrigger, Separator, Label, Textarea, Skeleton, Input
- Uses lucide-react icons: Eye, Truck, CheckCircle, XCircle, Clock, Search
- Uses date-fns for date formatting (dd/MM/yyyy HH:mm)
- French labels throughout

Features implemented:
1. **Filter Tabs**: Tabs for Toutes, En attente, Confirmées, Expédiées, Livrées, Annulées with dynamic counts fetched from API
2. **Search Bar**: Search input with icon, searches by name/email/order number, Enter key or button triggers search
3. **Orders Table** (desktop): Columns - N° Commande (first 8 chars of id, uppercase, font-mono), Client (name + email), Articles (count badge), Total (formatted FCFA with spaces), Statut (color-coded badge), Date (formatted dd/MM/yyyy HH:mm), Actions (view detail + delete)
4. **Mobile Card View**: Responsive card layout for orders on mobile devices
5. **Order Detail Dialog**:
   - Customer info section (name, email, phone)
   - Items table with Product, Price, Qty, Color, Size, Subtotal columns
   - Totals section with subtotal, discount (with promo code if applicable), and total
   - Order date display
   - Status update dropdown
   - Notes textarea
   - Save button with loading state
6. **Inline Status Change**: Quick status dropdown in table row, auto-saves on change with toast notification
7. **Status Badges**: Color-coded per status (pending: orange, confirmed: blue, shipped: gold/caramel, delivered: green, cancelled: red)
8. **Pagination**: Full pagination with page numbers, previous/next buttons, ellipsis for large page counts
9. **Loading Skeleton**: Custom skeleton matching table layout
10. **Empty State**: Clock icon with message when no orders found
11. **Error Handling**: Toast notifications (sonner) for all API operations

API integration:
- GET /api/orders?status=&page=1&limit=10 - List orders with status filter and pagination
- GET /api/orders/[id] - Get order detail with items
- PUT /api/orders/[id] - Update order status and notes
- DELETE /api/orders/[id] - Delete order with toast confirmation

- Lint passes with 0 errors

---
Task ID: 7
Agent: AdminProducts Agent
Task: Build AdminProducts component - Full CRUD Product Management

Work Log:
- Created /home/z/my-project/src/components/admin/AdminProducts.tsx (898 lines)
- Component uses 'use client' directive with TONOMI color scheme (cream/gold/caramel)
- Uses shadcn/ui components: Card, Button, Input, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, Switch, Label, Skeleton
- Uses lucide-react icons: Plus, Search, Edit, Trash2, X, Filter, ChevronLeft, ChevronRight, Package, Loader2
- French labels throughout

Features implemented:
1. **Search & Filter Bar**:
   - Search input with Search icon and clear (X) button
   - Category filter dropdown fetched from /api/categories with "Toutes les catégories" default
   - Filter icon next to category dropdown
   - Both filters reset pagination to page 1 on change
2. **Products Table**:
   - Columns: Image, Nom, Catégorie, Prix, Stock, Statut, Actions
   - Image: 40x40 thumbnail with rounded corners and fallback
   - Name: product name + slug in smaller text below
   - Category: outline Badge with gold/20 border
   - Price: formatted in FCFA with spaces, promo price shows both prices (promo in copper, original with line-through)
   - Stock: colored badges (green if >10, orange if 1-10, red "Épuisé" if 0)
   - Status: multi-badge display for nouveau/promo/epuise/best-seller
   - Actions: Edit (caramel hover) and Delete (red hover) icon buttons
   - Horizontal scroll on mobile (overflow-x-auto)
   - Pagination bar with page numbers, ellipsis, and prev/next buttons
   - Empty state with Package icon and contextual message
   - 5 skeleton rows during loading
3. **Add/Edit Product Dialog**:
   - Full form with all product fields:
     - name (required), slug (auto-generated from name with accent removal)
     - description (textarea)
     - price (number, required), pricePromo (number, optional)
     - category (select dropdown from /api/categories), material
     - colors (comma-separated input), sizes (comma-separated input)
     - images (comma-separated URLs input with helper text)
     - stock (number), badge (select: Aucun/Nouveau/Promo/Épuisé)
     - isNew (switch with cream background card), isBestSeller (switch)
   - Auto-generate slug from name using slugify function (normalizes accents)
   - Validation: name required, price > 0, category required
   - Save and Cancel buttons with loading spinner
   - Close dialog on successful save
4. **Delete Confirmation Dialog**:
   - Shows product name in quotes
   - "Cette action est irréversible" warning
   - Annuler/Supprimer buttons, red delete button
   - After deletion, refreshes the product list

API integration:
- GET /api/products?search=&category=&page=1&limit=10 - fetches products with pagination
- GET /api/categories - fetches categories for filter and form dropdown
- POST /api/products - creates new product
- PUT /api/products/[id] - updates existing product
- DELETE /api/products/[id] - deletes product with confirmation

Styling:
- All inputs use bg-cream/50 with border-gold/20
- Dialog max-w-2xl with max-h-[90vh] overflow-y-auto
- Gold gradient button (btn-gold) for primary actions
- TONOMI colors: cream backgrounds, warm-white cards, gold borders, caramel/copper text
- Responsive: grid cols switch from 1 to 2 on sm breakpoint
- Pagination styled with gold active page buttons

- Lint passes with 0 errors

---
Task ID: 11
Agent: AdminContacts Agent
Task: Build AdminContacts component - Contact Message Management

Work Log:
- Created /home/z/my-project/src/components/admin/AdminContacts.tsx
- Component uses 'use client' directive with TONOMI color scheme (cream/gold/caramel)
- Uses shadcn/ui components: Card, CardContent, Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, Tabs, TabsList, TabsTrigger, Separator, Skeleton
- Uses lucide-react icons: Mail, MailOpen, Trash2, Eye, Clock, User
- Uses date-fns with fr locale for date formatting
- French labels throughout

Features implemented:
1. **Header**: Title "Messages" with dynamic count + "Marquer tout comme lu" button with gold gradient (btn-gold), disabled when no unread messages
2. **Filter Tabs**: Tabs for "Tous", "Non lus", "Lus" with dynamic counts
   - "Non lus" tab shows copper-colored badge with unread count
   - "Tous" and "Lus" tabs show outline badges with counts
   - Active tab uses gold background with white text
3. **Messages Card List**: Each message displayed as a glass-card with:
   - Left: gold dot indicator for unread messages (transparent for read)
   - Sender name (bold if unread) with User icon
   - Email in text-mid text-xs (truncated on mobile)
   - Subject line (semibold if unread)
   - Message preview truncated to 2 lines (line-clamp-2)
   - Date with Clock icon in dd/MM/yyyy HH:mm format
   - Read/Unread status badge (gold bg for unread, beige bg for read)
   - Actions: "Marquer lu" button (if unread), "Voir" detail button, Delete button
   - Responsive: labels hidden on mobile (only icons), shown on sm+
4. **Message Detail Dialog**:
   - Sender info with avatar circle (User icon in gold bg), name, email
   - Read/Unread badge
   - Separator dividers between sections
   - Subject displayed in font-serif large text
   - Full message in cream bg card with proper whitespace pre-wrap
   - Date display with "Reçu le" prefix, formatted with French month names
   - "Marquer comme lu" button (btn-gold, only if unread)
   - "Supprimer" button (red variant)
5. **Bulk Action**: "Marquer tout comme lu" uses Promise.all to mark all unread messages simultaneously, shows count in success toast
6. **Delete Confirmation Dialog**: Shows sender name, Annuler/Supprimer buttons, loading spinner during delete
7. **Loading State**: 5 skeleton cards matching message card layout with dot, name, email, subject, message preview, date, and action buttons
8. **Empty State**: Mail icon with contextual message per active tab filter
9. **Error Handling**: Toast notifications (sonner) for all operations

API integration:
- GET /api/contacts - fetches all messages on mount
- PUT /api/contacts/[id] - mark as read (body: {isRead: true}), used for single and bulk operations
- DELETE /api/contacts/[id] - delete message with confirmation

Auto-read behavior:
- Opening message detail dialog automatically marks the message as read
- selectedMessage state updated immediately for responsive UI

- Lint passes with 0 errors

---
Task ID: 10
Agent: AdminPromos Agent
Task: Build AdminPromos component - Promo Code Management

Work Log:
- Created /home/z/my-project/src/components/admin/AdminPromos.tsx
- Component uses 'use client' directive with TONOMI color scheme (cream/gold/caramel)
- Uses shadcn/ui components: Card, CardContent, Button, Input, Label, Badge, Switch, Skeleton, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Select, SelectContent, SelectItem, SelectTrigger, SelectValue
- Uses lucide-react icons: Plus, Edit, Trash2, Tag, Copy, Check
- French labels throughout

Features implemented:
1. **Header**: Title "Codes Promo" with dynamic count + "Ajouter un code" button with gold gradient (btn-gold)
2. **Promos Grid**: Responsive grid (1 col mobile, 2 cols md, 3 cols lg)
   - Each card uses glass-card style with warm-shadow and hover effects
   - Promo code in large monospace font with Copy button (copies to clipboard with toast "Code copié !")
   - Discount badge: "10%" or "5 000 FCFA" based on type (percentage/fixed)
   - Expiry badge shown for expired codes (red outline)
   - Inactive badge shown for inactive non-expired codes
   - Description text (line-clamp-2)
   - Min purchase in FCFA format
   - Valid until date (formatted in French locale)
   - Active/Inactive switch toggle (auto-saves via PUT API)
   - Usage count badge (shown when > 0)
   - Edit and Delete icon buttons at bottom
3. **Add/Edit Dialog**: Fields for code (auto-uppercase), discount value, type (percentage/fixed via Select), description, min purchase (FCFA), valid until (date input), active toggle (Switch with cream background card)
   - Save and Cancel buttons with loading spinner
   - Validation: code required, discount > 0, percentage ≤ 100, validUntil required
4. **Delete Confirmation Dialog**: Shows promo code in monospace, Annuler/Supprimer buttons, loading spinner during delete
5. **Loading State**: 6 skeleton cards matching card layout
6. **Empty State**: Tag icon + message + add button
7. **Error Handling**: Toast notifications (sonner) for all CRUD operations
8. **Copy to clipboard**: Click copy button to copy code, shows toast "Code copié !", shows Check icon for 2 seconds after copy

API integration:
- GET /api/promos - fetches all promo codes on mount
- POST /api/promos - creates new promo code
- PUT /api/promos/[id] - updates existing promo code (also used for toggle active)
- DELETE /api/promos/[id] - deletes promo code with confirmation

- Lint passes with 0 errors

---
Task ID: 12+13
Agent: AdminNewsletter+Settings Agent
Task: Build AdminNewsletter and AdminSettings components

Work Log:
- Created /home/z/my-project/src/components/admin/AdminNewsletter.tsx
- Created /home/z/my-project/src/components/admin/AdminSettings.tsx
- Both components use 'use client' directive with TONOMI color scheme (cream/gold/caramel)
- Both use shadcn/ui components and lucide-react icons
- French labels throughout
- Lint passes with 0 errors

### AdminNewsletter Features:
1. **Header**: Title "Abonnés Newsletter" with dynamic count + "Exporter les emails" button with gold gradient (btn-gold), shows CheckCircle2 icon + "Copié !" for 2s after copy
2. **Search Bar**: Glass-card with Search icon, clear button, result count display
3. **Subscribers Table** (desktop): Columns - Email (with Mail icon avatar), Date d'inscription (French locale), Actions (Supprimer button)
4. **Mobile Card View**: Responsive card layout for subscribers on mobile devices
5. **Export CSV**: Copies all emails to clipboard with newline-separated format, fallback to document.execCommand for older browsers
6. **Delete Confirmation Dialog**: Shows subscriber email, Annuler/Supprimer buttons, loading spinner during delete
7. **Loading State**: Skeleton with header + 5 row skeletons
8. **Empty State**: Mail icon + contextual message for no subscribers
9. **No Results State**: Search icon + message when search yields no results
10. **Footer Badge**: Count of filtered subscribers with "(filtrés)" indicator when searching

API integration:
- GET /api/newsletter - fetches all subscribers on mount
- DELETE /api/newsletter/[id] - deletes/unsubscribes with confirmation

### AdminSettings Features:
1. **Header**: Title "Paramètres du site" with Settings icon + "Enregistrer" button (btn-gold, disabled when no changes)
2. **Grouped Settings Form** with 3 cards:
   - "Informations boutique": store_name (Store icon), store_email (Mail icon), store_phone (Phone icon), store_address (MapPin icon)
   - "Réseaux sociaux": whatsapp_number (MessageCircle icon), instagram_url (Instagram icon)
   - "Devise": currency (Coins icon)
3. **Each field**: Label with icon, Input with gold borders and cream background, "Modifié — valeur actuelle" hint when changed
4. **Bottom Save Card**: Shows "Vous avez des modifications non enregistrées" or "Tous les paramètres sont à jour" with save button
5. **Loading State**: 3 skeleton cards matching grouped form layout (4+2+1 fields)
6. **Save**: PUT /api/settings with all form values, updates local state on success, toast notifications
7. **Change Detection**: hasChanges computed by comparing form values against current saved settings
8. **Default Values**: Pre-populated with TONOMI defaults (FCFA, Abidjan, etc.)

API integration:
- GET /api/settings - fetches all settings as key-value object on mount
- PUT /api/settings - updates settings (upsert), returns updated settings map

---
Task ID: 10b
Agent: AdminFlashSales Agent
Task: Build AdminFlashSales component - Flash Sale Management

Work Log:
- Created /home/z/my-project/src/components/admin/AdminFlashSales.tsx
- Component uses 'use client' directive with TONOMI color scheme (cream/gold/caramel)
- Uses shadcn/ui components: Card, CardContent, Button, Input, Label, Badge, Switch, Progress, Skeleton, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Select, SelectContent, SelectItem, SelectTrigger, SelectValue
- Uses lucide-react icons: Plus, Edit, Trash2, Zap, Clock, AlertTriangle
- French labels throughout

Features implemented:
1. **Header**: Title "Ventes Flash" with Zap icon in tonomi-accent/15 container + active sales count + "Créer une vente flash" button with gold gradient (btn-gold)
2. **Flash Sales Cards Grid** (responsive: 1 col mobile, 2 cols md, 3 cols lg):
   - Product name (font-serif, truncated) + flash sale price (FCFA formatted, with original price strikethrough)
   - Discount badge (e.g., "-22%") in tonomi-accent/15 with caramel text
   - Custom stock progress bar with color-coded backgrounds:
     - > 50%: green/emerald (bg-emerald-500, bg-emerald-100)
     - 20-50%: orange (bg-orange-400, bg-orange-100)
     - < 20%: red (bg-red-500, bg-red-100)
   - Stock text: "X / Y restants" with percentage label
   - End date with Clock icon, formatted in French locale (fr-FR)
   - Countdown-like display: "Xj Xh restants" or "Xh Xmin restants" or "Xmin restants"
   - "Expirée" badge when past end date
   - "Épuisé" badge when stockLeft = 0
   - Active/Inactive switch (emerald when active, auto-disabled when expired)
   - Edit and Delete icon buttons
   - Expired or out-of-stock cards rendered with opacity-70
3. **Add/Edit Dialog**:
   - Product select dropdown (from /api/products?limit=100), showing product name + price
   - Current price hint below product select (including promo price if applicable)
   - Discount percentage input with "%" suffix and live flash price preview
   - Total stock and Stock left (side-by-side grid), with stockLeft capped to totalStock
   - End date/time input (datetime-local) with expired date warning (AlertTriangle icon)
   - Active toggle switch in cream/50 card with description text
   - Validation: product required, discount 1-99%, totalStock > 0, stockLeft valid, endsAt required
   - Save and Cancel buttons with loading spinner
4. **Delete Confirmation Dialog**: Shows product name, "Cette action est irréversible" warning, Annuler/Supprimer buttons
5. **Loading State**: 6 skeleton cards matching card layout
6. **Empty State**: Zap icon + message + "Créer une vente flash" button
7. **Inline Active Toggle**: Switch on each card, auto-saves via PUT with toast notification
8. **Error Handling**: Toast notifications (sonner) for all CRUD operations

API integration:
- GET /api/flash-sales - fetches all flash sales on mount
- GET /api/products?limit=100 - fetches product list for select dropdown
- POST /api/flash-sales - creates new flash sale
- PUT /api/flash-sales/[id] - updates existing flash sale (also used for inline toggle)
- DELETE /api/flash-sales/[id] - deletes flash sale with confirmation

Helper functions:
- formatFCFA() - number formatting with spaces + " FCFA" suffix
- isExpired() - checks if end date is in the past
- getStockPercentage() - calculates stock percentage
- getStockBarColor() / getStockBarBgColor() - returns tailwind classes based on stock level
- formatEndsAt() - French date formatting
- getTimeRemaining() - countdown-like text (days/hours/minutes remaining)

- Lint passes with 0 errors

---
Task ID: 14
Agent: Main
Task: Integrate admin into page.tsx and verify

Work Log:
- Added 'admin' to PageName type in nav-store.ts
- Added goAdmin() method to nav-store
- Created admin-store.ts with AdminPage type and sidebar state management
- Created AdminLayout.tsx - main admin wrapper with sidebar and page routing
- Created AdminSidebar.tsx - collapsible sidebar with navigation links and TONOMI branding
- Created AdminHeader.tsx - top bar with notifications bell and store link
- Updated page.tsx to render AdminLayout when currentPage === 'admin' (no Navbar/Footer for admin)
- Added Settings (admin) icon button to Navbar.tsx next to cart icon
- Added Administration link to MobileMenu.tsx with Settings icon
- All 9 admin pages created: Dashboard, Products, Categories, Orders, Promos, FlashSales, Contacts, Newsletter, Settings
- Lint passes with 0 errors
- API endpoints verified working: /api/dashboard, /api/products, etc.
- Dev server compiling successfully

Stage Summary:
- Complete back-office dashboard integrated into the TONOMI e-commerce site
- Admin accessible via gear icon in navbar or mobile menu
- Full CRUD management for: Products, Categories, Orders, Promo Codes, Flash Sales, Contact Messages, Newsletter Subscribers, Site Settings
- Dashboard with KPI cards, revenue charts, recent orders, top products
- All admin pages use TONOMI design system (warm colors, no dark backgrounds)
- Responsive layout with collapsible sidebar
- Toast notifications for all operations
- Database-backed with Prisma ORM and SQLite
