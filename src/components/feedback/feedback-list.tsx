'use client'

import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from '@/components/ui/star-rating'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { MessageSquare, Star } from 'lucide-react'

interface Feedback {
  id: string
  rating: number
  comment: string | null
  createdAt: string
}

interface FeedbackListProps {
  feedbacks: Feedback[]
}

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-slate-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">
            Nenhum feedback ainda
          </h3>
          <p className="text-sm text-slate-500">
            Quando colaboradores avaliarem você, os feedbacks aparecerão aqui.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <StarRating rating={feedback.rating} size="sm" />
                  <Badge
                    variant={
                      feedback.rating >= 4
                        ? 'success'
                        : feedback.rating >= 3
                        ? 'warning'
                        : 'destructive'
                    }
                  >
                    {feedback.rating >= 4
                      ? 'Positivo'
                      : feedback.rating >= 3
                      ? 'Neutro'
                      : 'Negativo'}
                  </Badge>
                </div>

                {/* Comment */}
                {feedback.comment ? (
                  <p className="text-slate-700 leading-relaxed">
                    {feedback.comment}
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-sm">
                    Avaliação sem comentário
                  </p>
                )}

                {/* Footer */}
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {feedback.rating}/5
                  </span>
                  <span>{formatRelativeTime(feedback.createdAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
