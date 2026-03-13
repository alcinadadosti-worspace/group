import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { notifyNewFeedback } from '@/lib/slack'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const feedbacks = await prisma.feedback.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error('Get feedbacks error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar feedbacks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, rating, comment } = body

    if (!userId || !rating) {
      return NextResponse.json(
        { error: 'ID do gestor e nota são obrigatórios' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Nota deve ser entre 1 e 5' },
        { status: 400 }
      )
    }

    // Buscar gestor
    const manager = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!manager) {
      return NextResponse.json(
        { error: 'Gestor não encontrado' },
        { status: 404 }
      )
    }

    // Criar feedback
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        rating,
        comment,
      },
    })

    // Calcular nova média
    const newTotalRatings = manager.totalRatings + 1
    const newAverageRating =
      (manager.averageRating * manager.totalRatings + rating) / newTotalRatings

    // Atualizar gestor
    await prisma.user.update({
      where: { id: userId },
      data: {
        averageRating: Math.round(newAverageRating * 10) / 10,
        totalRatings: newTotalRatings,
      },
    })

    // Enviar notificação Slack se configurado
    if (manager.slackUserId) {
      await notifyNewFeedback({
        slackUserId: manager.slackUserId,
        managerName: manager.name,
        rating,
        hasComment: !!comment,
      })
    }

    return NextResponse.json({ feedback }, { status: 201 })
  } catch (error) {
    console.error('Create feedback error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar feedback' },
      { status: 500 }
    )
  }
}
