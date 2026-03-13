import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { FeedbackList } from '@/components/feedback/feedback-list'
import { DashboardActions } from './dashboard-actions'
import { Star, MessageSquare, TrendingUp, Calendar } from 'lucide-react'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

async function getManagerData(userId: string) {
  const manager = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      feedbacks: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
  })

  return manager
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const manager = await getManagerData(session.userId)

  if (!manager) {
    redirect('/login')
  }

  // Calcular estatísticas
  const totalFeedbacks = manager.feedbacks.length
  const positiveCount = manager.feedbacks.filter((f) => f.rating >= 4).length
  const feedbacksThisMonth = manager.feedbacks.filter((f) => {
    const feedbackDate = new Date(f.createdAt)
    const now = new Date()
    return (
      feedbackDate.getMonth() === now.getMonth() &&
      feedbackDate.getFullYear() === now.getFullYear()
    )
  }).length

  return (
    <>
      <Navbar isAuthenticated userName={manager.name} />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Meu Dashboard
            </h1>
            <p className="text-slate-500">
              Acompanhe seus feedbacks e gerencie seu perfil
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Profile */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 ring-4 ring-violet-100 shadow-lg mb-4">
                      {manager.avatarUrl ? (
                        <AvatarImage src={manager.avatarUrl} alt={manager.name} />
                      ) : null}
                      <AvatarFallback className="text-2xl">
                        {getInitials(manager.name)}
                      </AvatarFallback>
                    </Avatar>

                    <h2 className="text-xl font-semibold text-slate-900">
                      {manager.name}
                    </h2>
                    <p className="text-slate-500 text-sm">{manager.role}</p>

                    {manager.store && (
                      <Badge variant="secondary" className="mt-2">
                        {manager.store}
                      </Badge>
                    )}

                    <div className="mt-4 flex items-center gap-2">
                      <StarRating rating={manager.averageRating} size="md" showValue />
                    </div>

                    <DashboardActions managerId={manager.id} />
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
                        <Star className="h-5 w-5 text-violet-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {manager.averageRating.toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-500">Nota Média</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {totalFeedbacks}
                    </p>
                    <p className="text-xs text-slate-500">Total</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {totalFeedbacks > 0
                        ? Math.round((positiveCount / totalFeedbacks) * 100)
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-slate-500">Positivos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {feedbacksThisMonth}
                    </p>
                    <p className="text-xs text-slate-500">Este mês</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content - Feedbacks */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-violet-600" />
                    Meus Feedbacks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FeedbackList
                    feedbacks={manager.feedbacks.map((f) => ({
                      ...f,
                      createdAt: f.createdAt.toISOString(),
                    }))}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
