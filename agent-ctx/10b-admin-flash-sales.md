# Task 10b - AdminFlashSales Component

## Summary
Built the AdminFlashSales component for flash sale management in the TONOMI ACCESSOIRES admin panel.

## File Created
- `/home/z/my-project/src/components/admin/AdminFlashSales.tsx`

## Key Decisions
- Used custom div-based progress bar instead of shadcn Progress component to enable dynamic color classes (emerald/orange/red based on stock level)
- Built productMap via useMemo for O(1) product name lookups
- Inline active toggle via PUT API for immediate feedback
- stockLeft auto-capped to totalStock in form to prevent invalid data
- Live flash price preview in the form dialog when both product and discount are set

## Lint
- Passes with 0 errors
