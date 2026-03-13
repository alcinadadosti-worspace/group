'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { LogOut, Camera, Upload } from 'lucide-react'

interface DashboardActionsProps {
  managerId: string
}

export function DashboardActions({ managerId }: DashboardActionsProps) {
  const router = useRouter()
  const [isUploading, setIsUploading] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        // Limpar qualquer estado local
        window.location.href = '/'
      } else {
        throw new Error('Falha no logout')
      }
    } catch {
      toast({
        title: 'Erro ao sair',
        description: 'Tente novamente.',
        variant: 'destructive',
      })
      setIsLoggingOut(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de arquivo inválido',
        description: 'Use JPG, PNG, WebP ou GIF.',
        variant: 'destructive',
      })
      return
    }

    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo é 2MB.',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      toast({
        title: 'Foto atualizada!',
        description: 'Sua foto de perfil foi alterada com sucesso.',
        variant: 'success',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Erro ao atualizar foto',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      // Limpar input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="mt-6 w-full space-y-3">
      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Botão de upload de foto */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={handleFileSelect}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <div className="h-4 w-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            Alterar Foto
          </>
        )}
      </Button>

      {/* Botão de logout */}
      <Button
        variant="ghost"
        className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <>
            <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            Saindo...
          </>
        ) : (
          <>
            <LogOut className="h-4 w-4" />
            Sair
          </>
        )}
      </Button>
    </div>
  )
}
