import Link from 'next/link'
import { MessageSquareHeart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600">
              <MessageSquareHeart className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Feed<span className="text-violet-600">Syncs</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Gestores
            </Link>
            <Link href="/ouvidoria" className="hover:text-slate-900 transition-colors">
              Ouvidoria
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Área do Gestor
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-slate-400">
            O Boticário - Franquia
          </p>
        </div>
      </div>
    </footer>
  )
}
