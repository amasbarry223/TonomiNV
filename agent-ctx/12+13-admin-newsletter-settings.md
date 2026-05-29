# Task 12+13: AdminNewsletter + AdminSettings Components

## Summary

Built two admin panel components for the TONOMI ACCESSOIRES e-commerce Next.js project.

## Files Created

1. **`/home/z/my-project/src/components/admin/AdminNewsletter.tsx`** - Newsletter subscriber management component
2. **`/home/z/my-project/src/components/admin/AdminSettings.tsx`** - Site settings management component

## AdminNewsletter Component

### API Integration
- `GET /api/newsletter` - Fetches all newsletter subscribers
- `DELETE /api/newsletter/[id]` - Deletes/unsubscribes a subscriber

### Features
- Header with "Abonnés Newsletter" title, subscriber count, and "Exporter les emails" button
- Search input to filter subscribers by email with result count
- Desktop Table view with columns: Email (with Mail icon), Date d'inscription, Actions (Supprimer)
- Mobile Card view with responsive layout
- Export button copies all emails to clipboard (newline-separated), with clipboard API fallback
- Delete confirmation dialog showing subscriber email
- Loading skeleton state
- Empty state for no subscribers
- No results state for search with no matches
- Footer badge showing filtered subscriber count
- All French labels, TONOMI color scheme, shadcn/ui components

## AdminSettings Component

### API Integration
- `GET /api/settings` - Fetches all settings as key-value object
- `PUT /api/settings` - Updates settings (upsert)

### Features
- Header with "Paramètres du site" title and "Enregistrer" button (disabled when no changes)
- Three grouped setting cards:
  1. **Informations boutique**: store_name, store_email, store_phone, store_address
  2. **Réseaux sociaux**: whatsapp_number, instagram_url
  3. **Devise**: currency
- Each field has icon label, gold-bordered input, and change indicator
- Change detection comparing form values vs saved settings
- Bottom save card with status message
- Loading skeleton matching form layout
- Default values for TONOMI (FCFA, Abidjan, etc.)
- Toast notifications on save success/error
- Save button with gold gradient and loading spinner

## Design Consistency
- Both components follow existing admin component patterns (AdminCategories, AdminOrders, etc.)
- TONOMI color scheme: cream, warm-white, beige, caramel, gold
- `glass-card`, `warm-shadow`, `btn-gold` CSS classes used consistently
- shadcn/ui components: Card, Button, Input, Label, Table, Badge, Skeleton, Separator, Dialog
- lucide-react icons throughout
- `'use client'` directive, French labels
- Responsive design with mobile-first approach

## Verification
- `bun run lint` passes with 0 errors
- Dev server compiles successfully
