import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyNewReport } from '@/lib/slack'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, description, reportedUserId, reporterEmail, anonymous } = body

    if (!category || !description) {
      return NextResponse.json(
        { error: 'Categoria e descrição são obrigatórios' },
        { status: 400 }
      )
    }

    if (description.length < 20) {
      return NextResponse.json(
        { error: 'A descrição deve ter pelo menos 20 caracteres' },
        { status: 400 }
      )
    }

    // Buscar nome do gestor denunciado se informado
    let reportedManagerName: string | undefined

    if (reportedUserId) {
      const manager = await prisma.user.findUnique({
        where: { id: reportedUserId },
        select: { name: true },
      })
      reportedManagerName = manager?.name
    }

    // Criar denúncia
    const report = await prisma.report.create({
      data: {
        category,
        description,
        reportedUserId,
        reporterEmail: anonymous ? null : reporterEmail,
        anonymous: anonymous ?? true,
      },
    })

    // Notificar canal de administração no Slack
    await notifyNewReport({
      category,
      reportedManagerName,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Denúncia registrada com sucesso. Obrigado por reportar.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create report error:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar denúncia' },
      { status: 500 }
    )
  }
}
