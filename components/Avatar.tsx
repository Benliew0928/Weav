'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

import Link from 'next/link'

interface AvatarProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  userId?: string
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

export function Avatar({ src, alt, size = 'md', className, userId }: AvatarProps) {
  const avatarContent = (
    <AvatarPrimitive.Root
      className={cn(
        'relative inline-flex items-center justify-center align-middle overflow-hidden select-none rounded-full',
        'bg-gradient-primary',
        sizeClasses[size],
        className
      )}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className="flex items-center justify-center w-full h-full bg-gradient-primary text-white text-sm font-medium"
        delayMs={600}
      >
        {alt.charAt(0).toUpperCase()}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )

  if (userId) {
    return (
      <Link href={`/profile/${userId}`} onClick={(e) => e.stopPropagation()}>
        {avatarContent}
      </Link>
    )
  }

  return avatarContent
}

