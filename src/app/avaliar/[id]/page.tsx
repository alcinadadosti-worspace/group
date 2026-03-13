import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { FeedbackForm } from '@/components/feedback/feedback-form'
import { getSession } from '@/lib/auth'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getManager(id: string) {
  const manager = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      store: true,
      avatarUrl: true,
      averageRating: true,
    },
  })

  return manager
}

export default async function AvaliarPage({ params }: PageProps) {
  const { id } = await params
  const session = await getSession()
  const manager = await getManager(id)

  if (!manager) {
    notFound()
  }

  return (
    <>
      <Navbar isAuthenticated={!!session} userName={session?.name} />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para gestores
          </Link>

          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Avaliar Gestor
              </h1>
              <p className="text-slate-500">
                Compartilhe sua experiência de forma anônima
              </p>
            </div>

            <FeedbackForm manager={manager} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
