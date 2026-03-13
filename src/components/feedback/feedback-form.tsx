'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/ui/star-rating'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { Send, Lock, CheckCircle } from 'lucide-react'

interface FeedbackFormProps {
  manager: {
    id: string
    name: string
    role: string
    store?: string | null
    avatarUrl?: string | null
    averageRating: number
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function FeedbackForm({ manager }: FeedbackFormProps) {
  const [rating, setRating] = React.useState(0)
  const [comment, setComment] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: 'Selecione uma nota',
        description: 'Por favor, escolha uma nota de 1 a 5 estrelas.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: manager.id,
          rating,
          comment: comment.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar feedback')
      }

      setIsSubmitted(true)
      toast({
        title: 'Feedback enviado!',
        description: 'Obrigado por compartilhar sua avaliação.',
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar seu feedback. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Feedback Enviado!
          </h2>
          <p className="text-slate-500 mb-6">
            Obrigado por compartilhar sua avaliação sobre {manager.name}.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Voltar para Gestores
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center pb-2">
        {/* Manager Info */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <Avatar className="h-20 w-20 ring-4 ring-violet-100 shadow-lg">
            {manager.avatarUrl ? (
              <AvatarImage src={manager.avatarUrl} alt={manager.name} />
            ) : null}
            <AvatarFallback className="text-2xl">
              {getInitials(manager.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{manager.name}</CardTitle>
            <CardDescription className="mt-1">{manager.role}</CardDescription>
            {manager.store && (
              <Badge variant="secondary" className="mt-2">
                {manager.store}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>Nota atual:</span>
          <StarRating rating={manager.averageRating} size="sm" showValue />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div className="text-center">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Qual nota você dá para este gestor?
            </label>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onChange={setRating}
              />
            </div>
            {rating > 0 && (
              <p className="text-sm text-violet-600 mt-2 font-medium">
                {rating === 1 && 'Muito Insatisfeito'}
                {rating === 2 && 'Insatisfeito'}
                {rating === 3 && 'Neutro'}
                {rating === 4 && 'Satisfeito'}
                {rating === 5 && 'Muito Satisfeito'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Textarea
              label="Comentário (opcional)"
              placeholder="Compartilhe mais detalhes sobre sua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
              <Lock className="h-3 w-3" />
              <span>Seu comentário é privado e só será visto pelo gestor.</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviar Feedback
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
