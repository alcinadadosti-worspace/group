import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const manager = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        store: true,
        avatarUrl: true,
        averageRating: true,
        totalRatings: true,
      },
    })

    if (!manager) {
      return NextResponse.json(
        { error: 'Gestor não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ manager })
  } catch (error) {
    console.error('Get manager error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar gestor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session || session.userId !== id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { avatarUrl, name } = body

    const updatedManager = await prisma.user.update({
      where: { id },
      data: {
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(name !== undefined && { name }),
      },
      select: {
        id: true,
        name: true,
        role: true,
        store: true,
        avatarUrl: true,
        averageRating: true,
        totalRatings: true,
      },
    })

    return NextResponse.json({ manager: updatedManager })
  } catch (error) {
    console.error('Update manager error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar gestor' },
      { status: 500 }
    )
  }
}
