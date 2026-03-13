'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MessageSquareHeart, AlertTriangle, LogIn, LayoutDashboard, LogOut } from 'lucide-react'

interface NavbarProps {
  isAuthenticated?: boolean
  userName?: string
  onLogout?: () => void
}

export function Navbar({ isAuthenticated, userName, onLogout }: NavbarProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-sm">
            <MessageSquareHeart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">
            Feed<span className="text-violet-600">Syncs</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              pathname === '/'
                ? 'text-violet-600 bg-violet-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            )}
          >
            Gestores
          </Link>
          <Link
            href="/ouvidoria"
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
              pathname === '/ouvidoria'
                ? 'text-violet-600 bg-violet-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            Ouvidoria
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                Olá, <span className="font-medium text-slate-900">{userName}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Área do Gestor</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
