export const PRODUCT_IMAGE_MAX_COUNT = 6
export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const PRODUCT_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/gif'

export function validateProductImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Format non supporté. Utilisez JPEG, PNG, WebP ou AVIF.'
  }
  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return 'Image trop lourde (max. 5 Mo).'
  }
  return null
}

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  const err = validateProductImageFile(file)
  if (err) throw new Error(err)

  const body = new FormData()
  body.append('file', file)
  body.append('productId', productId)

  const res = await fetch('/api/admin/product-images', { method: 'POST', body })
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
  if (!res.ok) {
    throw new Error(data.error ?? 'Échec de l’upload')
  }
  if (!data.url) throw new Error('Réponse serveur invalide')
  return data.url
}
