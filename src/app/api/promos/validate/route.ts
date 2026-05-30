import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const total = parseInt(searchParams.get('total') || '0')

    if (!code) {
      return NextResponse.json({ error: 'Code promo requis' }, { status: 400 })
    }

    const promo = await db.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Code invalide' })
    }
    if (!promo.isActive) {
      return NextResponse.json({ valid: false, error: 'Code désactivé' })
    }
    if (total < promo.minPurchase) {
      return NextResponse.json({
        valid: false,
        error: `Montant minimum: ${promo.minPurchase.toLocaleString('fr-FR')} FCFA`,
      })
    }
    if (new Date(promo.validUntil) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Code expiré' })
    }

    const discountAmount =
      promo.type === 'percentage'
        ? Math.round((total * promo.discount) / 100)
        : promo.discount

    return NextResponse.json({
      valid: true,
      promo: {
        code: promo.code,
        type: promo.type,
        discount: promo.discount,
        description: promo.description,
        discountAmount,
      },
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    )
  }
}
