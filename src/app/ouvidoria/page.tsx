'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { toast } from '@/components/ui/use-toast'
import { AlertTriangle, Shield, Lock, CheckCircle, ArrowLeft, Send } from 'lucide-react'

const CATEGORIES = [
  { value: 'assedio', label: 'Assédio' },
  { value: 'discriminacao', label: 'Discriminação' },
  { value: 'ma_conduta', label: 'Má Conduta' },
  { value: 'abuso_poder', label: 'Abuso de Poder' },
  { value: 'outros', label: 'Outros' },
]

export default function OuvidoriaPage() {
  const [category, setCategory] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [reporterEmail, setReporterEmail] = React.useState('')
  const [anonymous, setAnonymous] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category) {
      toast({
        title: 'Selecione uma categoria',
        variant: 'destructive',
      })
      return
    }

    if (description.length < 20) {
      toast({
        title: 'Descrição muito curta',
        description: 'Por favor, forneça mais detalhes sobre o ocorrido (mínimo 20 caracteres).',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          reporterEmail: anonymous ? null : reporterEmail,
          anonymous,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar denúncia')
      }

      setIsSubmitted(true)
      toast({
        title: 'Denúncia registrada',
        description: 'Sua denúncia foi enviada com total sigilo.',
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Erro ao enviar',
        description: 'Não foi possível registrar sua denúncia. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="max-w-lg mx-auto">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Denúncia Registrada
                </h2>
                <p className="text-slate-500 mb-6">
                  Sua denúncia foi recebida e será tratada com total sigilo e confidencialidade.
                  Agradecemos sua coragem em reportar.
                </p>
                <Link href="/">
                  <Button>Voltar para a Página Inicial</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para gestores
          </Link>

          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Ouvidoria
              </h1>
              <p className="text-slate-500">
                Canal seguro para denúncias e relatos de má conduta
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card className="text-center">
                <CardContent className="pt-4 pb-4">
                  <Shield className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Sigilo Total</p>
                  <p className="text-xs text-slate-500">Proteção de dados</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-4 pb-4">
                  <Lock className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Anônimo</p>
                  <p className="text-xs text-slate-500">Identidade protegida</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-4 pb-4">
                  <CheckCircle className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Investigação</p>
                  <p className="text-xs text-slate-500">Todas são avaliadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Registrar Denúncia</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo com o máximo de detalhes possível.
                  Todas as informações são tratadas com confidencialidade.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categoria da Denúncia *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          className="transition-all"
                        >
                          <Badge
                            variant={category === cat.value ? 'default' : 'outline'}
                            className={`cursor-pointer px-4 py-2 ${
                              category === cat.value
                                ? 'bg-violet-600'
                                : 'hover:bg-slate-100'
                            }`}
                          >
                            {cat.label}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <Textarea
                    label="Descrição do Ocorrido *"
                    placeholder="Descreva em detalhes o que aconteceu, quando, onde e quem estava envolvido..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                  />

                  {/* Anonymous Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Denúncia Anônima</p>
                      <p className="text-sm text-slate-500">
                        Seu email não será vinculado à denúncia
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnonymous(!anonymous)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        anonymous ? 'bg-violet-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          anonymous ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email (if not anonymous) */}
                  {!anonymous && (
                    <Input
                      type="email"
                      label="Seu Email (para possível retorno)"
                      placeholder="seu@email.com"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                    />
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Enviar Denúncia
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-center text-slate-400">
                    Ao enviar, você concorda que as informações são verdadeiras e
                    serão usadas apenas para investigação interna.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
