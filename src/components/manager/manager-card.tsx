'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { MessageSquare } from 'lucide-react'

interface ManagerCardProps {
  id: string
  name: string
  role: string
  store?: string | null
  avatarUrl?: string | null
  averageRating: number
  totalRatings: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ManagerCard({
  id,
  name,
  role,
  store,
  avatarUrl,
  averageRating,
  totalRatings,
}: ManagerCardProps) {
  return (
    <Link href={`/avaliar/${id}`}>
      <Card className="group cursor-pointer hover:border-violet-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={name} />
              ) : null}
              <AvatarFallback className="text-lg">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors truncate">
                {name}
              </h3>
              <p className="text-sm text-slate-500 truncate">{role}</p>
              {store && (
                <Badge variant="secondary" className="mt-2">
                  {store}
                </Badge>
              )}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} size="sm" showValue />
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <MessageSquare className="h-4 w-4" />
                <span>{totalRatings}</span>
              </div>
            </div>
          </div>

          {/* Hover CTA */}
          <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-medium text-violet-600">
              Clique para avaliar
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
