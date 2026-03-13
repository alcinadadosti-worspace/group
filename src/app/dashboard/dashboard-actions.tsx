'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { LogOut, Camera, Save } from 'lucide-react'

interface DashboardActionsProps {
  managerId: string
}

export function DashboardActions({ managerId }: DashboardActionsProps) {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = React.useState('')
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [showAvatarInput, setShowAvatarInput] = React.useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch {
      toast({
        title: 'Erro ao sair',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateAvatar = async () => {
    if (!avatarUrl.trim()) {
      toast({
        title: 'URL inválida',
        description: 'Por favor, insira uma URL válida para a imagem.',
        variant: 'destructive',
      })
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/managers/${managerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar foto')
      }

      toast({
        title: 'Foto atualizada!',
        description: 'Sua foto de perfil foi alterada com sucesso.',
        variant: 'success',
      })

      setShowAvatarInput(false)
      setAvatarUrl('')
      router.refresh()
    } catch {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar sua foto. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="mt-6 w-full space-y-3">
      {showAvatarInput ? (
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="URL da imagem (https://...)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowAvatarInput(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="flex-1 gap-2"
              onClick={handleUpdateAvatar}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => setShowAvatarInput(true)}
        >
          <Camera className="h-4 w-4" />
          Alterar Foto
        </Button>
      )}

      <Button
        variant="ghost"
        className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  )
}
