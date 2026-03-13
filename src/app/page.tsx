import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { ManagerCard } from '@/components/manager/manager-card'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getSession } from '@/lib/auth'
import { Users, TrendingUp, Shield } from 'lucide-react'

async function getManagers() {
  const managers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      store: true,
      avatarUrl: true,
      averageRating: true,
      totalRatings: true,
    },
    orderBy: {
      averageRating: 'desc',
    },
  })

  return managers
}

function ManagersGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-200" />
            <div className="flex-1">
              <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="h-4 bg-slate-100 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function ManagersGrid() {
  const managers = await getManagers()

  if (managers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">
          Nenhum gestor cadastrado
        </h3>
        <p className="text-sm text-slate-500">
          Os gestores aparecerão aqui quando forem cadastrados.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {managers.map((manager) => (
        <ManagerCard
          key={manager.id}
          id={manager.id}
          name={manager.name}
          role={manager.role}
          store={manager.store}
          avatarUrl={manager.avatarUrl}
          averageRating={manager.averageRating}
          totalRatings={manager.totalRatings}
        />
      ))}
    </div>
  )
}

export default async function HomePage() {
  const session = await getSession()

  return (
    <>
      <Navbar
        isAuthenticated={!!session}
        userName={session?.name}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                Avalie seus{' '}
                <span className="text-violet-600">gestores</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 mb-8 leading-relaxed">
                Compartilhe feedback de forma anônima e ajude a construir um ambiente de trabalho melhor para todos.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-10">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-violet-600 mb-1">
                    <Shield className="h-5 w-5" />
                    <span className="text-2xl font-bold">100%</span>
                  </div>
                  <p className="text-sm text-slate-500">Anônimo</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-violet-600 mb-1">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-2xl font-bold">Transparente</span>
                  </div>
                  <p className="text-sm text-slate-500">Notas públicas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-violet-600 mb-1">
                    <Users className="h-5 w-5" />
                    <span className="text-2xl font-bold">Colaborativo</span>
                  </div>
                  <p className="text-sm text-slate-500">Para todos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Managers Section */}
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Nossos Gestores
              </h2>
              <p className="text-slate-500 mt-1">
                Clique em um gestor para avaliá-lo
              </p>
            </div>
          </div>

          <Suspense fallback={<ManagersGridSkeleton />}>
            <ManagersGrid />
          </Suspense>
        </section>
      </main>

      <Footer />
    </>
  )
}
