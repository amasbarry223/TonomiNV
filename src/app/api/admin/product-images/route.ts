import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import {
  PRODUCT_IMAGE_MAX_BYTES,
  PRODUCT_IMAGE_ACCEPT,
} from '@/lib/admin-image-upload'

const ACCEPT_TYPES = PRODUCT_IMAGE_ACCEPT.split(',').map((t) => t.trim())

function safeProductId(raw: string): string {
  const id = raw.trim().slice(0, 80)
  if (!/^prod-[a-zA-Z0-9_-]+$/.test(id)) {
    return `prod-${Date.now()}`
  }
  return id
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const productIdRaw = formData.get('productId')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
    }

    if (!ACCEPT_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 })
    }

    if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max. 5 Mo)' }, { status: 400 })
    }

    const productId = safeProductId(
      typeof productIdRaw === 'string' ? productIdRaw : `prod-${Date.now()}`
    )

    const buffer = Buffer.from(await file.arrayBuffer())
    const optimized = await sharp(buffer)
      .rotate()
      .resize(1400, 1400, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()

    const filename = `${Date.now()}.webp`
    const relDir = path.join('uploads', 'products', productId)
    const absDir = path.join(process.cwd(), 'public', relDir)
    await mkdir(absDir, { recursive: true })
    await writeFile(path.join(absDir, filename), optimized)

    const url = `/${relDir.replace(/\\/g, '/')}/${filename}`
    return NextResponse.json({ url })
  } catch (e) {
    console.error('[product-images]', e)
    return NextResponse.json(
      { error: 'Impossible d’enregistrer l’image' },
      { status: 500 }
    )
  }
}
