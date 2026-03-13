'use client'

import * as React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  showValue?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0)

  const displayRating = hoverRating || rating

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= displayRating

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              className={cn(
                'transition-all duration-150',
                interactive && 'cursor-pointer hover:scale-110',
                !interactive && 'cursor-default'
              )}
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors duration-150',
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent text-slate-300'
                )}
              />
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-medium text-slate-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
