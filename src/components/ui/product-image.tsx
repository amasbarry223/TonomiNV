'use client'

import Image from 'next/image'
import { useState } from 'react'

const PLACEHOLDER = '/images/products/placeholder.svg'

interface ProductImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
  fill?: boolean
}

export function ProductImage({
  src,
  alt,
  width = 400,
  height = 533,
  priority = false,
  className = 'object-cover',
  sizes = '(max-width: 768px) 50vw, 25vw',
  fill = false,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)

  if (src !== prevSrc) {
    setPrevSrc(src)
    setHasError(false)
  }

  const imgSrc = hasError ? PLACEHOLDER : (src || PLACEHOLDER)

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
        onError={() => setHasError(true)}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}
